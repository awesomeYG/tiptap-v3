import { FloatingPopover } from "@cq/tiptap/component"
import { LinkIcon } from "@cq/tiptap/component/Icons"
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import React, { useEffect, useState } from "react"
import { ALinkAttributes } from "."

interface InsertLinkProps extends Partial<NodeViewProps> {
  attrs: ALinkAttributes
}

const InsertLink = ({ updateAttributes, deleteNode, selected, attrs }: InsertLinkProps) => {
  const [title, setTitle] = useState(attrs.title)
  const [href, setHref] = useState(attrs.href)
  const [type, setType] = useState(attrs.type || 'icon')
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const handleShowPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClosePopover = () => setAnchorEl(null)

  const handleSave = () => {
    updateAttributes?.({
      title,
      href,
      type,
    })
  }

  const handleDeleteLink = () => {
    deleteNode?.()
  }

  useEffect(() => {
    if (!attrs.href && attrs.title && !anchorEl) {
      setTimeout(() => {
        const insertLinkBox = document.getElementById('insert-link-box')
        if (insertLinkBox) {
          insertLinkBox.click()
        }
      }, 100)
    }
  }, [])

  return <NodeViewWrapper
    className={`link-wrapper ${attrs.class} ${selected ? 'ProseMirror-selectednode' : ''}`}
    data-drag-handle
    as={'span'}
  >
    <Box
      id="insert-link-box"
      component="span"
      onClick={handleShowPopover}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 'var(--mui-shape-borderRadius)',
        px: 2,
        py: 1.5,
        fontSize: 14,
        color: 'text.secondary',
        bgcolor: 'action.default',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover'
        },
        '&:active': {
          bgcolor: 'action.selected',
        },
        transition: 'background-color 0.2s ease',
      }}>
      <LinkIcon sx={{ fontSize: '1rem', flexShrink: 0 }} />
      <Box component={'span'}>添加{title ? `“${title}”` : ''}链接</Box>
    </Box>
    <FloatingPopover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      placement="bottom"
    >
      <Stack gap={2} sx={{ p: 2, width: 320 }}>
        <Stack direction={'row'} gap={2} alignItems={'center'}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', flexShrink: 0 }}>地址</Box>
          <TextField
            fullWidth
            size="small"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="https://example.com"
            required
            autoFocus
            error={href.length > 0 && !href.trim()}
            helperText={href.length > 0 && !href.trim() ? "请输入有效的链接地址" : ""}
          />
        </Stack>
        <Stack direction={'row'} gap={2} alignItems={'center'}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', flexShrink: 0 }}>标题</Box>
          <TextField
            fullWidth
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="链接标题（可选）"
          />
        </Stack>
        <FormControl component="fieldset">
          <Stack direction={'row'} gap={2} alignItems={'center'} sx={{
            '.MuiFormControlLabel-label': {
              fontSize: '0.875rem'
            }
          }}>
            <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>风格</FormLabel>
            <RadioGroup
              row
              value={type}
              onChange={(e) => setType(e.target.value as 'icon' | 'block')}
            >
              <FormControlLabel
                value="icon"
                control={<Radio size="small" />}
                label="图标文字链接"
              />
              <FormControlLabel
                value="block"
                control={<Radio size="small" />}
                label="卡片链接"
              />
            </RadioGroup>
          </Stack>
        </FormControl>
        <Stack direction="row" gap={1}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={handleDeleteLink}
          >
            取消链接
          </Button>
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={handleSave}
            disabled={!href.trim()}
          >
            插入链接
          </Button>
        </Stack>
      </Stack>
    </FloatingPopover>
  </NodeViewWrapper>
}

export default InsertLink