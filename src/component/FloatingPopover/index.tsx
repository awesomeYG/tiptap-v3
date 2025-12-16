import { autoUpdate, computePosition, flip, offset, Placement, shift, Strategy, VirtualElement } from '@floating-ui/dom'
import { Paper } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface FloatingPopoverProps {
  open: boolean
  anchorEl: HTMLElement | VirtualElement | null
  onClose: () => void
  children: React.ReactNode
  strategy?: Strategy
  placement?: Placement
  offset?: number
  className?: string
  style?: React.CSSProperties
  onMouseEnter?: (event: React.MouseEvent) => void
  onMouseLeave?: (event: React.MouseEvent) => void
}

export const FloatingPopover: React.FC<FloatingPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  children,
  strategy = 'absolute',
  placement = 'bottom',
  offset: offsetValue = 8,
  className,
  style,
  onMouseEnter,
  onMouseLeave
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!open || !anchorEl || !popoverRef.current) return

    const updatePosition = () => {
      if (!popoverRef.current) return

      computePosition(anchorEl, popoverRef.current, {
        placement,
        strategy,
        middleware: [
          offset(offsetValue),
          flip(),
          shift({ padding: 8 }),
        ],
      }).then(({ x, y }) => {
        setPosition({ x, y })
      })
    }

    // 立即更新位置
    updatePosition()

    // 设置自动更新
    const cleanup = autoUpdate(anchorEl, popoverRef.current, updatePosition)

    return cleanup
  }, [open, anchorEl, placement, offsetValue])

  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        // 仅当锚点为真实元素时，才检测是否点击在锚点上
        const isHitAnchor = (anchorEl instanceof HTMLElement) && anchorEl.contains(event.target as Node)
        if (!isHitAnchor) {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose, anchorEl])

  if (!open) return null

  return createPortal(
    <>
      {/* 背景遮罩 */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5000,
          pointerEvents: 'none'
        }}
      />
      {/* Popover内容 */}
      <Paper
        ref={popoverRef}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-hidden={false}
        style={{
          position: strategy,
          left: position.x,
          top: position.y,
          zIndex: 1300,
          boxShadow: 'var(--mui-shadows-1)',
          borderRadius: 'var(--mui-shape-borderRadius)',
          opacity: (position.x === 0 && position.y === 0) ? 0 : 1,
          ...style
        }}
        elevation={8}
      >
        {children}
      </Paper>
    </>,
    document.body
  )
}

export default FloatingPopover 