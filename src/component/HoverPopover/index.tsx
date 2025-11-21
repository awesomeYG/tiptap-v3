import { FloatingPopover } from "@ctzhian/tiptap/component"
import React, { ReactNode, useEffect, useRef, useState } from "react"

export interface HoverPopoverProps {
  /** 被包裹的触发元素 */
  children: ReactNode
  /** Popover 内部展示的内容 */
  actions: ReactNode
  /** hover 延迟时间（毫秒），默认 500ms */
  hoverDelay?: number
  /** 关闭延迟时间（毫秒），默认 300ms */
  closeDelay?: number
  /** Popover 位置，默认 'top' */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Popover 与触发元素的距离（像素），默认 4 */
  offset?: number
  /** 是否禁用 hover 效果 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
  /** 样式对象 */
  style?: React.CSSProperties
  /** 是否保持打开状态（用于点击 action 按钮触发弹框时保持打开） */
  keepOpen?: boolean
}

/**
 * HoverPopover 组件
 * 
 * 当鼠标悬停在 children 上超过指定时间后，显示 popover
 * 支持鼠标移到 popover 上时保持打开状态
 */
export const HoverPopover: React.FC<HoverPopoverProps> = ({
  children,
  actions,
  hoverDelay = 500,
  closeDelay = 300,
  placement = 'top',
  offset = 4,
  disabled = false,
  className,
  style,
  keepOpen = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const childRef = useRef<HTMLDivElement>(null)

  // 当 keepOpen 为 true 时，确保 anchorEl 不为 null
  useEffect(() => {
    if (keepOpen && !anchorEl && childRef.current) {
      setAnchorEl(childRef.current)
    }
  }, [keepOpen, anchorEl])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      return
    }


    // 清除关闭定时器
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    // 清除之前的 hover 定时器
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }

    // 保存 currentTarget 引用，因为 React 事件对象会被重用
    const target = event.currentTarget as HTMLElement
    const timer = setTimeout(() => {
      setAnchorEl(target)
      hoverTimerRef.current = null
    }, hoverDelay)
    hoverTimerRef.current = timer
  }

  const handleMouseLeave = () => {
    if (disabled || keepOpen) {
      return
    }

    // 清除 hover 定时器
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }

    // 清除之前的关闭定时器
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }

    // 延迟关闭 popover
    const timer = setTimeout(() => {
      setAnchorEl(null)
      closeTimerRef.current = null
    }, closeDelay)
    closeTimerRef.current = timer
  }

  const handlePopoverMouseEnter = (event: React.MouseEvent) => {
    event.stopPropagation();

    // 鼠标进入 popover，取消关闭
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const handlePopoverMouseLeave = (event: React.MouseEvent) => {
    event.stopPropagation();

    // 如果 keepOpen 为 true，不关闭
    if (keepOpen) {
      return
    }

    // 鼠标离开 popover，延迟关闭
    handleMouseLeave()
  }

  const handleForceClose = () => {
    // 如果 keepOpen 为 true，不关闭
    if (keepOpen) {
      return
    }

    // 强制关闭，清除所有定时器
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setAnchorEl(null)
  }

  return (
    <>
      <div
        ref={childRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hover-popover-child ${className || ''}`}
        style={style}
      >
        {children}
      </div>
      <FloatingPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleForceClose}
        placement={placement}
        offset={offset}
        onMouseEnter={handlePopoverMouseEnter}
        onMouseLeave={handlePopoverMouseLeave}
      >
        {actions}
      </FloatingPopover>
    </>
  )
}

export default HoverPopover

