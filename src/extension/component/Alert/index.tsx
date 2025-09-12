import { Box, Typography, useTheme } from '@mui/material';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { CheckboxCircleFillIcon, CloseCircleFillIcon, ErrorWarningFillIcon, Information2FillIcon } from '../../../component/Icons';
import { AlertAttributes } from '../../node/Alert';

interface AlertViewWrapperProps {
  node: any;
  updateAttributes: any;
  selected: boolean;
  editor: any;
  onUpload?: (file: File) => Promise<string>;
  onError?: (error: string) => void;
}

const AlertViewWrapper: React.FC<AlertViewWrapperProps> = ({
  node,
  updateAttributes,
  selected,
  editor,
  onUpload,
  onError,
}) => {
  const theme = useTheme();
  const { type = 'info', title = '' } = node.attrs as AlertAttributes;

  // 根据类型获取颜色和图标
  const getAlertConfig = (alertType: string) => {
    switch (alertType) {
      case 'success':
        return {
          color: theme.palette.success.main,
          backgroundColor: `${theme.palette.success.main}10`, // 10% 透明度
          icon: CheckboxCircleFillIcon,
        };
      case 'warning':
        return {
          color: theme.palette.warning.main,
          backgroundColor: `${theme.palette.warning.main}10`,
          icon: ErrorWarningFillIcon,
        };
      case 'error':
        return {
          color: theme.palette.error.main,
          backgroundColor: `${theme.palette.error.main}10`,
          icon: CloseCircleFillIcon,
        };
      case 'info':
      default:
        return {
          color: theme.palette.text.secondary,
          backgroundColor: `${theme.palette.text.secondary}10`,
          icon: Information2FillIcon,
        };
    }
  };

  const config = getAlertConfig(type);
  const IconComponent = config.icon;

  return (
    <NodeViewWrapper
      as="div"
      style={{
        margin: '16px 0',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '12px 16px',
          borderRadius: '8px',
          border: `1px solid ${config.color}`,
          backgroundColor: config.backgroundColor,
          position: 'relative',
          ...(selected && {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          }),
        }}
      >
        {/* 图标 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '12px',
            marginTop: '2px',
            flexShrink: 0,
          }}
        >
          <IconComponent
            style={{
              fontSize: '20px',
              color: config.color,
            }}
          />
        </Box>

        {/* 内容区域 */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* 标题 */}
          {title && (
            <Typography
              variant="subtitle2"
              sx={{
                color: config.color,
                fontWeight: 600,
                marginBottom: '4px',
                fontSize: '14px',
                lineHeight: '20px',
              }}
            >
              {title}
            </Typography>
          )}

          {/* 内容 */}
          <Box
            sx={{
              color: theme.palette.text.primary,
              fontSize: '14px',
              lineHeight: '20px',
              '& p': {
                margin: 0,
                '&:not(:last-child)': {
                  marginBottom: '8px',
                },
              },
              '& ul, & ol': {
                margin: 0,
                paddingLeft: '20px',
              },
              '& li': {
                marginBottom: '4px',
              },
            }}
          >
            <NodeViewContent />
          </Box>
        </Box>
      </Box>
    </NodeViewWrapper>
  );
};

export default AlertViewWrapper;
