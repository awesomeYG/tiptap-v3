import { EditorProps } from '@cq/tiptap/type';
import { Box } from '@mui/material';
import { EditorContent } from '@tiptap/react';
// @ts-ignore
import React from 'react';
import SelectionText from '../component/CustomBubbleMenu/SelectionText';
import CustomDragHandle from '../component/CustomDragHandle';
import CustomFloatingMenu from '../component/CustomFloatingMenu';
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
    {editor && (
      <SelectionText editor={editor} />
    )}
    {editor && <CustomFloatingMenu editor={editor} />}
    <CustomDragHandle editor={editor} />
    <EditorContent editor={editor} />
  </Box>
};

export default Editor;