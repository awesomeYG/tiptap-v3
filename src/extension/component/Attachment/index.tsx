import { Box, Button, Divider, Stack, TextField } from "@mui/material";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { FloatingPopover } from "@yu-cq/tiptap/component";
import { Attachment2Icon, CarouselViewIcon, DeleteLineIcon, DownloadLineIcon, EditBoxLineIcon, ScrollToBottomLineIcon } from "@yu-cq/tiptap/component/Icons";
import { ToolbarItem } from "@yu-cq/tiptap/component/Toolbar";
import { EditorFnProps } from "@yu-cq/tiptap/type";
import React, { useEffect, useState } from "react";
import InsertAttachment from "./Insert";
import ReadonlyAttachment from "./Readonly";

export interface AttachmentAttributes {
  url: string
  title: string
  type: string
  size: string
}

const AttachmentViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
  onUpload,
  onError
}) => {
  const attrs = node.attrs as AttachmentAttributes

  const [title, setTitle] = useState('')
  const [extension, setExtension] = useState('')
  const [type, setType] = useState('icon')
  const [opraAnchorEl, setOpraAnchorEl] = useState<HTMLDivElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

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
      title: title + (extension ? `.${extension}` : ''),
      type,
    })
    handleClosePopover()
  }

  const handleDeleteAttachment = () => {
    deleteNode?.()
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = attrs.url
    a.target = '_blank'
    a.download = attrs.title
    a.click()
    a.remove()
  }

  useEffect(() => {
    let title = attrs.title || ''
    setTitle(title.split('.').slice(0, -1).join('.'))
    setExtension(title.split('.').pop() || '')
    setType(attrs.type || 'icon')
  }, [attrs.title, attrs.type])

  if ((!attrs.url || attrs.url === 'error') && !editor.isEditable) {
    return null
  }

  if (!attrs.title) {
    return <InsertAttachment
      editor={editor}
      selected={selected}
      attrs={attrs}
      updateAttributes={updateAttributes}
      deleteNode={deleteNode}
      onUpload={onUpload}
      onError={onError}
    />
  }

  if (!editor.isEditable) {
    return <ReadonlyAttachment attrs={attrs} />
  }

  return (
    <NodeViewWrapper
      className={`attachment-wrapper${attrs.type === 'block' ? ' block-attachment-wrapper' : ''}${selected ? ' ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      {attrs.type === 'block' ? <Stack direction={'row'} alignItems={'center'} gap={2}
        onClick={handleShowOperationPopover}
        sx={{
          border: '1px solid',
          borderColor: attrs.url === 'error' ? 'error.main' : 'divider',
          cursor: 'pointer',
          borderRadius: 'var(--mui-shape-borderRadius)',
          bgcolor: 'background.paper',
          p: 2,
          ':hover': {
            borderColor: attrs.url === 'error' ? 'error.main' : 'primary.main',
          },
        }}>
        <Attachment2Icon sx={{
          fontSize: '2rem',
          cursor: 'grab',
          color: attrs.url === 'error' ? 'error.main' : 'primary.main',
          alignSelf: 'center',
          ':active': {
            cursor: 'grabbing',
          }
        }} />
        <Stack sx={{ flex: 1 }} gap={0.5}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: attrs.url === 'error' ? 'error.main' : 'inherit' }}>
            {attrs.title}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{attrs.size}</Box>
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
        <Box component={'span'} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <Attachment2Icon sx={{
            fontSize: '0.875rem',
            cursor: 'grab',
            color: 'primary.main',
            alignSelf: 'center',
            ':active': {
              cursor: 'grabbing',
            }
          }} />
          {attrs.title}
        </Box>
      </Box>}
      <FloatingPopover
        open={Boolean(opraAnchorEl)}
        anchorEl={opraAnchorEl}
        onClose={handleCloseOperationPopover}
        placement="top"
      >
        <Stack direction={'row'} alignItems={'center'} sx={{
          p: 0.5,
        }}>
          <ToolbarItem
            icon={<DownloadLineIcon sx={{ fontSize: '1rem' }} />}
            text='下载'
            onClick={handleDownload}
          />
          <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'var(--mui-palette-divider)' }} />
          <ToolbarItem
            icon={<EditBoxLineIcon sx={{ fontSize: '1rem' }} />}
            tip='编辑'
            onClick={() => {
              handleCloseOperationPopover()
              handleShowPopover()
            }}
          />
          <ToolbarItem
            icon={<DeleteLineIcon sx={{ fontSize: '1rem' }} />}
            tip='删除'
            onClick={handleDeleteAttachment}
          />
          <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'var(--mui-palette-divider)' }} />
          <ToolbarItem
            icon={<ScrollToBottomLineIcon sx={{ transform: 'rotate(90deg)', fontSize: '1rem' }} />}
            tip='图标文字链接'
            className={type === 'icon' ? 'tool-active' : ''}
            onClick={() => updateAttributes({
              type: 'icon',
            })}
          />
          <ToolbarItem
            icon={<CarouselViewIcon sx={{ transform: 'rotate(90deg)', fontSize: '1rem' }} />}
            tip='摘要卡片'
            className={type === 'block' ? 'tool-active' : ''}
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
          },
        }}>
          <Stack direction={'row'} gap={2} alignItems={'center'}>
            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', flexShrink: 0 }}>标题</Box>
            <TextField
              fullWidth
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="附件标题"
            />
          </Stack>
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
            >
              保存
            </Button>
          </Stack>
        </Stack>
      </FloatingPopover>
    </NodeViewWrapper>
  )
}

export default AttachmentViewWrapper