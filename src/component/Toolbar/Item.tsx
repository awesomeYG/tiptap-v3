import { getShortcutKeyText } from "@cq/tiptap/util/shortcutKey";
import { Theme } from "@emotion/react";
import { Box, Button, Stack, SxProps, Tooltip } from "@mui/material";
import React from "react";

interface ToolbarItemProps {
  tip: string;
  shortcutKey?: string[];
  sx?: SxProps<Theme>;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  [key: string]: any;
}

const ToolbarItem = React.forwardRef<HTMLButtonElement, ToolbarItemProps>(
  ({ tip, shortcutKey, icon, sx, text, onClick, ...rest }, ref) => {
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
            sx={{ ...sx, textTransform: 'none' }}
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