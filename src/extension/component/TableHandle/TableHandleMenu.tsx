import {
  AlignBottomIcon,
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlignTopIcon,
  ArrowDownSLineIcon,
  BrushLineIcon,
  DeleteColumnIcon, DeleteRowIcon,
  FileCopyLineIcon,
  InsertColumnLeftIcon,
  InsertColumnRightIcon, InsertRowBottomIcon, InsertRowTopIcon,
  LayoutLeft2LineIcon,
  LayoutTop2LineIcon,
} from '@ctzhian/tiptap/component/Icons';
import { DeleteBack2LineIcon } from '@ctzhian/tiptap/component/Icons/delete-back-2-line-icon';
import { getThemeTextBgColor, getThemeTextColor } from '@ctzhian/tiptap/contants/enums';
import { Box, Divider, Typography, useTheme } from '@mui/material';
import type { Node } from '@tiptap/pm/model';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import { addColumnAfter, addRowAfter, CellSelection, deleteCellSelection, TableMap } from '@tiptap/pm/tables';
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
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);

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

  const canDuplicate = useMemo(() => {
    if (!editor || typeof index !== 'number' || typeof tablePos !== 'number') {
      return false;
    }

    try {
      const cells = orientation === 'row'
        ? getRowCells(editor, index, tablePos)
        : getColumnCells(editor, index, tablePos);

      return cells.cells.length > 0 && cells.mergedCells.length === 0;
    } catch {
      return false;
    }
  }, [editor, index, orientation, tablePos, tableNode, editor?.state.doc]);

  const duplicateRowOrColumn = useCallback(() => {
    if (!editor || typeof index !== 'number' || typeof tablePos !== 'number' || !canDuplicate) {
      return;
    }

    try {
      const originalCells = orientation === 'row'
        ? getRowCells(editor, index, tablePos)
        : getColumnCells(editor, index, tablePos);

      if (originalCells.cells.length === 0) return;

      selectRowOrColumn();

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

      const updatedTable = getTable(editor, tablePos);
      if (!updatedTable) return;

      const newCells = orientation === 'row'
        ? getRowCells(editor, index + 1, updatedTable.pos)
        : getColumnCells(editor, index + 1, updatedTable.pos);

      if (newCells.cells.length === 0) return;

      const { state, view } = editor;
      const tr = state.tr;

      const cellsToReplace = [...newCells.cells].reverse();
      const originalCellsReversed = [...originalCells.cells].reverse();

      cellsToReplace.forEach((newCell, reverseIndex) => {
        const originalCell = originalCellsReversed[reverseIndex];
        if (newCell.node && originalCell?.node) {
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

      const allHeaders = cells.cells.every(cell => cell?.node?.type.name === 'tableHeader');
      setIsHeader(allHeaders);
    } catch {
      setIsHeader(false);
    }
  }, [editor, index, orientation, tablePos, tableNode, editor?.state.doc, editor?.state.selection]);

  const isFirstRowOrColumn = typeof index === 'number' && index === 0;

  const menuList = useMemo<MenuItem[]>(() => {
    if (!editor) return [];

    const menuItems: MenuItem[] = [
    ];

    if (isFirstRowOrColumn) {
      menuItems.push(
        {
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
        },
        {
          customLabel: <Divider sx={{ my: 0.5 }} />,
          key: 'divider2',
        }
      );
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
        customLabel: <Divider sx={{ my: 0.5 }} />,
        key: 'divider1',
      },
      {
        key: 'color',
        label: '颜色',
        icon: <BrushLineIcon sx={{ fontSize: '1rem' }} />,
        children: [
          {
            customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>文字颜色</Typography>,
            key: 'text-color',
          },
          ...(getThemeTextColor(theme).map(it => ({
            label: it.label,
            key: it.value,
            icon: <Box sx={{
              color: it.value,
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              bgcolor: it.value,
              border: '1px solid',
              borderColor: it.value === theme.palette.common.white ? 'divider' : 'transparent'
            }}></Box>,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                editor
                  .chain()
                  .focus()
                  .toggleMark('textStyle', { color: it.value })
                  .run();
              }, 0);
            }
          }))),
          {
            customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>背景颜色</Typography>,
            key: 'background-color',
          },
          ...(getThemeTextBgColor(theme).map(it => ({
            label: it.label,
            key: it.value,
            icon: <Box sx={{
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              bgcolor: it.value,
              border: '1px solid',
              borderColor: 'divider',
            }}></Box>,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                const bgColor = it.value === 'transparent' || it.value === 'var(--mui-palette-background-paper)'
                  ? 'transparent'
                  : it.value;
                editor
                  .chain()
                  .focus()
                  .setCellAttribute('bgcolor', bgColor)
                  .run();
              }, 0);
            }
          })))
        ]
      },
      {
        key: 'align',
        label: '对齐方式',
        icon: <AlignLeftIcon sx={{ fontSize: '1rem' }} />,
        children: [
          {
            customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>
              水平对齐方式
            </Typography>,
            key: 'align-horizontal',
          },
          {
            label: '左侧对齐',
            key: 'align-horizontal-left',
            icon: <AlignLeftIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                editor
                  .chain()
                  .focus()
                  .setCellAttribute('textAlign', 'left')
                  .run();
              }, 0);
            }
          },
          {
            label: '居中对齐',
            key: 'align-horizontal-center',
            icon: <AlignCenterIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                editor.chain().focus().setCellAttribute('textAlign', 'center').run();
              }, 0);
            }
          },
          {
            label: '右侧对齐',
            key: 'align-horizontal-right',
            icon: <AlignRightIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                editor.chain().focus().setCellAttribute('textAlign', 'right').run();
              }, 0);
            }
          },
          {
            label: '两端对齐',
            key: 'align-horizontal-justify',
            icon: <AlignJustifyIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                editor.chain().focus().setCellAttribute('textAlign', 'justify').run();
              }, 0);
            }
          },
          {
            customLabel: <Typography sx={{ p: 1, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>
              垂直对齐方式
            </Typography>,
            key: 'align-vertical',
          },
          {
            label: '顶部对齐',
            key: 'align-vertical-top',
            icon: <AlignTopIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                editor.chain().focus().setCellAttribute('verticalAlign', 'top').run();
              }, 0);
            }
          },
          {
            label: '居中对齐',
            key: 'align-vertical-center',
            icon: <AlignCenterIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                editor.chain().focus().setCellAttribute('verticalAlign', 'middle').run();
              }, 0);
            }
          },
          {
            label: '底部对齐',
            key: 'align-vertical-bottom',
            icon: <AlignBottomIcon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              if (!editor) return;
              selectRowOrColumn();
              setTimeout(() => {
                editor.chain().focus().setCellAttribute('verticalAlign', 'bottom').run();
              }, 0);
            }
          },
        ]
      },
      {
        key: 'clear-content',
        label: orientation === 'row' ? '清空当前行内容' : '清空当前列内容',
        icon: <DeleteBack2LineIcon sx={{ fontSize: '1rem' }} />,
        onClick: () => {
          if (!editor || typeof index !== 'number' || typeof tablePos !== 'number' || !tableNode) return;
          const { state, view } = editor;

          try {
            const { width, height } = TableMap.get(tableNode);
            const start =
              orientation === 'row' ? { row: index, col: 0 } : { row: 0, col: index };
            const end =
              orientation === 'row'
                ? { row: index, col: width - 1 }
                : { row: height - 1, col: index };

            const stateWithSelection = selectCellsByCoords(editor, tablePos, [start, end], {
              mode: 'state',
            }) as EditorState | undefined;

            if (stateWithSelection && stateWithSelection.selection instanceof CellSelection) {
              deleteCellSelection(stateWithSelection, view.dispatch.bind(view));
            }
          } catch (error) {
            console.warn('Failed to clear row/column content:', error);
          }
        },
        attrs: (() => {
          if (!editor || typeof index !== 'number' || typeof tablePos !== 'number') {
            return { disabled: true };
          }

          try {
            const cells = orientation === 'row'
              ? getRowCells(editor, index, tablePos)
              : getColumnCells(editor, index, tablePos);

            if (cells.cells.length === 0) {
              return { disabled: true };
            }

            let hasContent = false;
            for (const cell of cells.cells) {
              if (cell.node && cell.node.content.size > 0) {
                hasContent = true;
                break;
              }
            }

            return hasContent ? {} : { disabled: true };
          } catch {
            return { disabled: true };
          }
        })(),
      },
      {
        customLabel: <Divider sx={{ my: 0.5 }} />,
        key: 'divider3',
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
    editor.commands.freezeHandles();
    selectRowOrColumn();
    onToggleOtherHandle?.(false);
    onOpenChange?.(true);

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
      }
    }
  }, [editor, onOpenChange, onToggleOtherHandle, selectRowOrColumn, index, orientation, tablePos]);

  const handleMenuClose = useCallback(() => {
    if (!editor) return;
    editor.commands.unfreezeHandles();
    onToggleOtherHandle?.(true);
    onOpenChange?.(false);
  }, [editor, onOpenChange, onToggleOtherHandle]);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      setIsDragging(true);
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
        backgroundColor: 'var(--mui-palette-background-paper3)',
        borderRadius: 'var(--mui-shape-borderRadius)',
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
          backgroundColor: 'var(--mui-palette-primary-main)',
          '& .MuiSvgIcon-root': {
            color: 'var(--mui-palette-common-white)',
          },
        },
        '&:hover': {
          backgroundColor: 'var(--mui-palette-primary-main)',
          '& .MuiSvgIcon-root': {
            color: 'var(--mui-palette-common-white)',
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
      width={216}
      context={handleButton}
      list={menuList}
      anchorOrigin={{
        vertical: orientation === 'row' ? 'top' : 'bottom',
        horizontal: orientation === 'row' ? 'right' : 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onOpen={handleMenuOpen}
      onClose={handleMenuClose}
      arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
    />
  );
};

