import { Box, IconButton, MenuItem, MenuList, Paper, Slider, Stack, Typography } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import { FloatingPopover } from "@yu-cq/tiptap/component"
import { DownloadLineIcon, PauseLineIcon, PlayLineIcon, SpeedLineIcon, VolumeMuteLineIcon, VolumeUpLineIcon } from "@yu-cq/tiptap/component/Icons"
import React, { useEffect, useRef, useState } from "react"
import { AudioAttributes } from "."
import Disk from '../../../asset/images/disk.png'

interface ReadonlyAudioProps {
  selected: boolean
  attrs: AudioAttributes
  onError?: (error: Error) => void
}

const ReadonlyAudio = ({
  selected,
  attrs,
  onError
}: ReadonlyAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isHovering, setIsHovering] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [playbackRate, setPlaybackRate] = useState(1)
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

  return (
    <NodeViewWrapper
      className={`audio-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <audio
        ref={audioRef}
        src={attrs.src}
        style={{ display: 'none' }}
        onError={(e) => {
          onError?.(e as unknown as Error)
        }}
      />
      <Stack direction={'row'} alignItems={'center'}
        sx={{
          position: 'relative',
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
            <Stack direction={'row'} alignItems={'center'} sx={{
              flexShrink: 0,
              pr: 1,
            }} onClick={handleShowSpeedPopover}>
              <IconButton size="small" sx={{ color: anchorElSpeed ? 'primary.main' : '' }}>
                <SpeedLineIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
              <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{playbackRate}x</Box>
            </Stack>
          </Stack>
        </Box>
        {isHovering && (
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
            <IconButton size="small" onClick={handleDownload} sx={{
              color: 'text.primary',
              bgcolor: 'background.paper',
            }}>
              <DownloadLineIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Box>
        )}
      </Stack>
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

export default ReadonlyAudio