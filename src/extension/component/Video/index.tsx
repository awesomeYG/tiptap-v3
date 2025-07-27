import { MovieLineIcon, ScreenshotLineIcon } from "@cq/tiptap/component/Icons"
import { CheckboxBlankCircleLineIcon } from "@cq/tiptap/component/Icons/checkbox-blank-circle-line"
import { CheckboxCircleLineIcon } from "@cq/tiptap/component/Icons/checkbox-circle-line"
import { DeleteLineIcon } from "@cq/tiptap/component/Icons/delete-line-icon"
import { UploadIcon } from "@cq/tiptap/component/Icons/upload-icon"
import { Box, Button, IconButton, Stack, TextField } from "@mui/material"
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
  height: number
  class: string
}

const VideoViewWrapper: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected
}) => {
  const attrs = node.attrs as VideoAttributes
  const [isEditing, setIsEditing] = useState(false)
  const [editSrc, setEditSrc] = useState(attrs.src || '')
  const [editPoster, setEditPoster] = useState(attrs.poster || '')
  const [editWidth, setEditWidth] = useState(attrs.width || 600)
  const [editHeight, setEditHeight] = useState(attrs.height || 480)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setEditSrc(attrs.src || '')
    setEditPoster(attrs.poster || '')
    setEditWidth(attrs.width || 600)
    setEditHeight(attrs.height || 480)
  }, [attrs])

  const handleSave = () => {
    if (!editSrc.trim()) {
      return
    }

    updateAttributes({
      src: editSrc.trim(),
      poster: editPoster.trim() || null,
      width: editWidth,
      height: editHeight,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditSrc(attrs.src || '')
    setEditPoster(attrs.poster || '')
    setEditWidth(attrs.width || 600)
    setEditHeight(attrs.height || 480)
    setIsEditing(false)
  }

  const toggleAttribute = (attr: keyof VideoAttributes) => {
    updateAttributes({
      [attr]: !attrs[attr]
    })
  }

  if (!attrs.src && !isEditing) {
    return (
      <NodeViewWrapper
        className={`video-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
        data-drag-handle
      >
        <Box
          sx={{
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 'var(--mui-shape-borderRadius)',
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <MovieLineIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Box sx={{ color: 'text.secondary', mb: 2 }}>
            点击添加视频链接
          </Box>
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            startIcon={<ScreenshotLineIcon />}
          >
            添加视频
          </Button>
        </Box>
      </NodeViewWrapper>
    )
  }

  if (isEditing) {
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
          <Stack direction={'row'} alignItems={'center'} gap={2} sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)', width: 150, mb: 1, flexShrink: 0 }}>视频高度</Box>
            <TextField
              type="number"
              size="small"
              fullWidth
              value={editHeight}
              onChange={(e) => setEditHeight(Number(e.target.value))}
              inputProps={{ min: 150, max: 1080 }}
              sx={{ flex: 1 }}
            />
          </Stack>
          <Stack direction={'row'} alignItems={'flex-start'} gap={2} sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)', width: 150, mb: 1, flexShrink: 0 }}>视频设置</Box>
            <Stack gap={1}>
              <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => toggleAttribute('controls')} sx={{ cursor: 'pointer', width: 150 }}>
                {attrs.controls ? <CheckboxCircleLineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  : <CheckboxBlankCircleLineIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}>显示控制条</Box>
              </Stack>
              <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => toggleAttribute('autoplay')} sx={{ cursor: 'pointer', width: 150 }}>
                {attrs.autoplay ? <CheckboxCircleLineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  : <CheckboxBlankCircleLineIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}>自动播放</Box>
              </Stack>
              <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => toggleAttribute('loop')} sx={{ cursor: 'pointer', width: 150 }}>
                {attrs.loop ? <CheckboxCircleLineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  : <CheckboxBlankCircleLineIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                <Box sx={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}>循环播放</Box>
              </Stack>
              <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => toggleAttribute('muted')} sx={{ cursor: 'pointer', width: 150 }}>
                {attrs.muted ? <CheckboxCircleLineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
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
          height={attrs.height}
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block'
          }}
          onError={(e) => {
            console.error('Video load error:', e)
          }}
        />
        {selected && (
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
        )}
      </Box>
    </NodeViewWrapper>
  )
}

export default VideoViewWrapper