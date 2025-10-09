import { Box, CircularProgress, Stack } from '@mui/material';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { getFileIcon, getFileTypeText } from '.';

export interface InlineUploadProgressAttributes {
  fileName: string;
  fileType: 'image';
  progress: number;
  tempId: string;
}

const InlineUploadProgressView: React.FC<NodeViewProps> = ({ node }) => {
  const attrs = node.attrs as InlineUploadProgressAttributes;

  return (
    <NodeViewWrapper className="inline-upload-progress-wrapper" style={{ display: 'inline-flex' }}>
      <Stack component="span" direction="row" alignItems="center" gap={1} sx={{
        position: 'relative',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 'var(--mui-shape-borderRadius)',
        p: 2,
        maxWidth: '100%',
        ...(!attrs.progress ? {
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover'
          },
          '&:active': {
            bgcolor: 'action.selected',
          },
        } : {
          "&::before": {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${attrs.progress * 100}%`,
            bgcolor: 'primary.main',
            opacity: 0.1,
            transition: 'width 0.3s ease',
          }
        })
      }} data-temp-id={attrs.tempId}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Stack direction="row" alignItems="center" gap={2}>
            {getFileIcon(attrs.fileType)}
            <Box sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
              正在上传{getFileTypeText(attrs.fileType)}：{attrs.fileName}
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            {attrs.progress < 1 && <CircularProgress size={14} />}
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{Math.round(attrs.progress * 100)}%</Box>
          </Stack>
        </Stack>
      </Stack>
    </NodeViewWrapper>
  );
};

export default InlineUploadProgressView;

