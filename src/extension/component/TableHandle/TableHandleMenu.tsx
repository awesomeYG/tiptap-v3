import { Box, Menu, MenuItem } from '@mui/material';
import type { Node } from '@tiptap/pm/model';
import { TableMap } from '@tiptap/pm/tables';
import type { Editor } from '@tiptap/react';
import React, { useCallback, useState } from 'react';
import { MoreLineIcon } from '../../../component/Icons/more-line-icon';
import type { Orientation } from '../../../util/table-utils';
import { selectCellsByCoords } from '../../../util/table-utils';
import { dragEnd } from '../../node/TableHandler/plugin';
import './TableHandleMenu.css';

interface TableHandleMenuProps {
  editor?: Editor | null;
  orientation: Orientation;
  index?: number;
  tableNode?: Node;
  tablePos?: number;
  onToggleOtherHandle?: (visible: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  dragStart?: (e: React.DragEvent) => void;
}

export const TableHandleMenu = ({
  editor,
  orientation,
  index,
  tableNode,
  tablePos,
  onToggleOtherHandle,
  onOpenChange,
  dragStart,
}: TableHandleMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const selectRowOrColumn = useCallback(() => {
    if (
      !editor ||
      !tableNode ||
      typeof tablePos !== 'number' ||
      typeof index !== 'number'
    )
      return;

    try {
      const { width, height } = TableMap.get(tableNode);
      const start =
        orientation === 'row' ? { row: index, col: 0 } : { row: 0, col: index };
      const end =
        orientation === 'row'
          ? { row: index, col: width - 1 }
          : { row: height - 1, col: index };

      selectCellsByCoords(editor, tablePos, [start, end], {
        mode: 'dispatch',
        dispatch: editor.view.dispatch.bind(editor.view),
      });
    } catch (error) {
      console.warn('Failed to select row/column:', error);
    }
  }, [editor, tableNode, tablePos, orientation, index]);

  const handleMenuToggle = useCallback(
    (isOpen: boolean, event?: React.MouseEvent<HTMLElement>) => {
      if (!editor) return;

      setIsMenuOpen(isOpen);
      onOpenChange?.(isOpen);

      if (isOpen) {
        editor.commands.freezeHandles();
        selectRowOrColumn();
        onToggleOtherHandle?.(false);
        if (event?.currentTarget) {
          setAnchorEl(event.currentTarget);
        }
      } else {
        editor.commands.unfreezeHandles();
        onToggleOtherHandle?.(true);
        setAnchorEl(null);
      }
    },
    [editor, onOpenChange, onToggleOtherHandle, selectRowOrColumn]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      setIsDragging(true);
      // Store table info in data attributes for recovery if state is lost
      if (e.currentTarget instanceof HTMLElement) {
        if (typeof index === 'number') {
          e.currentTarget.dataset.tableIndex = String(index);
        }
        if (typeof tablePos === 'number') {
          e.currentTarget.dataset.tablePos = String(tablePos);
        }
        if (tableNode) {
          e.currentTarget.dataset.tableId = tableNode.attrs.id || '';
        }
      }
      dragStart?.(e);
    },
    [dragStart, index, tablePos, tableNode]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragEnd();
  }, []);

  const ariaLabel =
    orientation === 'row' ? 'Row actions' : 'Column actions';

  if (!editor?.isEditable) return null;

  return (
    <>
      <Box
        component="button"
        className={`tiptap-table-handle-menu ${isMenuOpen ? 'menu-opened' : ''} ${isDragging ? 'is-dragging' : ''} ${orientation}`}
        draggable={true}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={(e) => handleMenuToggle(!isMenuOpen, e)}
        sx={{
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--ct-tt-table-handle-bg-color, rgba(0,0,0,0.05))',
          borderRadius: 'var(--ct-tt-radius-lg, 4px)',
          cursor: isDragging ? 'grabbing' : 'pointer',
          padding: 0,
          ...(orientation === 'row'
            ? {
              width: '0.75rem',
              height: 'var(--table-handle-ref-height, 40px)',
            }
            : {
              height: '0.75rem',
              width: 'var(--table-handle-ref-width, 100px)',
            }),
          '&.menu-opened, &.is-dragging': {
            backgroundColor: 'var(--ct-tt-brand-color-500, #1976d2)',
            '& .MuiSvgIcon-root': {
              color: '#fff',
            },
          },
          '&:hover': {
            backgroundColor: 'var(--ct-tt-brand-color-500, #1976d2)',
            '& .MuiSvgIcon-root': {
              color: '#fff',
            },
          },
        }}
      >
        <MoreLineIcon
          sx={{
            width: '1rem',
            height: '1rem',
            flexShrink: 0,
            ...(orientation === 'row' && {
              transform: 'rotate(90deg)',
            }),
          }}
        />
      </Box>
      <Menu
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={() => handleMenuToggle(false)}
        anchorOrigin={{
          vertical: orientation === 'row' ? 'top' : 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: orientation === 'row' ? 'bottom' : 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            if (orientation === 'row') {
              editor.chain().focus().addRowBefore().run();
            } else {
              editor.chain().focus().addColumnBefore().run();
            }
            handleMenuToggle(false);
          }}
        >
          {orientation === 'row' ? '在上方插入行' : '在左侧插入列'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (orientation === 'row') {
              editor.chain().focus().addRowAfter().run();
            } else {
              editor.chain().focus().addColumnAfter().run();
            }
            handleMenuToggle(false);
          }}
        >
          {orientation === 'row' ? '在下方插入行' : '在右侧插入列'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (orientation === 'row') {
              editor.chain().focus().deleteRow().run();
            } else {
              editor.chain().focus().deleteColumn().run();
            }
            handleMenuToggle(false);
          }}
        >
          {orientation === 'row' ? '删除行' : '删除列'}
        </MenuItem>
      </Menu>
    </>
  );
};

