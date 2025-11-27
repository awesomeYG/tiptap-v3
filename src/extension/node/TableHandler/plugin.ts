import type { Editor } from '@tiptap/core';
import type { Node as TiptapNode } from '@tiptap/pm/model';
import type { EditorState, PluginView, Transaction } from '@tiptap/pm/state';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import {
  CellSelection,
  moveTableColumn,
  moveTableRow,
  TableMap,
} from '@tiptap/pm/tables';
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view';
import {
  clamp,
  domCellAround,
  getCellIndicesFromDOM,
  getColumnCells,
  getIndexCoordinates,
  getRowCells,
  getTableFromDOM,
  isHTMLElement,
  isTableNode,
  safeClosest,
  selectCellsByCoords,
} from '../../../util/table-utils';
import { createTableDragImage } from './create-image';

export type TableHandlesState = {
  show: boolean;
  showAddOrRemoveRowsButton: boolean;
  showAddOrRemoveColumnsButton: boolean;
  referencePosCell?: DOMRect;
  referencePosTable: DOMRect;
  referencePosLastRow?: DOMRect; // Position of last row for extend button
  referencePosLastCol?: DOMRect; // Position of last column for extend button
  block: TiptapNode;
  blockPos: number;
  colIndex: number | undefined;
  rowIndex: number | undefined;
  draggingState?:
  | {
    draggedCellOrientation: 'row' | 'col';
    originalIndex: number;
    mousePos: number;
    initialOffset: number;
    originalCellSize?: { width: number; height: number }; // Preserve original cell size during drag
  }
  | undefined;
  widgetContainer: HTMLElement | undefined;
};

function hideElements(selector: string, rootEl: Document | ShadowRoot) {
  rootEl.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.style.visibility = 'hidden';
  });
}

export const tableHandlePluginKey = new PluginKey('tableHandlePlugin');

class TableHandleView implements PluginView {
  public editor: Editor;
  public editorView: EditorView;

  public state: TableHandlesState | undefined = undefined;
  public menuFrozen = false;
  public mouseState: 'up' | 'down' | 'selecting' = 'up';
  public tableId: string | undefined;
  public tablePos: number | undefined;
  public tableElement: HTMLElement | undefined;

  public emitUpdate: () => void;

  constructor(
    editor: Editor,
    editorView: EditorView,
    emitUpdate: (state: TableHandlesState) => void
  ) {
    this.editor = editor;
    this.editorView = editorView;
    this.emitUpdate = () => this.state && emitUpdate(this.state);

    this.editorView.dom.addEventListener('mousemove', this.mouseMoveHandler);
    this.editorView.dom.addEventListener('mousedown', this.viewMousedownHandler);
    window.addEventListener('mouseup', this.mouseUpHandler);

    this.editorView.root.addEventListener(
      'dragover',
      this.dragOverHandler as EventListener
    );
    this.editorView.root.addEventListener(
      'drop',
      this.dropHandler as unknown as EventListener
    );

    // Listen to scroll events to update handle positions when scrolling
    window.addEventListener('scroll', this.scrollHandler, true);
    // Also listen to resize events
    window.addEventListener('resize', this.scrollHandler);
  }

  private viewMousedownHandler = (event: MouseEvent) => {
    this.mouseState = 'down';

    const { state, view } = this.editor;
    if (!(state.selection instanceof CellSelection) || this.editor.isFocused)
      return;

    const posInfo = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    if (!posInfo) return;

    const $pos = state.doc.resolve(posInfo.pos);
    const { nodes } = state.schema;
    let paraDepth = -1;
    let inTableCell = false;

    for (let d = $pos.depth; d >= 0; d--) {
      const node = $pos.node(d);
      if (
        !inTableCell &&
        (node.type === nodes.tableCell || node.type === nodes.tableHeader)
      ) {
        inTableCell = true;
      }
      if (paraDepth === -1 && node.type === nodes.paragraph) {
        paraDepth = d;
      }
      if (inTableCell && paraDepth !== -1) break;
    }

    if (!inTableCell || paraDepth === -1) return;

    const from = $pos.start(paraDepth);
    const to = $pos.end(paraDepth);
    const nextSel = TextSelection.create(state.doc, from, to);
    if (state.selection.eq(nextSel)) return;

    view.dispatch(state.tr.setSelection(nextSel));
    view.focus();
  };

  private mouseUpHandler = (event: MouseEvent) => {
    this.mouseState = 'up';
    this.mouseMoveHandler(event);
  };

