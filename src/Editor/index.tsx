import { EditorContent } from '@tiptap/react';
import { EditorProps } from '@yu-cq/tiptap/type';
import React from 'react';
import SelectionText from '../component/CustomBubbleMenu/SelectionText';
import CustomDragHandle from '../component/CustomDragHandle';

const Editor = ({
  editor,
  menuInDragHandle,
  menuInBubbleMenu,
  onTip
}: EditorProps) => {

  return <>
    <SelectionText editor={editor} more={menuInBubbleMenu} />
    <CustomDragHandle editor={editor} more={menuInDragHandle} onTip={onTip} />
    <EditorContent editor={editor} />
  </>
};

export default Editor;