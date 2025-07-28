import { ImageLineIcon } from "@cq/tiptap/component/Icons"
import { Box, Button, CircularProgress, Popover, Stack, Tab, Tabs, TextField } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import React, { useState } from "react"
import { ImageAttributes } from "."

interface InsertImageProps {
  selected: boolean
  attrs: ImageAttributes
  updateAttributes: (attrs: ImageAttributes) => void
  onUpload?: (file: File) => Promise<string>
}

const InsertImage = ({
  selected,
  attrs,
  updateAttributes,
  onUpload,
}: InsertImageProps) => {
  const [editSrc, setEditSrc] = useState(attrs.src || '')
  const [insertType, setInsertType] = useState<'upload' | 'link'>(onUpload ? 'upload' : 'link')
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleShowPopover = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget)
  const handleClosePopover = () => setAnchorEl(null)
  const handleChangeInsertType = (event: React.SyntheticEvent, newValue: string) => setInsertType(newValue as 'upload' | 'link')

  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onUpload) {
      setUploading(true)
      try {
        const url = await onUpload(file)
        setEditSrc(url)
        updateAttributes({
          src: url,
          width: attrs.width,
        })
        handleClosePopover()
      } catch (error) {
        console.error('图片上传失败:', error)
      } finally {
        setUploading(false)
      }
    }
  }

  const handleInsertLink = () => {
    if (!editSrc.trim()) return
    updateAttributes({
      src: editSrc.trim(),
      width: attrs.width,
    })
    handleClosePopover()
  }

  const open = Boolean(anchorEl)
  const id = open ? 'image-show-popover' : undefined

  return (
    <NodeViewWrapper
      className={`image-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <Stack
        direction={'row'}
        alignItems={'center'}
        gap={2}
        aria-describedby={id}
        onClick={handleShowPopover}
        sx={{
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 'var(--mui-shape-borderRadius)',
          px: 2,
          py: 1.5,
          textAlign: 'center',
          cursor: 'pointer',
          color: 'text.secondary',
          bgcolor: 'action.default',
          "&:hover": {
            bgcolor: 'action.hover'
          },
          "&:active": {
            bgcolor: 'action.selected',
          }
        }}
      >
        <ImageLineIcon sx={{ fontSize: 18 }} />
        <Box sx={{ fontSize: 14 }}>嵌入或复制图片链接</Box>
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ width: 350, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs value={insertType} onChange={handleChangeInsertType}>
            <Tab label="上传" value="upload" />
            <Tab label="嵌入链接" value="link" />
          </Tabs>
        </Box>
        {insertType === 'upload' ? (
          <Stack alignItems={'center'} gap={2} sx={{ p: 2 }}>
            <Button
              variant="contained"
              component="label"
              disabled={!onUpload || uploading}
              fullWidth
              startIcon={uploading ? <CircularProgress size={20} /> : <ImageLineIcon sx={{ fontSize: 18 }} />}
            >
              <input
                type="file"
                hidden
                multiple={false}
                accept="image/*"
                onChange={handleUploadImage}
              />
              {uploading ? '图片上传中...' : '选择图片文件'}
            </Button>
          </Stack>
        ) : (
          <Stack gap={2} sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={editSrc}
              onChange={(e) => setEditSrc(e.target.value)}
              placeholder="输入图片的 URL"
              label="图片链接"
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleInsertLink}
              disabled={!editSrc.trim()}
            >
              嵌入图片
            </Button>
          </Stack>
        )}
      </Popover>
    </NodeViewWrapper>
  )
}

export default InsertImage