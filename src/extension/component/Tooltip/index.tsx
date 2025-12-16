import { EditLineIcon } from "@ctzhian/tiptap/component/Icons"
import { Box, Stack, Tooltip } from "@mui/material"
import { MarkViewContent, MarkViewProps } from "@tiptap/react"
import React, { useEffect, useRef, useState } from "react"
import EditPopover from "./EditPopover"

const TooltipView: React.FC<MarkViewProps> = ({ mark, editor }) => {
  const tooltip = mark.attrs.tooltip
  const isEditable = editor.isEditable
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleTooltipToggleMobile = () => {
    if (!isEditable && isMobile) {
      setTooltipOpen((prev) => !prev)
    }
  }

  const handleTooltipOpen = () => {
    if (isEditable || !isMobile) {
      setTooltipOpen(true)
    }
  }

  const handleTooltipClose = () => {
    setTooltipOpen(false)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches
      const ua = navigator.userAgent || ''
      const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      setIsMobile(isCoarsePointer || isTouchDevice)
    }
  }, [])

  useEffect(() => {
    const isSelectionEmpty = editor.state.selection.empty
    if (isEditable && tooltip === '' && !isSelectionEmpty && anchorRef.current) {
      setOpen(true)
    }
  }, [tooltip, isEditable, anchorRef.current])

  const isMobileReadonly = !isEditable && isMobile

  return <>
    <Tooltip
      arrow
      open={tooltipOpen}
      onOpen={handleTooltipOpen}
      onClose={handleTooltipClose}
      disableHoverListener={isMobileReadonly}
      disableFocusListener={isMobileReadonly}
      disableTouchListener={isMobileReadonly}
      placement="top"
      title={
        isMobileReadonly
          ? <Box component='span' sx={{ maxWidth: 300 }}>{tooltip}</Box>
          : <Stack
            direction='row'
            alignItems='center'
            gap={0.5}
            maxWidth={300}
          >
            <Box component='span'>{tooltip}</Box>
            {isEditable && <EditLineIcon sx={{ fontSize: '0.75rem', cursor: 'pointer' }} onClick={handleEditClick} />}
          </Stack>
      }
    >
      <Box
        ref={anchorRef}
        component='span'
        onClick={isMobileReadonly ? handleTooltipToggleMobile : undefined}
        sx={{
          borderBottom: '1px dotted',
          borderColor: 'text.secondary',
        }}>
        <MarkViewContent />
      </Box >
    </Tooltip>
    {isEditable && (
      <EditPopover
        open={open}
        editor={editor}
        text={tooltip || ''}
        anchorEl={anchorRef.current}
        onClose={handleClose}
      />
    )}
  </>
}

export default TooltipView