  private mouseMoveHandler = (event: MouseEvent) => {
    if (this.menuFrozen || this.mouseState === 'selecting') return;

    const target = event.target;
    // If target is not in editor, don't process - this prevents state from being cleared
    // when dragging outside the editor, which is the key to preventing errors
    if (!isHTMLElement(target) || !this.editorView.dom.contains(target)) return;

    // Check if mouse is over a table handle or extend button
    const isOverHandle = target.closest('.tiptap-table-handle-menu') !== null;
    const isOverExtendButton = target.closest('.tiptap-table-extend-row-column-button') !== null;

    // If mouse is over handle/button, keep showing them (don't hide)
    if (isOverHandle || isOverExtendButton) {
      return;
    }

    // Check if mouse is near handle/button elements (within reasonable distance)
    const handleElements = Array.from(
      this.editorView.root.querySelectorAll(
        '.tiptap-table-handle-menu, .tiptap-table-extend-row-column-button'
      )
    );
    let isNearHandle = false;
    for (const handleEl of handleElements) {
      if (!isHTMLElement(handleEl)) continue;
      const rect = handleEl.getBoundingClientRect();
      // Expand the rect by 10px on all sides for easier mouse movement
      const expandedRect = new DOMRect(
        rect.left - 10,
        rect.top - 10,
        rect.width + 20,
        rect.height + 20
      );
      if (
        event.clientX >= expandedRect.left &&
        event.clientX <= expandedRect.right &&
        event.clientY >= expandedRect.top &&
        event.clientY <= expandedRect.bottom
      ) {
        isNearHandle = true;
        break;
      }
    }

    // If near handle, don't process further to avoid flickering
    if (isNearHandle) {
      return;
    }

    this._handleMouseMoveNow(event);
  };

  private hideHandles() {
    if (!this.state?.show) return;

    // Don't hide handles during drag operations - preserve dragging state
    if (this.state.draggingState) return;

    this.state = {
      ...this.state,
      show: false,
      showAddOrRemoveRowsButton: false,
      showAddOrRemoveColumnsButton: false,
      colIndex: undefined,
      rowIndex: undefined,
      referencePosCell: undefined,
      referencePosLastRow: undefined,
      referencePosLastCol: undefined,
    };
    this.emitUpdate();
  }

