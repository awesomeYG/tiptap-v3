import { Box } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import React from "react"
import { VideoAttributes } from "."

interface ReadonlyVideoProps {
  attrs: VideoAttributes
  onError?: (error: Error) => void
}

const ReadonlyVideo = ({
  attrs,
  onError
}: ReadonlyVideoProps) => {
  return <NodeViewWrapper
    className={`video-wrapper`}
    data-drag-handle
  >
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 'var(--mui-shape-borderRadius)',
        p: '0.25rem',
        '&:hover .video-controls': {
          opacity: 1
        }
      }}>
      <video
        src={attrs.src}
        poster={attrs.poster || undefined}
        controls={attrs.controls}
        autoPlay={attrs.autoplay}
        loop={attrs.loop}
        muted={attrs.muted}
        width={attrs.width}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block'
        }}
        onError={(e) => {
          onError?.(e as unknown as Error)
        }}
      />
    </Box>
  </NodeViewWrapper>
}

export default ReadonlyVideo