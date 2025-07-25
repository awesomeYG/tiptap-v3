import { Box } from "@mui/material";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { Editor } from "@tiptap/react";
import React from "react";
import { DraggableIcon } from "../Icons";

const CustomDragHandle = ({ editor }: { editor: Editor }) => {
  return <DragHandle editor={editor}>
    <Box sx={{
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '0.25rem',
      border: '1px solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mr: 1,
      color: 'var(--mui-palette-text-tertiary)',
      cursor: 'grab',
      borderColor: 'var(--mui-palette-divider)',
      backgroundColor: 'var(--mui-palette-background-paper)',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        color: 'var(--mui-palette-text-secondary)',
        backgroundColor: 'var(--mui-palette-divider)',
      },
      '&:active': {
        color: 'var(--mui-palette-text-primary)',
        cursor: 'grabbing',
      },
    }}>
      <DraggableIcon sx={{ fontSize: '1.25rem' }} />
    </Box>
  </DragHandle>
}

export default CustomDragHandle;