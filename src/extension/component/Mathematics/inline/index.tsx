import { FloatingPopover } from "@cq/tiptap/component/FloatingPopover"
import { SquareRootIcon } from "@cq/tiptap/component/Icons"
import { EditorFnProps } from "@cq/tiptap/type"
import { Box, Button, Stack, TextField } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import katex from 'katex'
import React, { useEffect, useRef, useState } from "react"
import ReadonlyInlineMath from "./Readonly"

export type InlineMathAttributes = {
  latex: string
}

export const MathematicsInlineViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  selected,
  onError,
}) => {
  const attrs = node.attrs as InlineMathAttributes
  const mathRef = useRef<HTMLSpanElement>(null)

  const [editLatex, setEditLatex] = useState(attrs.latex || '')
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const handleShowPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setEditLatex(attrs.latex || '')
    setAnchorEl(event.currentTarget)
  }
  const handleClosePopover = () => setAnchorEl(null)
  const handleInsertFormula = () => {
    if (!editLatex.trim()) return
    updateAttributes({
      latex: editLatex.trim(),
    })
    handleClosePopover()
  }

  useEffect(() => {
    if (mathRef.current && attrs.latex) {
      try {
        katex.render(attrs.latex, mathRef.current, {
          throwOnError: false,
          displayMode: false,
          errorColor: 'error.main',
          output: 'html'
        })
      } catch (error) {
        onError?.(error as Error)
      }
    }
  }, [attrs.latex])

  if (!editor.isEditable) {
    return <ReadonlyInlineMath mathRef={mathRef} attrs={attrs} selected={selected} />
  }

  return (
    <NodeViewWrapper
      className={`mathematics-inline-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
      as="span"
    >
      {!attrs.latex ? <Box
        component="span"
        onClick={handleShowPopover}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 'var(--mui-shape-borderRadius)',
          px: 2,
          py: 1.5,
          fontSize: 14,
          color: 'text.secondary',
          bgcolor: 'action.default',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover'
          },
          '&:active': {
            bgcolor: 'action.selected',
          },
          transition: 'background-color 0.2s ease',
        }}
      >
        <SquareRootIcon sx={{ fontSize: '1rem', flexShrink: 0 }} />
        <Box component="span">
          添加数学公式
        </Box>
      </Box> : <Box
        component="span"
        sx={{
          display: 'inline-block',
          cursor: 'pointer',
          position: 'relative',
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
          bgcolor: 'transparent',
          '&:hover': {
            bgcolor: 'action.hover'
          },
          transition: 'background-color 0.2s ease',
        }}
        onClick={handleShowPopover}
      >
        <Box component="span" ref={mathRef} />
      </Box>}
      <FloatingPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        placement="bottom"
      >
        <Stack gap={2} sx={{ p: 2, width: 360 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            value={editLatex}
            onChange={(e) => setEditLatex(e.target.value)}
            placeholder="输入 LaTeX 公式，例如：x^2 + y^2 = z^2"
          />
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={handleInsertFormula}
            disabled={!editLatex.trim()}
          >
            插入公式
          </Button>
        </Stack>
      </FloatingPopover>
    </NodeViewWrapper>
  )
}

export default MathematicsInlineViewWrapper