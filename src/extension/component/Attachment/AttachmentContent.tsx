import { Download2LineIcon } from "@ctzhian/tiptap/component/Icons"
import { Box, Stack } from "@mui/material"
import React from "react"
import { AttachmentAttributes } from "."

interface AttachmentContentProps {
  attrs: AttachmentAttributes
  type: 'icon' | 'block'
  /** 是否为编辑模式 */
  editable?: boolean
}

/**
 * 附件内容组件
 * 用于渲染附件的实际内容，支持编辑和只读模式
 */
export const AttachmentContent: React.FC<AttachmentContentProps> = ({ attrs, type, editable = false }) => {
  // 编辑模式和只读模式的样式差异
  const blockStyles = editable ? {
    display: 'flex',
    border: '1px solid',
    borderColor: attrs.url === 'error' ? 'error.main' : 'divider',
    cursor: 'pointer',
    borderRadius: 'var(--mui-shape-borderRadius)',
    bgcolor: 'background.paper',
    p: 2,
    color: 'inherit',
    ':hover': {
      borderColor: attrs.url === 'error' ? 'error.main' : 'primary.main',
    },
  } : {
    display: 'block',
  }

  const blockInnerStyles = editable ? {
    width: '100%'
  } : {
    border: '1px solid',
    borderColor: attrs.url === 'error' ? 'error.main' : 'divider',
    color: 'text.primary',
    cursor: 'pointer',
    borderRadius: 'var(--mui-shape-borderRadius)',
    bgcolor: 'background.paper',
    p: 2,
    ':hover': {
      borderColor: attrs.url === 'error' ? 'error.main' : 'primary.main',
    },
  }

  const inlineStyles = editable ? {
    color: 'primary.main',
    cursor: 'pointer',
    borderRadius: 'var(--mui-shape-borderRadius)',
    transition: 'background-color 0.2s ease',
    display: 'inline',
    ':hover': {
      bgcolor: 'background.paper',
    },
  } : {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    color: 'primary.main',
    cursor: 'pointer',
  }

  return (
    <>
      {type === 'block' ? (
        <Box
          component="a"
          href={attrs.url}
          target='_blank'
          download={attrs.title}
          {...(!editable && { 'data-title': attrs.title, 'data-type': attrs.type })}
          sx={blockStyles}
        >
          <Stack
            direction={'row'}
            alignItems={'center'}
            gap={2}
            sx={blockInnerStyles}
            {...(!editable && { 'data-title': attrs.title, 'data-type': type })}
          >
            <Download2LineIcon sx={{
              fontSize: '2rem',
              color: attrs.url === 'error' ? 'error.main' : 'primary.main',
              alignSelf: 'center',
            }} />
            <Stack sx={{ flex: 1 }} gap={0.5}>
              <Box sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                {attrs.title}
              </Box>
              {Number(attrs.size) > 0 && <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{attrs.size}</Box>}
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Box
          component="a"
          href={attrs.url}
          target='_blank'
          download={attrs.title}
          {...(!editable && { 'data-title': attrs.title, 'data-type': attrs.type })}
          sx={inlineStyles}
        >
          {editable ? (
            <Box component={'span'} sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
            }}>
              <Download2LineIcon sx={{
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
          ) : (
            <>
              <Download2LineIcon sx={{
                fontSize: '0.875rem',
                cursor: 'grab',
                color: 'primary.main',
                alignSelf: 'center',
                ':active': {
                  cursor: 'grabbing',
                }
              }} />
              {attrs.title}
            </>
          )}
        </Box>
      )}
    </>
  )
}

export default AttachmentContent

