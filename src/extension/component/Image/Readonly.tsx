import { Box } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import React from "react"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { ImageAttributes } from "."

import 'react-photo-view/dist/react-photo-view.css'

interface ReadonlyImageProps {
  selected: boolean
  attrs: ImageAttributes
}

const ReadonlyImage = ({
  selected,
  attrs,
}: ReadonlyImageProps) => {
  return <NodeViewWrapper
    className={`image-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
    data-drag-handle
  >
    <Box
      component={'span'}
      sx={{
        position: 'relative',
        display: 'inline-block',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 'var(--mui-shape-borderRadius)',
        p: '0.25rem',
        bgcolor: 'background.paper',
        '&:hover .image-controls': {
          opacity: 1
        }
      }}
    >
      <PhotoProvider>
        <PhotoView src={attrs.src}>
          <img
            src={attrs.src}
            width={attrs.width}
            style={{
              maxWidth: '100%',
              height: 'auto',
              cursor: 'pointer',
            }}
            onError={(e) => {
              console.error('Image load error:', e)
            }}
          />
        </PhotoView>
      </PhotoProvider>
    </Box>
  </NodeViewWrapper>
}

export default ReadonlyImage