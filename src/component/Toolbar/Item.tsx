import { getShortcutKeyText } from '@ctzhian/tiptap/util';
import { Theme } from '@emotion/react';
import { Box, Button, Stack, SxProps, Tooltip } from '@mui/material';
import React from 'react';

interface ToolbarItemProps {
  tip?: string;
  text?: string;
  shortcutKey?: string[];
  sx?: SxProps<Theme>;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ToolbarItem = React.forwardRef<HTMLButtonElement, ToolbarItemProps>(
  (
    { tip, shortcutKey, icon, sx, text, onClick, className, disabled, ...rest },
    ref,
  ) => {
    const shortcutKeyText = getShortcutKeyText(shortcutKey || []);
    return (
      <Tooltip
        title={
          tip ? (
            <Stack alignItems="center">
              <Box>{tip}</Box>
              {shortcutKeyText && (
                <Box sx={{ fontSize: 12 }}>{shortcutKeyText}</Box>
              )}
            </Stack>
          ) : null
        }
        arrow
      >
        <Box>
          <Button
            ref={ref}
            onClick={onClick}
            className={className}
            disabled={disabled}
            sx={{
              minWidth: '36px',
              p: 1,
              color: 'text.primary',
              borderRadius: 'var(--mui-shape-borderRadius)',
              '&.tool-active': {
                bgcolor: 'background.paper2',
                color: 'primary.main',
              },
              '&[disabled]': {
                color: 'text.disabled',
              },
              '&:hover': {
                bgcolor: 'background.paper2',
              },
              textTransform: 'none',
              ...sx,
            }}
            {...rest}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              gap={1}
              sx={{ lineHeight: 1, flexShrink: 0 }}
            >
              {icon}
              {text && <Box component="span">{text}</Box>}
            </Stack>
          </Button>
        </Box>
      </Tooltip>
    );
  },
);

ToolbarItem.displayName = 'toolbar-item';

export default ToolbarItem;
