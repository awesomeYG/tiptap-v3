import { EditorContent } from '@tiptap/react';
import { EditorProps } from '@yu-cq/tiptap/type';
import React from 'react';
import SelectionText from '../component/CustomBubbleMenu/SelectionText';
import CustomDragHandle from '../component/CustomDragHandle';
import './index.css';

const Editor = ({
  editor,
}: EditorProps) => {

  return <>
    <SelectionText editor={editor} />
    <CustomDragHandle editor={editor} />
    <EditorContent editor={editor} />
  </>
};

export default Editor;