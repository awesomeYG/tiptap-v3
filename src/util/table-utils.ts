import type { Node } from '@tiptap/pm/model';
import { Selection, type EditorState, type Transaction } from '@tiptap/pm/state';
import type { FindNodeResult } from '@tiptap/pm/tables';
import {
  cellAround,
  CellSelection,
  findTable,
  selectedRect,
  selectionCell,
  TableMap
} from '@tiptap/pm/tables';
import { Mapping } from '@tiptap/pm/transform';
import type { Editor } from '@tiptap/react';

export const RESIZE_MIN_WIDTH = 35;
export const EMPTY_CELL_WIDTH = 120;
export const EMPTY_CELL_HEIGHT = 40;

export type Orientation = 'row' | 'column';
export interface CellInfo extends FindNodeResult {
  row: number;
  column: number;
}

export type CellCoordinates = {
  row: number;
  col: number;
};

export type SelectionReturnMode = 'state' | 'transaction' | 'dispatch';

export type BaseSelectionOptions = { mode?: SelectionReturnMode };
export type DispatchSelectionOptions = {
  mode: 'dispatch';
  dispatch: (tr: Transaction) => void;
};
export type TransactionSelectionOptions = { mode: 'transaction' };
export type StateSelectionOptions = { mode?: 'state' };

export type TableInfo = {
  map: TableMap;
} & FindNodeResult;

// ============================================================================
// HELPER CONSTANTS & UTILITIES
// ============================================================================

const EMPTY_CELLS_RESULT = { cells: [], mergedCells: [] };

export function isHTMLElement(n: unknown): n is HTMLElement {
  return n instanceof HTMLElement;
}

export type DomCellAroundResult =
  | {
    type: 'cell';
    domNode: HTMLElement;
    tbodyNode: HTMLTableSectionElement | null;
  }
  | {
    type: 'wrapper';
    domNode: HTMLElement;
    tbodyNode: HTMLTableSectionElement | null;
  };

export function safeClosest<T extends Element>(
  start: Element | null,
  selector: string
): T | null {
  return (start?.closest?.(selector) as T | null) ?? null;
}

/**
 * Walk up from an element until we find a TD/TH or the table wrapper.
 * Returns the found element plus its tbody (if present).
 */
export function domCellAround(
  target: Element
): DomCellAroundResult | undefined {
  let current: Element | null = target;

  while (
    current &&
    current.tagName !== 'TD' &&
    current.tagName !== 'TH' &&
    !current.classList.contains('tableWrapper')
  ) {
    if (current.classList.contains('ProseMirror')) return undefined;
    current = isHTMLElement(current.parentNode)
      ? (current.parentNode as Element)
      : null;
  }

  if (!current) return undefined;

  if (current.tagName === 'TD' || current.tagName === 'TH') {
    return {
      type: 'cell',
      domNode: current as HTMLElement,
      tbodyNode: safeClosest<HTMLTableSectionElement>(current, 'tbody'),
    };
  }

  return {
    type: 'wrapper',
    domNode: current as HTMLElement,
    tbodyNode: (current as HTMLElement).querySelector('tbody'),
  };
}

/**
 * Clamps a value between min and max bounds
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Validates if row/col indices are within table bounds
 */
function isWithinBounds(row: number, col: number, map: TableMap): boolean {
  return row >= 0 && row < map.height && col >= 0 && col < map.width;
}

/**
 * Resolves the index for a row or column based on current selection or provided value
 */
function resolveOrientationIndex(
  state: EditorState,
  table: TableInfo,
  orientation: Orientation,
  providedIndex?: number
): number | null {
  if (typeof providedIndex === 'number') {
    return providedIndex;
  }

  if (state.selection instanceof CellSelection) {
    const rect = selectedRect(state);
    return orientation === 'row' ? rect.top : rect.left;
  }

  const $cell = cellAround(state.selection.$anchor) ?? selectionCell(state);
  if (!$cell) return null;

  const rel = $cell.pos - table.start;
  const rect = table.map.findCell(rel);
  return orientation === 'row' ? rect.top : rect.left;
}

