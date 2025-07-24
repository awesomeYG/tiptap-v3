import { Paper, Stack } from '@mui/material'
import { Editor } from '@tiptap/react'
// @ts-ignore
import { BubbleMenu } from '@tiptap/react/menus'
import React from 'react'
import { BoldIcon, CodeLineIcon, ItalicIcon, StrikethroughIcon, SubscriptIcon, SuperscriptIcon, UnderlineIcon } from '../Icons'
import ToolItem from '../ToolItem'

const CustomBubbleMenu = (props: { editor: Editor }) => {
  const { editor } = props

  return <BubbleMenu
    editor={editor}
    autoPlacement
    shouldShow={({ editor }: { editor: Editor }) => {
      if (editor.state.selection.empty
        || editor.isActive('image')
        || editor.isActive('link')
        || editor.isActive('code')
        || editor.isActive('codeBlock')
        || editor.isActive('emoji')
      ) {
        return false
      }
      return true
      // let isTextOnly = true
      // editor.state.doc.nodesBetween(from, to, (node) => {
      //   console.log(node)
      //   if (node.type.name !== 'text' && node.type.name !== 'paragraph' && node.type.name !== 'doc') {
      //     if (!node.isText && !node.isTextblock) {
      //       isTextOnly = false
      //       return false
      //     }
      //   }
      // })
      // return isTextOnly
    }}
    pluginKey={'bubble-menu'}
    options={{ placement: 'right', offset: 8 }}
  >
    <Paper sx={{
      p: 0.5,
      maxHeight: 300,
    }}>
      <Stack direction={'row'} alignItems={'center'} gap={0.5}>
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
          icon={<SubscriptIcon />}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
        />
        <ToolItem
          icon={<SuperscriptIcon />}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
        />
        <ToolItem
          icon={<CodeLineIcon />}
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
        />
        <ToolItem
          icon={<UnderlineIcon />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        />
      </Stack>
    </Paper>
  </BubbleMenu>
}

export default CustomBubbleMenu
