import { DeleteLineIcon } from "@cq/tiptap/component/Icons/delete-line-icon"
import { EditorFnProps } from "@cq/tiptap/type"
import { Box, IconButton, Tooltip } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useEffect, useRef, useState } from "react"
import InsertVideo from "./Insert"
import ReadonlyVideo from "./Readonly"

export interface VideoAttributes {
  src: string
  width: number
  controls: boolean
  autoplay: boolean
  loop: boolean
  muted: boolean
  poster: string | null
}

const VideoViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
  onUpload,
  onError
}) => {
  const attrs = node.attrs as VideoAttributes
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
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
    const newWidth = Math.max(200, Math.min(1920, dragStartWidth + deltaX))
    updateAttributes({
      width: newWidth
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
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

  if (!attrs.src && !editor.isEditable) {
    return null
  }

  if (!editor.isEditable) {
    return <ReadonlyVideo selected={selected} attrs={attrs} onError={onError} />
  }

  if (!attrs.src) {
    return <InsertVideo selected={selected} attrs={attrs} updateAttributes={updateAttributes} onUpload={onUpload} onError={onError} />
  }

  return (
    <NodeViewWrapper
      className={`video-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
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
          '&:hover .video-controls': {
            opacity: 1
          }
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video
          ref={videoRef}
          src={attrs.src}
          width={attrs.width}
          poster={attrs.poster || undefined}
          controls={attrs.controls}
          autoPlay={attrs.autoplay}
          loop={attrs.loop}
          muted={attrs.muted}
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block'
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
          className="video-controls"
          sx={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            display: 'flex',
            gap: '0.25rem',
          }}
        >
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

export default VideoViewWrapper