import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AnticlockwiseLineIcon,
  ClockwiseLineIcon,
  CloseCircleFillIcon,
  Download2LineIcon,
  FullscreenExitLineIcon,
  FullscreenLineIcon,
  ResetLeftFillIcon,
} from '../Icons';
import { ImageViewerContext } from './context';

interface CustomToolbarProps {
  currentSrc?: string;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = ({ currentSrc }) => {
  const {
    visible,
    scale,
    rotate,
    getScale,
    getRotate,
    onScale,
    onRotate,
    onClose,
  } = useContext(ImageViewerContext);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleDownload = useCallback(() => {
    if (currentSrc) {
      const link = document.createElement('a');
      link.href = currentSrc;
      link.download = currentSrc.split('/').pop() || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [currentSrc]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const handleReset = useCallback(() => {
    if (onScale) onScale(1);
    if (onRotate) onRotate(0);
  }, [onScale, onRotate]);

  if (!visible) {
    return null;
  }

  const toolbarContent = (
    <Box
      className="PhotoView-Slider__toolbar-custom"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 24px',
        zIndex: 10000,
        pointerEvents: 'none',
        '& > *': {
          pointerEvents: 'auto',
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          padding: '8px 12px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Tooltip title="放大" placement="top">
          <IconButton
            onClick={() => {
              if (onScale) {
                const currentScale = getScale();
                onScale(Math.min(currentScale + 0.5, 5));
              }
            }}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            size="small"
          >
            <svg width="20" height="20" viewBox="0 0 768 768" fill="currentColor">
              <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM415.5 223.5v129h129v63h-129v129h-63v-129h-129v-63h129v-129h63z"></path>
            </svg>
          </IconButton>
        </Tooltip>

        <Tooltip title="缩小" placement="top">
          <IconButton
            onClick={() => {
              if (onScale) {
                const currentScale = getScale();
                onScale(Math.max(currentScale - 0.5, 0.5));
              }
            }}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            size="small"
          >
            <svg width="20" height="20" viewBox="0 0 768 768" fill="currentColor">
              <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM223.5 352.5h321v63h-321v-63z"></path>
            </svg>
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            width: '1px',
            height: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            mx: 0.5,
          }}
        />

        <Tooltip title="逆时针旋转" placement="top">
          <IconButton
            onClick={() => {
              if (onRotate) {
                const currentRotate = getRotate();
                onRotate(currentRotate - 90);
              }
            }}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            size="small"
          >
            <AnticlockwiseLineIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="顺时针旋转" placement="top">
          <IconButton
            onClick={() => {
              if (onRotate) {
                const currentRotate = getRotate();
                onRotate(currentRotate + 90);
              }
            }}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            size="small"
          >
            <ClockwiseLineIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            width: '1px',
            height: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            mx: 0.5,
          }}
        />

        <Tooltip title="重置" placement="top">
          <IconButton
            onClick={handleReset}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            size="small"
          >
            <ResetLeftFillIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </Tooltip>

        {currentSrc && (
          <>
            <Box
              sx={{
                width: '1px',
                height: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                mx: 0.5,
              }}
            />
            <Tooltip title="下载" placement="top">
              <IconButton
                onClick={handleDownload}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                size="small"
              >
                <Download2LineIcon sx={{ fontSize: '20px' }} />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Box
          sx={{
            width: '1px',
            height: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            mx: 0.5,
          }}
        />

        <Tooltip title={isFullscreen ? '退出全屏' : '全屏'} placement="top">
          <IconButton
            onClick={handleFullscreen}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            size="small"
          >
            {isFullscreen ? (
              <FullscreenExitLineIcon sx={{ fontSize: '20px' }} />
            ) : (
              <FullscreenLineIcon sx={{ fontSize: '20px' }} />
            )}
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            width: '1px',
            height: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            mx: 0.5,
          }}
        />

        <Tooltip title="关闭" placement="top">
          <IconButton
            onClick={() => onClose && onClose()}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            size="small"
          >
            <CloseCircleFillIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  if (typeof document !== 'undefined') {
    return createPortal(toolbarContent, document.body);
  }

  return toolbarContent;
};

