import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material"
import { Editor } from "@tiptap/core"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { FloatingPopover } from "@yu-cq/tiptap/component"
import { LinkIcon } from "@yu-cq/tiptap/component/Icons"
import React, { useEffect, useState } from "react"
import { LinkAttributes } from "."

interface InsertLinkProps extends Partial<NodeViewProps> {
  attrs: LinkAttributes
  editor: Editor
}

const InsertLink = ({ updateAttributes, deleteNode, selected, attrs, editor }: InsertLinkProps) => {
  const [title, setTitle] = useState(attrs.title || '')
  const [href, setHref] = useState(attrs.href || '')
  const [type, setType] = useState(attrs.type || 'icon')
  const [target, setTarget] = useState(attrs.target || '_blank')
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const handleShowPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClosePopover = () => setAnchorEl(null)

  const handleSave = () => {
    if (type === 'block') {
      editor.commands.setBlockLink({
        title,
        href,
        type,
        target,
      })
    } else {
      updateAttributes?.({
        title,
        href,
        type,
        target,
      })
    }
  }

  const handleDeleteLink = () => {
    deleteNode?.()
    editor.commands.insertContent(attrs.title)
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
    className={`link-wrapper ${attrs.class}`}
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
      <Stack gap={2} sx={{ p: 2, width: 350 }}>
        <Stack direction={'row'} gap={2} alignItems={'center'}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', flexShrink: 0 }}>地址</Box>
          <TextField
            fullWidth
            size="small"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="https://example.com"
            required
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
          <Stack direction={'row'} gap={2} alignItems={'flex-start'} sx={{
            '.MuiFormControlLabel-label': {
              fontSize: '0.875rem'
            }
          }}>
            <FormLabel component="legend" sx={{ fontSize: '0.875rem', flexShrink: 0 }}>风格</FormLabel>
            <RadioGroup
              row
              value={type}
              onChange={(e) => setType(e.target.value as 'text' | 'icon' | 'block')}
            >
              <FormControlLabel
                value="text"
                control={<Radio size="small" />}
                label="纯文字"
              />
              <FormControlLabel
                value="icon"
                control={<Radio size="small" />}
                label="图标文字"
              />
              <FormControlLabel
                value="block"
                control={<Radio size="small" />}
                label="卡片"
              />
            </RadioGroup>
          </Stack>
        </FormControl>
        <FormControl component="fieldset">
          <Stack direction={'row'} gap={2} alignItems={'flex-start'} sx={{
            '.MuiFormControlLabel-label': {
              fontSize: '0.875rem'
            }
          }}>
            <FormLabel component="legend" sx={{ fontSize: '0.875rem', flexShrink: 0 }}>打开</FormLabel>
            <RadioGroup
              row
              value={target}
              onChange={(e) => setTarget(e.target.value as '_blank' | '_self' | '_parent' | '_top')}
            >
              <FormControlLabel
                value="_blank"
                control={<Radio size="small" />}
                label="新窗口"
              />
              <FormControlLabel
                value="_self"
                control={<Radio size="small" />}
                label="当前窗口"
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