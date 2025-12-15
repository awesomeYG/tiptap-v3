import { FloatingPopover } from "@ctzhian/tiptap/component/FloatingPopover"
import { Box, Button, Stack, TextField } from "@mui/material"
import { Editor } from "@tiptap/react"
import React, { useState } from "react"

interface TooltipInputPopoverProps {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  editor: Editor
  currentTooltip?: string
}

const TooltipInputPopover: React.FC<TooltipInputPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  editor,
  currentTooltip = ''
}) => {
  const [tooltipText, setTooltipText] = useState(currentTooltip)

  const handleConfirm = () => {
    if (tooltipText.trim()) {
      editor.chain().focus().setTooltip(tooltipText.trim()).run()
    } else {
      editor.chain().focus().unsetTooltip().run()
    }
    onClose()
  }

  const handleCancel = () => {
    setTooltipText(currentTooltip)
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleConfirm()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      handleCancel()
    }
  }

  return (
    <FloatingPopover
      open={open}
      anchorEl={anchorEl}
      onClose={handleCancel}
      placement="bottom"
    >
      <Stack gap={2} sx={{ p: 2, width: 350 }}>
        <TextField
          fullWidth
          size="small"
          value={tooltipText}
          onChange={(e) => setTooltipText(e.target.value)}
          placeholder="输入鼠标悬停时显示的提示文本"
          required
          error={tooltipText.length > 0 && !tooltipText.trim()}
          helperText={tooltipText.length > 0 && !tooltipText.trim() ? "请输入有效的提示文本" : ""}
        />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button size="small" onClick={handleCancel}>
            取消
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleConfirm}
            disabled={!tooltipText.trim() && !currentTooltip}
          >
            {tooltipText.trim() ? '应用' : '移除'}
          </Button>
        </Box>
      </Stack>
    </FloatingPopover>
  )
}

export default TooltipInputPopover
