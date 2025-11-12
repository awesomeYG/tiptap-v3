import { CollapseIcon, ExpendIcon, Editor as TiptapEditor } from '@ctzhian/tiptap';
import { alpha, Box, Divider, IconButton, Stack, useTheme } from "@mui/material";
import { Editor } from '@tiptap/core';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import AceEditor from "react-ace";
import { MARKDOWN_EDITOR_PLACEHOLDER } from '../contants/markdown-placeholder';
import { UploadFunction } from '../type';
import EditorMarkdownToolbar from './Toolbar';
import UploadProgress from './UploadProgress';
import { insertInlineTool } from './util';

import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-github';

interface EditorMarkdownProps {
  editor: Editor;
  value?: string;
  readOnly?: string;
  placeholder?: string;
  height: number | string;
  onUpload?: UploadFunction;
  defaultDisplayMode?: DisplayMode;
  splitMode?: boolean;
  showToolbar?: boolean;
  showLineNumbers?: boolean;
  onAceChange?: (value: string) => void;
  onTiptapChange?: (value: string) => void;
}

export interface MarkdownEditorRef {
  scrollToHeading: (headingText: string) => void;
}

type DisplayMode = 'edit' | 'preview' | 'split';

const EditorMarkdown = forwardRef<MarkdownEditorRef, EditorMarkdownProps>(({
  editor,
  value,
  placeholder,
  onAceChange,
  height,
  onUpload,
  readOnly = false,
  splitMode = false,
  defaultDisplayMode = 'edit',
  showToolbar = true,
  showLineNumbers = true,
}, ref) => {
  const theme = useTheme();
  const aceEditorRef = useRef<AceEditor>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(defaultDisplayMode);
  const [isExpend, setIsExpend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const EditorHeight = useMemo(() => {
    return isExpend ? 'calc(100vh - 45px)' : height;
  }, [isExpend, height]);

  const onChange = (value: string) => {
    onAceChange?.(value);
    editor.commands.setContent(value, {
      contentType: 'markdown'
    });
  }

  const handleFileUpload = async (file: File, expectedType?: 'image' | 'video' | 'audio' | 'attachment') => {
    if (!onUpload || !aceEditorRef.current) return;
    try {
      setLoading?.(true);
      setFileName(file.name);
      const url = await onUpload(file, (progress) => {
        setProgress(Math.round(progress.progress * 100));
      });
      let content = '';
      if (expectedType === 'image') {
        content = `![${file.name}](${url})`;
      } else if (expectedType === 'video') {
        content = `<video src="${url}" controls="true"></video>`;
      } else if (expectedType === 'audio') {
        content = `<audio src="${url}" controls="true"></audio>`;
      } else {
        content = `<a href="${url}" download="${file.name}">${file.name}</a>`;
      }
      insertInlineTool(aceEditorRef.current, { left: content, position: 1000 });
    } catch (error) {
      console.error('文件上传失败:', error);
    } finally {
      setLoading?.(false);
      setFileName('');
      setProgress(0);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    if (!['edit', 'split'].includes(displayMode) || loading || !!readOnly) return;
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleFileUpload(file, 'image');
        }
        break;
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDrop = async (e: React.DragEvent) => {
    // 只在编辑模式下处理
    if (!['edit', 'split'].includes(displayMode)) return;

    e.preventDefault();
    e.stopPropagation();

    // 先聚焦编辑器，确保光标位置正确
    if (aceEditorRef.current) {
      aceEditorRef.current.editor.focus();
    }

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    const attachmentFiles = files.filter(file => !file.type.startsWith('image/') && !file.type.startsWith('video/') && !file.type.startsWith('audio/'));

    for (const file of imageFiles) {
      await handleFileUpload(file, 'image');
    }
    for (const file of videoFiles) {
      await handleFileUpload(file, 'video');
    }
    for (const file of audioFiles) {
      await handleFileUpload(file, 'audio');
    }
    for (const file of attachmentFiles) {
      await handleFileUpload(file, 'attachment');
    }
  }

  useImperativeHandle(ref, () => ({
    scrollToHeading: (headingText: string) => {
      if (!aceEditorRef.current) return;

      const aceEditor = aceEditorRef.current.editor;
      const lines = value?.split('\n') || [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#')) {
          const titleText = line.replace(/^#+\s*/, '').trim();
          if (titleText === headingText.trim()) {
            aceEditor.gotoLine(i + 1, 0, true);
            aceEditor.scrollToLine(i, false, true, () => { });
            break;
          }
        }
      }
    },
  }));

  useEffect(() => {
    if (editor.isEditable) {
      editor.setEditable(false);
    }
  }, [editor]);

  return <Box sx={{
    position: 'relative',
    bgcolor: 'background.default',
    ...(isExpend && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2000,
    }),
  }}>
    {loading && <UploadProgress progress={progress} fileName={fileName} />}
    {showToolbar && <Stack
      direction='row'
      alignItems={'center'}
      justifyContent={'space-between'}
      sx={{
        p: 0.5,
        border: '1px solid',
        borderColor: 'divider',
        borderBottom: 'none',
        borderRadius: '4px 4px 0 0',
        fontSize: 12,
        lineHeight: '20px',
        color: 'text.tertiary',
        '.md-display-mode-active': {
          color: 'primary.main',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
        },
        '.md-display-mode:hover': {
          borderRadius: '4px',
          bgcolor: 'background.paper3',
        },
      }}
    >
      <EditorMarkdownToolbar
        isExpend={isExpend}
        aceEditorRef={aceEditorRef}
        onFileUpload={handleFileUpload}
      />
      <Stack direction={'row'} alignItems={'center'} gap={1}>
        <IconButton color='inherit' onClick={() => setIsExpend(!isExpend)}>
          {isExpend ? <CollapseIcon sx={{ fontSize: '16px' }} /> : <ExpendIcon sx={{ fontSize: '16px' }} />}
        </IconButton>
        <Stack direction={'row'} alignItems={'center'} sx={{
          p: 0.5,
          borderRadius: '4px',
          border: '1px solid',
          borderColor: 'divider',
        }}>
          <Box
            className={displayMode === 'edit' ? 'md-display-mode-active' : 'md-display-mode'}
            sx={{ px: 1, py: 0.25, cursor: 'pointer', borderRadius: '4px' }}
            onClick={() => setDisplayMode('edit')}
          >
            编辑模式
          </Box>
          <Box
            className={
              displayMode === 'preview' ? 'md-display-mode-active' : 'md-display-mode'
            }
            sx={{ px: 1, py: 0.25, cursor: 'pointer', borderRadius: '4px' }}
            onClick={() => setDisplayMode('preview')}
          >
            预览模式
          </Box>
          {splitMode && <Box
            className={
              displayMode === 'split' ? 'md-display-mode-active' : 'md-display-mode'
            }
            sx={{ px: 1, py: 0.25, cursor: 'pointer', borderRadius: '4px' }}
            onClick={() => setDisplayMode('split')}
          >
            分屏模式
          </Box>}
        </Stack>
      </Stack>
    </Stack>}
    <Stack direction={'row'} alignItems={'stretch'} sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '0 0 4px 4px',
    }}>
      {['edit', 'split'].includes(displayMode) && (
        <Stack
          direction='column'
          onPaste={handlePaste}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            flex: 1,
            fontFamily: 'monospace',
            '.ace_placeholder': {
              transform: 'scale(1)',
              height: '100%',
              overflow: 'auto',
              width: '100%',
              fontStyle: 'normal',
            },
          }}
        >
          <AceEditor
            ref={aceEditorRef}
            mode='markdown'
            theme='github'
            value={value}
            onChange={onChange}
            name='project-doc-editor'
            wrapEnabled={true}
            readOnly={loading || !!readOnly}
            showPrintMargin={false}
            placeholder={placeholder || MARKDOWN_EDITOR_PLACEHOLDER}
            fontSize={16}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              showLineNumbers: showLineNumbers,
              tabSize: 2,
            }}
            style={{
              width: '100%',
              height: EditorHeight,
            }}
          />
        </Stack>
      )}
      {displayMode === 'split' && (
        <Divider orientation='vertical' flexItem />
      )}
      {['split', 'preview'].includes(displayMode) && (
        <Box
          id='markdown-preview-container'
          sx={{
            overflowY: 'scroll',
            flex: 1,
            p: 2,
            height: EditorHeight,
            ...(displayMode === 'preview' && isExpend && {
              px: '10%',
            })
          }}
        >
          <TiptapEditor editor={editor} />
        </Box>
      )}
    </Stack>
  </Box>
});

EditorMarkdown.displayName = 'EditorMarkdown';

export default EditorMarkdown;