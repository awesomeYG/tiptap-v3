import { Editor } from '@tiptap/react';

export type EditorProps = {
  editor: Editor;
  height?: number | string;
}

export type MentionItems = string[]
export type MentionExtensionProps = {
  mentionItems?: MentionItems;
  getMentionItems?: ({ query }: { query: string }) => Promise<MentionItems>;
}

export type ExtensionRelativeProps = {
  exclude?: string[]
} & MentionExtensionProps

export type UseTiptapProps = {
} & ExtensionRelativeProps

export type GetExtensionsProps = ExtensionRelativeProps