import { Box } from "@mui/material";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { Editor } from "@tiptap/react";
import { DraggableIcon } from "@yu-cq/tiptap/component/Icons";
import React from "react";

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
      color: 'text.tertiary',
      cursor: 'grab',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        color: 'text.secondary',
        bgcolor: 'divider',
      },
      '&:active': {
        color: 'text.primary',
        cursor: 'grabbing',
      },
    }}>
      <DraggableIcon sx={{ fontSize: '1.25rem' }} />
    </Box>
  </DragHandle>
}

export default CustomDragHandle;