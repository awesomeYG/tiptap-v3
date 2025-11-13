import { DeleteLineIcon, EditLineIcon } from "@ctzhian/tiptap/component/Icons"
import { ToolbarItem } from "@ctzhian/tiptap/component/Toolbar"
import { EditorFnProps } from "@ctzhian/tiptap/type"
import { alpha, Box, Stack, useTheme } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useCallback, useEffect, useRef, useState } from "react"
import { HoverPopover } from "../../../component/HoverPopover"
import EditFlow from "./Edit"
import InsertFlow from "./Insert"
import ReadonlyFlow from "./Readonly"
import { useMermaidRender } from "./useMermaidRender"

export interface FlowAttributes {
  code: string
  width?: string | number
}

const FlowViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
  onError
}) => {
  const attrs = node.attrs as FlowAttributes
  const theme = useTheme()
  const [isHovering, setIsHovering] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragCorner, setDragCorner] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null>(null)
  const dragStartXRef = useRef(0)
  const dragStartWidthRef = useRef(0)
  const flowWrapperRef = useRef<HTMLDivElement>(null)
  const flowContentRef = useRef<HTMLDivElement>(null)

  // 获取当前实际显示的流程图宽度
  const getCurrentDisplayWidth = (): number => {
    if (flowWrapperRef.current) {
      return flowWrapperRef.current.offsetWidth
    }
    // 如果 ref 不存在，使用容器宽度计算
    const containerWidth = 800
    return getPixelValue(attrs.width, containerWidth)
  }

  // 将 width 转换为像素值
  const getPixelValue = (value: string | number | undefined, containerSize: number, defaultPercent: number = 100): number => {
    if (!value) return containerSize * (defaultPercent / 100)
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      if (value.endsWith('%')) {
        const percent = parseFloat(value)
        return containerSize * (percent / 100)
      }
      if (value.endsWith('px')) {
        return parseFloat(value)
      }
      return parseFloat(value) || containerSize * (defaultPercent / 100)
    }
    return containerSize * (defaultPercent / 100)
  }

  // 将像素值转换回字符串格式
  const formatValue = (pixels: number, original: string | number | undefined): string | number => {
    if (typeof original === 'string' && original.endsWith('%')) {
      // 如果原来是百分比，保持百分比格式
      const containerWidth = flowWrapperRef.current?.parentElement?.clientWidth || 800
      const percent = Math.round((pixels / containerWidth) * 100)
      return `${percent}%`
    }
    return Math.round(pixels)
  }

  const handleMouseDown = (e: React.MouseEvent, corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragCorner(corner)
    dragStartXRef.current = e.clientX
    dragStartWidthRef.current = getCurrentDisplayWidth()
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragCorner) return
    const deltaX = e.clientX - dragStartXRef.current
    let newWidth: number

    // 根据不同的角计算宽度变化
    if (dragCorner === 'top-right' || dragCorner === 'bottom-right') {
      // 右侧角：向右拉伸，宽度增加
      newWidth = dragStartWidthRef.current + deltaX
    } else {
      // 左侧角：向左拉伸，宽度增加（deltaX 为负时宽度增加）
      newWidth = dragStartWidthRef.current - deltaX
    }

    newWidth = Math.max(200, Math.min(1920, newWidth))
    updateAttributes({
      width: formatValue(newWidth, attrs.width),
      code: attrs.code,
    })
  }, [isDragging, dragCorner, attrs.width, updateAttributes])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragCorner(null)
  }, [])

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

  const handleShowPopover = () => setIsEditing(true)

  if (!editor.isEditable) {
    return <ReadonlyFlow attrs={attrs} onError={onError} />
  }

  if (!attrs.code || attrs.code.trim() === '') {
    return <InsertFlow updateAttributes={updateAttributes} />
  }

  return (
    <NodeViewWrapper
      className={`flow-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
    >
      <Box
        ref={flowContentRef}
        sx={{
          position: 'relative',
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Box
          ref={flowWrapperRef}
          sx={{
            position: 'relative',
            border: '2px solid',
            borderColor: (isHovering || isDragging) ? alpha(theme.palette.primary.main, 0.3) : 'transparent',
            borderRadius: 'var(--mui-shape-borderRadius)',
            bgcolor: 'background.paper',
            width: attrs.width || '100%',
            height: 'auto',
            transition: 'border-color 0.2s ease',
          }}
        >
          <HoverPopover
            style={{
              width: '100%',
            }}
            actions={
              <Stack
                direction={'row'}
                alignItems={'center'}
                sx={{ p: 0.5 }}
              >
                <ToolbarItem
                  icon={<EditLineIcon sx={{ fontSize: '1rem' }} />}
                  tip="编辑流程图"
                  onClick={handleShowPopover}
                />
                <ToolbarItem
                  icon={<DeleteLineIcon sx={{ fontSize: '1rem' }} />}
                  tip="删除流程图"
                  onClick={deleteNode}
                />
              </Stack>
            }
            placement="top"
            offset={4}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                borderRadius: 'var(--mui-shape-borderRadius)',
              }}
            >
              <FlowDiagram key={attrs.code} code={attrs.code} onError={onError} />
            </Box>
            {(isHovering || isDragging) && !isEditing && (
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
                    zIndex: 10
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
                    zIndex: 10
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
                    zIndex: 10
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
                    zIndex: 10
                  }}
                />
              </>
            )}
          </HoverPopover>
        </Box>
      </Box>
      {isEditing && (
        <EditFlow
          anchorEl={flowContentRef.current}
          attrs={attrs}
          updateAttributes={(newAttrs) => {
            updateAttributes(newAttrs)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </NodeViewWrapper>
  )
}

interface FlowDiagramProps {
  code: string
  onError?: (error: Error) => void
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({ code, onError }) => {
  const { svgContent, error, loading } = useMermaidRender({
    code,
    onError,
    showLoading: true,
    idPrefix: 'mermaid',
  })

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: loading ? '100px' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
          maxWidth: '100%',
          height: 'auto',
        }
      }}
    >
      {loading && !error && (
        <Box sx={{ color: 'text.secondary', fontSize: '14px' }}>正在渲染...</Box>
      )}
      {error && (
        <Box sx={{ color: 'error.main', padding: '20px', textAlign: 'center', fontSize: '14px' }}>
          {error}
        </Box>
      )}
      {svgContent && !error && (
        <Box
          dangerouslySetInnerHTML={{ __html: svgContent }}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}
    </Box>
  )
}

export default FlowViewWrapper

