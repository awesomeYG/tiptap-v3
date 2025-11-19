import { Box } from '@mui/material';
import type { Node } from '@tiptap/pm/model';
import { TableMap } from '@tiptap/pm/tables';
import type { Editor } from '@tiptap/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AddLineIcon } from '../../../component/Icons/add-line-icon';
import type { Orientation } from '../../../util/table-utils';
import {
  EMPTY_CELL_HEIGHT,
  EMPTY_CELL_WIDTH,
  countEmptyColumnsFromEnd,
  countEmptyRowsFromEnd,
  marginRound,
  runPreservingCursor,
  selectLastCell,
} from '../../../util/table-utils';
import { useTableHandleState } from '../TableHandle/use-table-handle-state';
import './TableExtendButton.css';
import { useTableExtendRowColumnButtonsPositioning } from './use-table-extend-row-column';

interface TableExtendRowColumnButtonProps {
  editor?: Editor | null;
  block: Node;
  onMouseDown: () => void;
  onMouseUp: () => void;
  orientation: Orientation;
}

/**
 * Simplified button component for extending/reducing table dimensions
 */
export const TableExtendRowColumnButton: React.FC<
  TableExtendRowColumnButtonProps
> = ({
  editor: providedEditor,
  onMouseDown,
  onMouseUp,
  orientation,
}) => {
    const editor = providedEditor;
    const state = useTableHandleState({ editor });
    const isRowOrientation = orientation === 'row';

    const movedRef = useRef(false);
    const [dragState, setDragState] = useState<{
      startPos: number;
      originalHeight: number;
      originalWidth: number;
    } | null>(null);

    const startDrag = useCallback(
      (ev: React.MouseEvent) => {
        if (!state) return;

        const dims = TableMap.get(state.block);
        movedRef.current = false;

        setDragState({
          startPos: isRowOrientation ? ev.clientY : ev.clientX,
          originalHeight: dims.height,
          originalWidth: dims.width,
        });

        onMouseDown();
        ev.preventDefault();
      },
      [state, isRowOrientation, onMouseDown]
    );

    const handleClick = useCallback(() => {
      if (movedRef.current || !editor || !state) return;

      runPreservingCursor(editor, () => {
        selectLastCell(editor, state.block, state.blockPos, orientation);

        if (isRowOrientation) {
          editor.commands.addRowAfter();
        } else {
          editor.commands.addColumnAfter();
        }
      });
    }, [editor, isRowOrientation, orientation, state]);

    useEffect(() => {
      if (!dragState || !editor || !state) return;

      const handleMove = (ev: MouseEvent) => {
        movedRef.current = true;

        const currentPos = isRowOrientation ? ev.clientY : ev.clientX;
        const diff = currentPos - dragState.startPos;
        const cellSize = isRowOrientation ? EMPTY_CELL_HEIGHT : EMPTY_CELL_WIDTH;

        const currentDims = TableMap.get(state.block);
        const currentCount = isRowOrientation
          ? currentDims.height
          : currentDims.width;
        const originalCount = isRowOrientation
          ? dragState.originalHeight
          : dragState.originalWidth;

        const newCount = Math.max(
          1,
          originalCount + marginRound(diff / cellSize, 0.3)
        );
        const delta = newCount - currentCount;

        if (delta === 0) return;

        // Add rows/columns
        if (delta > 0) {
          runPreservingCursor(editor, () => {
            selectLastCell(editor, state.block, state.blockPos, orientation);

            for (let i = 0; i < delta; i++) {
              if (isRowOrientation) {
                editor.commands.addRowAfter();
              } else {
                editor.commands.addColumnAfter();
              }
            }
          });
        }
        // Remove rows/columns - but only if they're empty
        else {
          runPreservingCursor(editor, () => {
            const absDelta = Math.abs(delta);

            const emptyCount = isRowOrientation
              ? countEmptyRowsFromEnd(editor, state.blockPos)
              : countEmptyColumnsFromEnd(editor, state.blockPos);

            // Only remove up to the number of empty cells, and keep at least 1
            const safeToRemove = Math.min(absDelta, emptyCount, currentCount - 1);

            selectLastCell(editor, state.block, state.blockPos, orientation);

            for (let i = 0; i < safeToRemove; i++) {
              if (isRowOrientation) {
                editor.commands.deleteRow();
              } else {
                editor.commands.deleteColumn();
              }
            }
          });
        }
      };

      const handleUp = () => {
        setDragState(null);
        onMouseUp();
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };
    }, [dragState, editor, isRowOrientation, orientation, onMouseUp, state]);

    if (!editor?.isEditable) return null;

    return (
      <Box
        component="button"
        className={`tiptap-table-extend-row-column-button ${isRowOrientation ? 'tiptap-table-row-end-add-remove' : 'tiptap-table-column-end-add-remove'} ${dragState ? 'editing' : ''}`}
        onClick={handleClick}
        onMouseDown={startDrag}
        type="button"
        aria-label={
          isRowOrientation ? 'Add or remove rows' : 'Add or remove columns'
        }
        sx={{
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--ct-tt-table-handle-bg-color, rgba(0,0,0,0.05))',
          borderRadius: 'var(--ct-tt-radius-lg, 4px)',
          padding: 0,
          cursor: 'pointer',
          '&.tiptap-table-row-end-add-remove': {
            width: '100%',
            height: '0.75rem',
          },
          '&.tiptap-table-column-end-add-remove': {
            width: '0.75rem',
          },
          '&:hover': {
            backgroundColor: 'var(--ct-tt-brand-color-500, #1976d2)',
            '& .MuiSvgIcon-root': {
              color: '#fff',
            },
          },
        }}
      >
        <AddLineIcon
          sx={{
            width: '1rem',
            height: '1rem',
            flexShrink: 0,
            color: 'var(--ct-tt-table-extend-icon-color, rgba(0,0,0,0.4))',
          }}
        />
      </Box>
    );
  };

export interface TableExtendRowColumnButtonsProps {
  editor?: Editor | null;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}

export const TableExtendRowColumnButtons: React.FC<
  TableExtendRowColumnButtonsProps
> = ({ editor: providedEditor, onMouseDown, onMouseUp }) => {
  const editor = providedEditor;
  const state = useTableHandleState({ editor });
  const { columnButton, rowButton } = useTableExtendRowColumnButtonsPositioning(
    state?.showAddOrRemoveColumnsButton ?? false,
    state?.showAddOrRemoveRowsButton ?? false,
    state?.referencePosTable ?? null,
    state?.referencePosLastRow ?? null,
    state?.referencePosLastCol ?? null
  );

  const handleDown = useCallback(() => {
    if (!editor) return;
    editor.commands.freezeHandles();
    onMouseDown?.();
  }, [editor, onMouseDown]);

  const handleUp = useCallback(() => {
    if (!editor) return;
    editor.commands.unfreezeHandles();
    onMouseUp?.();
  }, [editor, onMouseUp]);

  if (!state) return null;

  const rootElement = state.widgetContainer || document.body;

  return (
    <>
      <div ref={rowButton.ref} style={rowButton.style}>
        <TableExtendRowColumnButton
          editor={editor}
          orientation="row"
          block={state.block}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
        />
      </div>

      <div ref={columnButton.ref} style={columnButton.style}>
        <TableExtendRowColumnButton
          editor={editor}
          orientation="column"
          block={state.block}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
        />
      </div>
    </>
  );
};

