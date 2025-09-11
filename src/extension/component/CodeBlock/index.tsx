import {
  ArrowDownSLineIcon,
  CopyIcon,
  TitleIcon,
} from '@baizhicloud/tiptap/component/Icons';
import { languages } from '@baizhicloud/tiptap/contants/highlight';
import { Box, MenuItem, Select, Stack, TextField } from '@mui/material';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import React, { useCallback, useState } from 'react';
import ReadonlyCodeBlock from './Readonly';

interface CodeBlockAttributes {
  language?: string;
  title?: string;
}

const CodeBlockView: React.FC<NodeViewProps> = (props) => {
  const { node, updateAttributes, selected, editor } = props;
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [copyText, setCopyText] = useState('复制');
  const [titleValue, setTitleValue] = useState(node.attrs.title || '');

  const attrs = node.attrs as CodeBlockAttributes;

  const handleLanguageChange = useCallback(
    (language: string) => {
      updateAttributes({ language });
    },
    [updateAttributes],
  );

  const handleCopy = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const codeText = node.textContent || '';
      try {
        await navigator.clipboard.writeText(codeText);
        setCopyText('复制成功');
        setTimeout(() => {
          setCopyText('复制');
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    },
    [node],
  );

  const handleTitleToggle = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setShowTitleInput(!showTitleInput);
    },
    [showTitleInput],
  );

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitleValue(event.target.value);
    },
    [],
  );

  const handleTitleSubmit = useCallback(() => {
    updateAttributes({ title: titleValue });
    setShowTitleInput(false);
  }, [titleValue, updateAttributes]);

  const handleTitleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleTitleSubmit();
      } else if (event.key === 'Escape') {
        setTitleValue(attrs.title || '');
        setShowTitleInput(false);
      }
    },
    [handleTitleSubmit, attrs.title],
  );

  if (!editor.isEditable) {
    return <ReadonlyCodeBlock {...props} />;
  }

  return (
    <NodeViewWrapper
      className={`codeblock-wrapper ${selected ? 'ProseMirror-selectednode' : ''
        }`}
      data-drag-handle
    >
      <Box
        component="pre"
        sx={{
          p: '1.75rem 1rem 0.75rem',
          m: 0,
          borderRadius: showTitleInput
            ? 'var(--mui-shape-borderRadius) var(--mui-shape-borderRadius) 0 0 !important'
            : 'var(--mui-shape-borderRadius)',
          bgcolor: 'background.paper3',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="codeblock-toolbar"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            px: 0.5,
            pt: 0.5,
            zIndex: 1,
          }}
        >
          <Select
            value={attrs.language || 'auto'}
            onChange={(e) => handleLanguageChange(e.target.value)}
            size="small"
            variant="outlined"
            sx={{
              px: 0,
              height: '1.25rem',
              fontSize: '0.75rem',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              '&:focus': {
                bgcolor: 'action.selected',
              },
              '&.MuiOutlinedInput-root .MuiSelect-select': {
                p: 0,
                pl: 1,
                pr: 'calc(var(--mui-spacing-unit) * 3) !important',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            IconComponent={({ className, ...rest }) => {
              return (
                <ArrowDownSLineIcon
                  className={className}
                  {...rest}
                  sx={{ fontSize: '1rem', color: 'text.secondary' }}
                />
              );
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 360,
                },
              },
            }}
          >
            {attrs.language &&
              !languages.find((it) => it.value === attrs.language) && (
                <MenuItem value={attrs.language} sx={{ fontSize: '0.75rem' }}>
                  {attrs.language}
                </MenuItem>
              )}
            {languages.map((lang) => (
              <MenuItem
                key={lang.value}
                value={lang.value}
                sx={{ fontSize: '0.75rem' }}
              >
                {lang.label}
              </MenuItem>
            ))}
          </Select>
          <Stack direction="row" sx={{ userSelect: 'none' }}>
            <Stack
              direction="row"
              alignItems="center"
              gap={0.5}
              onClick={handleCopy}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 'var(--mui-shape-borderRadius)',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <CopyIcon
                sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
              />
              <Box sx={{ fontSize: '0.75rem', lineHeight: 1 }}>{copyText}</Box>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              gap={0.5}
              onClick={handleTitleToggle}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 'var(--mui-shape-borderRadius)',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <TitleIcon
                sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
              />
              <Box sx={{ fontSize: '0.75rem', lineHeight: 1 }}>标题</Box>
            </Stack>
          </Stack>
        </Stack>
        <NodeViewContent
          style={{
            margin: 0,
            fontSize: '0.875rem',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        />
      </Box>
      {showTitleInput && (
        <Box
          sx={{
            px: 1,
            pt: 0.25,
            pb: 0.5,
            borderRadius: '0 0 4px 4px',
            bgcolor: 'background.paper3',
            borderTop: '1px solid var(--mui-palette-divider)',
            boxSizing: 'border-box',
            letterSpacing: '0.01rem',
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="输入代码块标题..."
            value={titleValue}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleSubmit}
            autoFocus
            sx={{
              '& .MuiInputBase-input': {
                p: 0,
                height: '1rem',
                lineHeight: 1,
                fontSize: '0.875rem',
                color: 'text.secondary',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                  top: 0,
                  p: 0,
                },
              },
            }}
          />
        </Box>
      )}
      {attrs.title && !showTitleInput && (
        <Box
          sx={{
            px: 1,
            py: 0.5,
            fontSize: '0.875rem',
            color: 'text.secondary',
            letterSpacing: '0.01rem',
          }}
          onClick={handleTitleToggle}
        >
          {attrs.title}
        </Box>
      )}
    </NodeViewWrapper>
  );
};

export default CodeBlockView;
