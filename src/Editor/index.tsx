import { Box } from '@mui/material';
import { EditorContent } from '@tiptap/react';
import { EditorProps } from '@yu-cq/tiptap/type';
// @ts-ignore
import React from 'react';
import SelectionText from '../component/CustomBubbleMenu/SelectionText';
import CustomDragHandle from '../component/CustomDragHandle';
// import CustomFloatingMenu from '../component/CustomFloatingMenu';
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
    <SelectionText editor={editor} />
    <CustomDragHandle editor={editor} />
    <EditorContent editor={editor} />
  </Box>
};

export default Editor;