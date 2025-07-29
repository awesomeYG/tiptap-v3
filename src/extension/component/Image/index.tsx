import { CustomSizeIcon, DeleteLineIcon } from "@cq/tiptap/component/Icons"
import { EditorFnProps } from "@cq/tiptap/type"
import { Box, IconButton, Tooltip } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import React, { useEffect, useRef, useState } from "react"
import CropImage from "./Crop"
import InsertImage from "./Insert"
import ReadonlyImage from "./Readonly"

export interface ImageAttributes {
  src: string
  width: number
}

const ImageViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
  onUpload,
  onError
}) => {
  const attrs = node.attrs as ImageAttributes
  const imageRef = useRef<HTMLImageElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragStartWidth(attrs.width)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStartX
    const newWidth = Math.max(100, Math.min(1200, dragStartWidth + deltaX))
    updateAttributes({
      width: newWidth
    })
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleCropClick = () => setIsCropping(true)
  const handleCropCancel = () => setIsCropping(false)

  const handleCropConfirm = (imageUrl: string) => {
    updateAttributes({
      src: imageUrl
    })
    setIsCropping(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  if (!editor.isEditable) {
    return <ReadonlyImage selected={selected} attrs={attrs} />
  }

  if (!attrs.src) {
    return <InsertImage selected={selected} attrs={attrs} onUpload={onUpload} updateAttributes={updateAttributes} />
  }

  if (isCropping) {
    return (
      <CropImage
        selected={selected}
        attrs={attrs}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
        onUpload={onUpload}
        onError={onError}
      />
    )
  }

  return (
    <NodeViewWrapper
      className={`image-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <Box
        component={'span'}
        sx={{
          position: 'relative',
          display: 'inline-block',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 'var(--mui-shape-borderRadius)',
          p: '0.25rem',
          bgcolor: 'background.paper',
          '&:hover .image-controls': {
            opacity: 1
          }
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          ref={imageRef}
          src={attrs.src}
          width={attrs.width}
          style={{
            maxWidth: '100%',
            height: 'auto',
            cursor: 'default',
          }}
          onError={(e) => {
            onError?.(e as unknown as Error)
          }}
        />
        {(isHovering || isDragging) && (
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              position: 'absolute',
              right: -2,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 4,
              height: 50,
              bgcolor: isDragging ? 'primary.main' : 'text.primary',
              cursor: 'ew-resize',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'primary.main',
              },
              transition: 'background-color 0.2s ease',
              zIndex: 10
            }}
          />
        )}
        {isHovering && <Box
          className="image-controls"
          sx={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            display: 'flex',
            gap: '0.25rem',
          }}
        >
          <Tooltip arrow title="裁切图片">
            <IconButton
              size="small"
              onClick={handleCropClick}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.paper',
              }}
            >
              <CustomSizeIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="删除图片">
            <IconButton
              size="small"
              onClick={deleteNode}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.paper',
              }}
            >
              <DeleteLineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>}
      </Box>
    </NodeViewWrapper>
  )
}

export default ImageViewWrapper