import { Editor } from '@tiptap/core';
import { Plugin, PluginKey, Transaction } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FloatingPopover } from '../../../component/FloatingPopover';
import TableContextMenu from './ContextMenu';

const hasMultipleCellSelection = (editor: Editor) => {
  const { selection } = editor.state;
  // console.log('1️⃣ selection', selection)
  // console.log('2️⃣ cellSelection.constructor.name', selection.constructor.name)
  // console.log('2️⃣ cellSelection.ranges', selection.ranges)
  if (selection.constructor.name === '_CellSelection') {
    const cellSelection = selection as any;
    // console.log('2️⃣ cellSelection.$anchorCell', cellSelection.$anchorCell)
    // console.log('2️⃣ cellSelection.$headCell', cellSelection.$headCell)
    if (cellSelection.ranges && cellSelection.ranges.length > 1) {
      return true;
    }
    if (cellSelection.$anchorCell && cellSelection.$headCell) {
      return cellSelection.$anchorCell.pos !== cellSelection.$headCell.pos;
    }
  }
  return false
  // const selectionAny = selection as any;
  // const isColSelection = selectionAny.isColSelection;
  // const isRowSelection = selectionAny.isRowSelection;
  // // console.log('3️⃣ selectionAny.isColSelection', isColSelection)
  // // console.log('3️⃣ selectionAny.isRowSelection', isRowSelection)
  // if (isColSelection || isRowSelection) {
  //   return true;
  // }
  // console.log('3️⃣ selection.from', selection.from)
  // console.log('3️⃣ selection.to', selection.to)
  // if (selection.from !== selection.to) {
  //   const resolvedFrom = editor.state.doc.resolve(selection.from);
  //   const resolvedTo = editor.state.doc.resolve(selection.to);
  //   console.log('4️⃣ resolvedFrom.nodeAfter', resolvedFrom.nodeAfter)
  //   console.log('4️⃣ resolvedTo.nodeBefore', resolvedTo.nodeBefore)
  //   if (resolvedFrom.nodeAfter && resolvedTo.nodeBefore) {
  //     const fromCell = resolvedFrom.node();
  //     const toCell = resolvedTo.node();
  //     console.log('5️⃣ fromCell', fromCell)
  //     console.log('5️⃣ toCell', toCell)
  //     if (fromCell !== toCell && (fromCell.type.name === 'tableCell' || fromCell.type.name === 'tableHeader')) {
  //       return true;
  //     }
  //   }
  // }
  // return false;
};

const isClickedCellInSelection = (editor: Editor, clickedElement: Element) => {
  const { selection } = editor.state;
  // console.log('6️⃣ selection', selection)
  // console.log('6️⃣ selection.constructor.name', selection.constructor.name)
  if (selection.constructor.name !== '_CellSelection') {
    return false;
  }
  try {
    const editorView = editor.view;
    let domPosition: number | null = null;
    // console.log('7️⃣ clickedElement', clickedElement)
    if (clickedElement.tagName === 'TD' || clickedElement.tagName === 'TH') {
      domPosition = editorView.posAtDOM(clickedElement, 0);
      // console.log('7️⃣ domPosition - 1', domPosition)
    } else {
      const parentCell = clickedElement.closest('td, th');
      // console.log('7️⃣ parentCell', parentCell)
      if (parentCell) {
        domPosition = editorView.posAtDOM(parentCell, 0);
        // console.log('7️⃣ domPosition - 2', domPosition)
      }
    }
    if (domPosition === null || domPosition === undefined || domPosition < 0) {
      return false;
    }
    const cellSelection = selection as any;
    // console.log('8️⃣ cellSelection.ranges', cellSelection.ranges)
    const ranges = cellSelection.ranges.map((it: any) => it.$from.pos);
    // console.log('8️⃣ ranges', ranges)
    return ranges.includes(domPosition);
  } catch (error) {
    console.warn('Error checking if clicked cell is in selection:', error);
    return false;
  }
};

const saveCurrentSelection = (editor: Editor) => {
  // console.log('9️⃣ selection', editor.state.selection, 'doc', editor.state.doc)
  return {
    selection: editor.state.selection,
    doc: editor.state.doc
  };
};

const restoreSelection = (editor: Editor, savedState: any) => {
  // console.log('0️⃣ savedState', savedState)
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
  // console.log('🍎 isInTableCell cell', cell)
  if (!cell) return false;
  const editorElement = cell.closest('.tiptap');
  // console.log('🍎 isInTableCell editorElement', editorElement)
  return !!editorElement;
};

