import { Box, Divider, Stack } from '@mui/material'
import { Editor } from '@tiptap/react'
import React, { useEffect, useState } from 'react'
import { ArrowGoBackLineIcon, ArrowGoForwardLineIcon, BoldIcon, DoubleQuotesLIcon, ItalicIcon, LinkIcon, MenuFold2FillIcon, StrikethroughIcon, SubscriptIcon, SuperscriptIcon, Table2Icon, UnderlineIcon } from '../component/Icons'
import { EditorAlignSelect, EditorCode, EditorFontBgColor, EditorFontColor, EditorFontSize, EditorHeading, EditorInsert, EditorListSelect, EditorMath, EditorMore, ToolbarItem } from '../component/Toolbar'

interface EditorToolbarProps {
  editor: Editor
}

const EditorToolbar = ({
  editor,
}: EditorToolbarProps) => {
  const [active, setActive] = useState({
    undo: false,
    redo: false,
    quote: false,
    bold: false,
    italic: false,
    strike: false,
    underline: false,
    superscript: false,
    subscript: false,
    details: false,
    table: false,
    link: false,
  })

  const updateSelection = () => {
    setActive({
      undo: editor.can().undo(),
      redo: editor.can().redo(),
      quote: editor.isActive('blockquote'),
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      strike: editor.isActive('strike'),
      underline: editor.isActive('underline'),
      superscript: editor.isActive('superscript'),
      subscript: editor.isActive('subscript'),
      details: editor.isActive('details'),
      table: editor.isActive('table'),
      link: editor.isActive('link'),
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

  return <Box className='editor-toolbar'>
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='center'
      flexWrap={'wrap'}
      sx={{
        height: '44px',
        '.MuiButton-root': {
          minWidth: '36px',
          p: 1,
          color: 'text.primary',
          '&.tool-active': {
            bgcolor: 'background.paper0',
            color: 'primary.main',
          },
          '&[disabled]': {
            color: 'text.disabled',
          }
        },
        '.MuiSelect-root': {
          minWidth: '36px',
          bgcolor: 'background.paper',
          '.MuiSelect-select': {
            p: '0 !important',
          },
          input: {
            display: 'none',
          },
          '&.tool-active': {
            bgcolor: 'background.paper0',
            color: 'primary.main',
            button: {
              color: 'primary.main',
            }
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderWidth: '0px !important',
          }
        }
      }}
    >
      <ToolbarItem
        tip={'撤销'}
        shortcutKey={['ctrl', 'Z']}
        icon={<ArrowGoBackLineIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!active.undo}
      />
      <ToolbarItem
        tip={'重做'}
        shortcutKey={['ctrl', 'Y']}
        icon={<ArrowGoForwardLineIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!active.redo}
      />
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
      <EditorHeading editor={editor} />
      <EditorFontSize editor={editor} />
      <EditorListSelect editor={editor} />
      <EditorAlignSelect editor={editor} />
      <ToolbarItem
        tip={'引用块'}
        shortcutKey={['ctrl', 'shift', 'B']}
        icon={<DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={active.quote ? "tool-active" : ""}
      />
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
      <ToolbarItem
        tip={'加粗'}
        shortcutKey={['ctrl', 'B']}
        icon={<BoldIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={active.bold ? "tool-active" : ""}
      />
      <ToolbarItem
        tip={'斜体'}
        shortcutKey={['ctrl', 'I']}
        icon={<ItalicIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={active.italic ? "tool-active" : ""}
      />
      <ToolbarItem
        tip={'删除线'}
        shortcutKey={['ctrl', 'shift', 'S']}
        icon={<StrikethroughIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={active.strike ? "tool-active" : ""}
      />
      <ToolbarItem
        tip={'下划线'}
        shortcutKey={['ctrl', 'U']}
        icon={<UnderlineIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={active.underline ? "tool-active" : ""}
      />
      <EditorFontColor editor={editor} />
      <EditorFontBgColor editor={editor} />
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
      <ToolbarItem
        tip={'上标'}
        shortcutKey={['ctrl', '.']}
        icon={<SuperscriptIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={active.superscript ? "tool-active" : ""}
      />
      <ToolbarItem
        tip={'下标'}
        shortcutKey={['ctrl', ',']}
        icon={<SubscriptIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={active.subscript ? "tool-active" : ""}
      />
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
      <ToolbarItem
        tip={'链接'}
        shortcutKey={['ctrl', 'k']}
        icon={<LinkIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => {
          const selection = editor.state.selection
          const start = selection.from
          const end = selection.to
          const text = editor.state.doc.textBetween(start, end, '')
          editor.chain().focus().setALink({ href: '', title: text }).run()
        }}
        className={active.link ? "tool-active" : ""}
      />
      <ToolbarItem
        tip={'折叠块'}
        shortcutKey={[]}
        icon={<MenuFold2FillIcon sx={{ fontSize: '1rem' }} />}
        onClick={() => {
          if (!active.details) {
            editor.chain().focus().setDetails().run()
          } else {
            editor.chain().focus().unsetDetails().run()
          }
        }}
        className={active.details ? "tool-active" : ""}
      />
      <EditorCode editor={editor} />
      <EditorMath editor={editor} />
      <ToolbarItem
        tip={'表格'}
        shortcutKey={[]}
        icon={<Table2Icon sx={{ fontSize: '1rem' }} />}
        onClick={() => editor.commands.insertTable({
          rows: 3,
          cols: 3,
          withHeaderRow: true,
        })}
        className={active.table ? "tool-active" : ""}
      />
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
      <EditorInsert editor={editor} />
      <EditorMore />
    </Stack>
  </Box>
}

export default EditorToolbar