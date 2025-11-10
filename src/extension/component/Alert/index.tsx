import { FloatingPopover } from '@ctzhian/tiptap/component'
import { CheckboxCircleFillIcon, CloseCircleFillIcon, ErrorWarningFillIcon, Information2FillIcon, ScrollToBottomLineIcon, TextIcon, UserSmileFillIcon } from '@ctzhian/tiptap/component/Icons'
import { ToolbarItem } from '@ctzhian/tiptap/component/Toolbar'
import { Box, Divider, Stack } from '@mui/material'
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useMemo, useRef, useState } from 'react'

export interface AlertAttributes {
  id?: string
  variant?: 'info' | 'warning' | 'error' | 'success' | 'default'
  type?: 'text' | 'icon'
}

const VARIANT_DATA: Record<string, { icon: React.ReactNode, color: string }> = {
  info: {
    icon: <Information2FillIcon sx={{ fontSize: '1.25rem' }} />,
    color: 'var(--mui-palette-primary-main)',
  },
  warning: {
    icon: <ErrorWarningFillIcon sx={{ fontSize: '1.25rem' }} />,
    color: 'var(--mui-palette-warning-main)',
  },
  error: {
    icon: <CloseCircleFillIcon sx={{ fontSize: '1.25rem' }} />,
    color: 'var(--mui-palette-error-main)',
  },
  success: {
    icon: <CheckboxCircleFillIcon sx={{ fontSize: '1.25rem' }} />,
    color: 'var(--mui-palette-success-main)',
  },
  default: {
    icon: <UserSmileFillIcon sx={{ fontSize: '1.25rem' }} />,
    color: 'var(--mui-palette-divider)',
  },
}

const AlertView: React.FC<NodeViewProps> = ({ editor, node, updateAttributes, selected }) => {
  const attrs = node.attrs as AlertAttributes
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const showIcon = attrs.type !== 'text'

  const variantData = useMemo(() => {
    return VARIANT_DATA[attrs.variant || 'info']
  }, [attrs.variant])

  const handleShowOperationPopover = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget)
  const handleCloseOperationPopover = () => setAnchorEl(null)

  return (
    <NodeViewWrapper
      ref={containerRef}
      className={`alert-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
      as={'div'}
      style={{
        marginLeft: (node.attrs as any)?.indent ? (node.attrs as any).indent * 32 : undefined,
        border: '1px solid',
        borderColor: variantData.color,
        // color: attrs.variant === 'default' ? 'var(--mui-palette-text-primary)' : variantData.color,
        borderRadius: '10px',
        padding: '12px 16px',
        lineHeight: 1.625,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        background: attrs.variant === 'default' ? 'var(--mui-palette-background-paper3)' : `color-mix(in srgb, ${variantData.color} 10%, transparent)`,
      }}
      onClick={handleShowOperationPopover}
    >
      {showIcon && (
        <Box sx={{
          pt: '2px',
          lineHeight: 1,
          color: attrs.variant === 'default' ? 'text.disabled' : variantData.color,
        }}>{variantData.icon}</Box>
      )}
      <Box sx={{
        flex: 1,
        width: 0,
        'code': {
          borderColor: attrs.variant === 'default' ? '' : `color-mix(in srgb, ${variantData.color} 30%, transparent) !important`,
          bgcolor: attrs.variant === 'default' ? '' : `color-mix(in srgb, ${variantData.color} 10%, transparent) !important`,
        }
      }}>
        <NodeViewContent as={'div'} />
      </Box>

      {editor.isEditable && (
        <FloatingPopover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseOperationPopover}
          placement="top"
        >
          <Stack direction={'row'} alignItems={'center'} sx={{ p: 0.5 }}>
            <ToolbarItem
              icon={<Information2FillIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />}
              tip='信息'
              onClick={() => updateAttributes({ variant: 'info' })}
              className={attrs.variant === 'info' ? 'tool-active' : ''}
            />
            <ToolbarItem
              icon={<ErrorWarningFillIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />}
              tip='警告'
              onClick={() => updateAttributes({ variant: 'warning' })}
              className={attrs.variant === 'warning' ? 'tool-active' : ''}
            />
            <ToolbarItem
              icon={<CloseCircleFillIcon sx={{ fontSize: '1rem', color: 'error.main' }} />}
              tip='错误'
              onClick={() => updateAttributes({ variant: 'error' })}
              className={attrs.variant === 'error' ? 'tool-active' : ''}
            />
            <ToolbarItem
              icon={<CheckboxCircleFillIcon sx={{ fontSize: '1rem', color: 'success.main' }} />}
              tip='成功'
              onClick={() => updateAttributes({ variant: 'success' })}
              className={attrs.variant === 'success' ? 'tool-active' : ''}
            />
            <ToolbarItem
              icon={<UserSmileFillIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />}
              tip='默认'
              onClick={() => updateAttributes({ variant: 'default' })}
              className={attrs.variant === 'default' ? 'tool-active' : ''}
            />

            <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'divider' }} />

            <ToolbarItem
              icon={<TextIcon sx={{ fontSize: '1rem' }} />}
              tip='纯文字'
              onClick={() => updateAttributes({ type: 'text' })}
              className={attrs.type === 'text' ? 'tool-active' : ''}
            />
            <ToolbarItem
              icon={<ScrollToBottomLineIcon sx={{ transform: 'rotate(90deg)', fontSize: '1rem' }} />}
              tip='图标文字'
              onClick={() => updateAttributes({ type: 'icon' })}
              className={attrs.type === 'icon' ? 'tool-active' : ''}
            />
          </Stack>
        </FloatingPopover>
      )}
    </NodeViewWrapper>
  )
}

export default AlertView

