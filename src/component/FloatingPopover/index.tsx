import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { Paper } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

export interface FloatingPopoverProps {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  className?: string
  style?: React.CSSProperties
}

export const FloatingPopover: React.FC<FloatingPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  children,
  placement = 'bottom',
  offset: offsetValue = 8,
  className,
  style
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!open || !anchorEl || !popoverRef.current) return

    const updatePosition = () => {
      if (!popoverRef.current) return

      computePosition(anchorEl, popoverRef.current, {
        placement,
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
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose()
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

  return (
    <>
      {/* 背景遮罩 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          pointerEvents: 'none'
        }}
      />
      {/* Popover内容 */}
      <Paper
        ref={popoverRef}
        className={className}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex: 1300,
          ...style
        }}
        elevation={8}
      >
        {children}
      </Paper>
    </>
  )
}

export default FloatingPopover 