import { YoutubeOptions } from '@tiptap/extension-youtube';
import { Editor } from '@tiptap/react';

export type UploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
) => Promise<string>

export type EditorProps = {
  editor: Editor;
  height?: number | string;
}

export type EditorFnProps = {
  onError?: (error: Error) => void
  onUpload?: UploadFunction
}

export type MentionItems = string[]
export type MentionExtensionProps = {
  mentionItems?: MentionItems;
  getMention?: ({ query }: { query: string }) => Promise<MentionItems>;
}

export type ExtensionRelativeProps = MentionExtensionProps & EditorFnProps & {
  limit?: number | null
  exclude?: string[]
  editable: boolean
  youtube?: Partial<YoutubeOptions>
}

export type UseTiptapProps = {
} & ExtensionRelativeProps

export type GetExtensionsProps = ExtensionRelativeProps