  private _handleMouseMoveNow(event: MouseEvent) {
    const around = domCellAround(event.target as Element);

    // Hide handles while selecting inside a cell
    if (
      around?.type === 'cell' &&
      this.mouseState === 'down' &&
      !this.state?.draggingState
    ) {
      this.mouseState = 'selecting';
      this.hideHandles();
      return;
    }

    if (!around || !this.editor.isEditable) {
      this.hideHandles();
      return;
    }

    const tbody = around.tbodyNode;
    if (!tbody) return;

    const tableRect = tbody.getBoundingClientRect();
    const coords = this.editor.view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    if (!coords) return;

    // Find the table node at this position
    const $pos = this.editor.view.state.doc.resolve(coords.pos);
    let blockInfo: { node: TiptapNode; pos: number } | undefined;
    for (let d = $pos.depth; d >= 0; d--) {
      const node = $pos.node(d);
      if (isTableNode(node)) {
        blockInfo = { node, pos: d === 0 ? 0 : $pos.before(d) };
        break;
      }
    }
    if (!blockInfo || blockInfo.node.type.name !== 'table') return;

    this.tableElement = this.editor.view.nodeDOM(blockInfo.pos) as
      | HTMLElement
      | undefined;
    this.tablePos = blockInfo.pos;
    this.tableId = blockInfo.node.attrs.id;

    const wrapper = safeClosest<HTMLElement>(around.domNode, '.tableWrapper');
    const widgetContainer = wrapper?.querySelector(':scope > .table-controls') as
      | HTMLElement
      | undefined;

    // Hovering around the table (outside cells)
    if (around.type === 'wrapper') {
      const below =
        event.clientY >= tableRect.bottom - 1 &&
        event.clientY < tableRect.bottom + 20;
      const right =
        event.clientX >= tableRect.right - 1 &&
        event.clientX < tableRect.right + 20;
      const cursorBeyondRightOrBottom =
        event.clientX > tableRect.right || event.clientY > tableRect.bottom;

      // Calculate positions for extend buttons when hovering at edges
      let referencePosLastRow: DOMRect | undefined;
      let referencePosLastCol: DOMRect | undefined;

      if (below || right) {
        const tbody = this.tableElement?.querySelector('tbody');
        if (tbody) {
          const lastRowIndex = blockInfo.node.content.childCount - 1;
          const lastColIndex =
            (blockInfo.node.content.firstChild?.content.childCount ?? 0) - 1;

          if (below) {
            const lastRow = tbody.children[lastRowIndex] as HTMLElement | undefined;
            if (lastRow) {
              referencePosLastRow = lastRow.getBoundingClientRect();
            }
          }

          if (right) {
            let maxRight = 0;
            let lastColRect: DOMRect | null = null;
            for (let i = 0; i < tbody.children.length; i++) {
              const row = tbody.children[i] as HTMLElement | undefined;
              if (row && row.children[lastColIndex]) {
                const cell = row.children[lastColIndex] as HTMLElement;
                const cellRect = cell.getBoundingClientRect();
                if (cellRect.right > maxRight) {
                  maxRight = cellRect.right;
                  lastColRect = cellRect;
                }
              }
            }
            if (lastColRect) {
              const firstRow = tbody.children[0] as HTMLElement | undefined;
              const lastRow = tbody.children[lastRowIndex] as HTMLElement | undefined;
              if (firstRow && lastRow) {
                const firstCell = firstRow.children[lastColIndex] as HTMLElement | undefined;
                if (firstCell) {
                  const firstRect = firstCell.getBoundingClientRect();
                  referencePosLastCol = new DOMRect(
                    lastColRect.right,
                    firstRect.top,
                    0,
                    lastRow.getBoundingClientRect().bottom - firstRect.top
                  );
                }
              }
            }
          }
        }
      }

      this.state = {
        ...this.state,
        show: true,
        showAddOrRemoveRowsButton: below,
        showAddOrRemoveColumnsButton: right,
        referencePosTable: tableRect,
        referencePosLastRow,
        referencePosLastCol,
        block: blockInfo.node,
        blockPos: blockInfo.pos,
        widgetContainer,
        colIndex: cursorBeyondRightOrBottom ? undefined : this.state?.colIndex,
        rowIndex: cursorBeyondRightOrBottom ? undefined : this.state?.rowIndex,
        referencePosCell: cursorBeyondRightOrBottom
          ? undefined
          : this.state?.referencePosCell,
      };
    } else {
      // Hovering over a cell
      const cellPosition = getCellIndicesFromDOM(
        around.domNode as HTMLTableCellElement,
        blockInfo.node,
        this.editor
      );
      if (!cellPosition) return;

      const { rowIndex, colIndex } = cellPosition;
      const cellRect = (around.domNode as HTMLElement).getBoundingClientRect();
      const lastRowIndex = blockInfo.node.content.childCount - 1;
      const lastColIndex =
        (blockInfo.node.content.firstChild?.content.childCount ?? 0) - 1;

      // Skip update if same cell
      if (
        this.state?.show &&
        this.tableId === blockInfo.node.attrs.id &&
        this.state.rowIndex === rowIndex &&
        this.state.colIndex === colIndex
      ) {
        return;
      }

      // Calculate positions for extend buttons
      let referencePosLastRow: DOMRect | undefined;
      let referencePosLastCol: DOMRect | undefined;

      if (rowIndex === lastRowIndex || colIndex === lastColIndex) {
        const tbody = this.tableElement?.querySelector('tbody');
        if (tbody) {
          // Get last row position
          if (rowIndex === lastRowIndex) {
            const lastRow = tbody.children[lastRowIndex] as HTMLElement | undefined;
            if (lastRow) {
              referencePosLastRow = lastRow.getBoundingClientRect();
            }
          }
          // Get last column position
          if (colIndex === lastColIndex) {
            // Find the rightmost column by checking all rows
            let maxRight = 0;
            let lastColRect: DOMRect | null = null;
            for (let i = 0; i < tbody.children.length; i++) {
              const row = tbody.children[i] as HTMLElement | undefined;
              if (row && row.children[lastColIndex]) {
                const cell = row.children[lastColIndex] as HTMLElement;
                const cellRect = cell.getBoundingClientRect();
                if (cellRect.right > maxRight) {
                  maxRight = cellRect.right;
                  lastColRect = cellRect;
                }
              }
            }
            if (lastColRect) {
              // Create a rect representing the entire last column
              const firstRow = tbody.children[0] as HTMLElement | undefined;
              const lastRow = tbody.children[lastRowIndex] as HTMLElement | undefined;
              if (firstRow && lastRow) {
                const firstCell = firstRow.children[lastColIndex] as HTMLElement | undefined;
                if (firstCell) {
                  const firstRect = firstCell.getBoundingClientRect();
                  referencePosLastCol = new DOMRect(
                    lastColRect.right,
                    firstRect.top,
                    0,
                    lastRow.getBoundingClientRect().bottom - firstRect.top
                  );
                }
              }
            }
          }
        }
      }

      this.state = {
        show: true,
        showAddOrRemoveColumnsButton: colIndex === lastColIndex,
        showAddOrRemoveRowsButton: rowIndex === lastRowIndex,
        referencePosTable: tableRect,
        referencePosLastRow,
        referencePosLastCol,
        block: blockInfo.node,
        blockPos: blockInfo.pos,
        draggingState: undefined,
        referencePosCell: cellRect,
        colIndex,
        rowIndex,
        widgetContainer,
      };
    }

    this.emitUpdate();
    return false;
  }

