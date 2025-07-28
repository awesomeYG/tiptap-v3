import { FormulaIcon } from "@cq/tiptap/component/Icons"
import { EditorFnProps } from "@cq/tiptap/type"
import { Box, Button, Popover, Stack, TextField } from "@mui/material"
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

  const open = Boolean(anchorEl)
  const id = open ? 'insert-block-math-popover' : undefined

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
          aria-describedby={id}
          onClick={handleShowPopover}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            py: 3,
            px: 2,
            bgcolor: 'action.default',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'primary.main'
            },
            '&:active': {
              bgcolor: 'action.selected',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <FormulaIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            添加数学公式
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'block',
            textAlign: 'center',
            py: 2,
            px: 1,
            borderRadius: 1,
            bgcolor: 'transparent',
            cursor: 'pointer',
            border: '1px solid transparent',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'divider'
            },
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
          }}
          onClick={handleShowPopover}
        >
          <div ref={mathRef} />
        </Box>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Stack gap={2} sx={{ p: 3, width: 480 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            value={editLatex}
            onChange={(e) => setEditLatex(e.target.value)}
            placeholder="输入 LaTeX 公式，例如：\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}"
            label="LaTeX 数学公式"
            autoFocus
          />
          <Stack direction="row" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClosePopover}
            >
              取消
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleInsertFormula}
              disabled={!editLatex.trim()}
              sx={{ flex: 1 }}
            >
              插入公式
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </NodeViewWrapper>
  )
}

export default MathematicsBlockViewWrapper