const getTableCell = (element: Element): Element | null => {
  const cell = element.closest('td, th');
  // console.log('🍎 getTableCell cell', cell)
  if (!cell) return null;
  const editorElement = cell.closest('.tiptap');
  // console.log('🍎 getTableCell editorElement', editorElement)
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
    // console.log('🍊 createMenuContainer')
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
    // console.log('🍊 destroyMenuContainer', root, 'menuContainer', menuContainer)
    if (root) {
      // 保存当前的 root 引用，避免异步执行时访问 null
      const currentRoot = root;
      root = null;
      // 异步卸载以避免在 React 渲染期间卸载根节点
      queueMicrotask(() => {
        currentRoot.unmount();
      });
    }
    if (menuContainer) {
      // 保存当前的 menuContainer 引用
      const currentContainer = menuContainer;
      menuContainer = null;
      queueMicrotask(() => {
        if (currentContainer && currentContainer.parentNode) {
          document.body.removeChild(currentContainer);
        }
      });
    }
  };

  const hideContextMenu = () => {
    // console.log('🍊 hideContextMenu', root, 'savedSelection', savedSelection, 'commandExecuted', commandExecuted, 'preventSelectionLoss', preventSelectionLoss)
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

  const showContextMenu = (anchorEl: HTMLElement, hasMultipleSelection: boolean, hasMultipleCellElements: boolean) => {
    // console.log('🍊 showContextMenu', anchorEl, 'hasMultipleSelection', hasMultipleSelection)
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
          hasMultipleCellElements={hasMultipleCellElements}
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
        // console.log('🍊 init')
        return {
          show: false,
          anchorEl: null,
          hasMultipleSelection: false,
        };
      },
      apply(tr: Transaction, oldState: TableContextMenuPluginState) {
        // console.log('🍊 apply', oldState)
        return oldState;
      },
    },
    props: {
      handleDOMEvents: {
        contextmenu: (view: EditorView, event: MouseEvent) => {
          const target = event.target as Element;
          // console.log('🍊 contextmenu', target)
          if (!isInTableCell(target)) {
            // console.log('🍊 contextmenu not in table cell')
            hideContextMenu();
            preventSelectionLoss = false;
            return false;
          }
          event.preventDefault();
          event.stopPropagation();
          const cellElement = getTableCell(target);
          console.log('🍊 cellElement', cellElement?.getAttribute('colspan'), cellElement?.getAttribute('rowspan'))
          if (!cellElement) {
            preventSelectionLoss = false;
            return false;
          }
          if (preventSelectionLoss && savedSelection) {
            // console.log('🍊 contextmenu preventSelectionLoss and savedSelection', preventSelectionLoss, savedSelection)
            restoreSelection(editor, savedSelection);
            setTimeout(() => {
              const selectedCells = document.querySelectorAll('.tiptap .selectedCell');
              console.info('✅ Selected cells after restore:', selectedCells.length);
            }, 50);
          }
          const hasMultipleSelection = savedSelection ? true : hasMultipleCellSelection(editor);
          const hasMultipleCellElements = cellElement?.getAttribute('colspan') && parseInt(cellElement.getAttribute('colspan') || '1') > 1
            || cellElement?.getAttribute('rowspan') && parseInt(cellElement.getAttribute('rowspan') || '1') > 1 || false
          // console.log('🍊 contextmenu hasMultipleSelection', hasMultipleSelection)
          showContextMenu(cellElement as HTMLElement, hasMultipleSelection, hasMultipleCellElements);
          preventSelectionLoss = false;
          return true;
        },
        mousedown: (view: EditorView, event: MouseEvent) => {
          // console.log('🍊 mousedown')
          const target = event.target as Element;
          // console.log('🍊 mousedown target', target)
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
                    console.info('❌ Right-click outside selection, allowing normal behavior');
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
          // console.log('🍊 mouseup')
          const target = event.target as Element;
          if (isInTableCell(target)) {
            const cellElement = getTableCell(target);
            if (cellElement) {
              const currentHasMultipleSelection = hasMultipleCellSelection(editor);
              if (currentHasMultipleSelection) {
                // console.log('🍊🍊 mouseup current selection', window.getSelection()?.toString().length, window.getSelection()?.toString())
                window.getSelection()?.removeAllRanges();
                // console.log('🍊🍊 mouseup current selection', window.getSelection()?.toString().length, window.getSelection()?.toString())
              }
            }
          }
          if (event.button === 2 && preventSelectionLoss) {
            // console.log('🍊 mouseup preventSelectionLoss', preventSelectionLoss)
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
          // console.log('🍊 keydown')
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
          // console.log('🍊 destroy')
          destroyMenuContainer();
        },
      };
    },
  });
};