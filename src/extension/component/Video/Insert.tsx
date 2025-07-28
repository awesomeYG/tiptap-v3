import { MovieLineIcon } from "@cq/tiptap/component/Icons"
import { UploadIcon } from "@cq/tiptap/component/Icons/upload-icon"
import { EditorFnProps } from "@cq/tiptap/type"
import { Box, Button, CircularProgress, Popover, Stack, Tab, Tabs, TextField } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import React, { useState } from "react"
import { VideoAttributes } from "."

type InsertVideoProps = {
  selected: boolean
  attrs: VideoAttributes
  updateAttributes: (attrs: VideoAttributes) => void
} & EditorFnProps

const InsertVideo = ({
  selected,
  attrs,
  updateAttributes,
  onUpload,
  onError
}: InsertVideoProps) => {
  const [editSrc, setEditSrc] = useState(attrs.src || '')
  const [insertType, setInsertType] = useState<'upload' | 'link'>(onUpload ? 'upload' : 'link')
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleShowPopover = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget)
  const handleClosePopover = () => setAnchorEl(null)
  const handleChangeInsertType = (event: React.SyntheticEvent, newValue: string) => setInsertType(newValue as 'upload' | 'link')

  const handleUploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      try {
        const url = await onUpload?.(file)
        if (url) {
          setEditSrc(url)
          updateAttributes({
            src: url,
            width: attrs.width,
            controls: attrs.controls,
            autoplay: attrs.autoplay,
            loop: attrs.loop,
            muted: attrs.muted,
            poster: attrs.poster,
          })
        }
      } catch (error) {
        onError?.(error as Error)
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
      controls: attrs.controls,
      autoplay: attrs.autoplay,
      loop: attrs.loop,
      muted: attrs.muted,
      poster: attrs.poster,
    })
    handleClosePopover()
  }

  const open = Boolean(anchorEl)
  const id = open ? 'video-show-popover' : undefined

  return <NodeViewWrapper
    className={`video-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
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
      <MovieLineIcon sx={{ fontSize: 18 }} />
      <Box sx={{ fontSize: 14 }}>嵌入或复制视频链接</Box>
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
      <Box sx={{ width: 300, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs value={insertType} onChange={handleChangeInsertType}>
          <Tab label="上传" value="upload" />
          <Tab label="嵌入链接" value="link" />
        </Tabs>
      </Box>
      {insertType === 'upload' ? <Stack alignItems={'center'} gap={2} sx={{ p: 2 }}>
        <Button
          variant="contained"
          component="label"
          disabled={!onUpload || uploading}
          fullWidth
          startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon sx={{ fontSize: 18 }} />}
        >
          <input
            type="file"
            hidden
            multiple={false}
            accept="video/*"
            onChange={handleUploadVideo}
          />
          {uploading ? '视频文件上传中...' : '视频文件'}
        </Button>
      </Stack> : <Stack gap={2} sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={editSrc}
          onChange={(e) => setEditSrc(e.target.value)}
          placeholder="输入视频文件的 URL"
        />
        <Button variant="contained" fullWidth onClick={handleInsertLink}>
          嵌入视频
        </Button>
      </Stack>}
    </Popover>
  </NodeViewWrapper>
}

export default InsertVideo