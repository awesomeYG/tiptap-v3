import { FloatingPopover } from "@ctzhian/tiptap/component/FloatingPopover"
import { DeleteLineIcon, EditBoxLineIcon } from "@ctzhian/tiptap/component/Icons"
import { EditorFnProps } from "@ctzhian/tiptap/type"
import { Box, Button, IconButton, Stack, TextField, Tooltip } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useEffect, useState } from "react"
import InsertIframe, { IframeAttributes } from "./Insert"
import ReadonlyIframe from "./Readonly"

const IframeViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
  onValidateUrl
}) => {
  const attrs = node.attrs as IframeAttributes
  const [isHovering, setIsHovering] = useState(false)
  const [isDraggingWidth, setIsDraggingWidth] = useState(false)
  const [isDraggingHeight, setIsDraggingHeight] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)
  const [dragStartHeight, setDragStartHeight] = useState(0)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [editSrc, setEditSrc] = useState(attrs.src)

  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
  const handleClosePopover = () => setAnchorEl(null)
  const handleSave = async () => {
    if (editSrc.trim()) {
      try {
        let validatedUrl = editSrc.trim()
        if (onValidateUrl) {
          validatedUrl = await Promise.resolve(onValidateUrl(validatedUrl, 'iframe'))
        }
        updateAttributes({ src: validatedUrl, width: attrs.width, height: attrs.height })
      } catch (error) {
        // 错误处理已经在 onValidateUrl 中处理
      }
    }
    handleClosePopover()
  }

  const handleMouseDownWidth = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingWidth(true)
    setDragStartX(e.clientX)
    setDragStartWidth(attrs.width)
  }

  const handleMouseDownHeight = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingHeight(true)
    setDragStartY(e.clientY)
    setDragStartHeight(attrs.height)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingWidth) {
      const deltaX = e.clientX - dragStartX
      const newWidth = Math.max(200, Math.min(1920, dragStartWidth + deltaX))
      updateAttributes({ width: newWidth, height: attrs.height, src: attrs.src })
    }
    if (isDraggingHeight) {
      const deltaY = e.clientY - dragStartY
      const newHeight = Math.max(100, Math.min(2000, dragStartHeight + deltaY))
      updateAttributes({ width: attrs.width, height: newHeight, src: attrs.src })
    }
  }

  const handleMouseUp = () => {
    setIsDraggingWidth(false)
    setIsDraggingHeight(false)
  }

  useEffect(() => {
    if (isDraggingWidth || isDraggingHeight) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingWidth, isDraggingHeight])

  if (!attrs.src && !editor.isEditable) return null

  if (!editor.isEditable) {
    return <ReadonlyIframe attrs={attrs} />
  }

  if (!attrs.src) {
    return <InsertIframe selected={selected} attrs={attrs} updateAttributes={updateAttributes as any} onValidateUrl={onValidateUrl} />
  }

  return (
    <NodeViewWrapper
      className={`iframe-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 'var(--mui-shape-borderRadius)',
          p: '0.25rem',
          bgcolor: 'background.paper',
          '&:hover .iframe-controls': { opacity: 1 }
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {(isDraggingWidth || isDraggingHeight) && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 8,
              cursor: isDraggingWidth ? 'ew-resize' : 'ns-resize',
              backgroundColor: 'transparent',
            }}
          />
        )}
        <iframe
          src={attrs.src}
          width={attrs.width}
          height={attrs.height}
          style={{ display: 'block', border: 0, maxWidth: '100%', pointerEvents: (isDraggingWidth || isDraggingHeight) ? 'none' : 'auto' }}
        />
        {(isHovering || isDraggingWidth) && (
          <Box
            onMouseDown={handleMouseDownWidth}
            sx={{
              position: 'absolute',
              right: -2,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 4,
              height: 50,
              bgcolor: isDraggingWidth ? 'primary.main' : 'text.primary',
              cursor: 'ew-resize',
              borderRadius: 2,
              '&:hover': { bgcolor: 'primary.main' },
              transition: 'background-color 0.2s ease',
              zIndex: 10
            }}
          />
        )}
        {(isHovering || isDraggingHeight) && (
          <Box
            onMouseDown={handleMouseDownHeight}
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: -2,
              transform: 'translateX(-50%)',
              height: 4,
              width: 60,
              bgcolor: isDraggingHeight ? 'primary.main' : 'text.primary',
              cursor: 'ns-resize',
              borderRadius: 2,
              '&:hover': { bgcolor: 'primary.main' },
              transition: 'background-color 0.2s ease',
              zIndex: 10
            }}
          />
        )}
        {(isHovering || !!anchorEl) && <Box
          className="iframe-controls"
          sx={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            display: 'flex',
            gap: '0.25rem',
          }}
        >
          <Tooltip arrow title="更换链接">
            <IconButton
              size="small"
              onClick={handleShowPopover}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.paper',
              }}
            >
              <EditBoxLineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="删除">
            <IconButton size="small" onClick={deleteNode} sx={{ color: 'text.primary', bgcolor: 'background.paper' }}>
              <DeleteLineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>}
      </Box>
      <FloatingPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        placement="bottom"
      >
        <Stack sx={{ p: 2, width: 350 }}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: '1.5', mb: 1 }}>链接地址</Box>
          <TextField
            fullWidth
            size="small"
            value={editSrc}
            onChange={(e) => setEditSrc(e.target.value)}
            placeholder="输入要嵌入的 URL"
          />
          <Stack direction={'row'} gap={1} alignItems={'center'} sx={{ mt: 2 }}>
            <Button variant="outlined" size="small" fullWidth onClick={handleClosePopover}>取消</Button>
            <Button variant="contained" size="small" fullWidth onClick={handleSave} disabled={!editSrc.trim()}>保存</Button>
          </Stack>
        </Stack>
      </FloatingPopover>
    </NodeViewWrapper>
  )
}

export default IframeViewWrapper


