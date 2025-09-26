import { Box, Divider, Stack } from '@mui/material';
import { Editor } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import {
  AiGenerate2Icon,
  ArrowGoBackLineIcon,
  ArrowGoForwardLineIcon,
  BoldIcon,
  EraserLineIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon
} from '../component/Icons';
import {
  EditorAlignSelect,
  EditorFontBgColor,
  EditorFontColor,
  EditorFontSize,
  EditorHeading,
  EditorInsert,
  EditorListSelect,
  EditorMore,
  EditorVerticalAlignSelect,
  ToolbarItem
} from '../component/Toolbar';
import { ToolbarItemType } from '../type';

interface EditorToolbarProps {
  editor: Editor;
  menuInToolbarMore?: ToolbarItemType[];
}

const EditorToolbar = ({ editor, menuInToolbarMore }: EditorToolbarProps) => {

  const [active, setActive] = useState({
    undo: false,
    redo: false,
    format: false,
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
    aiWriting: false,
  });

  const updateSelection = () => {
    setActive({
      undo: editor.can().chain().undo().run() ?? false,
      redo: editor.can().chain().redo().run() ?? false,
      format: editor.can().chain().unsetAllMarks().run() ?? false,
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
      aiWriting: editor.storage.aiWriting.enabled,
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
        {editor.options.extensions.find(it => it.name === 'aiWriting') && <ToolbarItem
          text={'AI 伴写'}
          tip='开启后按下 Tab 键采纳建议'
          icon={<AiGenerate2Icon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().setAiWriting(!active.aiWriting).run()}
          className={active.aiWriting ? 'tool-active' : ''}
        />}
        <EditorInsert editor={editor} />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
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
        <ToolbarItem
          tip={'清除格式'}
          icon={<EraserLineIcon sx={{ fontSize: '1rem' }} />}
          disabled={!active.format}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
        <EditorHeading editor={editor} />
        <EditorFontSize editor={editor} />
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
        <ToolbarItem
          tip={'上标'}
          shortcutKey={['ctrl', '.']}
          icon={<SuperscriptIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={active.superscript ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'下标'}
          shortcutKey={['ctrl', ',']}
          icon={<SubscriptIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={active.subscript ? 'tool-active' : ''}
        />
        <EditorFontColor editor={editor} />
        <EditorFontBgColor editor={editor} />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
        <EditorListSelect editor={editor} />
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
        <EditorAlignSelect editor={editor} />
        <EditorVerticalAlignSelect editor={editor} />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
        />
        <EditorMore more={menuInToolbarMore} />
      </Stack>
    </Box>
  );
};

export default EditorToolbar;
