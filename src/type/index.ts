import { Editor, Extension } from '@tiptap/core';
import { YoutubeOptions } from '@tiptap/extension-youtube';

export type { Editor } from '@tiptap/react';

export type UploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
) => Promise<string>

export type EditorProps = {
  editor: Editor;
  height?: number | string;
}

export type TocItem = {
  id: string;
  isActive: boolean;
  isScrolledOver: boolean;
  itemIndex: number;
  level: number;
  originalLevel: number;
  pos: number;
  textContent: string;
}
export type TocList = TocItem[]

export type EditorFnProps = {
  onError?: (error: Error) => void
  onUpload?: UploadFunction
  onTocUpdate?: (toc: TocList) => void
}

export type MentionItems = string[]
export type MentionExtensionProps = {
  mentionItems?: MentionItems;
  onMentionFilter?: ({ query }: { query: string }) => Promise<MentionItems>;
}

export type ExtensionRelativeProps = MentionExtensionProps & EditorFnProps & {
  limit?: number | null
  exclude?: string[]
  extensions?: Extension[]
  editable: boolean
  youtube?: Partial<YoutubeOptions>
}

export type UseTiptapProps = {
  onSave?: (editor: Editor) => void
} & ExtensionRelativeProps

export type GetExtensionsProps = ExtensionRelativeProps

export type UseTiptapReturn = {
  editor: Editor
  getText: () => string
  getHTML: () => string
  getJSON: () => any
  getMarkdownByJSON: () => string
}

export interface SlashCommandItem {
  title: string
  icon: string
  command: string
  attrs?: Record<string, unknown>
}

export interface SlashCommandsListProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
  editor: Editor
}

export interface SlashCommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}