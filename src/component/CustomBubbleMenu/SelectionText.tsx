import { Box, Button, Divider, Paper, Stack, useTheme } from '@mui/material'
import { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { BoldIcon, FontFamilyIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from '@yu-cq/tiptap/component/Icons'
import React, { useEffect, useState } from 'react'
import { ToolbarItem } from '../Toolbar'

const SelectionText = (props: { editor: Editor }) => {
  const theme = useTheme()

  const THEME_TEXT_COLOR = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    '#D8A47F',
    '#73B5F0',
    '#CDDFA0',
    theme.palette.text.primary,
    theme.palette.text.secondary,
    theme.palette.text.disabled,
    theme.palette.common.white,
  ]

  const THEME_TEXT_BG_COLOR = [
    '#e7bdff',
    '#FFE0B2',
    '#F8BBD0',
    '#FFCDD2',
    '#FFECB3',
    '#FFCCBC',
    '#B3E5FC',
    '#C8E6C9',
    '#B2EBF2',
    '#BBDEFB',
    '#DCEDC8',
  ]

  const { editor } = props
  const [active, setActive] = useState({
    quote: false,
    bold: false,
    italic: false,
    strike: false,
    underline: false,
  })
  const [showColorPicker, setShowColorPicker] = useState(false)

  const updateSelection = () => {
    setActive({
      quote: editor.isActive('blockquote'),
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      strike: editor.isActive('strike'),
      underline: editor.isActive('underline'),
    })
  }

  useEffect(() => {
    editor.on('selectionUpdate', updateSelection);
    editor.on('transaction', updateSelection);
    return () => {
      editor.off('selectionUpdate', updateSelection);
      editor.off('transaction', updateSelection);
    };
  }, [editor]);

  if (!editor.isEditable) {
    return null
  }

  return <BubbleMenu
    editor={editor}
    pluginKey={'bubble-menu'}
    options={{
      placement: 'bottom',
      offset: 8,
    }}
    shouldShow={({ editor, from, to }: { editor: Editor, from: number, to: number }) => {
      if (editor.state.selection.empty
        || editor.isActive('image')
        || editor.isActive('link')
        || editor.isActive('code')
        || editor.isActive('codeBlock')
        || editor.isActive('emoji')
      ) {
        return false
      }
      let isTextOnly = true
      editor.state.doc.nodesBetween(from, to, (node) => {
        if (node.type.name !== 'text' && node.type.name !== 'paragraph' && node.type.name !== 'doc') {
          if (!node.isText && !node.isTextblock) {
            isTextOnly = false
            return false
          }
        }
      })
      return isTextOnly
    }}
  >
    <Paper sx={{
      p: 0.5,
      borderRadius: 'var(--mui-shape-borderRadius)',
    }}>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <ToolbarItem
          icon={<BoldIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={active.bold ? "tool-active" : ""}
        />
        <ToolbarItem
          icon={<ItalicIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={active.italic ? "tool-active" : ""}
        />
        <ToolbarItem
          icon={<StrikethroughIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={active.strike ? "tool-active" : ""}
        />
        <ToolbarItem
          icon={<UnderlineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={active.underline ? "tool-active" : ""}
        />
        <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'divider' }} />
        <ToolbarItem
          icon={<FontFamilyIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
      </Stack>
      {showColorPicker && <Box sx={{
        mt: 0.5,
        pt: 0.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        boxSizing: 'border-box',
      }}>
        <Box sx={{ fontSize: 14, mb: 0.5, color: 'text.secondary' }}>文字颜色</Box>
        <Stack direction={'row'} flexWrap={'wrap'} gap={0.5} sx={{ width: 'calc(36px * 5 + 9px)' }}>
          {THEME_TEXT_COLOR.map((c) => (
            <Box key={c} sx={{
              width: '1.5rem',
              height: '1.5rem',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'divider',
              boxSizing: 'border-box',
              borderRadius: 'var(--mui-shape-borderRadius)',
              bgcolor: c,
            }} onClick={() => {
              editor.chain().focus().setColor(c).run()
            }} />
          ))}
        </Stack>
        <Box sx={{ fontSize: 14, mb: 0.5, mt: 1, color: 'text.secondary' }}>背景颜色</Box>
        <Stack direction={'row'} flexWrap={'wrap'} gap={0.5} sx={{ width: 'calc(36px * 5 + 9px)' }}>
          {THEME_TEXT_BG_COLOR.map((c) => (
            <Box key={c} sx={{
              width: '1.5rem',
              height: '1.5rem',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'divider',
              boxSizing: 'border-box',
              borderRadius: 'var(--mui-shape-borderRadius)',
              bgcolor: c,
            }} onClick={() => {
              editor.chain().focus().setBackgroundColor(c).run()
            }} />
          ))}
        </Stack>
        <Button fullWidth size='small' sx={{ mt: 1, color: 'initial' }}
          onClick={() => {
            editor.chain().focus().setColor(theme.palette.text.primary).setBackgroundColor(theme.palette.background.paper).run()
          }}
        >恢复默认</Button>
      </Box>}
    </Paper>
  </BubbleMenu>
}

export default SelectionText
