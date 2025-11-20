import {
  offset,
  size,
  useFloating,
  useTransitionStyles,
  type Placement,
} from '@floating-ui/react';
import { useEffect, useMemo } from 'react';
import type { Orientation } from '../../../util/table-utils';

interface TableExtendRowColumnButtonPositionResult {
  isMounted: boolean;
  ref: (node: HTMLElement | null) => void;
  style: React.CSSProperties;
}

interface TableExtendRowColumnButtonsPositioningResult {
  rowButton: TableExtendRowColumnButtonPositionResult;
  columnButton: TableExtendRowColumnButtonPositionResult;
}

const ORIENTATION_CONFIG = {
  row: {
    placement: 'bottom' as Placement,
    sizeProperty: 'width',
  },
  column: {
    placement: 'right' as Placement,
    sizeProperty: 'height',
  },
} as const;

/**
 * Custom hook for positioning extend buttons using Floating UI React
 */
function useTableExtendRowColumnButtonPosition(
  orientation: Orientation,
  show: boolean,
  referencePosTable: DOMRect | null
): TableExtendRowColumnButtonPositionResult {
  const config = ORIENTATION_CONFIG[orientation];

  const { refs, update, context, floatingStyles } = useFloating({
    open: show,
    placement: config.placement,
    middleware: [
      offset(4),
      size({
        apply({ rects, elements }) {
          const floating = elements.floating;
          if (!floating) return;

          // Apply size based on orientation
          const sizeValue = `${rects.reference[config.sizeProperty]}px`;
          floating.style[config.sizeProperty] = sizeValue;
        },
      }),
    ],
  });

  const { isMounted, styles } = useTransitionStyles(context);

  useEffect(() => {
    if (!referencePosTable) {
      refs.setReference(null);
      return;
    }

    // Create a virtual element that always returns the latest rect values
    // This ensures autoUpdate can detect changes when scrolling
    refs.setReference({
      getBoundingClientRect: () => {
        // Always use the latest value from closure
        return referencePosTable || new DOMRect();
      },
    });
    update();
  }, [referencePosTable, refs, update]);

  return useMemo(
    () => ({
      isMounted,
      ref: refs.setFloating,
      style: {
        display: 'flex',
        ...styles,
        ...floatingStyles,
      } as React.CSSProperties,
    }),
    [floatingStyles, isMounted, refs.setFloating, styles]
  );
}

/**
 * Hook for managing positioning of both row and column extend buttons
 */
export function useTableExtendRowColumnButtonsPositioning(
  showAddOrRemoveColumnsButton: boolean,
  showAddOrRemoveRowsButton: boolean,
  referencePosTable: DOMRect | null,
  referencePosLastRow: DOMRect | null,
  referencePosLastCol: DOMRect | null
): TableExtendRowColumnButtonsPositioningResult {
  const rowButton = useTableExtendRowColumnButtonPosition(
    'row',
    showAddOrRemoveRowsButton,
    referencePosLastRow || referencePosTable
  );

  const columnButton = useTableExtendRowColumnButtonPosition(
    'column',
    showAddOrRemoveColumnsButton,
    referencePosLastCol || referencePosTable
  );

  return useMemo(
    () => ({
      rowButton,
      columnButton,
    }),
    [rowButton, columnButton]
  );
}
