import { BoldIcon, CodeLineIcon, EraserLineIcon, ItalicIcon, LinkIcon, MarkPenLineIcon, StrikethroughIcon, UnderlineIcon } from '@ctzhian/tiptap/component/Icons'
import { MenuItem } from '@ctzhian/tiptap/type'
import { hasMarksInSelection } from '@ctzhian/tiptap/util'
import { Paper, Stack } from '@mui/material'
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
        editor.isActive('iframe')
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
          // tip='加粗'
          // shortcutKey={['ctrl', 'B']}
          icon={<BoldIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={isBold ? "tool-active" : ""}
        />
        <ToolbarItem
          // tip='斜体'
          // shortcutKey={['ctrl', 'I']}
          icon={<ItalicIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={isItalic ? "tool-active" : ""}
        />
        <ToolbarItem
          // tip='删除线'
          // shortcutKey={['ctrl', 'shift', 'S']}
          icon={<StrikethroughIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={isStrike ? "tool-active" : ""}
        />
        <ToolbarItem
          // tip='下划线'
          // shortcutKey={['ctrl', 'U']}
          icon={<UnderlineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={isUnderline ? "tool-active" : ""}
        />
        <ToolbarItem
          // tip='高亮'
          // shortcutKey={['ctrl', 'shift', 'H']}
          icon={<MarkPenLineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={isHighlight ? "tool-active" : ""}
        />
        {/* <ToolbarItem
          tip='上标'
          icon={<SuperscriptIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={isSuperscript ? "tool-active" : ""}
        />
        <ToolbarItem
          tip='下标'
          icon={<SubscriptIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={isSubscript ? "tool-active" : ""}
        /> */}
        <ToolbarItem
          // tip='行内代码'
          // shortcutKey={['ctrl', 'E']}
          icon={<CodeLineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={isCode ? "tool-active" : ""}
        />
        <ToolbarItem
          // tip='文本格式化'
          icon={<EraserLineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          disabled={!hasAnyMarks}
        />
        <ToolbarItem
          // tip='插入链接'
          icon={<LinkIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => {
            const selection = editor.state.selection
            const start = selection.from
            const end = selection.to
            const text = editor.state.doc.textBetween(start, end, '')
            editor.chain().focus().setInlineLink({ href: '', title: text }).run()
          }}
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
      {/* <Box sx={{
        mt: 0.5,
        p: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        boxSizing: 'border-box',
      }}>
        <Stack direction={'row'} alignItems={'center'} sx={{ fontSize: 14, mb: 0.5 }}>
          <Box sx={{ color: 'text.secondary' }}>文字颜色</Box>
          <IconButton size='small' onClick={() => {
            editor.chain().focus().setColor('').run()
          }} sx={{
            color: 'text.disabled',
            ':hover': {
              color: 'primary.main',
            }
          }}>
            <ResetLeftFillIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Stack>
        <Stack direction={'row'} flexWrap={'wrap'} gap={0.5}>
          {THEME_TEXT_COLOR.map((c) => (
            <Box key={c} sx={{
              width: '1.5rem',
              height: '1.5rem',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: c === theme.palette.common.white ? 'divider' : c,
              boxSizing: 'border-box',
              borderRadius: 'var(--mui-shape-borderRadius)',
              bgcolor: c,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }} onClick={() => {
              editor.chain().focus().setColor(c).run()
            }} />
          ))}
        </Stack>
        <Stack direction={'row'} alignItems={'center'} sx={{ fontSize: 14, mb: 0.5, mt: 2 }}>
          <Box sx={{ color: 'text.secondary' }}>背景颜色</Box>
          <IconButton size='small' onClick={() => {
            editor.chain().focus().setBackgroundColor('').run()
          }} sx={{
            color: 'text.disabled',
            ':hover': {
              color: 'primary.main',
            }
          }}>
            <ResetLeftFillIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Stack>
        <Stack direction={'row'} flexWrap={'wrap'} gap={0.5}>
          {THEME_TEXT_BG_COLOR.map((c) => (
            <Box key={c} sx={{
              width: '1.5rem',
              height: '1.5rem',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: c === theme.palette.common.white ? 'divider' : c,
              boxSizing: 'border-box',
              borderRadius: 'var(--mui-shape-borderRadius)',
              bgcolor: c,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }} onClick={() => {
              editor.chain().focus().setBackgroundColor(c).run()
            }} />
          ))}
        </Stack>
      </Box> */}
    </Paper>
  </BubbleMenu>
}

export default CustomBubbleMenu
