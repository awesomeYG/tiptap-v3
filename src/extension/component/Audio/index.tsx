import { FloatingPopover } from "@ctzhian/tiptap/component"
import { DeleteLineIcon, DownloadLineIcon, EditBoxLineIcon, PauseLineIcon, PlayLineIcon, SpeedLineIcon, UploadCloud2LineIcon, VolumeMuteLineIcon, VolumeUpLineIcon } from "@ctzhian/tiptap/component/Icons"
import { EditorFnProps, UploadFunction } from "@ctzhian/tiptap/type"
import { Box, Button, CircularProgress, IconButton, MenuItem, MenuList, Paper, Slider, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useEffect, useRef, useState } from "react"
import Disk from '../../../asset/images/disk.png'
import InsertAudio from "./Insert"
import ReadonlyAudio from "./Readonly"

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
  onUpload?: UploadFunction
  onError?: (error: Error) => void
}> = ({ attrs, onSave, onUpload, onError }) => {
  const [src, setSrc] = useState(attrs.src)
  const [title, setTitle] = useState(attrs.title || '')
  const [poster, setPoster] = useState(attrs.poster || '')
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleSave = () => {
    onSave({ src, title, poster })
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
      <Button variant="contained" disabled={uploadingPoster} fullWidth onClick={handleSave}>
        嵌入音频
      </Button>
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
  onError
}) => {
  const attrs = node.attrs as AudioAttributes
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isHovering, setIsHovering] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [playbackRate, setPlaybackRate] = useState(1)

  const [anchorElEdit, setAnchorElEdit] = useState<HTMLButtonElement | null>(null)
  const handleCloseEditPopover = () => setAnchorElEdit(null)
  const handleShowEditPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorElEdit) {
      handleCloseEditPopover()
    } else {
      setAnchorElEdit(event.currentTarget)
    }
  }

  const [anchorElSpeed, setAnchorElSpeed] = useState<HTMLDivElement | null>(null)
  const handleCloseSpeedPopover = () => setAnchorElSpeed(null)
  const handleShowSpeedPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    if (anchorElSpeed) {
      handleCloseSpeedPopover()
    } else {
      setAnchorElSpeed(event.currentTarget)
    }
  }

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // 处理声音
  const toogleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false
      } else {
        audioRef.current.muted = true
      }
      setIsMuted(!isMuted)
    }
  }

  // 处理播放/暂停
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // 处理进度条变化
  const handleProgressChange = (event: Event, newValue: number | number[]) => {
    const newTime = newValue as number
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // 处理音量变化
  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // 处理播放速度变化
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
    handleCloseSpeedPopover()
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
    handleCloseEditPopover()
  }

  // 音频事件处理
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleError = (e: ErrorEvent) => {
      onError?.(e.error as unknown as Error)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [attrs.src, onError])

  if (!attrs.src && !editor.isEditable) {
    return null
  }

  if (!editor.isEditable) {
    return <ReadonlyAudio attrs={attrs} onError={onError} />
  }

  if (!attrs.src) {
    return <InsertAudio selected={selected} attrs={attrs} updateAttributes={updateAttributes} onUpload={onUpload} onError={onError} />
  }

  return (
    <NodeViewWrapper
      className={`audio-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <Stack direction={'row'} alignItems={'center'}
        sx={{
          position: 'relative',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 'var(--mui-shape-borderRadius)',
          p: '0.25rem',
          bgcolor: 'background.paper',
          '&:hover': {
            '.audio-controls': {
              opacity: 1
            }
          }
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Box
          sx={{
            height: 100,
            minWidth: 100,
            cursor: 'pointer',
            position: 'relative',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--mui-shape-borderRadius) 0 0 var(--mui-shape-borderRadius)',
            backgroundSize: 'cover',
            backgroundImage: `url(${Disk})`,
          }}
          onClick={togglePlay}
        >
          {attrs.poster && (
            <img
              src={attrs.poster}
              alt="音频海报"
              style={{
                width: 48,
                height: 48,
                objectFit: 'cover',
                borderRadius: '50%',
                ...(isPlaying && {
                  animation: 'rotate-icon infinite 20s linear'
                })
              }}
            />
          )}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.2s',
            borderRadius: '50%',
          }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconButton>
                {isPlaying ? (
                  <PauseLineIcon sx={{ fontSize: '1.5rem', color: 'text.primary' }} />
                ) : (
                  <PlayLineIcon sx={{ fontSize: '1.5rem', color: 'text.primary' }} />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, pr: 2, pl: 4, position: 'relative' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            {attrs.title || '音频'}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ minWidth: 40 }}>
                {formatTime(currentTime)}
              </Typography>
              <Slider
                value={currentTime}
                min={0}
                max={duration || 100}
                onChange={handleProgressChange}
                size="small"
                sx={{ flex: 1 }}
              />
              <Typography variant="caption" sx={{ minWidth: 40 }}>
                {formatTime(duration)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{
              flexShrink: 0
            }}>
              <IconButton size="small" onClick={toogleMute} sx={{ flexShrink: 0 }}>
                {!isMuted ? <VolumeUpLineIcon sx={{ fontSize: '1rem' }} />
                  : <VolumeMuteLineIcon sx={{ fontSize: '1rem' }} />}
              </IconButton>
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                size="small"
                color="error"
                disabled={isMuted}
                sx={(t) => ({
                  width: 80,
                  color: 'rgba(0,0,0,0.87)',
                  '& .MuiSlider-track': {
                    border: 'none',
                  },
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    backgroundColor: '#fff',
                    '&::before': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                    },
                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                      boxShadow: 'none',
                    },
                  },
                  ...t.applyStyles('dark', {
                    color: '#fff',
                  }),
                })}
              />
            </Stack>
            <Tooltip arrow title='倍速播放'>
              <Stack direction={'row'} alignItems={'center'} sx={{
                flexShrink: 0,
                pr: 1,
              }} onClick={handleShowSpeedPopover}>
                <IconButton size="small" sx={{ color: anchorElSpeed ? 'primary.main' : '' }}>
                  <SpeedLineIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
                <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{playbackRate}x</Box>
              </Stack>
            </Tooltip>
          </Stack>
        </Box>
        {(isHovering || !!anchorElEdit) && (
          <Box
            className="audio-controls"
            sx={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              display: 'flex',
              gap: '0.25rem',
            }}
          >
            <Tooltip arrow title="编辑音频">
              <IconButton
                size="small"
                onClick={handleShowEditPopover}
                sx={{
                  color: 'text.primary',
                  bgcolor: 'background.paper',
                }}
              >
                <EditBoxLineIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="下载音频">
              <IconButton size="small" onClick={handleDownload} sx={{
                color: 'text.primary',
                bgcolor: 'background.paper',
              }}>
                <DownloadLineIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="删除音频">
              <IconButton
                size="small"
                onClick={deleteNode}
                sx={{
                  color: 'text.primary',
                  bgcolor: 'background.paper',
                }}
              >
                <DeleteLineIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Stack>
      <audio
        ref={audioRef}
        src={attrs.src}
        style={{ display: 'none' }}
        onError={(e) => {
          onError?.(e as unknown as Error)
        }}
      />
      <FloatingPopover
        open={Boolean(anchorElEdit)}
        anchorEl={anchorElEdit}
        onClose={handleCloseEditPopover}
        placement="bottom"
      >
        <EditAudioDialog
          attrs={attrs}
          onSave={updateAudioSource}
          onUpload={onUpload}
          onError={onError}
        />
      </FloatingPopover>
      <FloatingPopover
        open={Boolean(anchorElSpeed)}
        anchorEl={anchorElSpeed}
        onClose={handleCloseSpeedPopover}
        placement="bottom"
      >
        <Paper sx={{
          p: 0.5,
          borderRadius: 'var(--mui-shape-borderRadius)',
          '.MuiList-root': {
            p: '0px !important',
            m: '0px !important',
          }
        }}>
          <MenuList>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate, index) => (
              <MenuItem
                key={index}
                selected={rate === playbackRate}
                onClick={() => handlePlaybackRateChange(rate)}
                sx={{
                  py: 1,
                  px: 2,
                  fontSize: '0.875rem',
                  borderRadius: 'var(--mui-shape-borderRadius)',
                  '&:hover:not(.Mui-selected)': {
                    backgroundColor: 'action.hover'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                  }
                }}
              >
                <Box>{rate}x</Box>
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </FloatingPopover>
    </NodeViewWrapper>
  )
}

export default AudioViewWrapper