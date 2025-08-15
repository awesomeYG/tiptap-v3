import { Box } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import React from "react"
import { AudioAttributes } from "."

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
  return (
    <NodeViewWrapper
      className={`audio-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <Box
        sx={{
          position: 'relative',
          display: 'block',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 'var(--mui-shape-borderRadius)',
          p: '0.25rem',
          bgcolor: 'background.paper',
        }}>
        <audio
          src={attrs.src}
          controls={attrs.controls}
          autoPlay={attrs.autoplay}
          loop={attrs.loop}
          muted={attrs.muted}
          style={{
            width: '100%',
            display: 'block'
          }}
          onError={(e) => {
            onError?.(e as unknown as Error)
          }}
        />
      </Box>
    </NodeViewWrapper>
  )
}

export default ReadonlyAudio