  dragOverHandler = (event: DragEvent) => {
    if (this.state?.draggingState === undefined) {
      return;
    }

    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';

    hideElements(
      '.prosemirror-dropcursor-block, .prosemirror-dropcursor-inline',
      this.editorView.root
    );

    // The mouse cursor coordinates, bounded to the table's bounding box.
    const {
      left: tableLeft,
      right: tableRight,
      top: tableTop,
      bottom: tableBottom,
    } = this.state.referencePosTable;

    const boundedMouseCoords = {
      left: clamp(event.clientX, tableLeft + 1, tableRight - 1),
      top: clamp(event.clientY, tableTop + 1, tableBottom - 1),
    };

    // Gets the table cell element
    const tableCellElements = this.editorView.root
      .elementsFromPoint(boundedMouseCoords.left, boundedMouseCoords.top)
      .filter((element) => element.tagName === 'TD' || element.tagName === 'TH');
    if (tableCellElements.length === 0) {
      return;
    }
    const tableCellElement = tableCellElements[0];
    if (!isHTMLElement(tableCellElement)) {
      return;
    }

    const cellPosition = getCellIndicesFromDOM(
      tableCellElement as HTMLTableCellElement,
      this.state.block,
      this.editor
    );
    if (!cellPosition) return;

    const { rowIndex, colIndex } = cellPosition;

    // Check what changed
    const oldIndex =
      this.state.draggingState.draggedCellOrientation === 'row'
        ? this.state.rowIndex
        : this.state.colIndex;
    const newIndex =
      this.state.draggingState.draggedCellOrientation === 'row'
        ? rowIndex
        : colIndex;
    const dispatchDecorationsTransaction = newIndex !== oldIndex;

    const mousePos =
      this.state.draggingState.draggedCellOrientation === 'row'
        ? boundedMouseCoords.top
        : boundedMouseCoords.left;

    // Check if anything needs updating
    const cellChanged =
      this.state.rowIndex !== rowIndex || this.state.colIndex !== colIndex;
    const mousePosChanged = this.state.draggingState.mousePos !== mousePos;

    if (cellChanged || mousePosChanged) {
      const newCellRect = tableCellElement.getBoundingClientRect();
      // Preserve original cell size during drag to prevent handle height changes
      const preservedCellRect = this.state.draggingState?.originalCellSize
        ? new DOMRect(
          newCellRect.x,
          newCellRect.y,
          this.state.draggingState.originalCellSize.width,
          this.state.draggingState.originalCellSize.height
        )
        : newCellRect;

      this.state = {
        ...this.state,
        rowIndex: rowIndex,
        colIndex: colIndex,
        referencePosCell: preservedCellRect,
        draggingState: {
          ...this.state.draggingState,
          mousePos: mousePos,
        },
      };

      this.emitUpdate();
    }

    // Dispatch decorations transaction if needed
    if (dispatchDecorationsTransaction) {
      this.editor.view.dispatch(
        this.editor.state.tr.setMeta(tableHandlePluginKey, true)
      );
    }
  };

  dropHandler = () => {
    this.mouseState = 'up';

    const st = this.state;
    if (!st?.draggingState) return false;

    const { draggingState, rowIndex, colIndex, blockPos } = st;
    if (typeof blockPos !== 'number' || blockPos < 0) return false;

    if (
      (draggingState.draggedCellOrientation === 'row' &&
        rowIndex === undefined) ||
      (draggingState.draggedCellOrientation === 'col' && colIndex === undefined)
    ) {
      throw new Error(
        'Attempted to drop table row or column, but no table block was hovered prior.'
      );
    }

    const isRow = draggingState.draggedCellOrientation === 'row';
    const orientation = isRow ? 'row' : 'column';
    const destIndex = isRow ? rowIndex! : colIndex!;

    const cellCoords = getIndexCoordinates({
      editor: this.editor,
      index: draggingState.originalIndex,
      orientation,
      tablePos: blockPos,
    });
    if (!cellCoords) return false;

    const stateWithCellSel = selectCellsByCoords(
      this.editor,
      blockPos,
      cellCoords,
      { mode: 'state' }
    );
    if (!stateWithCellSel) return false;

    // When mode is 'state', selectCellsByCoords returns EditorState
    // Type assertion is safe here because we explicitly requested 'state' mode
    const editorState = stateWithCellSel as EditorState;

    const dispatch = (tr: Transaction) => this.editor.view.dispatch(tr);

    if (isRow) {
      moveTableRow({
        from: draggingState.originalIndex,
        to: destIndex,
        select: true,
        pos: blockPos + 1,
      })(editorState, dispatch);
    } else {
      moveTableColumn({
        from: draggingState.originalIndex,
        to: destIndex,
        select: true,
        pos: blockPos + 1,
      })(editorState, dispatch);
    }

    this.state = { ...st, draggingState: undefined };
    this.emitUpdate();

    this.editor.view.dispatch(
      this.editor.state.tr.setMeta(tableHandlePluginKey, null)
    );

    return true;
  };

