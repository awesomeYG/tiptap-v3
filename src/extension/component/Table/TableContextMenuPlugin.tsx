import { Editor } from '@tiptap/core';
import { Plugin, PluginKey, Transaction } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FloatingPopover } from '../../../component/FloatingPopover';
import TableContextMenu from './ContextMenu';

const hasMultipleCellSelection = (editor: Editor) => {
  const { selection } = editor.state;
  if (selection.constructor.name === 'CellSelection') {
    const cellSelection = selection as any;
    if (cellSelection.ranges && cellSelection.ranges.length > 1) {
      return true;
    }
    if (cellSelection.$anchorCell && cellSelection.$headCell) {
      return cellSelection.$anchorCell.pos !== cellSelection.$headCell.pos;
    }
  }
  const selectionAny = selection as any;
  if (selectionAny.isColSelection || selectionAny.isRowSelection) {
    return true;
  }
  if (selection.from !== selection.to) {
    const resolvedFrom = editor.state.doc.resolve(selection.from);
    const resolvedTo = editor.state.doc.resolve(selection.to);
    if (resolvedFrom.nodeAfter && resolvedTo.nodeBefore) {
      const fromCell = resolvedFrom.node();
      const toCell = resolvedTo.node();
      if (fromCell !== toCell && (fromCell.type.name === 'tableCell' || fromCell.type.name === 'tableHeader')) {
        return true;
      }
    }
  }
  return false;
};

const isClickedCellInSelection = (editor: Editor, clickedElement: Element) => {
  const { selection } = editor.state;
  if (selection.constructor.name !== '_CellSelection') {
    return false;
  }
  try {
    const editorView = editor.view;
    let domPosition: number | null = null;
    if (clickedElement.tagName === 'TD' || clickedElement.tagName === 'TH') {
      domPosition = editorView.posAtDOM(clickedElement, 0);
    } else {
      const parentCell = clickedElement.closest('td, th');
      if (parentCell) {
        domPosition = editorView.posAtDOM(parentCell, 0);
      }
    }
    if (domPosition === null || domPosition === undefined || domPosition < 0) {
      return false;
    }
    const cellSelection = selection as any;
    // 使用范围判断不精确，直接使用ranges判断
    const ranges = cellSelection.ranges.map((it: any) => it.$from.pos);
    return ranges.includes(domPosition);
    // if (cellSelection.$anchorCell && cellSelection.$headCell) {
    //   const anchorPos = cellSelection.$anchorCell.pos;
    //   const headPos = cellSelection.$headCell.pos;
    //   const minPos = Math.min(anchorPos, headPos);
    //   const maxPos = Math.max(anchorPos, headPos);
    //   return domPosition >= minPos && domPosition <= maxPos;
    // }
    // return domPosition >= selection.from && domPosition <= selection.to;
  } catch (error) {
    console.warn('Error checking if clicked cell is in selection:', error);
    return false;
  }
};

const saveCurrentSelection = (editor: Editor) => {
  return {
    selection: editor.state.selection,
    doc: editor.state.doc
  };
};

const restoreSelection = (editor: Editor, savedState: any) => {
  if (savedState && savedState.selection) {
    try {
      const tr = editor.state.tr.setSelection(savedState.selection);
      editor.view.dispatch(tr);
      editor.view.updateState(editor.view.state);
      requestAnimationFrame(() => {
        editor.view.dom.dispatchEvent(new Event('selectionchange', { bubbles: true }));
      });
    } catch (error) {
      console.warn('Failed to restore table cell selection:', error);
    }
  }
};

const isInTableCell = (element: Element): boolean => {
  const cell = element.closest('td, th');
  if (!cell) return false;
  const editorElement = cell.closest('.tiptap');
  return !!editorElement;
};

const getTableCell = (element: Element): Element | null => {
  const cell = element.closest('td, th');
  if (!cell) return null;
  const editorElement = cell.closest('.tiptap');
  return editorElement ? cell : null;
};

export interface TableContextMenuPluginState {
  show: boolean;
  anchorEl: HTMLElement | null;
  hasMultipleSelection: boolean;
}

export const TableContextMenuPluginKey = new PluginKey<TableContextMenuPluginState>('tableContextMenu');

