import { Box, Divider, Stack } from '@mui/material';
import { Editor, useEditorState } from '@tiptap/react';
import React from 'react';
import {
  AiGenerate2Icon,
  ArrowGoBackLineIcon,
  ArrowGoForwardLineIcon,
  BoldIcon,
  CodeBoxLineIcon,
  CollapseHorizontalLine,
  EraserLineIcon,
  ExpandHorizontalLineIcon,
  ItalicIcon,
  LinkIcon,
  MarkPenLineIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  TooltipLineIcon,
  UnderlineIcon,
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
  ToolbarItem,
} from '../component/Toolbar';
import { ToolbarItemType } from '../type';
import { getLinkAttributesWithSelectedText, hasMarksInSelection } from '../util';

interface EditorToolbarProps {
  editor: Editor;
  menuInToolbarMore?: ToolbarItemType[];
  /**
   * Toolbar 模式
   * - advanced：展示全部工具
   * - simple：只展示常用工具，并尽量保持单行
   */
  mode?: 'simple' | 'advanced';
  onModeChange?: (mode: 'simple' | 'advanced') => void;
}

const EditorToolbar = ({
  editor,
  menuInToolbarMore,
  mode,
  onModeChange,
}: EditorToolbarProps) => {
  const [toolbarMode, setToolbarMode] = React.useState<'simple' | 'advanced'>(
    () => mode ?? 'advanced',
  );

  React.useEffect(() => {
    if (typeof mode !== 'undefined') {
      setToolbarMode(mode);
    }
  }, [mode]);

  const isSimpleMode = toolbarMode === 'simple';

  const handleToggleMode = React.useCallback(() => {
    const nextMode: 'simple' | 'advanced' = isSimpleMode
      ? 'advanced'
      : 'simple';
    setToolbarMode(nextMode);
    onModeChange?.(nextMode);
  }, [isSimpleMode, onModeChange]);

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
    isCodeBlock,
    isTooltip,
  } = useEditorState({
    editor,
    selector: (ctx) => ({
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
      isAiWriting: !!ctx.editor.storage?.aiWriting?.enabled,
      isCodeBlock: ctx.editor.isActive('codeBlock'),
      isTooltip: ctx.editor.isActive('tooltip'),
    }),
  });

  return (
    <Box className="editor-toolbar">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={isSimpleMode ? 'flex-start' : 'center'}
        flexWrap={isSimpleMode ? 'nowrap' : 'wrap'}
        sx={{
          minHeight: '44px',
          overflowX: isSimpleMode ? 'auto' : 'visible',
          columnGap: '1px',
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
        {!isSimpleMode &&
          editor.options.extensions.find((it) => it.name === 'aiWriting') && (
            <ToolbarItem
              text={'AI 伴写'}
              tip="开启后按下 Tab 键采纳建议"
              icon={<AiGenerate2Icon sx={{ fontSize: '1rem' }} />}
              onClick={() =>
                editor.chain().focus().setAiWriting(!isAiWriting).run()
              }
              className={isAiWriting ? 'tool-active' : ''}
            />
          )}
        {!isSimpleMode && (
          <>
            <EditorInsert editor={editor} />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.25, height: 20, alignSelf: 'center' }}
            />
          </>
        )}
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
          sx={{ mx: 0.25, height: 20, alignSelf: 'center' }}
        />
        <EditorHeading editor={editor} />
        {!isSimpleMode && <>
          <EditorFontSize editor={editor} />
          <EditorFontColor editor={editor} />
          <EditorFontBgColor editor={editor} />
        </>}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.25, height: 20, alignSelf: 'center' }}
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
        {!isSimpleMode && (
          <>
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
              tip={'文本提示'}
              icon={<TooltipLineIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => {
                if (isTooltip) {
                  editor.chain().focus().unsetTooltip().run()
                } else {
                  editor.chain().focus().toggleTooltip().run()
                }
              }}
              className={isTooltip ? 'tool-active' : ''}
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
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.25, height: 20, alignSelf: 'center' }}
            />
          </>
        )}
        <EditorListSelect editor={editor} />
        {isSimpleMode ? (
          <ToolbarItem
            tip={'代码块'}
            shortcutKey={['ctrl', 'alt', 'C']}
            icon={<CodeBoxLineIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={isCodeBlock ? 'tool-active' : ''}
          />
        ) : (
          <ToolbarItem
            tip={'链接'}
            shortcutKey={['ctrl', '1']}
            icon={<LinkIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => {
              const linkAttributes = getLinkAttributesWithSelectedText(editor)
              editor
                .chain()
                .focus()
                .setInlineLink({ href: '', ...linkAttributes })
                .run();
            }}
            className={isLink ? 'tool-active' : ''}
          />
        )}
        {!isSimpleMode && (
          <>
            <EditorAlignSelect editor={editor} />
            <EditorVerticalAlignSelect editor={editor} />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.25, height: 20, alignSelf: 'center' }}
            />
            <EditorMore more={menuInToolbarMore} />
          </>
        )}
        {isSimpleMode && menuInToolbarMore?.length ? (
          <EditorMore more={menuInToolbarMore} />
        ) : null}
        {mode === 'simple' && (
          <ToolbarItem
            tip={isSimpleMode ? '切换为复杂模式' : '切换为简单模式'}
            icon={
              isSimpleMode ? (
                <ExpandHorizontalLineIcon sx={{ fontSize: '1rem' }} />
              ) : (
                <CollapseHorizontalLine sx={{ fontSize: '1rem' }} />
              )
            }
            onClick={handleToggleMode}
          />
        )}
      </Stack>
    </Box>
  );
};

export default EditorToolbar;