  update(view: EditorView): void {
    const pluginState = tableHandlePluginKey.getState(view.state);
    if (pluginState !== undefined && pluginState !== this.menuFrozen) {
      this.menuFrozen = pluginState;
    }

    if (!this.state?.show) return;

    if (!this.tableElement?.isConnected) {
      this.hideHandles();
      return;
    }

    const tableInfo = getTableFromDOM(this.tableElement, this.editor);
    if (!tableInfo) {
      this.hideHandles();
      return;
    }

    // Check if table changed
    const blockChanged =
      this.state.block !== tableInfo.node ||
      this.state.blockPos !== tableInfo.pos;

    if (
      !tableInfo.node ||
      tableInfo.node.type.name !== 'table' ||
      !this.tableElement?.isConnected
    ) {
      this.hideHandles();
      return;
    }

    const { height: rowCount, width: colCount } = TableMap.get(tableInfo.node);

    // Calculate new indices
    let newRowIndex = this.state.rowIndex;
    let newColIndex = this.state.colIndex;

    // Clamp indices if rows/columns were deleted
    if (newRowIndex !== undefined && newRowIndex >= rowCount) {
      newRowIndex = rowCount ? rowCount - 1 : undefined;
    }
    if (newColIndex !== undefined && newColIndex >= colCount) {
      newColIndex = colCount ? colCount - 1 : undefined;
    }

    const tableBody = this.tableElement.querySelector('tbody');
    if (!tableBody) {
      throw new Error(
        "Table block does not contain a 'tbody' HTML element. This should never happen."
      );
    }

    // Calculate new reference positions
    let newReferencePosCell = this.state.referencePosCell;
    if (newRowIndex !== undefined && newColIndex !== undefined) {
      const rowEl = tableBody.children[newRowIndex];
      const cellEl = rowEl?.children[newColIndex];

      if (cellEl) {
        const newCellRect = cellEl.getBoundingClientRect();
        // Preserve original cell size during drag to prevent handle height changes
        if (this.state.draggingState?.originalCellSize) {
          newReferencePosCell = new DOMRect(
            newCellRect.x,
            newCellRect.y,
            this.state.draggingState.originalCellSize.width,
            this.state.draggingState.originalCellSize.height
          );
        } else {
          newReferencePosCell = newCellRect;
        }
      } else {
        newRowIndex = undefined;
        newColIndex = undefined;
        newReferencePosCell = undefined;
      }
    }

    const newReferencePosTable = tableBody.getBoundingClientRect();

    // Update last row/col positions if needed
    let newReferencePosLastRow = this.state.referencePosLastRow;
    let newReferencePosLastCol = this.state.referencePosLastCol;

    if (this.state.showAddOrRemoveRowsButton || this.state.showAddOrRemoveColumnsButton) {
      const lastRowIndex = tableInfo.node.content.childCount - 1;
      const lastColIndex =
        (tableInfo.node.content.firstChild?.content.childCount ?? 0) - 1;

      if (this.state.showAddOrRemoveRowsButton) {
        const lastRow = tableBody.children[lastRowIndex] as HTMLElement | undefined;
        if (lastRow) {
          newReferencePosLastRow = lastRow.getBoundingClientRect();
        }
      }

      if (this.state.showAddOrRemoveColumnsButton) {
        let maxRight = 0;
        let lastColRect: DOMRect | null = null;
        for (let i = 0; i < tableBody.children.length; i++) {
          const row = tableBody.children[i] as HTMLElement | undefined;
          if (row && row.children[lastColIndex]) {
            const cell = row.children[lastColIndex] as HTMLElement;
            const cellRect = cell.getBoundingClientRect();
            if (cellRect.right > maxRight) {
              maxRight = cellRect.right;
              lastColRect = cellRect;
            }
          }
        }
        if (lastColRect) {
          const firstRow = tableBody.children[0] as HTMLElement | undefined;
          const lastRow = tableBody.children[lastRowIndex] as HTMLElement | undefined;
          if (firstRow && lastRow) {
            const firstCell = firstRow.children[lastColIndex] as HTMLElement | undefined;
            if (firstCell) {
              const firstRect = firstCell.getBoundingClientRect();
              newReferencePosLastCol = new DOMRect(
                lastColRect.right,
                firstRect.top,
                0,
                lastRow.getBoundingClientRect().bottom - firstRect.top
              );
            }
          }
        }
      }
    }

    // Check if anything changed
    const indicesChanged =
      newRowIndex !== this.state.rowIndex || newColIndex !== this.state.colIndex;
    const refPosChanged =
      newReferencePosCell !== this.state.referencePosCell ||
      newReferencePosTable !== this.state.referencePosTable ||
      newReferencePosLastRow !== this.state.referencePosLastRow ||
      newReferencePosLastCol !== this.state.referencePosLastCol;

    if (blockChanged || indicesChanged || refPosChanged) {
      this.state = {
        ...this.state,
        block: tableInfo.node,
        blockPos: tableInfo.pos,
        rowIndex: newRowIndex,
        colIndex: newColIndex,
        referencePosCell: newReferencePosCell,
        referencePosTable: newReferencePosTable,
        referencePosLastRow: newReferencePosLastRow,
        referencePosLastCol: newReferencePosLastCol,
      };
      this.emitUpdate();
    }
  }

  private scrollHandler = () => {
    // When scrolling, update positions if handles are visible
    if (this.state?.show && this.tableElement?.isConnected) {
      // Force update by recalculating positions
      this.updatePositions();
    }
  };

