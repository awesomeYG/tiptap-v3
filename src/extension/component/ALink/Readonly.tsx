import { LinkIcon } from "@cq/tiptap/component/Icons"
import { Avatar, Box } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import React from "react"
import { ALinkAttributes } from "."

interface ReadonlyLinkProps extends Partial<NodeViewProps> {
  attrs: ALinkAttributes
}

const ReadonlyLink = ({ attrs, selected }: ReadonlyLinkProps) => {
  const favicon = new URL(attrs.href).origin + '/favicon.ico'

  return <NodeViewWrapper
    className={`link-wrapper ${attrs.class} ${selected ? 'ProseMirror-selectednode' : ''}`}
    data-drag-handle
    as={'span'}
  >
    <Box
      component={'a'}
      href={attrs.href}
      target={attrs.target}
      rel={attrs.rel}
      data-title={attrs.title}
      data-type={attrs.type}
      sx={{
        color: 'primary.main',
        textDecoration: 'none',
      }}
    >
      <Box component={'span'} sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.25 }}>
        {attrs.type === 'icon' && <Avatar sx={{ width: '0.875rem', height: '0.875rem', alignSelf: 'center', bgcolor: 'transparent' }} src={favicon}>
          <LinkIcon sx={{
            fontSize: '0.875rem',
            cursor: 'grab',
            color: 'primary.main',
            alignSelf: 'center',
            ':active': {
              cursor: 'grabbing',
            }
          }} />
        </Avatar>}
        {attrs.title || attrs.href}
      </Box>
    </Box>
  </NodeViewWrapper>
}

export default ReadonlyLink