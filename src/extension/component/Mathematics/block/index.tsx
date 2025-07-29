import { FloatingPopover } from "@cq/tiptap/component/FloatingPopover"
import { FunctionsIcon } from "@cq/tiptap/component/Icons"
import { EditorFnProps } from "@cq/tiptap/type"
import { Box, Button, Stack, TextField } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import katex from "katex"
import React, { useEffect, useRef, useState } from "react"
import ReadonlyBlockMath from "./Readonly"

export type BlockMathAttributes = {
  latex: string
}

export const MathematicsBlockViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  selected,
  onError,
}) => {
  const attrs = node.attrs as BlockMathAttributes
  const mathRef = useRef<HTMLDivElement>(null)

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
          displayMode: true,
          errorColor: 'error.main',
          output: 'html'
        })
      } catch (error) {
        onError?.(error as Error)
      }
    }
  }, [attrs.latex])

  if (!editor.isEditable) {
    return <ReadonlyBlockMath mathRef={mathRef} attrs={attrs} selected={selected} />
  }

  return (
    <NodeViewWrapper
      className={`mathematics-block-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      {!attrs.latex ? (
        <Box
          onClick={handleShowPopover}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 'var(--mui-shape-borderRadius)',
            px: 2,
            py: 1.5,
            fontSize: '0.875rem',
            color: 'text.secondary',
            bgcolor: 'action.default',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover'
            },
            '&:active': {
              bgcolor: 'action.selected',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <FunctionsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            添加数学公式
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'block',
            textAlign: 'center',
            py: 1.5,
            px: 2,
            borderRadius: 'var(--mui-shape-borderRadius)',
            bgcolor: 'transparent',
            cursor: 'pointer',
            '.katex-display': {
              m: 0,
            },
            '&:hover': {
              bgcolor: 'action.hover'
            },
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
          }}
          onClick={handleShowPopover}
        >
          <div ref={mathRef} />
        </Box>
      )}
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
            rows={4}
            size="small"
            value={editLatex}
            onChange={(e) => setEditLatex(e.target.value)}
            placeholder="输入 LaTeX 公式，例如：\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}"
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

export default MathematicsBlockViewWrapper