  private updatePositions() {
    if (!this.state?.show || !this.tableElement?.isConnected) return;

    const tableInfo = getTableFromDOM(this.tableElement, this.editor);
    if (!tableInfo || tableInfo.node.type.name !== 'table') return;

    const tableBody = this.tableElement.querySelector('tbody');
    if (!tableBody) return;

    const newReferencePosTable = tableBody.getBoundingClientRect();

    // Update cell position if we have row/col indices
    let newReferencePosCell = this.state.referencePosCell;
    if (
      this.state.rowIndex !== undefined &&
      this.state.colIndex !== undefined
    ) {
      const rowEl = tableBody.children[this.state.rowIndex];
      const cellEl = rowEl?.children[this.state.colIndex];
      if (cellEl) {
        const newCellRect = cellEl.getBoundingClientRect();
        // Preserve original cell size during drag
        if (this.state.draggingState?.originalCellSize) {
          newReferencePosCell = new DOMRect(
            newCellRect.x,
            newCellRect.y,
            this.state.draggingState.originalCellSize.width,
            this.state.draggingState.originalCellSize.height
          );
        } else {
          newReferencePosCell = newCellRect;
        }
      }
    }

    // Update last row/col positions if needed
    let newReferencePosLastRow = this.state.referencePosLastRow;
    let newReferencePosLastCol = this.state.referencePosLastCol;

    if (this.state.showAddOrRemoveRowsButton || this.state.showAddOrRemoveColumnsButton) {
      const lastRowIndex = tableInfo.node.content.childCount - 1;
      const lastColIndex =
        (tableInfo.node.content.firstChild?.content.childCount ?? 0) - 1;

      if (this.state.showAddOrRemoveRowsButton) {
        const lastRow = tableBody.children[lastRowIndex] as HTMLElement | undefined;
        if (lastRow) {
          newReferencePosLastRow = lastRow.getBoundingClientRect();
        }
      }

      if (this.state.showAddOrRemoveColumnsButton) {
        let maxRight = 0;
        let lastColRect: DOMRect | null = null;
        for (let i = 0; i < tableBody.children.length; i++) {
          const row = tableBody.children[i] as HTMLElement | undefined;
          if (row && row.children[lastColIndex]) {
            const cell = row.children[lastColIndex] as HTMLElement;
            const cellRect = cell.getBoundingClientRect();
            if (cellRect.right > maxRight) {
              maxRight = cellRect.right;
              lastColRect = cellRect;
            }
          }
        }
        if (lastColRect) {
          const firstRow = tableBody.children[0] as HTMLElement | undefined;
          const lastRow = tableBody.children[lastRowIndex] as HTMLElement | undefined;
          if (firstRow && lastRow) {
            const firstCell = firstRow.children[lastColIndex] as HTMLElement | undefined;
            if (firstCell) {
              const firstRect = firstCell.getBoundingClientRect();
              newReferencePosLastCol = new DOMRect(
                lastColRect.right,
                firstRect.top,
                0,
                lastRow.getBoundingClientRect().bottom - firstRect.top
              );
            }
          }
        }
      }
    }

    // Check if positions actually changed (compare individual properties)
    const refPosChanged =
      !newReferencePosCell ||
      !this.state.referencePosCell ||
      newReferencePosCell.x !== this.state.referencePosCell.x ||
      newReferencePosCell.y !== this.state.referencePosCell.y ||
      newReferencePosTable.x !== this.state.referencePosTable.x ||
      newReferencePosTable.y !== this.state.referencePosTable.y ||
      (newReferencePosLastRow &&
        this.state.referencePosLastRow &&
        (newReferencePosLastRow.x !== this.state.referencePosLastRow.x ||
          newReferencePosLastRow.y !== this.state.referencePosLastRow.y)) ||
      (newReferencePosLastCol &&
        this.state.referencePosLastCol &&
        (newReferencePosLastCol.x !== this.state.referencePosLastCol.x ||
          newReferencePosLastCol.y !== this.state.referencePosLastCol.y));

    if (refPosChanged) {
      this.state = {
        ...this.state,
        referencePosCell: newReferencePosCell,
        referencePosTable: newReferencePosTable,
        referencePosLastRow: newReferencePosLastRow,
        referencePosLastCol: newReferencePosLastCol,
      };
      this.emitUpdate();
    }
  }

  destroy(): void {
    this.editorView.dom.removeEventListener(
      'mousemove',
      this.mouseMoveHandler as EventListener
    );
    window.removeEventListener('mouseup', this.mouseUpHandler as EventListener);
    this.editorView.dom.removeEventListener(
      'mousedown',
      this.viewMousedownHandler as EventListener
    );
    this.editorView.root.removeEventListener(
      'dragover',
      this.dragOverHandler as EventListener
    );
    this.editorView.root.removeEventListener(
      'drop',
      this.dropHandler as unknown as EventListener
    );
    window.removeEventListener('scroll', this.scrollHandler, true);
    window.removeEventListener('resize', this.scrollHandler);
  }
}

let tableHandleView: TableHandleView | null = null;

