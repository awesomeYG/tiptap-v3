import { Box, Divider, Stack } from '@mui/material';
import { Editor } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import {
  ArrowGoBackLineIcon,
  ArrowGoForwardLineIcon,
  BoldIcon,
  DoubleQuotesLIcon,
  Information2LineIcon,
  ItalicIcon,
  LinkIcon,
  MenuFold2FillIcon,
  StrikethroughIcon,
  Table2Icon,
  UnderlineIcon,
  WindowFillIcon,
} from '../component/Icons';
import {
  EditorAlignSelect,
  EditorCode,
  EditorFontBgColor,
  EditorFontColor,
  EditorFontSize,
  EditorHeading,
  EditorInsert,
  EditorListSelect,
  EditorMath,
  EditorMore,
  EditorScript,
  EditorVerticalAlignSelect,
  ToolbarItem,
} from '../component/Toolbar';
import TableSizePicker from '../component/Toolbar/TableSizePicker';
import { ToolbarItemType } from '../type';

interface EditorToolbarProps {
  editor: Editor;
  menuInToolbarMore?: ToolbarItemType[];
}

const EditorToolbar = ({ editor, menuInToolbarMore }: EditorToolbarProps) => {
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
    alert: false,
    iframe: false,
  });

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
      alert: editor.isActive('alert'),
      iframe: editor.isActive('iframe'),
    });
  };

  useEffect(() => {
    editor.on('selectionUpdate', updateSelection);
    editor.on('transaction', updateSelection);
    return () => {
      editor.off('selectionUpdate', updateSelection);
      editor.off('transaction', updateSelection);
    };
  }, [editor]);

  return (
    <Box className="editor-toolbar">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap={'wrap'}
        sx={{
          minHeight: '44px',
          '.MuiSelect-root': {
            minWidth: '36px',
            bgcolor: 'background.paper',
            '.MuiSelect-select': {
              p: '0 !important',
            },
            input: {
              display: 'none',
            },
            '&:hover': {
              bgcolor: 'background.paper2',
            },
            '&.tool-active': {
              bgcolor: 'background.paper2',
              color: 'primary.main',
              button: {
                color: 'primary.main',
              },
            },
            '.MuiOutlinedInput-notchedOutline': {
              borderWidth: '0px !important',
            },
          },
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
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
        <EditorHeading editor={editor} />
        <EditorFontSize editor={editor} />
        <EditorListSelect editor={editor} />
        <EditorAlignSelect editor={editor} />
        <EditorVerticalAlignSelect editor={editor} />
        <ToolbarItem
          tip={'引用块'}
          shortcutKey={['ctrl', 'shift', 'B']}
          icon={<DoubleQuotesLIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={active.quote ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'警告提示'}
          icon={<Information2LineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleAlert({ type: 'icon', variant: 'info' }).run()}
          className={active.alert ? 'tool-active' : ''}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
        <ToolbarItem
          tip={'加粗'}
          shortcutKey={['ctrl', 'B']}
          icon={<BoldIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={active.bold ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'斜体'}
          shortcutKey={['ctrl', 'I']}
          icon={<ItalicIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={active.italic ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'删除线'}
          shortcutKey={['ctrl', 'shift', 'S']}
          icon={<StrikethroughIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={active.strike ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'下划线'}
          shortcutKey={['ctrl', 'U']}
          icon={<UnderlineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={active.underline ? 'tool-active' : ''}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
        <EditorScript editor={editor} />
        <EditorFontColor editor={editor} />
        <EditorFontBgColor editor={editor} />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
        <ToolbarItem
          tip={'链接'}
          shortcutKey={['ctrl', '1']}
          icon={<LinkIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => {
            const selection = editor.state.selection;
            const start = selection.from;
            const end = selection.to;
            const text = editor.state.doc.textBetween(start, end, '');
            editor
              .chain()
              .focus()
              .setInlineLink({ href: '', title: text })
              .run();
          }}
          className={active.link ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'折叠块'}
          shortcutKey={['ctrl', '8']}
          icon={<MenuFold2FillIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => {
            if (!active.details) {
              editor.chain().focus().setDetails().run();
            } else {
              editor.chain().focus().unsetDetails().run();
            }
          }}
          className={active.details ? 'tool-active' : ''}
        />
        <EditorCode editor={editor} />
        <EditorMath editor={editor} />
        <ToolbarItem
          tip={'表格'}
          shortcutKey={['ctrl', '9']}
          icon={<Table2Icon sx={{ fontSize: '1rem' }} />}
          className={active.table ? 'tool-active' : ''}
          customComponent={<TableSizePicker
            onConfirm={(cols, rows) => {
              editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
            }}
          />}
        />
        <ToolbarItem
          tip={'iframe'}
          icon={<WindowFillIcon sx={{ fontSize: '1rem' }} />}
          onClick={() =>
            editor.commands.setIframe({
              src: '',
              width: 760,
              height: 400,
            })
          }
          className={active.iframe ? 'tool-active' : ''}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
        <EditorInsert editor={editor} />
        <EditorMore more={menuInToolbarMore} />
      </Stack>
    </Box>
  );
};

export default EditorToolbar;
