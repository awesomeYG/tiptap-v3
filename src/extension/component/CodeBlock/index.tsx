import {
  ArrowDownSLineIcon,
  FileCopyLineIcon
} from '@ctzhian/tiptap/component/Icons';
import { languages } from '@ctzhian/tiptap/contants/highlight';
import { Box, Divider, ListSubheader, MenuItem, Select, Stack, TextField } from '@mui/material';
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
  const [searchText, setSearchText] = useState('');
  const menuListRef = React.useRef<HTMLUListElement>(null);

  const attrs = node.attrs as CodeBlockAttributes;

  const filteredLanguages = React.useMemo(() => {
    if (!searchText) return languages;
    const lowerSearch = searchText.toLowerCase();
    return languages.filter(
      (lang) =>
        lang.label.toLowerCase().includes(lowerSearch) ||
        lang.value.toLowerCase().includes(lowerSearch),
    );
  }, [searchText]);

  // 当搜索文本改变时，重置滚动位置
  React.useEffect(() => {
    if (menuListRef.current) {
      menuListRef.current.scrollTop = 0;
    }
  }, [searchText]);

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
      className={`codeblock-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <Box
        component="pre"
        sx={{
          p: '0.75rem 1rem',
          m: 0,
          borderRadius: showTitleInput
            ? '6px 6px 0 0 !important'
            : '6px',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="codeblock-toolbar"
          sx={{
            zIndex: 1,
            mb: 2,
          }}
        >
          {showTitleInput ? (
            <Box
              sx={{
                py: 0.5,
                flex: 1,
                borderRadius: '0 0 4px 4px',
                bgcolor: 'background.paper3',
                boxSizing: 'border-box',
                letterSpacing: '0.01rem',
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="请输入代码块名称"
                value={titleValue}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyDown}
                onBlur={handleTitleSubmit}
                autoFocus
                sx={{
                  '& .MuiInputBase-input': {
                    p: 0,
                    height: '0.875rem',
                    lineHeight: 1,
                    fontSize: '0.875rem',
                    color: 'text.auxiliary',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    fontSize: '0.875rem',
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
          ) : (
            <Box
              sx={{
                flex: 1,
                fontSize: '0.875rem',
                color: 'text.auxiliary',
                letterSpacing: '0.01rem',
              }}
              onClick={handleTitleToggle}
            >
              {attrs.title || '代码块'}
            </Box>
          )}
          <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
            <Select
              value={attrs.language || 'auto'}
              onChange={(e) => handleLanguageChange(e.target.value)}
              onClose={() => setSearchText('')}
              size="small"
              variant="outlined"
              sx={{
                px: 0,
                height: '1.25rem',
                fontSize: '0.75rem',
                bgcolor: 'inherit',
                color: 'inherit',
                '&.MuiOutlinedInput-root .MuiSelect-select': {
                  p: 0,
                  pl: 1,
                  pr: 'calc(var(--mui-spacing-unit) * 3) !important',
                },
                '& .MuiSelect-icon': {
                  color: 'inherit',
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
                    sx={{ fontSize: '1rem' }}
                  />
                );
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 400,
                    p: 0,
                  },
                },
                autoFocus: false,
                MenuListProps: {
                  ref: menuListRef,
                },
              }}
            >
              <ListSubheader
                sx={{
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'background.default',
                  zIndex: 1,
                  p: 0.5,
                  lineHeight: 1,
                }}
              >
                <TextField
                  size="small"
                  autoFocus
                  placeholder="搜索语言..."
                  fullWidth
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </ListSubheader>
              {searchText && (
                <MenuItem
                  value={searchText}
                  sx={{
                    fontSize: '0.75rem',
                    height: '30px',
                    m: 0.5,
                    bgcolor: 'action.hover',
                    fontWeight: 500,
                  }}
                >
                  {searchText}
                  {filteredLanguages.length === 0 && ' (自定义)'}
                </MenuItem>
              )}
              {!searchText &&
                attrs.language &&
                !languages.find((it) => it.value === attrs.language) && (
                  <MenuItem value={attrs.language} sx={{ fontSize: '0.75rem', height: '30px', m: 0.5 }}>
                    {attrs.language}
                  </MenuItem>
                )}
              {filteredLanguages.map((lang) => (
                <MenuItem
                  key={lang.value}
                  value={lang.value}
                  sx={{ fontSize: '0.75rem', height: '30px', m: 0.5 }}
                >
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
            <Divider orientation="vertical" flexItem sx={{ height: '1.25rem', alignSelf: 'center', borderColor: 'divider' }} />
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
              <FileCopyLineIcon
                sx={{ fontSize: '0.875rem', color: 'inherit' }}
              />
              <Box sx={{ fontSize: '0.75rem', lineHeight: 1 }}>{copyText}</Box>
            </Stack>
          </Stack>
        </Stack>
        <NodeViewContent
          style={{
            margin: 0,
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        />
      </Box>
    </NodeViewWrapper>
  );
};

export default CodeBlockView;
