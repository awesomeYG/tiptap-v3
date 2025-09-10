import { Box } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import React from "react"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { ImageAttributes } from "."

import 'react-photo-view/dist/react-photo-view.css'

interface ReadonlyImageProps {
  attrs: ImageAttributes
}

const ReadonlyImage = ({
  attrs,
}: ReadonlyImageProps) => {
  return <NodeViewWrapper
    className={`image-wrapper`}
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
        <PhotoView render={(props) => (
          <img
            {...props.attrs}
            src={attrs.src}
            style={{
              transformOrigin: '0 0',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'hsl(0, 0%, 90%)',
              maxWidth: '100%',
              maxHeight: '90%',
            }}
          />
        )}>
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