import { EditorProps } from '@cq/tiptap/type';
import { EditorContent } from '@tiptap/react';
import React from 'react';

const Editor = ({
  editor
}: EditorProps) => {

  return <>
    <EditorContent editor={editor} />
  </>
};

export default Editor;