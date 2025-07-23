import { Editor } from '@tiptap/react';

export type UseTiptapProps = {
  content: string;
  editable?: boolean;
}

export type EditorProps = {
  editor: Editor;
  height?: number | string;
}