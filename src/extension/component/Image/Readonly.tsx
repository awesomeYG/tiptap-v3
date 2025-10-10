import { Box } from "@mui/material"
import { NodeViewWrapper } from "@tiptap/react"
import React from "react"
import { PhotoView } from "react-photo-view"
import 'react-photo-view/dist/react-photo-view.css'
import { ImageAttributes } from "."

interface ReadonlyImageProps {
  attrs: ImageAttributes
}

const ReadonlyImage = ({
  attrs,
}: ReadonlyImageProps) => {
  return <NodeViewWrapper
    className={`image-wrapper`}
  >
    <Box component={'span'} sx={{
      position: 'relative',
      display: 'inline-block',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 'var(--mui-shape-borderRadius)',
      p: '0.25rem',
    }}>
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
    </Box>
  </NodeViewWrapper>
}

export default ReadonlyImage