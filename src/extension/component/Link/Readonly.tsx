import { Avatar, Box, Stack } from "@mui/material"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { LinkIcon } from "@yu-cq/tiptap/component/Icons"
import { getLinkTitle } from "@yu-cq/tiptap/util"
import React from "react"
import { LinkAttributes } from "."

interface ReadonlyLinkProps extends Partial<NodeViewProps> {
  attrs: LinkAttributes
}

const ReadonlyLink = ({ attrs, selected }: ReadonlyLinkProps) => {
  let favicon = ''
  try {
    favicon = new URL(attrs.href).origin + '/favicon.ico'
  } catch (error) {
  }

  return <NodeViewWrapper
    className={`link-wrapper`}
    data-drag-handle
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
      {attrs.type === 'block' ? <Stack
        direction={'row'}
        alignItems={'center'}
        gap={2}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          borderRadius: 'var(--mui-shape-borderRadius)',
          bgcolor: 'background.paper',
          p: 2,
          ':hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <Avatar
          sx={{
            width: '2rem',
            height: '2rem',
            alignSelf: 'center',
            bgcolor: '#FFFFFF',
          }}
          src={favicon}
        >
          <LinkIcon sx={{
            fontSize: '2rem',
            cursor: 'grab',
            color: 'primary.main',
            alignSelf: 'center',
            ':active': {
              cursor: 'grabbing',
            }
          }} />
        </Avatar>
        <Stack sx={{ flex: 1 }} gap={0.5}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{attrs.title || getLinkTitle(attrs.href)}</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{attrs.href}</Box>
        </Stack>
      </Stack> : <Box component={'span'} sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.5 }}>
        {attrs.type === 'icon' && <Avatar sx={{ width: '1rem', height: '1rem', alignSelf: 'center', bgcolor: '#FFFFFF' }} src={favicon}>
          <LinkIcon sx={{
            fontSize: '1rem',
            cursor: 'grab',
            color: 'primary.main',
            alignSelf: 'center',
            ':active': {
              cursor: 'grabbing',
            }
          }} />
        </Avatar>}
        {attrs.title || getLinkTitle(attrs.href)}
      </Box>}
    </Box>
  </NodeViewWrapper>
}

export default ReadonlyLink