export const createTableContextMenuPlugin = (editor: Editor) => {
  let menuContainer: HTMLDivElement | null = null;
  let root: any = null;
  let savedSelection: any = null;
  let commandExecuted = false;
  let preventSelectionLoss = false;

  const createMenuContainer = () => {
    if (!menuContainer) {
      menuContainer = document.createElement('div');
      menuContainer.style.position = 'fixed';
      menuContainer.style.zIndex = '9999';
      menuContainer.style.pointerEvents = 'auto';
      document.body.appendChild(menuContainer);
      root = createRoot(menuContainer);
    }
    return { menuContainer, root };
  };

  const destroyMenuContainer = () => {
    if (root) {
      root.unmount();
      root = null;
    }
    if (menuContainer) {
      document.body.removeChild(menuContainer);
      menuContainer = null;
    }
  };

  const hideContextMenu = () => {
    if (root) {
      root.render(null);
    }
    if (savedSelection && !commandExecuted && !preventSelectionLoss) {
      restoreSelection(editor, savedSelection);
    }
    savedSelection = null;
    commandExecuted = false;
    preventSelectionLoss = false;
  };

  const showContextMenu = (anchorEl: HTMLElement, hasMultipleSelection: boolean) => {
    const { root } = createMenuContainer();
    commandExecuted = false;
    const handleClose = () => {
      hideContextMenu();
    };

    const handleCommandExecute = () => {
      commandExecuted = true;
      savedSelection = null;
    };

    root.render(
      <FloatingPopover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        placement="bottom"
      >
        <TableContextMenu
          editor={editor}
          hasMultipleSelection={hasMultipleSelection}
          onClose={handleClose}
          onCommandExecute={handleCommandExecute}
        />
      </FloatingPopover>
    );
  };

  return new Plugin<TableContextMenuPluginState>({
    key: TableContextMenuPluginKey,
    state: {
      init() {
        return {
          show: false,
          anchorEl: null,
          hasMultipleSelection: false,
        };
      },
      apply(tr: Transaction, oldState: TableContextMenuPluginState) {
        return oldState;
      },
    },
    props: {
      handleDOMEvents: {
        contextmenu: (view: EditorView, event: MouseEvent) => {
          const target = event.target as Element;
          if (!isInTableCell(target)) {
            hideContextMenu();
            preventSelectionLoss = false;
            return false;
          }
          event.preventDefault();
          event.stopPropagation();
          const cellElement = getTableCell(target);
          if (!cellElement) {
            preventSelectionLoss = false;
            return false;
          }
          if (preventSelectionLoss && savedSelection) {
            restoreSelection(editor, savedSelection);
            setTimeout(() => {
              const selectedCells = document.querySelectorAll('.tiptap .selectedCell');
              console.log('✅ Selected cells after restore:', selectedCells.length);
            }, 50);
          }
          const hasMultipleSelection = savedSelection ? true : hasMultipleCellSelection(editor);
          showContextMenu(cellElement as HTMLElement, hasMultipleSelection);
          preventSelectionLoss = false;
          return true;
        },
        mousedown: (view: EditorView, event: MouseEvent) => {
          const target = event.target as Element;
          if (event.button === 2) {
            if (isInTableCell(target)) {
              const cellElement = getTableCell(target);
              if (cellElement) {
                const currentHasMultipleSelection = hasMultipleCellSelection(editor);
                if (currentHasMultipleSelection) {
                  const isInSelection = isClickedCellInSelection(editor, cellElement);
                  if (isInSelection) {
                    savedSelection = saveCurrentSelection(editor);
                    preventSelectionLoss = true;
                    event.preventDefault();
                    event.stopPropagation();
                    return true;
                  } else {
                    console.log('❌ Right-click outside selection, allowing normal behavior');
                  }
                }
              }
            }
          } else {
            if (!target.closest('[role="menu"]') && !target.closest('.MuiPaper-root')) {
              hideContextMenu();
            }
          }
          return false;
        },
        mouseup: (view: EditorView, event: MouseEvent) => {
          if (event.button === 2 && preventSelectionLoss) {
            setTimeout(() => {
              if (preventSelectionLoss) {
                preventSelectionLoss = false;
                if (savedSelection && !commandExecuted) {
                  restoreSelection(editor, savedSelection);
                  savedSelection = null;
                }
              }
            }, 10);
          }
          return false;
        },
        keydown: (view: EditorView, event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            hideContextMenu();
            return true;
          }
          return false;
        },
      },
    },
    view() {
      return {
        destroy() {
          destroyMenuContainer();
        },
      };
    },
  });
};