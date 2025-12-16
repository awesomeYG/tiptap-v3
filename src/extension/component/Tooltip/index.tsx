import { EditLineIcon } from "@ctzhian/tiptap/component/Icons"
import { Box, Stack, Tooltip } from "@mui/material"
import { MarkViewContent, MarkViewProps } from "@tiptap/react"
import React, { useEffect, useRef, useState } from "react"
import EditPopover from "./EditPopover"

const TooltipView: React.FC<MarkViewProps> = ({ mark, editor }) => {
  const tooltip = mark.attrs.tooltip
  const isEditable = editor.isEditable
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  useEffect(() => {
    const isSelectionEmpty = editor.state.selection.empty
    if (isEditable && tooltip === '' && !isSelectionEmpty && anchorRef.current) {
      setOpen(true)
    }
  }, [tooltip, isEditable, anchorRef.current])

  return <>
    <Tooltip
      key={tooltip || 'empty-tooltip'}
      arrow
      placement="top"
      title={<Stack
        direction='row'
        alignItems='center'
        gap={0.5}
        maxWidth={300}
      >
        <Box component='span'>{tooltip}</Box>
        {isEditable && <EditLineIcon sx={{ fontSize: '0.75rem', cursor: 'pointer' }} onClick={handleEditClick} />}
      </Stack>}
    >
      <Box
        ref={anchorRef}
        component='span'
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