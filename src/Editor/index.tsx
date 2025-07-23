import { EditorProps } from '@cq/tiptap/type';
import { Box } from '@mui/material';
import { EditorContent } from '@tiptap/react';
import React from 'react';
import './index.css';

const Editor = ({
  editor,
  height,
}: EditorProps) => {

  return <Box sx={{
    '.tiptap': {
      height,
    }
  }}>
    <EditorContent editor={editor} />
  </Box>
};

export default Editor;