import { Divider, Paper, Stack } from '@mui/material'
import { Editor } from '@tiptap/react'
// @ts-ignore
import { BoldIcon, CodeLineIcon, FontColorIcon, ItalicIcon, MarkupLineIcon, StrikethroughIcon, SubscriptIcon, SuperscriptIcon, UnderlineIcon } from '@cq/tiptap/component/Icons'
import { BubbleMenu } from '@tiptap/react/menus'
import React, { useState } from 'react'
import ToolItem from '../ToolItem'
import ColorPicker from './ColorPicker'

const SelectionText = (props: { editor: Editor }) => {
  const { editor } = props
  const [colorPickerType, setColorPickerType] = useState<string>('')

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
      width: 304,
      maxHeight: 300,
    }}>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <ToolItem
          icon={<BoldIcon />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        />
        <ToolItem
          icon={<ItalicIcon />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        />
        <ToolItem
          icon={<StrikethroughIcon />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
        />
        <ToolItem
          icon={<UnderlineIcon />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        />
        <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'var(--mui-palette-divider)' }} />
        <ToolItem
          icon={<FontColorIcon />}
          isActive={colorPickerType === 'text'}
          onClick={() => colorPickerType === 'text' ? setColorPickerType('') : setColorPickerType('text')}
        />
        <ToolItem
          icon={<MarkupLineIcon />}
          isActive={colorPickerType === 'bg'}
          onClick={() => colorPickerType === 'bg' ? setColorPickerType('') : setColorPickerType('bg')}
        />
        <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'var(--mui-palette-divider)' }} />
        <ToolItem
          icon={<SubscriptIcon />}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
        />
        <ToolItem
          icon={<SuperscriptIcon />}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
        />
        <Divider orientation='vertical' flexItem sx={{ height: '1rem', mx: 0.5, alignSelf: 'center', borderColor: 'var(--mui-palette-divider)' }} />
        <ToolItem
          icon={<CodeLineIcon />}
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
        />
      </Stack>
      {colorPickerType && <ColorPicker
        editor={editor}
        defaultColor={colorPickerType === 'text' ? '#000000' : '#FFFFFF'}
        colorPickerType={colorPickerType}
        setColorPickerType={setColorPickerType}
      />}
    </Paper>
  </BubbleMenu>
}

export default SelectionText
