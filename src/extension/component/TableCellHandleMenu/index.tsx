import { Menu } from '@ctzhian/tiptap/component';
import { AlignBottomIcon, AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, AlignTopIcon, ArrowDownSLineIcon, BrushLineIcon, MergeCellsVerticalIcon, MoreLineIcon, SplitCellsVerticalIcon } from '@ctzhian/tiptap/component/Icons';
import { DeleteBack2LineIcon } from '@ctzhian/tiptap/component/Icons/delete-back-2-line-icon';
import { getThemeTextBgColor, getThemeTextColor } from '@ctzhian/tiptap/contants/enums';
import { MenuItem } from '@ctzhian/tiptap/type';
import { Box, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CellSelection,
  cellAround,
  deleteCellSelection,
  mergeCells,
  splitCell,
} from '@tiptap/pm/tables';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';

interface TableCellHandleMenuProps
  extends React.ComponentPropsWithoutRef<'button'> {
  editor?: Editor | null;
  onOpenChange?: (isOpen: boolean) => void;
  onResizeStart?: (handle: 'br') => (event: React.MouseEvent) => void;
}

export const TableCellHandleMenu = forwardRef<
  HTMLButtonElement,
  TableCellHandleMenuProps
>(({ editor, onOpenChange, className, onResizeStart, ...props }, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();

  const editorState = useEditorState({
    editor: editor!,
    selector: (context) => {
      if (!context.editor) return null;
      return {
        selection: context.editor.state.selection,
        isEditable: context.editor.isEditable,
      };
    },
  });

  const handleMenuToggle = useCallback(
    (isOpen: boolean) => {
      setIsMenuOpen(isOpen);

      if (!editor) return;

      if (isOpen) {
        editor.commands.freezeHandles();
      } else {
        editor.commands.unfreezeHandles();
      }
    },
    [editor]
  );

  useEffect(() => {
    onOpenChange?.(isMenuOpen);
  }, [isMenuOpen, onOpenChange]);

  const menuList = React.useMemo<MenuItem[]>(() => {
    if (!editor || !editor.isEditable) return [];

    const canMerge = (() => {
      try {
        return mergeCells(editor.state, undefined);
      } catch {
        return false;
      }
    })();

    const canSplit = (() => {
      try {
        return splitCell(editor.state, undefined);
      } catch {
        return false;
      }
    })();

    const menuItems: MenuItem[] = [];

    if (canMerge || canSplit) {
      if (canMerge) {
        menuItems.push({
          key: 'merge-cells',
          label: '合并单元格',
          icon: <MergeCellsVerticalIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => {
            const { state, view } = editor;
            mergeCells(state, view.dispatch.bind(view));
          },
        });
      }

      if (canSplit) {
        menuItems.push({
          key: 'split-cell',
          label: '拆分单元格',
          icon: <SplitCellsVerticalIcon sx={{ fontSize: '1rem' }} />,
          onClick: () => {
            const { state, view } = editor;
            splitCell(state, view.dispatch.bind(view));
          },
        });
      }

      menuItems.push({
        customLabel: <Divider sx={{ my: 0.5 }} />,
        key: 'divider1',
      });
    }

    menuItems.push(
      {
        key: 'color',
        label: '颜色',
        icon: <BrushLineIcon sx={{ fontSize: '1rem' }} />,
        children: [
          {
            customLabel: (
              <Typography
                sx={{
                  p: 1,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  fontWeight: 'bold',
                }}
              >
                文字颜色
              </Typography>
            ),
            key: 'text-color',
          },
          ...getThemeTextColor(theme).map((it) => ({
            label: it.label,
            key: it.value,
            icon: (
              <Box
                sx={{
                  color: it.value,
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  bgcolor: it.value,
                  border: '1px solid',
                  borderColor:
                    it.value === theme.palette.common.white
                      ? 'divider'
                      : 'transparent',
                }}
              />
            ),
            onClick: () => {
              setTimeout(() => {
                editor
                  .chain()
                  .focus()
                  .toggleMark('textStyle', { color: it.value })
                  .run();
              }, 0);
            },
          })),
          {
            customLabel: (
              <Typography
                sx={{
                  p: 1,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  fontWeight: 'bold',
                }}
              >
                背景颜色
              </Typography>
            ),
            key: 'background-color',
          },
          ...getThemeTextBgColor(theme).map((it) => ({
            label: it.label,
            key: it.value,
            icon: (
              <Box
                sx={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  bgcolor: it.value,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            ),
            onClick: () => {
              const bgColor =
                it.value === 'transparent' ||
                  it.value === 'var(--mui-palette-background-paper)'
                  ? 'transparent'
                  : it.value;
              setTimeout(() => {
                editor
                  .chain()
                  .focus()
                  .setCellAttribute('bgcolor', bgColor)
                  .run();
              }, 0);
            },
          })),
        ],
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
              setTimeout(() => {
                editor.chain().focus().setCellAttribute('verticalAlign', 'bottom').run();
              }, 0);
            }
          },
        ]
      },
    );

    menuItems.push({
      key: 'clear-content',
      label: '清空单元格内容',
      icon: <DeleteBack2LineIcon sx={{ fontSize: '1rem' }} />,
      onClick: () => {
        if (!editor) return;
        const { state, view } = editor;

        if (state.selection instanceof CellSelection) {
          deleteCellSelection(state, view.dispatch.bind(view));
        } else {
          const { $anchor } = state.selection;
          const cell = cellAround($anchor);
          if (cell) {
            const cellNode = state.doc.nodeAt(cell.pos);
            if (cellNode) {
              const from = cell.pos + 1;
              const to = cell.pos + cellNode.nodeSize - 1;
              if (from < to) {
                view.dispatch(state.tr.delete(from, to));
              }
            }
          }
        }
      },
      attrs: (() => {
        if (!editor) return { disabled: true };
        const { selection } = editor.state;
        if (selection instanceof CellSelection) {
          let hasContent = false;
          selection.forEachCell((cell) => {
            if (cell.content.size > 0) {
              hasContent = true;
            }
          });
          return hasContent ? {} : { disabled: true };
        } else {
          const { $anchor } = selection;
          const cell = cellAround($anchor);
          if (cell) {
            const cellNode = editor.state.doc.nodeAt(cell.pos);
            return cellNode && cellNode.content.size > 0
              ? {}
              : { disabled: true };
          }
          return { disabled: true };
        }
      })(),
    });

    return menuItems;
  }, [editor, theme, editorState]);

  const handleButton = (
    <Box
      component="button"
      ref={ref}
      className={className}
      aria-label="Table cells option"
      aria-haspopup="menu"
      aria-expanded={isMenuOpen}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (onResizeStart) {
          onResizeStart('br')(e);
        }
      }}
      sx={{
        position: 'absolute',
        top: '50%',
        right: '-8px',
        transform: 'translateY(-50%)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--mui-shape-borderRadius)',
        cursor: 'pointer',
        padding: '4px',
        width: '14px',
        height: '14px',
        zIndex: 4,
        backgroundColor: 'var(--mui-palette-primary-main)',
        '& .MuiSvgIcon-root': {
          color: 'var(--mui-palette-common-white)',
        },
      }}
      {...props}
    >
      <MoreLineIcon
        sx={{
          width: '0.75rem',
          height: '0.75rem',
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
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onOpen={() => handleMenuToggle(true)}
      onClose={() => handleMenuToggle(false)}
      arrowIcon={<ArrowDownSLineIcon sx={{ fontSize: '1rem', transform: 'rotate(-90deg)' }} />}
    />
  );
});

TableCellHandleMenu.displayName = 'TableCellHandleMenu';
