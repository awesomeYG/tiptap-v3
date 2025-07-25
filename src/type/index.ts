import { YoutubeOptions } from '@tiptap/extension-youtube';
import { Editor } from '@tiptap/react';

export type EditorProps = {
  editor: Editor;
  height?: number | string;
}

export type MentionItems = string[]
export type MentionExtensionProps = {
  mentionItems?: MentionItems;
  getMention?: ({ query }: { query: string }) => Promise<MentionItems>;
}

export type ExtensionRelativeProps = MentionExtensionProps & {
  limit?: number | null
  exclude?: string[]
  editable: boolean
  youtube?: Partial<YoutubeOptions>
  onUpload?: (file: File) => Promise<string>
}

export type UseTiptapProps = {
} & ExtensionRelativeProps

export type GetExtensionsProps = ExtensionRelativeProps