/**
 * Creates a CellInfo object from position data
 */
function createCellInfo(
  row: number,
  column: number,
  cellPos: number,
  cellNode: Node
): CellInfo {
  return {
    row,
    column,
    pos: cellPos,
    node: cellNode,
    start: cellPos + 1,
    depth: cellNode ? cellNode.content.size : 0,
  };
}

/**
 * Checks if a cell is merged (has colspan or rowspan > 1)
 */
export function isCellMerged(node: Node | null): boolean {
  if (!node) return false;
  const colspan = node.attrs.colspan ?? 1;
  const rowspan = node.attrs.rowspan ?? 1;
  return colspan > 1 || rowspan > 1;
}

/**
 * Generic function to collect cells along a row or column
 */
function collectCells(
  editor: Editor | null,
  orientation: Orientation,
  index?: number,
  tablePos?: number
): { cells: CellInfo[]; mergedCells: CellInfo[] } {
  if (!editor) return EMPTY_CELLS_RESULT;

  const { state } = editor;
  const table = getTable(editor, tablePos);
  if (!table) return EMPTY_CELLS_RESULT;

  const tableStart = table.start;
  const tableNode = table.node;
  const map = table.map;

  const resolvedIndex = resolveOrientationIndex(
    state,
    table,
    orientation,
    index
  );
  if (resolvedIndex === null) return EMPTY_CELLS_RESULT;

  // Bounds check
  const maxIndex = orientation === 'row' ? map.height : map.width;
  if (resolvedIndex < 0 || resolvedIndex >= maxIndex) {
    return EMPTY_CELLS_RESULT;
  }

  const cells: CellInfo[] = [];
  const mergedCells: CellInfo[] = [];
  const seenMerged = new Set<number>();

  const iterationCount = orientation === 'row' ? map.width : map.height;

  for (let i = 0; i < iterationCount; i++) {
    const row = orientation === 'row' ? resolvedIndex : i;
    const col = orientation === 'row' ? i : resolvedIndex;
    const cellIndex = row * map.width + col;
    const mapCell = map.map[cellIndex];

    if (mapCell === undefined) continue;

    const cellPos = tableStart + mapCell;
    const cellNode = tableNode.nodeAt(mapCell);
    if (!cellNode) continue;

    const cell = createCellInfo(row, col, cellPos, cellNode);

    if (isCellMerged(cellNode)) {
      if (!seenMerged.has(cellPos)) {
        mergedCells.push(cell);
        seenMerged.add(cellPos);
      }
    }

    cells.push(cell);
  }

  return { cells, mergedCells };
}

/**
 * Generic function to count empty cells from the end of a row or column
 */
function countEmptyCellsFromEnd(
  editor: Editor,
  tablePos: number,
  orientation: Orientation
): number {
  const table = getTable(editor, tablePos);
  if (!table) return 0;

  const { doc } = editor.state;
  const maxIndex = orientation === 'row' ? table.map.height : table.map.width;

  let emptyCount = 0;
  for (let idx = maxIndex - 1; idx >= 0; idx--) {
    const seen = new Set<number>();
    let isLineEmpty = true;

    const iterationCount =
      orientation === 'row' ? table.map.width : table.map.height;

    for (let i = 0; i < iterationCount; i++) {
      const row = orientation === 'row' ? idx : i;
      const col = orientation === 'row' ? i : idx;
      const rel = table.map.positionAt(row, col, table.node);

      if (seen.has(rel)) continue;
      seen.add(rel);

      const abs = tablePos + 1 + rel;
      const cell = doc.nodeAt(abs);
      if (!cell) continue;

      if (!isCellEmpty(cell)) {
        isLineEmpty = false;
        break;
      }
    }

    if (isLineEmpty) emptyCount++;
    else break;
  }

  return emptyCount;
}

/**
 * Get information about the table at the current selection or a specific position.
 */
