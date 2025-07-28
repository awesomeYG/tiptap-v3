import { MovieLineIcon } from "@cq/tiptap/component/Icons"
import { CheckboxBlankCircleLineIcon } from "@cq/tiptap/component/Icons/checkbox-blank-circle-line"
import { CheckboxCircleLineIcon } from "@cq/tiptap/component/Icons/checkbox-circle-line"
import { UploadIcon } from "@cq/tiptap/component/Icons/upload-icon"
import { Box, Button, CircularProgress, IconButton, Popover, Stack, Tab, Tabs, TextField } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useEffect, useRef, useState } from "react"

interface VideoAttributes {
  src: string
  controls: boolean
  autoplay: boolean
  loop: boolean
  muted: boolean
  poster: string | null
  width: number
  class: string
}

export type VideoViewWrapperProps = {
  onUpload?: (file: File) => Promise<string>
  onError?: (error: Error) => void
}

const VideoViewWrapper: React.FC<NodeViewProps & VideoViewWrapperProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
  onUpload,
  onError
}) => {
  const attrs = node.attrs as VideoAttributes
  const [isEditing, setIsEditing] = useState(false)
  const [editSrc, setEditSrc] = useState(attrs.src || '')
  const [editPoster, setEditPoster] = useState(attrs.poster || '')
  const [editWidth, setEditWidth] = useState(attrs.width || 760)
  const [editControls, setEditControls] = useState(attrs.controls ?? true)
  const [editAutoplay, setEditAutoplay] = useState(attrs.autoplay || false)
  const [editLoop, setEditLoop] = useState(attrs.loop || false)
  const [editMuted, setEditMuted] = useState(attrs.muted || false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [insertType, setInsertType] = useState<'upload' | 'link'>(onUpload ? 'upload' : 'link')
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [uploading, setUploading] = useState(false)

  // 拖拽相关状态
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)

  const handleShowPopover = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);
  const handleChangeInsertType = (event: React.SyntheticEvent, newValue: string) => setInsertType(newValue as 'upload' | 'link')
  const handleUploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      try {
        const url = await onUpload?.(file)
        if (url) {
          setEditSrc(url)
          updateAttributes({
            src: url,
            poster: null,
            width: 760,
            controls: editControls,
            autoplay: editAutoplay,
            loop: editLoop,
            muted: editMuted,
          })
        }
      } catch (error) {
        onError?.(error as Error)
      } finally {
        setUploading(false)
      }
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'video-show-popover' : undefined;

  useEffect(() => {
    setEditSrc(attrs.src || '')
    setEditPoster(attrs.poster || '')
    setEditWidth(attrs.width || 760)
    setEditControls(attrs.controls || true)
    setEditAutoplay(attrs.autoplay || false)
    setEditLoop(attrs.loop || false)
    setEditMuted(attrs.muted || false)
  }, [attrs])

  const handleSave = () => {
    if (!editSrc.trim()) {
      return
    }

    updateAttributes({
      src: editSrc.trim(),
      poster: editPoster.trim() || null,
      width: editWidth,
      controls: editControls,
      autoplay: editAutoplay,
      loop: editLoop,
      muted: editMuted,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditSrc(attrs.src || '')
    setEditPoster(attrs.poster || '')
    setEditWidth(attrs.width || 760)
    setIsEditing(false)
  }

  // const toggleAttribute = (attr: keyof VideoAttributes) => {
  //   updateAttributes({
  //     [attr]: !attrs[attr]
  //   })
  // }

  // 拖拽处理函数
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragStartWidth(isEditing ? editWidth : attrs.width)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStartX
    const newWidth = Math.max(200, Math.min(1920, dragStartWidth + deltaX))

    if (isEditing) {
      // 编辑模式下更新临时状态
      setEditWidth(newWidth)
    } else {
      // 展示模式下直接更新属性
      updateAttributes({
        width: newWidth
      })
    }
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
  }, [isDragging, dragStartX, dragStartWidth, isEditing, editWidth, attrs.width, updateAttributes])

  if (!attrs.src && !isEditing && !editor.isEditable) { // 默认插入状态
    return (
      <NodeViewWrapper
        className={`video-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
        data-drag-handle
      >
        <Stack
          direction={'row'}
          alignItems={'center'}
          gap={2}
          aria-describedby={id}
          onClick={handleShowPopover}
          sx={{
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 'var(--mui-shape-borderRadius)',
            px: 2,
            py: 1.5,
            textAlign: 'center',
            cursor: 'pointer',
            color: 'text.secondary',
            bgcolor: 'action.default',
            "&:hover": {
              bgcolor: 'action.hover'
            },
            "&:active": {
              bgcolor: 'action.selected',
            }
          }}
        >
          <MovieLineIcon sx={{ fontSize: 18 }} />
          <Box sx={{ fontSize: 14 }}>嵌入或复制视频链接</Box>
        </Stack>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ width: 300, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Tabs value={insertType} onChange={handleChangeInsertType}>
              <Tab label="上传" value="upload" />
              <Tab label="嵌入链接" value="link" />
            </Tabs>
          </Box>
          {insertType === 'upload' ? <Stack alignItems={'center'} gap={2} sx={{ p: 2 }}>
            <Button
              variant="contained"
              component="label"
              disabled={!onUpload || uploading}
              fullWidth
              startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon sx={{ fontSize: 18 }} />}
            >
              <input
                type="file"
                hidden
                multiple={false}
                accept="video/*"
                onChange={handleUploadVideo}
              />
              {uploading ? '视频文件上传中...' : '视频文件'}
            </Button>
          </Stack> : <Stack gap={2} sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={editSrc}
              onChange={(e) => setEditSrc(e.target.value)}
              placeholder="输入视频文件的 URL"
            />
            <Button variant="contained" fullWidth onClick={handleSave}>
              嵌入视频
            </Button>
          </Stack>}
        </Popover>
      </NodeViewWrapper>
    )
  }

  if (isEditing) { // 编辑视频属性状态
    return (
      <NodeViewWrapper
        className={`video-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
        data-drag-handle
      >
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 'var(--mui-shape-borderRadius)',
            p: '1rem',
            lineHeight: 1.5,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ mb: 2, fontWeight: 'bold' }}>编辑视频</Box>
          <Stack direction={'row'} alignItems={'center'} gap={2} sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)', width: 150, mb: 1, flexShrink: 0 }}>视频链接</Box>
            <TextField
              fullWidth
              size="small"
              value={editSrc}
              onChange={(e) => setEditSrc(e.target.value)}
              placeholder="输入视频文件的 URL"
            />
            <IconButton size="small" sx={{ flexShrink: 0, bgcolor: 'background.paper' }}>
              <UploadIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} gap={2} sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)', width: 150, mb: 1, flexShrink: 0 }}>封面图片 (可选)</Box>
            <TextField
              fullWidth
              size="small"
              value={editPoster}
              onChange={(e) => setEditPoster(e.target.value)}
              placeholder="输入封面图片的URL"
            />
            <IconButton size="small" sx={{ flexShrink: 0, bgcolor: 'background.paper' }}>
              <UploadIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} gap={2} sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)', width: 150, mb: 1, flexShrink: 0 }}>视频宽度</Box>
            <TextField
              type="number"
              size="small"
              fullWidth
              value={editWidth}
              onChange={(e) => setEditWidth(Number(e.target.value))}
              inputProps={{ min: 200, max: 1920 }}
              sx={{ flex: 1 }}
            />
          </Stack>
          <Stack direction={'row'} alignItems={'flex-start'} gap={2} sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)', width: 150, mb: 1, flexShrink: 0 }}>视频设置</Box>
            <Stack gap={1}>
              <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => setEditControls(!editControls)} sx={{ cursor: 'pointer', width: 150 }}>
                {editControls ? <CheckboxCircleLineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  : <CheckboxBlankCircleLineIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}>显示控制条</Box>
              </Stack>
              <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => setEditAutoplay(!editAutoplay)} sx={{ cursor: 'pointer', width: 150 }}>
                {editAutoplay ? <CheckboxCircleLineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  : <CheckboxBlankCircleLineIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}>自动播放</Box>
              </Stack>
              <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => setEditLoop(!editLoop)} sx={{ cursor: 'pointer', width: 150 }}>
                {editLoop ? <CheckboxCircleLineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  : <CheckboxBlankCircleLineIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}>循环播放</Box>
              </Stack>
              <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => setEditMuted(!editMuted)} sx={{ cursor: 'pointer', width: 150 }}>
                {editMuted ? <CheckboxCircleLineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  : <CheckboxBlankCircleLineIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}>静音</Box>
              </Stack>
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              取消
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!editSrc.trim()}
            >
              保存
            </Button>
          </Box>
        </Box>
      </NodeViewWrapper>
    )
  }

  // 展示状态
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
        onMouseEnter={() => {
          if (!editor.isEditable) return
          setIsHovering(true)
        }}
        onMouseLeave={() => {
          if (!editor.isEditable) return
          setIsHovering(false)
        }}
      >
        <video
          ref={videoRef}
          src={attrs.src}
          poster={attrs.poster || undefined}
          controls={attrs.controls}
          autoPlay={attrs.autoplay}
          loop={attrs.loop}
          muted={attrs.muted}
          width={attrs.width}
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block'
          }}
          onError={(e) => {
            onError?.(e as unknown as Error)
          }}
        />
        {(isHovering || isDragging) && editor.isEditable && (
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
        {/* {selected && editor.isEditable && (
          <Box
            className="video-controls"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
              opacity: 0.8,
              transition: 'opacity 0.2s ease'
            }}
          >
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.9)' }
              }}
            >
              <ScreenshotLineIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={deleteNode}
              sx={{
                bgcolor: 'rgba(255, 0, 0, 0.7)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.9)' }
              }}
            >
              <DeleteLineIcon fontSize="small" />
            </IconButton>
          </Box>
        )} */}
      </Box>
    </NodeViewWrapper>
  )
}

export default VideoViewWrapper