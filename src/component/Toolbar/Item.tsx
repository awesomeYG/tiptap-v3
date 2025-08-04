import { getShortcutKeyText } from "@cq/tiptap/util/shortcutKey";
import { Theme } from "@emotion/react";
import { Box, Button, Stack, SxProps, Tooltip } from "@mui/material";
import React from "react";

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
  ({ tip, shortcutKey, icon, sx, text, onClick, className, disabled, ...rest }, ref) => {
    const shortcutKeyText = getShortcutKeyText(shortcutKey || []);
    return (
      <Tooltip title={
        tip ? <Stack alignItems="center">
          <Box>{tip}</Box>
          {shortcutKeyText && <Box sx={{ fontSize: 12 }}>{shortcutKeyText}</Box>}
        </Stack> : null
      } arrow>
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
              '&.tool-active': {
                bgcolor: 'background.paper0',
                color: 'primary.main',
              },
              '&[disabled]': {
                color: 'text.disabled',
              },
              textTransform: 'none',
              ...sx,
            }}
            {...rest}
          >
            {icon} {text && <Box component='span' sx={{ pl: 1, lineHeight: 1 }}>{text}</Box>}
          </Button>
        </Box>
      </Tooltip>
    )
  }
);

ToolbarItem.displayName = 'toolbar-item';

export default ToolbarItem;