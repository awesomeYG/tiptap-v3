import { LinkIcon } from "@cq/tiptap/component/Icons"
import { Avatar, Box, Link, Stack } from "@mui/material"
import React from "react"
import { LinkAttributes } from "."

interface ReadonlyLinkProps {
  attrs: LinkAttributes
}

export const ReadonlyLink: React.FC<ReadonlyLinkProps> = (props) => {
  const { attrs } = props

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (attrs.href) {
      window.open(attrs.href, attrs.target || '_blank')
    }
  }

  // 获取网站图标
  const getFavicon = (url: string) => {
    try {
      const urlObj = new URL(url)
      return `${urlObj.protocol}//${urlObj.host}/favicon.ico`
    } catch {
      return null
    }
  }

  if (attrs.type === 'card') {
    return (
      <Box
        component="div"
        onClick={handleClick}
        sx={{
          display: 'block',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'inherit',
          maxWidth: 400,
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar
            sx={{ width: 24, height: 24 }}
            src={getFavicon(attrs.href) || undefined}
          >
            <LinkIcon sx={{ fontSize: '1.125rem' }} />
          </Avatar>
          <Stack flex={1} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {attrs.title || attrs.href}
            </Box>
            <Box
              sx={{
                fontSize: '0.75rem',
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {attrs.href}
            </Box>
          </Stack>
        </Stack>
      </Box>
    )
  }

  // 默认链接风格
  return (
    <Link
      component="a"
      href={attrs.href}
      target={attrs.target || '_blank'}
      rel={attrs.rel || 'noopener noreferrer'}
      onClick={handleClick}
      sx={{
        color: 'primary.main',
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'none'
        }
      }}
    >
      {attrs.title || attrs.href}
    </Link>
  )
}