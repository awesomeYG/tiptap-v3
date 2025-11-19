import {
  DeleteColumnIcon, DeleteRowIcon,
  FileCopyLineIcon,
  InsertColumnLeftIcon,
  InsertColumnRightIcon, InsertRowBottomIcon, InsertRowTopIcon,
  LayoutLeft2LineIcon,
  LayoutTop2LineIcon, MergeCellsHorizontalIcon, MergeCellsVerticalIcon
} from '@ctzhian/tiptap/component/Icons';
import { Box } from '@mui/material';
import type { Node } from '@tiptap/pm/model';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import { addColumnAfter, addRowAfter, CellSelection, TableMap } from '@tiptap/pm/tables';
import type { Editor } from '@tiptap/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MoreLineIcon } from '../../../component/Icons/more-line-icon';
import Menu from '../../../component/Menu';
import type { MenuItem } from '../../../type';
import type { Orientation } from '../../../util/table-utils';
import { getColumnCells, getIndexCoordinates, getRowCells, getTable, selectCellsByCoords } from '../../../util/table-utils';
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
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Check if row/column can be duplicated (no merged cells)
  const canDuplicate = useMemo(() => {
    if (!editor || typeof index !== 'number' || typeof tablePos !== 'number') {
      return false;
    }

    try {
      const cells = orientation === 'row'
        ? getRowCells(editor, index, tablePos)
        : getColumnCells(editor, index, tablePos);

      // Cannot duplicate if there are merged cells
      return cells.cells.length > 0 && cells.mergedCells.length === 0;
    } catch {
      return false;
    }
  }, [editor, index, orientation, tablePos, tableNode, editor?.state.doc]);

  // Duplicate row/column function
  const duplicateRowOrColumn = useCallback(() => {
    if (!editor || typeof index !== 'number' || typeof tablePos !== 'number' || !canDuplicate) {
      return;
    }

    try {
      // Get original cells before adding new row/column
      const originalCells = orientation === 'row'
        ? getRowCells(editor, index, tablePos)
        : getColumnCells(editor, index, tablePos);

      if (originalCells.cells.length === 0) return;

      // First, select the row/column
      selectRowOrColumn();

      // Add new row/column after current one
      let addSuccess = false;
      if (editor.state.selection instanceof CellSelection) {
        addSuccess = orientation === 'row'
          ? editor.chain().focus().addRowAfter().run()
          : editor.chain().focus().addColumnAfter().run();
      } else {
        const sourceCoords = getIndexCoordinates({
          editor,
          index,
          orientation,
          tablePos,
        });
        if (!sourceCoords) return;

        const stateWithCellSel = selectCellsByCoords(editor, tablePos, sourceCoords, {
          mode: 'state',
        });
        if (!stateWithCellSel) return;

        const dispatch = (tr: Transaction) => editor.view.dispatch(tr);
        if (orientation === 'row') {
          addSuccess = addRowAfter(stateWithCellSel as EditorState, dispatch);
        } else {
          addSuccess = addColumnAfter(stateWithCellSel as EditorState, dispatch);
        }
      }

      if (!addSuccess) return;

      // After adding, get the updated table position and new row/column cells
      // The tablePos might have changed, so we need to find it again
      const updatedTable = getTable(editor, tablePos);
      if (!updatedTable) return;

      // Get the new row/column cells (at index + 1) using updated state
      const newCells = orientation === 'row'
        ? getRowCells(editor, index + 1, updatedTable.pos)
        : getColumnCells(editor, index + 1, updatedTable.pos);

      if (newCells.cells.length === 0) return;

      // Replace each cell in the new row/column with duplicated content
      const { state, view } = editor;
      const tr = state.tr;

      // Process in reverse order to maintain correct positions
      const cellsToReplace = [...newCells.cells].reverse();
      const originalCellsReversed = [...originalCells.cells].reverse();

      cellsToReplace.forEach((newCell, reverseIndex) => {
        const originalCell = originalCellsReversed[reverseIndex];
        if (newCell.node && originalCell?.node) {
          // Create a duplicated cell with the same content, attrs, and marks
          const duplicatedCell = newCell.node.type.create(
            { ...originalCell.node.attrs },
            originalCell.node.content,
            originalCell.node.marks
          );

          const cellEnd = newCell.pos + newCell.node.nodeSize;
          tr.replaceWith(newCell.pos, cellEnd, duplicatedCell);
        }
      });

      if (tr.docChanged) {
        view.dispatch(tr);
      }
    } catch (error) {
      console.error('Error duplicating row/column:', error);
    }
  }, [editor, index, orientation, tablePos, canDuplicate, selectRowOrColumn]);

  // Check if current row/column is a header
  // Use useState and useEffect to ensure it updates when editor state changes
  const [isHeader, setIsHeader] = useState(false);

  useEffect(() => {
    if (!editor || typeof index !== 'number' || typeof tablePos !== 'number') {
      setIsHeader(false);
      return;
    }

    try {
      const cells = orientation === 'row'
        ? getRowCells(editor, index, tablePos)
        : getColumnCells(editor, index, tablePos);

      if (cells.cells.length === 0) {
        setIsHeader(false);
        return;
      }

      // Check if ALL cells in the row/column are headers
      const allHeaders = cells.cells.every(cell => cell?.node?.type.name === 'tableHeader');
      setIsHeader(allHeaders);
    } catch {
      setIsHeader(false);
    }
  }, [editor, index, orientation, tablePos, tableNode, editor?.state.doc, editor?.state.selection]);

  const isFirstRowOrColumn = typeof index === 'number' && index === 0;

  const menuList = useMemo<MenuItem[]>(() => {
    if (!editor) return [];

    const menuItems: MenuItem[] = [];

    if (isFirstRowOrColumn) {
      menuItems.push({
        key: 'toggle-header',
        label: isHeader
          ? (orientation === 'row' ? '取消行表头' : '取消列表头')
          : (orientation === 'row' ? '切换行表头' : '切换列表头'),
        icon: isHeader ? <LayoutLeft2LineIcon sx={{ fontSize: '1rem' }} /> : <LayoutTop2LineIcon sx={{ fontSize: '1rem' }} />,
        onClick: () => {
          selectRowOrColumn();
          if (orientation === 'row') {
            editor.chain().focus().toggleHeaderRow().run();
          } else {
            editor.chain().focus().toggleHeaderColumn().run();
          }
        },
      });
    }

    menuItems.push(
      {
        key: 'add-before',
        label: orientation === 'row' ? '上方插入行' : '左侧插入列',
        icon: orientation === 'row' ? <InsertRowTopIcon sx={{ fontSize: '1rem' }} /> : <InsertColumnLeftIcon sx={{ fontSize: '1rem' }} />,
        onClick: () => {
          if (orientation === 'row') {
            editor.chain().focus().addRowBefore().run();
          } else {
            editor.chain().focus().addColumnBefore().run();
          }
        },
      },
      {
        key: 'add-after',
        label: orientation === 'row' ? '下方插入行' : '右侧插入列',
        icon: orientation === 'row' ? <InsertRowBottomIcon sx={{ fontSize: '1rem' }} /> : <InsertColumnRightIcon sx={{ fontSize: '1rem' }} />,
        onClick: () => {
          if (orientation === 'row') {
            editor.chain().focus().addRowAfter().run();
          } else {
            editor.chain().focus().addColumnAfter().run();
          }
        },
      },
      {
        key: 'merge-cells',
        label: orientation === 'row' ? '合并当前行' : '合并当前列',
        icon: orientation === 'row' ? <MergeCellsHorizontalIcon sx={{ fontSize: '1rem' }} /> : <MergeCellsVerticalIcon sx={{ fontSize: '1rem' }} />,
        onClick: () => {
          editor.chain().focus().mergeCells().run();
        },
      },
      {
        key: 'duplicate',
        label: orientation === 'row' ? '复制当前行' : '复制当前列',
        icon: <FileCopyLineIcon sx={{ fontSize: '1rem' }} />,
        onClick: duplicateRowOrColumn,
        attrs: canDuplicate ? {} : { disabled: true },
      },
      {
        key: 'delete',
        label: orientation === 'row' ? '删除当前行' : '删除当前列',
        icon: orientation === 'row' ? <DeleteRowIcon sx={{ fontSize: '1rem' }} /> : <DeleteColumnIcon sx={{ fontSize: '1rem' }} />,
        onClick: () => {
          if (orientation === 'row') {
            editor.chain().focus().deleteRow().run();
          } else {
            editor.chain().focus().deleteColumn().run();
          }
        },
      }
    );

    return menuItems;
  }, [editor, orientation, isFirstRowOrColumn, isHeader, selectRowOrColumn, canDuplicate, duplicateRowOrColumn]);

  const handleMenuOpen = useCallback(() => {
    if (!editor) return;
    setIsMenuOpen(true);
    editor.commands.freezeHandles();
    selectRowOrColumn();
    onToggleOtherHandle?.(false);
    onOpenChange?.(true);

    // Recalculate isHeader when menu opens to ensure it's up to date
    if (typeof index === 'number' && typeof tablePos === 'number') {
      try {
        const cells = orientation === 'row'
          ? getRowCells(editor, index, tablePos)
          : getColumnCells(editor, index, tablePos);

        if (cells.cells.length > 0) {
          const allHeaders = cells.cells.every(cell => cell?.node?.type.name === 'tableHeader');
          setIsHeader(allHeaders);
        }
      } catch {
        // Ignore errors
      }
    }
  }, [editor, onOpenChange, onToggleOtherHandle, selectRowOrColumn, index, orientation, tablePos]);

  const handleMenuClose = useCallback(() => {
    if (!editor) return;
    setIsMenuOpen(false);
    editor.commands.unfreezeHandles();
    onToggleOtherHandle?.(true);
    onOpenChange?.(false);
  }, [editor, onOpenChange, onToggleOtherHandle]);

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

  const handleButton = (
    <Box
      component="button"
      className={`tiptap-table-handle-menu ${isDragging ? 'is-dragging' : ''} ${orientation}`}
      draggable={true}
      aria-label={ariaLabel}
      aria-haspopup="menu"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
        '&.is-dragging': {
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
  );

  return (
    <Menu
      context={handleButton}
      list={menuList}
      anchorOrigin={{
        vertical: orientation === 'row' ? 'top' : 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: orientation === 'row' ? 'bottom' : 'top',
        horizontal: 'left',
      }}
      onOpen={handleMenuOpen}
      onClose={handleMenuClose}
    />
  );
};

