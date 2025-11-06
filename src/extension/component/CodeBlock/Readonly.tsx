import { FileCopyLineIcon } from '@ctzhian/tiptap/component/Icons';
import { Box, Divider, Stack } from '@mui/material';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import React, { useCallback, useState } from 'react';

interface CodeBlockAttributes {
  language?: string;
  title?: string;
}

const ReadonlyCodeBlock: React.FC<NodeViewProps> = ({
  node,
  selected
}) => {
  const [copyText, setCopyText] = useState('复制');
  const [isHovering, setIsHovering] = useState(false);

  const attrs = node.attrs as CodeBlockAttributes;

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

  return (
    <NodeViewWrapper
      className={`codeblock-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box
        component="pre"
        sx={{
          p: '0.75rem 1rem',
          m: 0,
          borderRadius: '6px',
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
          <Box
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: 'text.tertiary',
              letterSpacing: '0.01rem',
            }}
          >
            {attrs.title || '代码块'}
          </Box>
          {isHovering && <Stack direction="row" alignItems="center" gap={0.5}>
            <Box>{attrs.language || 'Auto'}</Box>
            <Divider orientation="vertical" flexItem sx={{ height: '1rem', mr: 0.5, ml: 1, alignSelf: 'center', borderColor: 'divider' }} />
            <Stack direction="row" alignItems="center" gap={0.5}
              onClick={handleCopy}
              sx={{
                px: 1,
                borderRadius: 'var(--mui-shape-borderRadius)',
                cursor: 'pointer',
                userSelect: 'none',
                bgcolor: 'inherit',
                color: 'inherit',
              }}>
              <FileCopyLineIcon sx={{ fontSize: '0.875rem', color: 'inherit' }} />
              <Box sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
                {copyText}
              </Box>
            </Stack>
          </Stack>}
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
    </NodeViewWrapper>
  );
};

export default ReadonlyCodeBlock;