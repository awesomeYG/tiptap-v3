import { Box, IconButton, Tooltip } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { DeleteLineIcon } from "@yu-cq/tiptap/component/Icons/delete-line-icon"
import { EditorFnProps } from "@yu-cq/tiptap/type"
import React, { useRef, useState } from "react"
import InsertAudio from "./Insert"
import ReadonlyAudio from "./Readonly"

export interface AudioAttributes {
  src: string
  controls: boolean
  autoplay: boolean
  loop: boolean
  muted: boolean
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

  if (!attrs.src && !editor.isEditable) {
    return null
  }

  if (!editor.isEditable) {
    return <ReadonlyAudio selected={selected} attrs={attrs} onError={onError} />
  }

  if (!attrs.src) {
    return <InsertAudio selected={selected} attrs={attrs} updateAttributes={updateAttributes} onUpload={onUpload} onError={onError} />
  }

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
          '&:hover .audio-controls': {
            opacity: 1
          }
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <audio
          ref={audioRef}
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
        {isHovering && <Box
          className="audio-controls"
          sx={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            display: 'flex',
            gap: '0.25rem',
          }}
        >
          <Tooltip arrow title="删除音频">
            <IconButton
              size="small"
              onClick={deleteNode}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.paper',
              }}
            >
              <DeleteLineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>}
      </Box>
    </NodeViewWrapper>
  )
}

export default AudioViewWrapper