export function TableHandlePlugin(
  editor: Editor,
  emitUpdate: (state: TableHandlesState) => void
): Plugin {
  return new Plugin({
    key: tableHandlePluginKey,

    state: {
      init: () => false,
      apply: (tr, frozen) => {
        const meta = tr.getMeta(tableHandlePluginKey);
        return meta !== undefined ? meta : frozen;
      },
    },

    view: (editorView) => {
      tableHandleView = new TableHandleView(editor, editorView, emitUpdate);

      return tableHandleView;
    },

    props: {
      decorations: (state) => {
        if (!tableHandleView) return null;

        if (
          tableHandleView === undefined ||
          tableHandleView.state === undefined ||
          tableHandleView.state.draggingState === undefined ||
          tableHandleView.tablePos === undefined
        ) {
          return;
        }

        const newIndex =
          tableHandleView.state.draggingState.draggedCellOrientation === 'row'
            ? tableHandleView.state.rowIndex
            : tableHandleView.state.colIndex;

        if (newIndex === undefined) {
          return;
        }

        const decorations: Decoration[] = [];
        const { draggingState } = tableHandleView.state;
        const { originalIndex } = draggingState;

        if (
          tableHandleView.state.draggingState.draggedCellOrientation === 'row'
        ) {
          const originalCells = getRowCells(
            editor,
            originalIndex,
            tableHandleView.state.blockPos
          );
          originalCells.cells.forEach((cell) => {
            if (cell.node) {
              decorations.push(
                Decoration.node(cell.pos, cell.pos + cell.node.nodeSize, {
                  class: 'table-cell-dragging-source',
                })
              );
            }
          });
        } else {
          const originalCells = getColumnCells(
            editor,
            originalIndex,
            tableHandleView.state.blockPos
          );
          originalCells.cells.forEach((cell) => {
            if (cell.node) {
              decorations.push(
                Decoration.node(cell.pos, cell.pos + cell.node.nodeSize, {
                  class: 'table-cell-dragging-source',
                })
              );
            }
          });
        }

        // Return empty decorations if:
        // - original index is same as new index (no change)
        // - editor is not defined for some reason
        if (newIndex === originalIndex || !editor) {
          return DecorationSet.create(state.doc, decorations);
        }

        if (
          tableHandleView.state.draggingState.draggedCellOrientation === 'row'
        ) {
          const cellsInRow = getRowCells(
            editor,
            newIndex,
            tableHandleView.state.blockPos
          );

          cellsInRow.cells.forEach((cell) => {
            const cellNode = cell.node;
            if (!cellNode) {
              return;
            }

            // Creates a decoration at the start or end of each cell,
            // depending on whether the new index is before or after the
            // original index.
            const decorationPos =
              cell.pos + (newIndex > originalIndex ? cellNode.nodeSize - 2 : 2);
            decorations.push(
              Decoration.widget(decorationPos, () => {
                const widget = document.createElement('div');
                widget.className = 'tiptap-table-dropcursor';
                widget.style.position = 'absolute';
                widget.style.left = '0';
                widget.style.right = '0';
                widget.style.zIndex = '20';
                widget.style.pointerEvents = 'none';
                // This is only necessary because the drop indicator's height
                // is an even number of pixels, whereas the border between
                // table cells is an odd number of pixels. So this makes the
                // positioning slightly more consistent regardless of where
                // the row is being dropped.
                if (newIndex > originalIndex) {
                  widget.style.bottom = '-1px';
                } else {
                  widget.style.top = '-1px';
                }
                widget.style.height = '3px';
                widget.style.backgroundColor = 'var(--mui-palette-primary-main, #1976d2)';

                return widget;
              })
            );
          });
        } else {
          const cellsInColumn = getColumnCells(
            editor,
            newIndex,
            tableHandleView.state.blockPos
          );
          cellsInColumn.cells.forEach((cell) => {
            const cellNode = cell.node;
            if (!cellNode) {
              return;
            }
            // Creates a decoration at the start or end of each cell,
            // depending on whether the new index is before or after the
            // original index.
            const decorationPos =
              cell.pos + (newIndex > originalIndex ? cellNode.nodeSize - 2 : 2);
            decorations.push(
              Decoration.widget(decorationPos, () => {
                const widget = document.createElement('div');
                widget.className = 'tiptap-table-dropcursor';
                widget.style.position = 'absolute';
                widget.style.top = '0';
                widget.style.bottom = '0';
                widget.style.zIndex = '20';
                widget.style.pointerEvents = 'none';
                // This is only necessary because the drop indicator's width
                // is an even number of pixels, whereas the border between
                // table cells is an odd number of pixels. So this makes the
                // positioning slightly more consistent regardless of where
                // the column is being dropped.
                if (newIndex > originalIndex) {
                  widget.style.right = '-1px';
                } else {
                  widget.style.left = '-1px';
                }
                widget.style.width = '3px';
                widget.style.backgroundColor = 'var(--mui-palette-primary-main, #1976d2)';
                return widget;
              })
            );
          });
        }

        return DecorationSet.create(state.doc, decorations);
      },
    },
  });
}

/**
 * Shared drag start handler for table rows and columns
 */
