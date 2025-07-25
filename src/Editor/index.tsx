import { EditorProps } from '@cq/tiptap/type';
import { Box } from '@mui/material';
import { EditorContent } from '@tiptap/react';
// @ts-ignore
import { FloatingMenu } from '@tiptap/react/menus';
import React from 'react';
import SelectionText from '../component/BubbleMenu/SelectionText';
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
    {editor && (
      <FloatingMenu className="floating-menu" editor={editor}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet list
        </button>
      </FloatingMenu>
    )}
    <EditorContent editor={editor} />
  </Box>
};

export default Editor;