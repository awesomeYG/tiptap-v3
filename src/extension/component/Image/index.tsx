import { Box, Button, IconButton, Stack, TextField, Tooltip } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { FloatingPopover } from "@yu-cq/tiptap/component"
import { CustomSizeIcon, DeleteLineIcon, EditBoxLineIcon } from "@yu-cq/tiptap/component/Icons"
import { EditorFnProps } from "@yu-cq/tiptap/type"
import React, { useEffect, useRef, useState } from "react"
import CropImage from "./Crop"
import InsertImage from "./Insert"
import ReadonlyImage from "./Readonly"

export interface ImageAttributes {
  src: string
  width: number
}

// 图片尺寸缓存，避免重复加载
export const imageDimensionsCache = new Map<string, { width: number; height: number }>()

// 获取图片尺寸的函数（带缓存）
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  // 检查缓存
  if (imageDimensionsCache.has(src)) {
    return Promise.resolve(imageDimensionsCache.get(src)!)
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
      // 缓存结果
      imageDimensionsCache.set(src, dimensions)
      resolve(dimensions)
    }
    img.onerror = () => {
      reject(new Error('无法加载图片'))
    }
    img.src = src
  })
}

// 从文件获取图片尺寸（避免重复加载）
export const getImageDimensionsFromFile = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
      img.onerror = () => {
        reject(new Error('无法读取图片文件'))
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      reject(new Error('无法读取文件'))
    }
    reader.readAsDataURL(file)
  })
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
  const [editSrc, setEditSrc] = useState(attrs.src)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
  const handleClosePopover = () => setAnchorEl(null)

  // 获取当前实际显示的图片宽度
  const getCurrentDisplayWidth = (): number => {
    if (!imageRef.current) return attrs.width

    // 获取图片的实际显示宽度（考虑 maxWidth: 100% 的限制）
    const computedStyle = window.getComputedStyle(imageRef.current)
    const displayWidth = imageRef.current.offsetWidth

    // 如果图片被 CSS 限制为 100%，则使用容器宽度
    if (computedStyle.maxWidth === '100%' && displayWidth < attrs.width) {
      return displayWidth
    }

    return attrs.width
  }

  // 自动获取图片尺寸并设置
  useEffect(() => {
    // 当有 src 但没有 width 时，自动获取图片尺寸
    if (attrs.src && (!attrs.width || attrs.width <= 0)) {
      getImageDimensions(attrs.src)
        .then(dimensions => {
          updateAttributes({
            src: attrs.src,
            width: dimensions.width
          })
        })
        .catch(error => {
          console.warn('无法获取图片尺寸，使用默认宽度:', error)
          // 如果无法获取尺寸，设置默认宽度
          updateAttributes({
            src: attrs.src,
            width: 400 // 默认宽度
          })
        })
    }
  }, [attrs.src, attrs.width, updateAttributes])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStartX(e.clientX)
    // 使用当前实际显示的宽度作为拖拽起始点
    setDragStartWidth(getCurrentDisplayWidth())
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

  const handleSave = () => {
    if (editSrc.trim()) {
      const currentWidth = getCurrentDisplayWidth()
      updateAttributes({
        src: editSrc.trim(),
        width: currentWidth,
        error: true,
      })
      setEditSrc(editSrc.trim())
    }
    handleClosePopover()
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
    return <ReadonlyImage attrs={attrs} />
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
        {(isHovering || !!anchorEl) && <Box
          className="image-controls"
          sx={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            display: 'flex',
            gap: '0.25rem',
          }}
        >
          <Tooltip arrow title="更换图片地址">
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
      <FloatingPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        placement="bottom"
      >
        <Stack sx={{ p: 2, width: 350 }}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: '1.5', mb: 1 }}>图片地址</Box>
          <TextField
            fullWidth
            size="small"
            value={editSrc}
            onChange={(e) => setEditSrc(e.target.value)}
            placeholder="输入图片的 URL"
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

export default ImageViewWrapper