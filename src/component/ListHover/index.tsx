import {
  ArrowDownSLineIcon,
  ArrowGoForwardLineIcon,
  ArrowLeftWideLineIcon,
  DeleteLineIcon,
  FontSizeIcon,
  ListOrdered2Icon,
  ListUnorderedIcon
} from '@baizhicloud/tiptap/component/Icons'
import { Box, MenuItem, Paper, Select, Stack } from '@mui/material'
import { Editor } from '@tiptap/react'
import React, { useEffect, useRef, useState } from 'react'
import { ToolbarItem } from '../Toolbar'

interface ListHoverProps {
  editor: Editor
}

const ListHover = ({ editor }: ListHoverProps) => {
  const [hoveredList, setHoveredList] = useState<{
    element: HTMLElement
    type: 'orderedList' | 'bulletList'
    fontSize: string
  } | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fontSizeOptions = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60].map(it => it.toString())

  // 清理列表样式的工具函数
  const clearListStyle = (element: HTMLElement) => {
    element.style.outline = ''
    element.style.outlineOffset = ''
    element.style.borderRadius = ''
    element.style.transition = ''
  }

  // 处理字体大小变化
  const handleFontSizeChange = (newSize: string) => {
    if (!hoveredList) return

    if (hoveredList.type === 'orderedList') {
      editor.chain().focus().updateAttributes('orderedList', { fontSize: `${newSize}px` }).run()
    } else if (hoveredList.type === 'bulletList') {
      editor.chain().focus().updateAttributes('bulletList', { fontSize: `${newSize}px` }).run()
    }

    setHoveredList(prev => prev ? { ...prev, fontSize: newSize } : null)
  }

  // 列表类型转换
  const convertToOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run()
    // 更新悬停状态
    if (hoveredList && hoveredList.type === 'bulletList') {
      setHoveredList(prev => prev ? { ...prev, type: 'orderedList' } : null)
    }
  }

  const convertToBulletList = () => {
    editor.chain().focus().toggleBulletList().run()
    // 更新悬停状态
    if (hoveredList && hoveredList.type === 'orderedList') {
      setHoveredList(prev => prev ? { ...prev, type: 'bulletList' } : null)
    }
  }

  // 删除列表
  const removeList = () => {
    if (!hoveredList) return

    if (hoveredList.type === 'orderedList') {
      editor.chain().focus().toggleOrderedList().run()
    } else if (hoveredList.type === 'bulletList') {
      editor.chain().focus().toggleBulletList().run()
    }
    setHoveredList(null)
  }

  // 缩进控制
  const indentList = () => {
    editor.chain().focus().sinkListItem('listItem').run()
  }

  const outdentList = () => {
    editor.chain().focus().liftListItem('listItem').run()
  }

  // 监听鼠标悬停事件
  useEffect(() => {
    // 基本检查编辑器是否存在
    if (!editor || !editor.isEditable) return

    let cleanupFn: (() => void) | null = null
    let isSetup = false

    const setupListeners = () => {
      if (isSetup) return

      // 在设置函数内部安全地检查 view.dom
      try {
        if (!editor || !editor.view || !editor.view.dom) {
          return
        }
      } catch (error) {
        return
      }

      isSetup = true

      const editorElement = editor.view.dom as HTMLElement

      const handleMouseEnter = (event: MouseEvent) => {
        const target = event.target as HTMLElement

        // 查找最近的列表元素
        const listElement = target.closest('ol[data-type="orderedList"], ul[data-type="bulletList"]') as HTMLOListElement | HTMLUListElement

        if (!listElement) return

        // 检查是否已经悬停在同一个列表上
        if (hoveredList?.element === listElement) return

        // 清除之前的定时器
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        // 清除之前列表的样式
        if (hoveredList?.element && hoveredList.element !== listElement) {
          clearListStyle(hoveredList.element)
        }

        const listType = listElement.tagName === 'OL' ? 'orderedList' : 'bulletList'
        const fontSize = listElement.getAttribute('data-font-size')?.replace('px', '') ||
          getComputedStyle(listElement).fontSize.replace('px', '') || '16'

        // 计算菜单位置
        const rect = listElement.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

        setMenuPosition({
          top: rect.top + scrollTop - 50, // 在列表上方50px
          left: Math.max(10, rect.left + scrollLeft + rect.width / 2 - 210) // 菜单宽度420px的一半，但不能超出屏幕左边
        })

        setHoveredList({
          element: listElement,
          type: listType,
          fontSize
        })

        // 添加悬停样式
        listElement.style.outline = '2px solid var(--mui-palette-primary-main)'
        listElement.style.outlineOffset = '2px'
        listElement.style.borderRadius = 'var(--mui-shape-borderRadius)'
        listElement.style.transition = 'outline 0.2s ease'
      }

      const handleMouseLeave = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        const listElement = target.closest('ol, ul') as HTMLOListElement | HTMLUListElement

        if (!listElement) return

        // 设置延迟隐藏，给用户时间移动到菜单上
        timeoutRef.current = setTimeout(() => {
          if (hoveredList?.element === listElement) {
            // 移除悬停样式
            clearListStyle(listElement)

            setHoveredList(null)
            setMenuPosition(null)
          }
        }, 100)
      }

      // 使用事件委托的方式监听鼠标事件
      editorElement.addEventListener('mouseover', handleMouseEnter)
      editorElement.addEventListener('mouseout', handleMouseLeave)

      // 设置清理函数
      cleanupFn = () => {
        editorElement.removeEventListener('mouseover', handleMouseEnter)
        editorElement.removeEventListener('mouseout', handleMouseLeave)
      }
    }

    // 尝试立即设置
    setupListeners()

    // 如果立即设置失败，则使用延迟设置
    const setupTimeout = setTimeout(setupListeners, 500)

    // 监听编辑器的 update 事件，当编辑器准备好时设置监听器
    editor.on('update', setupListeners)
    editor.on('focus', setupListeners)

    return () => {
      clearTimeout(setupTimeout)
      editor.off('update', setupListeners)
      editor.off('focus', setupListeners)

      if (cleanupFn) {
        cleanupFn()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 清理样式
      if (hoveredList?.element) {
        clearListStyle(hoveredList.element)
      }
    }
  }, [editor])

  // 菜单悬停处理
  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (hoveredList) {
        // 移除悬停样式
        clearListStyle(hoveredList.element)

        setHoveredList(null)
        setMenuPosition(null)
      }
    }, 100)
  }

  if (!hoveredList || !menuPosition || !editor.isEditable) {
    return null
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
      onMouseEnter={handleMenuMouseEnter}
      onMouseLeave={handleMenuMouseLeave}
    >
      <Paper sx={{
        p: 0.5,
        borderRadius: 'var(--mui-shape-borderRadius)',
        minWidth: 420,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid var(--mui-palette-divider)'
      }}>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          {/* 列表类型转换 */}
          <ToolbarItem
            tip='转换为有序列表'
            icon={<ListOrdered2Icon sx={{ fontSize: '1rem' }} />}
            onClick={convertToOrderedList}
            className={hoveredList.type === 'orderedList' ? "tool-active" : ""}
          />
          <ToolbarItem
            tip='转换为无序列表'
            icon={<ListUnorderedIcon sx={{ fontSize: '1rem' }} />}
            onClick={convertToBulletList}
            className={hoveredList.type === 'bulletList' ? "tool-active" : ""}
          />

          {/* 分隔线 */}
          <Box sx={{
            width: '1px',
            height: '20px',
            backgroundColor: 'divider'
          }} />

          {/* 缩进控制 */}
          <ToolbarItem
            tip='减少缩进'
            icon={<ArrowLeftWideLineIcon sx={{ fontSize: '1rem' }} />}
            onClick={outdentList}
          />
          <ToolbarItem
            tip='增加缩进'
            icon={<ArrowGoForwardLineIcon sx={{ fontSize: '1rem' }} />}
            onClick={indentList}
          />

          {/* 分隔线 */}
          <Box sx={{
            width: '1px',
            height: '20px',
            backgroundColor: 'divider'
          }} />

          {/* 字体大小选择器 */}
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <FontSizeIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Select
              value={hoveredList.fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              size="small"
              sx={{
                minWidth: 60,
                '& .MuiSelect-select': {
                  padding: '4px 8px',
                  fontSize: '0.875rem',
                }
              }}
              IconComponent={({ className, ...rest }) => {
                return <ArrowDownSLineIcon
                  sx={{
                    fontSize: '0.875rem',
                    transform: className?.includes('MuiSelect-iconOpen') ? 'rotate(-180deg)' : 'none',
                    transition: 'transform 0.3s',
                  }}
                  {...rest}
                />
              }}
            >
              {fontSizeOptions.map(size => (
                <MenuItem key={size} value={size} sx={{ fontSize: '0.875rem' }}>
                  {size}px
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {/* 分隔线 */}
          <Box sx={{
            width: '1px',
            height: '20px',
            backgroundColor: 'divider'
          }} />

          {/* 删除列表 */}
          <ToolbarItem
            tip='移除列表格式'
            icon={<DeleteLineIcon sx={{ fontSize: '1rem' }} />}
            onClick={removeList}
          />
        </Stack>
      </Paper>
    </Box>
  )
}

export default ListHover
