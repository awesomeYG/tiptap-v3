import { FloatingPopover, HoverPopover } from "@ctzhian/tiptap/component"
import { DeleteLineIcon, DownloadLineIcon, EditLineIcon, UploadCloud2LineIcon } from "@ctzhian/tiptap/component/Icons"
import { ToolbarItem } from "@ctzhian/tiptap/component/Toolbar"
import { EditorFnProps, UploadFunction } from "@ctzhian/tiptap/type"
import { Button, CircularProgress, Divider, IconButton, Stack, TextField } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useRef, useState } from "react"
import AudioPlayer from "./AudioPlayer"
import InsertAudio from "./Insert"

export interface AudioAttributes {
  src: string
  title?: string
  poster?: string
  controls: boolean
  autoplay: boolean
  loop: boolean
  muted: boolean
}

const EditAudioDialog: React.FC<{
  attrs: AudioAttributes
  onSave: (value: { src: string, title?: string, poster?: string }) => void
  onClose?: () => void
  onUpload?: UploadFunction
  onError?: (error: Error) => void
  onValidateUrl?: (url: string, type: 'image' | 'video' | 'audio' | 'iframe') => Promise<string> | string
}> = ({ attrs, onSave, onClose, onUpload, onError, onValidateUrl }) => {
  const [src, setSrc] = useState(attrs.src)
  const [title, setTitle] = useState(attrs.title || '')
  const [poster, setPoster] = useState(attrs.poster || '')
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleSave = async () => {
    try {
      let validatedSrc = src
      if (onValidateUrl && src.trim()) {
        validatedSrc = await Promise.resolve(onValidateUrl(src.trim(), 'audio'))
      }
      onSave({ src: validatedSrc, title, poster })
    } catch (error) {
      onError?.(error as Error)
    }
  }

  const handleSelectAudio = () => {
    const uploadId = document.getElementById('audioUploadInput') as HTMLInputElement
    if (uploadId) {
      uploadId.click()
    }
  }

  const handleSelectPosterImage = () => {
    const uploadId = document.getElementById('posterUploadInput') as HTMLInputElement
    if (uploadId) {
      uploadId.click()
    }
  }

  const handleUploadPoster = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadingPoster(true)
      try {
        const url = await onUpload?.(file)
        if (url) {
          setPoster(url)
        }
      } catch (error) {
        onError?.(error as Error)
      } finally {
        setUploadingPoster(false)
      }
    }
  }

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      try {
        const url = await onUpload?.(file)
        if (url) {
          setTitle(file.name)
          setSrc(url)
        }
      } catch (error) {
        onError?.(error as Error)
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <Stack
      gap={2}
      sx={{
        width: 350,
        bgcolor: 'background.paper',
        borderRadius: 'var(--mui-shape-borderRadius)',
        px: 2,
        py: 1.5,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Stack direction={'row'} gap={2}>
        <TextField
          fullWidth
          size="small"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          placeholder="输入音频文件的 URL"
        />
        <IconButton onClick={handleSelectAudio}>
          {uploading ? <CircularProgress size={20} /> : <UploadCloud2LineIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </Stack>
      <TextField
        fullWidth
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="输入音频名称（可选）"
      />
      <Stack direction={'row'} gap={2}>
        <TextField
          fullWidth
          size="small"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          placeholder="输入海报图片的 URL（可选）"
        />
        <IconButton onClick={handleSelectPosterImage}>
          {uploadingPoster ? <CircularProgress size={20} /> : <UploadCloud2LineIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </Stack>
      <input
        id='audioUploadInput'
        type="file"
        hidden
        multiple={false}
        accept="audio/*"
        onChange={handleAudioUpload}
      />
      <input
        id='posterUploadInput'
        type="file"
        hidden
        multiple={false}
        accept="image/*"
        onChange={handleUploadPoster}
      />
      <Stack direction={'row'} gap={1} alignItems={'center'} sx={{ mt: 1 }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={onClose}
        >
          取消
        </Button>
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={handleSave}
          disabled={uploadingPoster || uploading || !src.trim()}
        >
          保存
        </Button>
      </Stack>
    </Stack>
  )
}

const AudioViewWrapper: React.FC<NodeViewProps & EditorFnProps> = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
  selected,
  onUpload,
  onError,
  onValidateUrl
}) => {
  const attrs = node.attrs as AudioAttributes

  const editButtonRef = useRef<HTMLButtonElement>(null)
  const [anchorElEdit, setAnchorElEdit] = useState<HTMLElement | null>(null)
  const [keepHoverPopoverOpen, setKeepHoverPopoverOpen] = useState(false)

  const handleShowPopover = () => {
    setKeepHoverPopoverOpen(true)
    setAnchorElEdit(editButtonRef.current)
  }

  const handleClosePopover = () => {
    setAnchorElEdit(null)
    setKeepHoverPopoverOpen(false)
  }

  // 处理下载
  const handleDownload = () => {
    if (attrs.src) {
      const link = document.createElement('a')
      link.href = attrs.src
      link.download = attrs.src.split('/').pop() || 'audio.mp3'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // 更新音频源和海报
  const updateAudioSource = (value: { src: string, title?: string, poster?: string }) => {
    updateAttributes({
      src: value.src,
      title: value.title || null,
      poster: value.poster || null,
      controls: attrs.controls,
      autoplay: attrs.autoplay,
      loop: attrs.loop,
      muted: attrs.muted,
    })
    handleClosePopover()
  }

  if (!attrs.src && !editor.isEditable) {
    return null
  }

  if (!attrs.src) {
    return <InsertAudio selected={selected} attrs={attrs} updateAttributes={updateAttributes} onUpload={onUpload} onError={onError} onValidateUrl={onValidateUrl} />
  }

  const isEditable = editor.isEditable

  return (
    <NodeViewWrapper
      className={`audio-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      {isEditable ? (
        <HoverPopover
          keepOpen={keepHoverPopoverOpen}
          placement="top"
          offset={4}
          actions={
            <Stack
              direction={'row'}
              alignItems={'center'}
              sx={{ p: 0.5 }}
            >
              <ToolbarItem
                ref={editButtonRef}
                icon={<EditLineIcon sx={{ fontSize: '1rem' }} />}
                tip="编辑音频"
                onClick={handleShowPopover}
              />
              <ToolbarItem
                icon={<DownloadLineIcon sx={{ fontSize: '1rem' }} />}
                tip="下载音频"
                onClick={handleDownload}
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'divider' }}
              />
              <ToolbarItem
                icon={<DeleteLineIcon sx={{ fontSize: '1rem' }} />}
                tip="删除音频"
                onClick={deleteNode}
              />
            </Stack>
          }
        >
          <AudioPlayer attrs={attrs} onError={onError} />
        </HoverPopover>
      ) : (
        <AudioPlayer attrs={attrs} onError={onError} />
      )}
      {isEditable && (
        <FloatingPopover
          open={Boolean(anchorElEdit)}
          anchorEl={anchorElEdit}
          onClose={handleClosePopover}
          placement="bottom"
        >
          <EditAudioDialog
            attrs={attrs}
            onSave={updateAudioSource}
            onClose={handleClosePopover}
            onUpload={onUpload}
            onError={onError}
            onValidateUrl={onValidateUrl}
          />
        </FloatingPopover>
      )}
    </NodeViewWrapper>
  )
}

export default AudioViewWrapper
