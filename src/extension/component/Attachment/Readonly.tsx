import { Attachment2Icon } from "@ctzhian/tiptap/component/Icons"
import { Box, Stack } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import React from "react"
import { AttachmentAttributes } from "."

interface ReadonlyAttachmentProps extends Partial<NodeViewProps> {
  attrs: AttachmentAttributes
  type: 'icon' | 'block'
}

const ReadonlyAttachment = ({ attrs, type }: ReadonlyAttachmentProps) => {
  return <NodeViewWrapper
    className={`attachment-wrapper${type === 'block' ? ' block-attachment-wrapper' : ''}`}
    as={type === 'block' ? 'div' : 'span'}
  >
    <Box component='a' href={attrs.url} target='_blank' download={attrs.title} sx={{
      textDecoration: 'none !important',
      color: 'inherit',
    }}>
      {type === 'block' ? <Stack direction={'row'} alignItems={'center'} gap={2}
        sx={{
          border: '1px solid',
          borderColor: attrs.url === 'error' ? 'error.main' : 'divider',
          cursor: 'pointer',
          borderRadius: 'var(--mui-shape-borderRadius)',
          p: 2,
          ':hover': {
            borderColor: attrs.url === 'error' ? 'error.main' : 'primary.main',
            color: attrs.url === 'error' ? 'error.main' : 'primary.main',
          },
        }}>
        <Attachment2Icon sx={{
          fontSize: '2rem',
          cursor: 'grab',
          color: attrs.url === 'error' ? 'error.main' : 'primary.main',
          alignSelf: 'center',
          ':active': {
            cursor: 'grabbing',
          }
        }} />
        <Stack sx={{ flex: 1 }} gap={0.5}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
            {attrs.title}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{attrs.size}</Box>
        </Stack>
      </Stack> : <Box
        component={'span'}
        sx={{
          color: 'primary.main',
          textDecoration: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--mui-shape-borderRadius)',
          transition: 'background-color 0.2s ease',
          ':hover': {
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box component={'span'} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <Attachment2Icon sx={{
            fontSize: '0.875rem',
            cursor: 'grab',
            color: 'primary.main',
            alignSelf: 'center',
            ':active': {
              cursor: 'grabbing',
            }
          }} />
          {attrs.title}
        </Box>
      </Box>}
    </Box>
  </NodeViewWrapper>
}

export default ReadonlyAttachment