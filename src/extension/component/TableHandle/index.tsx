import { useCallback, useMemo, useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { Node } from '@tiptap/pm/model';
import {
  colDragStart,
  rowDragStart,
} from '../../node/TableHandler/plugin';
import { useTableHandlePositioning } from './use-table-handle-positioning';
import { useTableHandleState } from './use-table-handle-state';
import type { Orientation } from '../../../util/table-utils';
import { TableHandleMenu } from './TableHandleMenu';

export interface TableHandleButtonProps {
  editor: Editor;
  orientation: Orientation;
  index?: number;
  tablePos?: number;
  tableNode?: Node;
  onToggleOtherHandle?: (visible: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  dragStart?: (e: React.DragEvent) => void;
}

export interface TableHandleProps {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
}

/**
 * Main table handle component that manages the positioning and rendering
 * of table row/column handles, extend buttons, and context menus.
 */
export function TableHandle({
  editor: providedEditor,
}: TableHandleProps) {
  const editor = providedEditor;
  const state = useTableHandleState({ editor });

  const [isRowVisible, setIsRowVisible] = useState(true);
  const [isColumnVisible, setIsColumnVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState<null | 'row' | 'column'>(null);

  const draggingState = useMemo(() => {
    if (!state?.draggingState) return undefined;

    return {
      draggedCellOrientation: state.draggingState.draggedCellOrientation,
      mousePos: state.draggingState.mousePos,
      initialOffset: state.draggingState.initialOffset,
    };
  }, [state?.draggingState]);

  const { rowHandle, colHandle } = useTableHandlePositioning(
    state?.show || false,
    state?.referencePosCell || null,
    state?.referencePosTable || null,
    draggingState
  );

  const toggleRowVisibility = useCallback((visible: boolean) => {
    setIsRowVisible(visible);
  }, []);

  const toggleColumnVisibility = useCallback((visible: boolean) => {
    setIsColumnVisible(visible);
  }, []);

  const handleMenuOpenChange = useCallback(
    (type: 'row' | 'column', open: boolean) => {
      setMenuOpen(open ? type : null);
    },
    []
  );

  if (!editor || !state) return null;

  const hasValidRowIndex = typeof state.rowIndex === 'number';
  const hasValidColIndex = typeof state.colIndex === 'number';

  const shouldShowRow =
    (isRowVisible && rowHandle.isMounted && hasValidRowIndex) ||
    menuOpen === 'row';

  const shouldShowColumn =
    (isColumnVisible && colHandle.isMounted && hasValidColIndex) ||
    menuOpen === 'column';

  const rootElement = state.widgetContainer || document.body;

  return (
    <>
      {shouldShowRow && (
        <div ref={rowHandle.ref} style={rowHandle.style}>
          <TableHandleMenu
            editor={editor}
            orientation="row"
            index={state.rowIndex}
            tablePos={state.blockPos}
            tableNode={state.block}
            onToggleOtherHandle={toggleColumnVisibility}
            dragStart={rowDragStart}
            onOpenChange={(open) => handleMenuOpenChange('row', open)}
          />
        </div>
      )}

      {shouldShowColumn && (
        <div ref={colHandle.ref} style={colHandle.style}>
          <TableHandleMenu
            editor={editor}
            orientation="column"
            index={state.colIndex}
            tablePos={state.blockPos}
            tableNode={state.block}
            onToggleOtherHandle={toggleRowVisibility}
            dragStart={colDragStart}
            onOpenChange={(open) => handleMenuOpenChange('column', open)}
          />
        </div>
      )}
    </>
  );
}

TableHandle.displayName = 'TableHandle';