export function getTable(editor: Editor | null, tablePos?: number) {
  if (!editor) return null;

  let table = null;

  if (typeof tablePos === 'number') {
    const tableNode = editor.state.doc.nodeAt(tablePos);
    if (tableNode?.type.name === 'table') {
      table = {
        node: tableNode,
        pos: tablePos,
        start: tablePos + 1,
        depth: editor.state.doc.resolve(tablePos).depth,
      };
    }
  }

  if (!table) {
    const { state } = editor;
    const $from = state.doc.resolve(state.selection.from);
    table = findTable($from);
  }

  if (!table) return null;

  const tableMap = TableMap.get(table.node);
  if (!tableMap) return null;

  return { ...table, map: tableMap };
}

/**
 * Checks if the current text selection is inside a table cell.
 */
export function isSelectionInCell(state: EditorState): boolean {
  const { selection } = state;
  const $from = selection.$from;

  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
      return true;
    }
  }

  return false;
}

/**
 * Runs a function while preserving the editor's selection.
 */
export function runPreservingCursor(editor: Editor, fn: () => void): boolean {
  const view = editor.view;
  const startSel = view.state.selection;
  const bookmark = startSel.getBookmark();

  const mapping = new Mapping();
  const originalDispatch = view.dispatch;

  view.dispatch = (tr) => {
    mapping.appendMapping(tr.mapping);
    originalDispatch(tr);
  };

  try {
    fn();
  } finally {
    view.dispatch = originalDispatch;
  }

  try {
    const sel = bookmark.map(mapping).resolve(view.state.doc);
    view.dispatch(view.state.tr.setSelection(sel));
    return true;
  } catch {
    // Fallback: if the exact spot vanished (e.g., cell deleted),
    // go to the nearest valid position.
    const mappedPos = mapping.map(startSel.from, -1);
    const clamped = clamp(mappedPos, 0, view.state.doc.content.size);
    const near = Selection.near(view.state.doc.resolve(clamped), -1);
    view.dispatch(view.state.tr.setSelection(near));
    return false;
  }
}

/**
 * Determines whether a table cell is effectively empty.
 */
export function isCellEmpty(cellNode: Node): boolean {
  if (cellNode.childCount === 0) return true;

  let isEmpty = true;
  cellNode.descendants((n) => {
    if (n.isText && n.text?.trim()) {
      isEmpty = false;
      return false;
    }
    if (n.isLeaf && !n.isText) {
      isEmpty = false;
      return false;
    }
    return true;
  });

  return isEmpty;
}

/**
 * Counts how many consecutive empty rows exist at the bottom of a given table.
 */
export function countEmptyRowsFromEnd(
  editor: Editor,
  tablePos: number
): number {
  return countEmptyCellsFromEnd(editor, tablePos, 'row');
}

/**
 * Counts how many consecutive empty columns exist at the right edge of a given table.
 */
export function countEmptyColumnsFromEnd(
  editor: Editor,
  tablePos: number
): number {
  return countEmptyCellsFromEnd(editor, tablePos, 'column');
}

/**
 * Rounds a number with a symmetric "dead-zone" around integer boundaries.
 */
export function marginRound(num: number, margin = 0.3): number {
  const floor = Math.floor(num);
  const ceil = Math.ceil(num);
  const lowerBound = floor + margin;
  const upperBound = ceil - margin;

  if (num < lowerBound) return floor;
  if (num > upperBound) return ceil;
  return Math.round(num);
}

/**
 * Applies the transaction based on the specified mode
 */
function applySelectionWithMode(
  state: EditorState,
  transaction: Transaction,
  options: BaseSelectionOptions | DispatchSelectionOptions
): EditorState | Transaction | void {
  const mode: SelectionReturnMode = options.mode ?? 'state';

  switch (mode) {
    case 'dispatch': {
      const dispatchOptions = options as DispatchSelectionOptions;
      if (typeof dispatchOptions.dispatch === 'function') {
        dispatchOptions.dispatch(transaction);
      }
      return;
    }

    case 'transaction':
      return transaction;

    default: // "state"
      return state.apply(transaction);
  }
}

/**
 * Selects table cells by their (row, col) coordinates.
 */
