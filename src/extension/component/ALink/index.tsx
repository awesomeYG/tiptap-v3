import { FloatingPopover } from "@cq/tiptap/component"
import { CarouselViewIcon, CopyIcon, EditBoxLineIcon, LinkIcon, LinkUnlinkIcon, ScrollToBottomLineIcon, ShareBoxLineIcon, TextIcon } from "@cq/tiptap/component/Icons"
import ToolItem from "@cq/tiptap/component/ToolItem"
import { Avatar, Box, Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import React, { useCallback, useEffect, useState } from "react"
import InsertLink from "./Insert"
import ReadonlyLink from "./Readonly"

export interface ALinkAttributes {
  href: string
  target: string
  class: string
  title: string
  rel: string
  type: string
}

const ALinkViewWrapper: React.FC<NodeViewProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const attrs = node.attrs as ALinkAttributes
  const [title, setTitle] = useState(attrs.title)
  const [href, setHref] = useState(attrs.href)
  const [type, setType] = useState(attrs.type || 'icon')
  const [opraAnchorEl, setOpraAnchorEl] = useState<HTMLDivElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    setTitle(attrs.title)
    setHref(attrs.href)
    setType(attrs.type || 'icon')
  }, [attrs.title, attrs.href, attrs.type])

  const handleShowOperationPopover = (event: React.MouseEvent<HTMLDivElement>) => setOpraAnchorEl(event.currentTarget)
  const handleCloseOperationPopover = () => setOpraAnchorEl(null)

  const handleShowPopover = (event?: React.MouseEvent<HTMLDivElement>) => {
    if (event) {
      handleCloseOperationPopover()
      setAnchorEl(event.currentTarget)
    } else {
      setAnchorEl(opraAnchorEl)
    }
  }
  const handleClosePopover = () => setAnchorEl(null)

  const handleSave = () => {
    updateAttributes?.({
      title,
      href,
      type,
    })
    handleClosePopover()
  }

  const handleDeleteLink = () => {
    editor.commands.deleteNode(node.type)
    editor.commands.insertContent(attrs.title)
  }

  const handleCopyLink = useCallback(async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(attrs.href);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, [attrs.href]);

  const favicon = attrs.href ? new URL(attrs.href).origin + '/favicon.ico' : ''

  if (!attrs.href && !editor.isEditable) {
    return null
  }

  if (!editor.isEditable) {
    return <ReadonlyLink attrs={attrs} selected={selected} />
  }

  if (!attrs.href) {
    return <InsertLink updateAttributes={updateAttributes} deleteNode={deleteNode} selected={selected} attrs={attrs} />
  }

  return <NodeViewWrapper
    className={`link-wrapper ${attrs.class} ${attrs.type === 'block' ? 'block-link-wrapper' : ''} ${selected ? 'ProseMirror-selectednode' : ''}`}
    data-drag-handle
    as={attrs.type === 'block' ? 'div' : 'span'}
  >
    {attrs.type === 'block' ? <Stack
      direction={'row'}
      alignItems={'center'}
      gap={2}
      onClick={handleShowOperationPopover}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        borderRadius: 'var(--mui-shape-borderRadius)',
        bgcolor: 'background.paper',
        p: 2,
        ':hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <Avatar
        sx={{ width: '2rem', height: '2rem', alignSelf: 'center', bgcolor: 'transparent' }}
        src={favicon}
      >
        <LinkIcon sx={{
          fontSize: '2rem',
          cursor: 'grab',
          color: 'primary.main',
          alignSelf: 'center',
          ':active': {
            cursor: 'grabbing',
          }
        }} />
      </Avatar>
      <Stack sx={{ flex: 1 }} gap={0.5}>
        <Box sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{attrs.title || attrs.href}</Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{attrs.href}</Box>
      </Stack>
    </Stack> : <Box
      component={'span'}
      onClick={handleShowOperationPopover}
      sx={{
        color: 'primary.main',
        textDecoration: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--mui-shape-borderRadius)',
        transition: 'background-color 0.2s ease',
        ':hover': {
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box component={'span'} sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.5 }}>
        {attrs.type === 'icon' && <Avatar
          sx={{ width: '0.875rem', height: '0.875rem', alignSelf: 'center', bgcolor: 'transparent' }}
          src={favicon}
        >
          <LinkIcon sx={{
            fontSize: '0.875rem',
            cursor: 'grab',
            color: 'primary.main',
            alignSelf: 'center',
            ':active': {
              cursor: 'grabbing',
            }
          }} />
        </Avatar>}
        {attrs.title || attrs.href}
      </Box>
    </Box>}
    <FloatingPopover
      open={Boolean(opraAnchorEl)}
      anchorEl={opraAnchorEl}
      onClose={handleCloseOperationPopover}
      placement="top"
    >
      <Stack direction={'row'} alignItems={'center'} sx={{ p: 0.5 }}>
        <ToolItem
          icon={<ShareBoxLineIcon />}
          text='打开'
          onClick={() => window.open(attrs.href, '_blank')}
        />
        <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'var(--mui-palette-divider)' }} />
        <ToolItem
          icon={<EditBoxLineIcon />}
          tip='编辑'
          onClick={() => {
            handleCloseOperationPopover()
            handleShowPopover()
          }}
        />
        <ToolItem
          icon={<CopyIcon />}
          tip='复制'
          onClick={handleCopyLink}
        />
        <ToolItem
          icon={<LinkUnlinkIcon />}
          tip='取消链接'
          onClick={handleDeleteLink}
        />
        <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'var(--mui-palette-divider)' }} />
        <ToolItem
          icon={<TextIcon />}
          tip='文字链接'
          onClick={() => updateAttributes({
            type: 'text',
          })}
        />
        <ToolItem
          icon={<ScrollToBottomLineIcon sx={{ transform: 'rotate(90deg)' }} />}
          tip='图标文字链接'
          onClick={() => updateAttributes({
            type: 'icon',
          })}
        />
        <ToolItem
          icon={<CarouselViewIcon sx={{ transform: 'rotate(90deg)' }} />}
          tip='摘要卡片'
          onClick={() => updateAttributes({
            type: 'block',
          })}
        />
      </Stack>
    </FloatingPopover>
    <FloatingPopover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      placement="bottom"
    >
      <Stack gap={2} sx={{
        p: 2, width: 320,
        '.MuiFormControlLabel-label': {
          fontSize: '0.875rem'
        }
      }}>
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
          <Stack direction={'row'} gap={2} alignItems={'center'}>
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
            onClick={handleClosePopover}
          >
            取消
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

export default ALinkViewWrapper