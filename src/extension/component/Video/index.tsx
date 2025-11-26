import { ActionDropdown, FloatingPopover, HoverPopover } from "@ctzhian/tiptap/component"
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, DeleteLineIcon, DownloadLineIcon, EditLineIcon } from "@ctzhian/tiptap/component/Icons"
import { ToolbarItem } from "@ctzhian/tiptap/component/Toolbar"
import { EditorFnProps } from "@ctzhian/tiptap/type"
import { alpha, Box, Button, Divider, Stack, TextField, useTheme } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useCallback, useEffect, useRef, useState } from "react"
import InsertVideo from "./Insert"
import ReadonlyVideo from "./Readonly"

export interface VideoAttributes {
  src: string
  width?: number | string | null
  controls: boolean
  autoplay: boolean
  loop: boolean
  muted: boolean
  poster: string | null
  align: 'left' | 'center' | 'right' | null
}

const VideoViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
  onUpload,
  onError,
  onValidateUrl
}) => {
  const attrs = node.attrs as VideoAttributes
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContentRef = useRef<HTMLDivElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const theme = useTheme()

  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [dragCorner, setDragCorner] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null>(null)
  const dragStartXRef = useRef(0)
  const dragStartWidthRef = useRef(0)
  const maxWidthRef = useRef(0)
  const [editSrc, setEditSrc] = useState(attrs.src)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [keepHoverPopoverOpen, setKeepHoverPopoverOpen] = useState(false)

  const handleShowPopover = () => {
    setKeepHoverPopoverOpen(true)
    setAnchorEl(editButtonRef.current)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
    setKeepHoverPopoverOpen(false)
  }


  const isPercentWidth = (): boolean => {
    if (!attrs.width) return true
    if (typeof attrs.width === 'string' && attrs.width.endsWith('%')) {
      return true
    }
    return false
  }


  const getCurrentWidthPercent = (): string => {
    if (isPercentWidth()) {
      if (!attrs.width) return '100'
      if (typeof attrs.width === 'string' && attrs.width.endsWith('%')) {
        return attrs.width.replace('%', '')
      }
      return '100'
    }
    return 'pixel'
  }

  const getCurrentDisplayWidth = (): number => {
    if (!videoRef.current) {
      return getEditorWidth()
    }
    const computedStyle = window.getComputedStyle(videoRef.current)
    const displayWidth = videoRef.current.offsetWidth


    if (typeof attrs.width === 'string' && attrs.width.endsWith('%')) {
      return displayWidth
    }


    if (typeof attrs.width === 'number') {
      if (computedStyle.maxWidth === '100%' && displayWidth < attrs.width) {
        return displayWidth
      }
      return attrs.width
    }
    return getEditorWidth()
  }

  const getEditorWidth = (): number => {
    if (videoContentRef.current) {
      let current: HTMLElement | null = videoContentRef.current
      while (current) {
        if (current.classList?.contains('node-video')) {
          const style = window.getComputedStyle(current)
          const paddingLeft = parseFloat(style.paddingLeft) || 0
          const paddingRight = parseFloat(style.paddingRight) || 0

          return current.clientWidth - paddingLeft - paddingRight
        }
        current = current.parentElement
      }
    }
    if (editor?.view?.dom) {
      const editorElement = editor.view.dom as HTMLElement
      const style = window.getComputedStyle(editorElement)
      const paddingLeft = parseFloat(style.paddingLeft) || 0
      const paddingRight = parseFloat(style.paddingRight) || 0
      const editorWidth = editorElement.clientWidth - paddingLeft - paddingRight
      if (editorWidth > 0) {
        return editorWidth
      }
    }
    return 800
  }

  const handleMouseDown = (e: React.MouseEvent, corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragCorner(corner)
    dragStartXRef.current = e.clientX
    const width = getCurrentDisplayWidth()
    dragStartWidthRef.current = width
    maxWidthRef.current = getEditorWidth()
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragCorner) return
    const deltaX = e.clientX - dragStartXRef.current
    let newWidth: number
    if (dragCorner === 'top-right' || dragCorner === 'bottom-right') {
      newWidth = dragStartWidthRef.current + deltaX
    } else {
      newWidth = dragStartWidthRef.current - deltaX
    }

    newWidth = Math.max(200, Math.min(maxWidthRef.current, newWidth))
    updateAttributes({
      width: newWidth
    })
  }, [isDragging, dragCorner, updateAttributes])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragCorner(null)
  }, [])

  useEffect(() => {
    setEditSrc(attrs.src)
  }, [attrs.src])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleSave = async () => {
    if (editSrc.trim()) {
      try {
        let validatedUrl = editSrc.trim()
        if (onValidateUrl) {
          validatedUrl = await Promise.resolve(onValidateUrl(validatedUrl, 'video'))
        }
        updateAttributes({
          src: validatedUrl,
          width: attrs.width,
          controls: attrs.controls,
          autoplay: attrs.autoplay,
          loop: attrs.loop,
          muted: attrs.muted,
          poster: attrs.poster,
          align: attrs.align,
        })
        setEditSrc(validatedUrl)
      } catch (error) {
        onError?.(error as Error)
      }
    }
    handleClosePopover()
  }

  if (!attrs.src && !editor.isEditable) {
    return null
  }

  if (!editor.isEditable) {
    return <ReadonlyVideo attrs={attrs} onError={onError} />
  }

  if (!attrs.src) {
    return <InsertVideo selected={selected} attrs={attrs} updateAttributes={updateAttributes} onUpload={onUpload} onError={onError} onValidateUrl={onValidateUrl} />
  }

  return (
    <NodeViewWrapper
      className={`video-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
    >
      <Box sx={{
        backgroundColor: 'transparent !important',
        textAlign: attrs.align || undefined,
      }}>
        <HoverPopover
          keepOpen={keepHoverPopoverOpen}
          placement="top"
          offset={4}
          actions={
            <Stack
              direction={'row'}
              alignItems={'center'}
              sx={{ p: 0.5 }}
            >
              <ToolbarItem
                ref={editButtonRef}
                icon={<EditLineIcon sx={{ fontSize: '1rem' }} />}
                tip="更换视频链接"
                onClick={handleShowPopover}
              />
              <ToolbarItem
                icon={<DownloadLineIcon sx={{ fontSize: '1rem' }} />}
                tip='下载视频'
                onClick={() => {
                  const video = document.createElement('a')
                  video.href = attrs.src
                  video.target = '_blank'
                  video.download = attrs.src.split('/').pop() || 'video.mp4'
                  document.body.appendChild(video)
                  video.click()
                  document.body.removeChild(video)
                }}
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'divider' }}
              />
              <ToolbarItem
                icon={<AlignLeftIcon sx={{ fontSize: '1rem' }} />}
                tip="左侧对齐"
                className={attrs.align === 'left' ? 'tool-active' : ''}
                onClick={() => updateAttributes({ align: attrs.align === 'left' ? null : 'left' })}
              />
              <ToolbarItem
                icon={<AlignCenterIcon sx={{ fontSize: '1rem' }} />}
                tip="居中对齐"
                className={attrs.align === 'center' ? 'tool-active' : ''}
                onClick={() => updateAttributes({ align: attrs.align === 'center' ? null : 'center' })}
              />
              <ToolbarItem
                icon={<AlignRightIcon sx={{ fontSize: '1rem' }} />}
                tip="右侧对齐"
                className={attrs.align === 'right' ? 'tool-active' : ''}
                onClick={() => updateAttributes({ align: attrs.align === 'right' ? null : 'right' })}
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'divider' }}
              />
              <ActionDropdown
                id='video-width-dropdown'
                selected={getCurrentWidthPercent()}
                defaultDisplay={
                  !isPercentWidth() ? {
                    label: '固定宽度',
                  } : undefined
                }
                list={[
                  {
                    key: '50',
                    label: '自适应宽度（50%）',
                    onClick: () => updateAttributes({ width: '50%' }),
                  },
                  {
                    key: '75',
                    label: '自适应宽度（75%）',
                    onClick: () => updateAttributes({ width: '75%' }),
                  },
                  {
                    key: '100',
                    label: '自适应宽度（100%）',
                    onClick: () => updateAttributes({ width: '100%' }),
                  },
                ]}
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'divider' }}
              />
              <ToolbarItem
                icon={<DeleteLineIcon sx={{ fontSize: '1rem' }} />}
                tip="删除视频"
                onClick={deleteNode}
              />
            </Stack>
          }
          style={{
            display: 'inline-block',
            ...(typeof attrs.width === 'string' && attrs.width.endsWith('%')
              ? { width: attrs.width }
              : {}),
          }}
        >
          <Box
            ref={videoContentRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            sx={{
              position: 'relative',
            }}
          >
            <video
              ref={videoRef}
              src={attrs.src}
              width={typeof attrs.width === 'number' ? attrs.width : undefined}
              style={{
                width: typeof attrs.width === 'string' && attrs.width.endsWith('%') ? '100%' : undefined,
                maxWidth: '100%',
                height: 'auto',
                cursor: isDragging ? 'default' : 'pointer',
                border: '2px solid',
                borderColor: (isHovering || isDragging) ? alpha(theme.palette.primary.main, 0.3) : 'transparent',
                display: 'block',
              }}
              poster={attrs.poster || undefined}
              controls={attrs.controls}
              autoPlay={attrs.autoplay}
              loop={attrs.loop}
              muted={attrs.muted}
              onError={(e) => {
                onError?.(e as unknown as Error)
              }}
            />
            {(isHovering || isDragging) && (
              <>
                {/* 左上角 */}
                <Box
                  onMouseDown={(e) => handleMouseDown(e, 'top-left')}
                  sx={{
                    position: 'absolute',
                    left: -4,
                    top: -4,
                    width: 12,
                    height: 12,
                    bgcolor: 'background.default',
                    cursor: 'nwse-resize',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: (isDragging && dragCorner === 'top-left') ? 'primary.main' : alpha(theme.palette.primary.main, 0.3),
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                />
                {/* 右上角 */}
                <Box
                  onMouseDown={(e) => handleMouseDown(e, 'top-right')}
                  sx={{
                    position: 'absolute',
                    right: -4,
                    top: -4,
                    width: 12,
                    height: 12,
                    bgcolor: 'background.default',
                    cursor: 'nesw-resize',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: (isDragging && dragCorner === 'top-right') ? 'primary.main' : alpha(theme.palette.primary.main, 0.3),
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                />
                {/* 左下角 */}
                <Box
                  onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
                  sx={{
                    position: 'absolute',
                    left: -4,
                    bottom: -2,
                    width: 12,
                    height: 12,
                    cursor: 'nesw-resize',
                    borderRadius: '50%',
                    border: '2px solid',
                    bgcolor: 'background.default',
                    borderColor: (isDragging && dragCorner === 'bottom-left') ? 'primary.main' : alpha(theme.palette.primary.main, 0.3),
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                />
                {/* 右下角 */}
                <Box
                  onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
                  sx={{
                    position: 'absolute',
                    right: -4,
                    bottom: -2,
                    width: 12,
                    height: 12,
                    bgcolor: 'background.default',
                    cursor: 'nwse-resize',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: (isDragging && dragCorner === 'bottom-right') ? 'primary.main' : alpha(theme.palette.primary.main, 0.3),
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                />
              </>
            )}
          </Box>
        </HoverPopover>
      </Box>
      <FloatingPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        placement="bottom"
      >
        <Stack sx={{ p: 2, width: 350 }}>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: '1.5', mb: 1 }}>视频地址</Box>
          <TextField
            fullWidth
            size="small"
            value={editSrc}
            onChange={(e) => setEditSrc(e.target.value)}
            placeholder="输入视频的 URL"
          />
          <Stack direction={'row'} gap={1} alignItems={'center'} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={handleClosePopover}
            >
              取消
            </Button>
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleSave}
              disabled={!editSrc.trim()}
            >
              保存
            </Button>
          </Stack>
        </Stack>
      </FloatingPopover>
    </NodeViewWrapper>
  )
}

export default VideoViewWrapper