export function selectCellsByCoords(
  editor: Editor | null,
  tablePos: number,
  coords: { row: number; col: number }[],
  options: BaseSelectionOptions | DispatchSelectionOptions = { mode: 'state' }
): EditorState | Transaction | void {
  if (!editor) return;

  const table = getTable(editor, tablePos);
  if (!table) return;

  const { state } = editor;
  const tableMap = table.map;

  const cleanedCoords = coords
    .map((coord) => ({
      row: clamp(coord.row, 0, tableMap.height - 1),
      col: clamp(coord.col, 0, tableMap.width - 1),
    }))
    .filter((coord) => isWithinBounds(coord.row, coord.col, tableMap));

  if (cleanedCoords.length === 0) {
    return;
  }

  // --- Find the smallest rectangle that contains all our coordinates ---
  const allRows = cleanedCoords.map((coord) => coord.row);
  const topRow = Math.min(...allRows);
  const bottomRow = Math.max(...allRows);

  const allCols = cleanedCoords.map((coord) => coord.col);
  const leftCol = Math.min(...allCols);
  const rightCol = Math.max(...allCols);

  // --- Convert visual coordinates to document positions ---
  const getCellPositionFromMap = (row: number, col: number): number | null => {
    const cellOffset = tableMap.map[row * tableMap.width + col];
    if (cellOffset === undefined) return null;
    return tablePos + 1 + cellOffset;
  };

  // Anchor = where the selection starts (top-left of bounding box)
  const anchorPosition = getCellPositionFromMap(topRow, leftCol);
  if (anchorPosition === null) return;

  // Head = where the selection ends (usually bottom-right of bounding box)
  let headPosition = getCellPositionFromMap(bottomRow, rightCol);
  if (headPosition === null) return;

  // --- Handle edge case with merged cells ---
  if (headPosition === anchorPosition) {
    let foundDifferentCell = false;

    for (let row = bottomRow; row >= topRow && !foundDifferentCell; row--) {
      for (let col = rightCol; col >= leftCol && !foundDifferentCell; col--) {
        const candidatePosition = getCellPositionFromMap(row, col);

        if (
          candidatePosition !== null &&
          candidatePosition !== anchorPosition
        ) {
          headPosition = candidatePosition;
          foundDifferentCell = true;
        }
      }
    }
  }

  try {
    const anchorRef = state.doc.resolve(anchorPosition);
    const headRef = state.doc.resolve(headPosition);

    const cellSelection = new CellSelection(anchorRef, headRef);
    const transaction = state.tr.setSelection(cellSelection);

    return applySelectionWithMode(state, transaction, options);
  } catch (error) {
    console.error('Failed to create cell selection:', error);
    return;
  }
}

/**
 * Select the cell at (row, col) using `cellAround` to respect merged cells.
 */
export function selectCellAt({
  editor,
  row,
  col,
  tablePos,
  dispatch,
}: {
  editor: Editor | null;
  row: number;
  col: number;
  tablePos?: number;
  dispatch?: (tr: Transaction) => void;
}): boolean {
  if (!editor) return false;

  const { state, view } = editor;
  const found = getTable(editor, tablePos);
  if (!found) return false;

  // Bounds check
  if (!isWithinBounds(row, col, found.map)) {
    return false;
  }

  const relCellPos = found.map.positionAt(row, col, found.node);
  const absCellPos = found.start + relCellPos;

  const $abs = state.doc.resolve(absCellPos);
  const $cell = cellAround($abs);
  const cellPos = $cell ? $cell.pos : absCellPos;

  const sel = CellSelection.create(state.doc, cellPos);

  const doDispatch = dispatch ?? view?.dispatch;
  if (!doDispatch) return false;

  doDispatch(state.tr.setSelection(sel));
  return true;
}

/**
 * Selects a boundary cell of the table based on orientation.
 */
