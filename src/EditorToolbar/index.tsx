import { Box, Divider, Stack } from '@mui/material';
import { Editor, useEditorState } from '@tiptap/react';
import React from 'react';
import {
  AiGenerate2Icon,
  ArrowGoBackLineIcon,
  ArrowGoForwardLineIcon,
  BoldIcon,
  EraserLineIcon,
  ItalicIcon,
  LinkIcon,
  MarkPenLineIcon,
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
import { hasMarksInSelection } from '../util';

interface EditorToolbarProps {
  editor: Editor;
  menuInToolbarMore?: ToolbarItemType[];
}

const EditorToolbar = ({ editor, menuInToolbarMore }: EditorToolbarProps) => {

  const {
    isUndo,
    isRedo,
    isFormat,
    isBold,
    isItalic,
    isStrike,
    isUnderline,
    isSuperscript,
    isSubscript,
    isLink,
    isAiWriting,
    isHighlight,
  } = useEditorState({
    editor,
    selector: ctx => ({
      isUndo: ctx.editor.can().chain().undo().run() ?? false,
      isRedo: ctx.editor.can().chain().redo().run() ?? false,
      isFormat: hasMarksInSelection(ctx.editor.state),
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isStrike: ctx.editor.isActive('strike'),
      isUnderline: ctx.editor.isActive('underline'),
      isSuperscript: ctx.editor.isActive('superscript'),
      isSubscript: ctx.editor.isActive('subscript'),
      isLink: ctx.editor.isActive('link'),
      isHighlight: ctx.editor.isActive('highlight'),
      isAiWriting: !!(ctx.editor.storage?.aiWriting?.enabled),
    }),
  });

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
          onClick={() => editor.chain().focus().setAiWriting(!isAiWriting).run()}
          className={isAiWriting ? 'tool-active' : ''}
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
          disabled={!isUndo}
        />
        <ToolbarItem
          tip={'重做'}
          shortcutKey={['ctrl', 'Y']}
          icon={<ArrowGoForwardLineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!isRedo}
        />
        <ToolbarItem
          tip={'清除格式'}
          icon={<EraserLineIcon sx={{ fontSize: '1rem' }} />}
          disabled={!isFormat}
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
          className={isBold ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'斜体'}
          shortcutKey={['ctrl', 'I']}
          icon={<ItalicIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={isItalic ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'删除线'}
          shortcutKey={['ctrl', 'shift', 'S']}
          icon={<StrikethroughIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={isStrike ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'下划线'}
          shortcutKey={['ctrl', 'U']}
          icon={<UnderlineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={isUnderline ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'高亮'}
          shortcutKey={['ctrl', 'shift', 'H']}
          icon={<MarkPenLineIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={isHighlight ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'上标'}
          shortcutKey={['ctrl', '.']}
          icon={<SuperscriptIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={isSuperscript ? 'tool-active' : ''}
        />
        <ToolbarItem
          tip={'下标'}
          shortcutKey={['ctrl', ',']}
          icon={<SubscriptIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={isSubscript ? 'tool-active' : ''}
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
          className={isLink ? 'tool-active' : ''}
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