const tableDragStart = (
  orientation: 'col' | 'row',
  event: {
    dataTransfer: DataTransfer | null;
    currentTarget: EventTarget & Element;
    clientX: number;
    clientY: number;
  }
) => {
  // If state doesn't exist, try to recover from DOM or data attributes
  if (!tableHandleView?.state) {
    const handleElement = event.currentTarget as HTMLElement;

    // Try to recover from data attributes first (set by React component)
    const dataIndex = handleElement.dataset.tableIndex;
    const dataTablePos = handleElement.dataset.tablePos;
    const dataTableId = handleElement.dataset.tableId;

    if (dataIndex && dataTablePos && tableHandleView) {
      const index = parseInt(dataIndex, 10);
      const blockPos = parseInt(dataTablePos, 10);

      if (!isNaN(index) && !isNaN(blockPos)) {
        // Try to find the table node
        const tableNode = tableHandleView.editor.state.doc.nodeAt(blockPos);
        if (tableNode && isTableNode(tableNode)) {
          const tableWrapper = safeClosest<HTMLElement>(handleElement, '.tableWrapper');
          const tbody = tableWrapper?.querySelector('tbody');

          if (tbody) {
            const tableRect = tbody.getBoundingClientRect();

            // Create minimal state for drag operation
            const recoveredState: TableHandlesState = {
              show: true,
              showAddOrRemoveRowsButton: false,
              showAddOrRemoveColumnsButton: false,
              referencePosTable: tableRect,
              block: tableNode,
              blockPos: blockPos,
              colIndex: orientation === 'col' ? index : undefined,
              rowIndex: orientation === 'row' ? index : undefined,
              referencePosCell: undefined,
              widgetContainer: undefined,
            };

            tableHandleView.state = recoveredState;
          }
        }
      }
    }

    // If still no state, try to recover from DOM
    if (!tableHandleView?.state) {
      const tableWrapper = safeClosest<HTMLElement>(handleElement, '.tableWrapper');

      if (!tableWrapper || !tableHandleView) {
        // Can't recover - cancel drag silently
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'none';
        }
        return;
      }

      // Try to recover table info from DOM
      const tableInfo = getTableFromDOM(tableWrapper, tableHandleView.editor);
      if (!tableInfo) {
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'none';
        }
        return;
      }

      // Recover basic state from DOM
      const tbody = tableWrapper.querySelector('tbody');
      if (!tbody) {
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'none';
        }
        return;
      }

      // Try to determine index from handle position
      // This is a fallback - ideally state should exist
      const tableRect = tbody.getBoundingClientRect();
      const handleRect = handleElement.getBoundingClientRect();

      // Approximate index based on handle position
      // This is not perfect but better than throwing an error
      let approximateIndex = 0;
      if (orientation === 'row') {
        const rowHeight = tableRect.height / tableInfo.node.content.childCount;
        approximateIndex = Math.floor((handleRect.top - tableRect.top) / rowHeight);
      } else {
        const colWidth = tableRect.width / (tableInfo.node.content.firstChild?.content.childCount ?? 1);
        approximateIndex = Math.floor((handleRect.left - tableRect.left) / colWidth);
      }

      // Create minimal state for drag operation
      const recoveredState: TableHandlesState = {
        show: true,
        showAddOrRemoveRowsButton: false,
        showAddOrRemoveColumnsButton: false,
        referencePosTable: tableRect,
        block: tableInfo.node,
        blockPos: tableInfo.pos,
        colIndex: orientation === 'col' ? approximateIndex : undefined,
        rowIndex: orientation === 'row' ? approximateIndex : undefined,
        referencePosCell: undefined,
        widgetContainer: undefined,
      };

      tableHandleView.state = recoveredState;
    }

    // Final check - if still no state, cancel drag
    if (!tableHandleView?.state) {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'none';
      }
      return;
    }
  }

  const { state, editor } = tableHandleView;
  const index = orientation === 'col' ? state.colIndex : state.rowIndex;

  if (index === undefined) {
    // Can't determine index - cancel drag silently
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'none';
    }
    return;
  }

  const { blockPos, referencePosCell } = state;
  const mousePos = orientation === 'col' ? event.clientX : event.clientY;

  // Clear cell selection to prevent table reference collapse
  if (editor.state.selection instanceof CellSelection) {
    const safeSel = TextSelection.near(editor.state.doc.resolve(blockPos), 1);
    editor.view.dispatch(editor.state.tr.setSelection(safeSel));
  }

  const dragImage = createTableDragImage(editor, orientation, index, blockPos);

  // Configure drag image
  if (event.dataTransfer) {
    const handleRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    const offset =
      orientation === 'col'
        ? { x: handleRect.width / 2, y: 0 }
        : { x: 0, y: handleRect.height / 2 };

    event.dataTransfer.effectAllowed =
      orientation === 'col' ? 'move' : 'copyMove';
    event.dataTransfer.setDragImage(dragImage, offset.x, offset.y);
  }

  // Cleanup drag image
  const cleanup = () => dragImage.parentNode?.removeChild(dragImage);
  document.addEventListener('drop', cleanup, { once: true });
  document.addEventListener('dragend', cleanup, { once: true });

  const initialOffset = referencePosCell
    ? (orientation === 'col' ? referencePosCell.left : referencePosCell.top) -
    mousePos
    : 0;

  // Save original cell size to preserve it during drag
  const originalCellSize = referencePosCell
    ? { width: referencePosCell.width, height: referencePosCell.height }
    : undefined;

  // Update dragging state
  tableHandleView.state = {
    ...state,
    draggingState: {
      draggedCellOrientation: orientation,
      originalIndex: index,
      mousePos,
      initialOffset,
      originalCellSize,
    },
  };
  tableHandleView.emitUpdate();
  editor.view.dispatch(editor.state.tr.setMeta(tableHandlePluginKey, true));
};

/**
 * Callback for column drag handle
 */
export const colDragStart = (event: {
  dataTransfer: DataTransfer | null;
  currentTarget: EventTarget & Element;
  clientX: number;
}) => tableDragStart('col', { ...event, clientY: 0 });

/**
 * Callback for row drag handle
 */
export const rowDragStart = (event: {
  dataTransfer: DataTransfer | null;
  currentTarget: EventTarget & Element;
  clientY: number;
}) => tableDragStart('row', { ...event, clientX: 0 });

/**
 * Drag end cleanup
 */
export const dragEnd = () => {
  if (!tableHandleView || tableHandleView.state === undefined) {
    return;
  }

  tableHandleView.state = {
    ...tableHandleView.state,
    draggingState: undefined,
  };
  tableHandleView.emitUpdate();

  const editor = tableHandleView.editor;
  editor.view.dispatch(editor.state.tr.setMeta(tableHandlePluginKey, null));
};

