import { Box, Button, Stack, useTheme } from "@mui/material";
import { Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import FloatingPopover from "../FloatingPopover";
import { ArrowDownSLineIcon, FontColorIcon } from "../Icons";
import ToolbarItem from "./Item";

interface EditorFontColorProps {
  editor: Editor
}

const EditorFontColor = ({ editor }: EditorFontColorProps) => {
  const theme = useTheme()
  const defaultColor = theme.palette.text.primary

  const THEME_TEXT_COLOR = [
    'var(--mui-palette-primary-main)',
    'var(--mui-palette-success-main)',
    'var(--mui-palette-warning-main)',
    'var(--mui-palette-error-main)',
    '#D8A47F',
    '#73B5F0',
    '#CDDFA0',
    'var(--mui-palette-text-primary)',
    'var(--mui-palette-text-secondary)',
    'var(--mui-palette-common-white)',
  ]

  const [color, setColor] = useState<string>(defaultColor);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl) {
      handleClosePopover()
    } else {
      setAnchorEl(event.currentTarget)
    }
  }
  const handleClosePopover = () => setAnchorEl(null)

  const updateColor = () => {
    const attrs = editor.getAttributes('textStyle');
    setColor(attrs.color || defaultColor);
  }

  useEffect(() => {
    editor.on('selectionUpdate', updateColor);
    editor.on('transaction', updateColor);
    return () => {
      editor.off('selectionUpdate', updateColor);
      editor.off('transaction', updateColor);
    };
  }, [editor]);

  return <>
    <Stack sx={{
      position: 'relative'
    }}>
      <ToolbarItem
        tip={'文字颜色'}
        icon={<FontColorIcon sx={{ fontSize: '1rem', pr: '0.75rem' }} />}
        sx={{ position: 'relative' }}
        onClick={() => {
          editor.chain().focus().setColor(color).run()
          handleClosePopover()
        }}
      />
      <Box sx={{
        width: '0.875rem',
        height: '2px',
        borderRadius: '2px',
        position: 'absolute',
        left: '0.55rem',
        top: '1.3rem',
        p: '0px !important',
        minWidth: '0px !important',
        zIndex: 1,
        bgcolor: color,
      }}>
      </Box>
      <Button onClick={handleShowPopover} sx={{
        position: 'absolute',
        right: 0,
        p: '0px !important',
        width: '1rem',
        minWidth: '0px !important',
        height: '100%',
        zIndex: 1,
      }}>
        <ArrowDownSLineIcon sx={{
          fontSize: '1rem',
          color: 'text.disabled',
          transform: anchorEl ? 'rotate(-180deg)' : 'none',
          transition: 'transform 0.3s',
          cursor: 'pointer',
          pointerEvents: 'none'
        }} />
      </Button>
    </Stack>
    <FloatingPopover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      placement="bottom"
    >
      <Box sx={{
        p: 0.5,
        width: 300,
        fontSize: '0.875rem',
      }}>
        <Stack direction={'row'} alignItems={'center'} gap={1} sx={{ mb: 1 }}>
          <Box sx={{
            width: 24,
            height: 24,
            borderRadius: 'var(--mui-shape-borderRadius)',
            bgcolor: defaultColor,
            cursor: 'pointer',
          }} onClick={() => {
            editor.chain().focus().setColor('').run()
            handleClosePopover()
          }} />
          <Box>标准颜色</Box>
        </Stack>
        <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
          {THEME_TEXT_COLOR.map((c) => (
            <Box key={c} sx={{
              width: 24,
              height: 24,
              cursor: 'pointer',
              borderRadius: 'var(--mui-shape-borderRadius)',
              bgcolor: c,
            }} onClick={() => {
              setColor(c)
              editor.chain().focus().setColor(c).run()
              handleClosePopover()
            }} />
          ))}
        </Stack>
      </Box>
    </FloatingPopover>
  </>
};

export default EditorFontColor;