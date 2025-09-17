import { FloatingPopover } from "@ctzhian/tiptap/component/FloatingPopover"
import { WindowFillIcon } from "@ctzhian/tiptap/component/Icons"
import { EditorFnProps } from "@ctzhian/tiptap/type"
import { Box, Button, Stack, TextField } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import React, { useState } from "react"

export type IframeAttributes = {
  src: string
  width: number
  height: number
}

type InsertIframeProps = {
  selected: boolean
  attrs: IframeAttributes
  updateAttributes: (attrs: IframeAttributes) => void
} & EditorFnProps

const InsertIframe = ({ selected, attrs, updateAttributes }: InsertIframeProps) => {
  const [editUrl, setEditUrl] = useState(attrs.src || '')
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const handleShowPopover = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget)
  const handleClosePopover = () => setAnchorEl(null)

  const handleInsert = () => {
    if (!editUrl.trim()) return
    updateAttributes({
      src: editUrl.trim(),
      width: attrs.width,
      height: attrs.height,
    })
    handleClosePopover()
  }

  return <NodeViewWrapper className={`iframe-wrapper`} data-drag-handle>
    <Stack
      direction={'row'}
      alignItems={'center'}
      gap={2}
      onClick={handleShowPopover}
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 'var(--mui-shape-borderRadius)',
        px: 2,
        py: 1.5,
        minWidth: 200,
        textAlign: 'center',
        color: 'text.secondary',
        bgcolor: 'action.default',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover'
        },
        '&:active': {
          bgcolor: 'action.selected',
        },
      }}
    >
      <WindowFillIcon sx={{ fontSize: '1rem', position: 'relative', flexShrink: 0 }} />
      <Box sx={{ fontSize: '0.875rem', position: 'relative', flexGrow: 1, textAlign: 'left' }}>
        点击此处嵌入 iframe
      </Box>
    </Stack>
    <FloatingPopover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      placement="bottom"
    >
      <Stack gap={2} sx={{ p: 2, width: 350 }}>
        <TextField
          fullWidth
          size="small"
          value={editUrl}
          onChange={(e) => setEditUrl(e.target.value)}
          placeholder="输入要嵌入的 URL"
        />
        <Stack direction={'row'} gap={1}>
          <Button variant="outlined" fullWidth onClick={handleClosePopover}>取消</Button>
          <Button variant="contained" fullWidth onClick={handleInsert}>嵌入</Button>
        </Stack>
      </Stack>
    </FloatingPopover>
  </NodeViewWrapper>
}

export default InsertIframe


