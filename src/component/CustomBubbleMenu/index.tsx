import { BoldIcon, CodeLineIcon, EraserLineIcon, ItalicIcon, MarkPenLineIcon, StrikethroughIcon, UnderlineIcon } from '@ctzhian/tiptap/component/Icons'
import { MenuItem } from '@ctzhian/tiptap/type'
import { hasMarksInSelection } from '@ctzhian/tiptap/util'
import { Divider, Paper, Stack } from '@mui/material'
import { Editor, useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import React from 'react'
import { ToolbarItem } from '../Toolbar'

export interface CustomBubbleMenuProps {
  editor: Editor
  more?: MenuItem[]
}

const CustomBubbleMenu = ({ editor, more }: CustomBubbleMenuProps) => {
  // const theme = useTheme()

  // const THEME_TEXT_COLOR = [
  //   theme.palette.primary.main,
  //   theme.palette.success.main,
  //   theme.palette.warning.main,
  //   theme.palette.error.main,
  //   '#D8A47F',
  //   '#73B5F0',
  //   '#CDDFA0',
  //   theme.palette.text.primary,
  //   theme.palette.text.secondary,
  //   theme.palette.text.disabled,
  //   theme.palette.common.white,
  // ]

  // const THEME_TEXT_BG_COLOR = [
  //   '#e7bdff',
  //   '#FFE0B2',
  //   '#F8BBD0',
  //   '#FFCDD2',
  //   '#FFECB3',
  //   '#FFCCBC',
  //   '#B3E5FC',
  //   '#C8E6C9',
  //   '#B2EBF2',
  //   '#BBDEFB',
  //   '#DCEDC8',
  // ]

  const {
    isBold,
    isItalic,
    isStrike,
    isUnderline,
    isCode,
    isHighlight,
    hasAnyMarks,
    // isSuperscript,
    // isSubscript,
  } = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isStrike: ctx.editor.isActive('strike'),
      isUnderline: ctx.editor.isActive('underline'),
      isCode: ctx.editor.isActive('code'),
      isHighlight: ctx.editor.isActive('highlight'),
      hasAnyMarks: hasMarksInSelection(ctx.editor.state),
      // isSuperscript: ctx.editor.isActive('superscript'),
      // isSubscript: ctx.editor.isActive('subscript'),
    })
  })

  if (editor && !editor.isEditable) {
    return null
  }

  return <BubbleMenu
    editor={editor}
    pluginKey={'bubble-menu'}
    updateDelay={750}
    options={{
      placement: 'bottom',
      offset: 8,
      flip: true,
    }}
    shouldShow={() => {
      // 表格多选单元格时禁止弹出气泡菜单
      // if (editor.state.selection.constructor.name === '_CellSelection') {
      //   const cellSelection = editor.state.selection as any;
      //   if (cellSelection.ranges.length > 1) {
      //     return false
      //   }
      //   if (cellSelection.$anchorCell && cellSelection.$headCell) {
      //     return cellSelection.$anchorCell.pos !== cellSelection.$headCell.pos;
      //   }
      // }
      if (
        editor.state.selection.empty ||
        editor.isActive('image') ||
        editor.isActive('video') ||
        editor.isActive('audio') ||
        editor.isActive('emoji') ||
        editor.isActive('codeBlock') ||
        editor.isActive('blockMath') ||
        editor.isActive('inlineMath') ||
        editor.isActive('blockLink') ||
        editor.isActive('inlineLink') ||
        editor.isActive('blockAttachment') ||
        editor.isActive('inlineAttachment') ||
        editor.isActive('horizontalRule') ||
        editor.isActive('iframe') ||
        editor.isActive('yamlFormat') ||
        editor.isActive('flow')
      ) {
        return false
      }
      return true
    }}
  >
    <Paper sx={{
      p: 0.5,
      borderRadius: 'var(--mui-shape-borderRadius)',
    }}>
      <Stack direction={'row'} alignItems={'center'}>
        <ToolbarItem
          icon={<BoldIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={isBold ? "tool-active" : ""}
        />
        <ToolbarItem
          icon={<ItalicIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={isItalic ? "tool-active" : ""}
        />
        <ToolbarItem
          icon={<StrikethroughIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={isStrike ? "tool-active" : ""}
        />
        <ToolbarItem
          icon={<UnderlineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={isUnderline ? "tool-active" : ""}
        />
        <ToolbarItem
          icon={<MarkPenLineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={isHighlight ? "tool-active" : ""}
        />
        <ToolbarItem
          icon={<CodeLineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={isCode ? "tool-active" : ""}
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
        <ToolbarItem
          icon={<EraserLineIcon sx={{ fontSize: '1rem' }} />}
          text='清除格式'
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          disabled={!hasAnyMarks}
        />
        {more?.map((item) => (
          <ToolbarItem
            key={item.key}
            tip={item.label as string}
            icon={item.icon || <></>}
            onClick={item.onClick}
          />
        ))}
      </Stack>
    </Paper>
  </BubbleMenu>
}

export default CustomBubbleMenu