export function selectLastCell(
  editor: Editor,
  tableNode: Node,
  tablePos: number,
  orientation: Orientation
) {
  const map = TableMap.get(tableNode);
  const isRow = orientation === 'row';

  // For rows, select bottom-left cell; for columns, select top-right cell
  const row = isRow ? map.height - 1 : 0;
  const col = isRow ? 0 : map.width - 1;

  // Calculate the index in the table map
  const index = row * map.width + col;

  // Get the actual cell position from the map (handles merged cells)
  const cellPos = map.map[index];
  if (!cellPos && cellPos !== 0) {
    console.warn('selectLastCell: cell position not found in map', {
      index,
      row,
      col,
      map,
    });
    return false;
  }

  // Find the row and column of the actual cell
  const cellIndex = map.map.indexOf(cellPos);
  const actualRow = cellIndex >= 0 ? Math.floor(cellIndex / map.width) : 0;
  const actualCol = cellIndex >= 0 ? cellIndex % map.width : 0;

  return selectCellAt({
    editor,
    row: actualRow,
    col: actualCol,
    tablePos,
    dispatch: editor.view.dispatch.bind(editor.view),
  });
}

/**
 * Get all (row, col) coordinates for a given row or column index.
 */
export function getIndexCoordinates({
  editor,
  index,
  orientation,
  tablePos,
}: {
  editor: Editor | null;
  index: number;
  orientation?: Orientation;
  tablePos?: number;
}): { row: number; col: number }[] | null {
  if (!editor) return null;

  const table = getTable(editor, tablePos);
  if (!table) return null;

  const { map } = table;
  const { width, height } = map;

  if (index < 0) return null;
  if (orientation === 'row' && index >= height) return null;
  if (orientation === 'column' && index >= width) return null;

  return orientation === 'row'
    ? Array.from({ length: map.width }, (_, col) => ({ row: index, col }))
    : Array.from({ length: map.height }, (_, row) => ({ row, col: index }));
}

/**
 * Given a DOM cell element, find its (row, col) indices within the table.
 */
export function getCellIndicesFromDOM(
  cell: HTMLTableCellElement,
  tableNode: Node | null,
  editor: Editor
): { rowIndex: number; colIndex: number } | null {
  if (!tableNode) return null;

  try {
    const cellPos = editor.view.posAtDOM(cell, 0);
    const $cellPos = editor.view.state.doc.resolve(cellPos);

    for (let d = $cellPos.depth; d > 0; d--) {
      const node = $cellPos.node(d);
      if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
        const tableMap = TableMap.get(tableNode);
        const cellNodePos = $cellPos.before(d);
        const tableStart = $cellPos.start(d - 2);
        const cellOffset = cellNodePos - tableStart;
        const cellIndex = tableMap.map.indexOf(cellOffset);

        return {
          rowIndex: Math.floor(cellIndex / tableMap.width),
          colIndex: cellIndex % tableMap.width,
        };
      }
    }
  } catch (error) {
    console.warn('Could not get cell position:', error);
  }
  return null;
}

/**
 * Given a DOM element inside a table, find the corresponding table node and its position.
 */
export function getTableFromDOM(
  tableElement: HTMLElement,
  editor: Editor
): { node: Node; pos: number } | null {
  try {
    const pos = editor.view.posAtDOM(tableElement, 0);
    const $pos = editor.view.state.doc.resolve(pos);

    for (let d = $pos.depth; d >= 0; d--) {
      const node = $pos.node(d);
      if (isTableNode(node)) {
        return { node, pos: d === 0 ? 0 : $pos.before(d) };
      }
    }
  } catch (error) {
    console.warn('Could not get table from DOM:', error);
  }
  return null;
}

/**
 * Checks if a node is a table node
 */
export function isTableNode(node: Node | null | undefined): node is Node {
  return (
    !!node &&
    (node.type.name === 'table' || node.type.spec.tableRole === 'table')
  );
}

/**
 * Get all cells (and unique merged cells) from a specific row.
 */
export function getRowCells(
  editor: Editor | null,
  rowIndex?: number,
  tablePos?: number
): { cells: CellInfo[]; mergedCells: CellInfo[] } {
  return collectCells(editor, 'row', rowIndex, tablePos);
}

/**
 * Collect cells (and unique merged cells) from the current table.
 */
export function getColumnCells(
  editor: Editor | null,
  columnIndex?: number,
  tablePos?: number
): { cells: CellInfo[]; mergedCells: CellInfo[] } {
  return collectCells(editor, 'column', columnIndex, tablePos);
}

