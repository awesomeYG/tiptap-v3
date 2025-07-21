import { Editor, useTiptap } from '@cq/tiptap';
import React from 'react';

const Reader = () => {
  const editor = useTiptap({
    content: 'aa'
  });

  return <Editor editor={editor} />;
};

export default Reader; 