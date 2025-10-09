import { AttachmentLineIcon, ImageLineIcon, MovieLineIcon } from '@ctzhian/tiptap/component/Icons';
import { Box, CircularProgress, Stack } from '@mui/material';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import React from 'react';

export interface UploadProgressAttributes {
  fileName: string;
  fileType: 'image' | 'video' | 'other';
  progress: number;
  tempId: string;
}

export const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'image':
      return <ImageLineIcon sx={{ fontSize: '1rem' }} />;
    case 'video':
      return <MovieLineIcon sx={{ fontSize: '1rem' }} />;
    default:
      return <AttachmentLineIcon sx={{ fontSize: '1rem' }} />;
  }
};

export const getFileTypeText = (fileType: string) => {
  switch (fileType) {
    case 'image':
      return '图片';
    case 'video':
      return '视频';
    default:
      return '文件';
  }
};

const UploadProgressView: React.FC<NodeViewProps> = ({ node }) => {
  const attrs = node.attrs as UploadProgressAttributes;

  return (
    <NodeViewWrapper className="upload-progress-wrapper">
      <Box
        sx={{
          position: 'relative',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 'var(--mui-shape-borderRadius)',
          p: 2,
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
        }}
        data-temp-id={attrs.tempId}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
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
      </Box>
    </NodeViewWrapper>
  );
};

export default UploadProgressView;  