import { PopoverOrigin, SxProps, Theme } from '@mui/material';
import { Editor, Extension } from '@tiptap/core';
import { YoutubeOptions } from '@tiptap/extension-youtube';
import { UseEditorOptions } from '@tiptap/react';

export type { Editor } from '@tiptap/react';

export interface MenuItem {
  label?: React.ReactNode;
  customLabel?: React.ReactNode;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  selected?: boolean;
  attrs?: Record<string, unknown>;
  children?: MenuItem[];
  textSx?: SxProps<Theme>;
  key: number | string;
  width?: number;
  minWidth?: number;
  maxHeight?: number;
  onClick?: () => void;
}

export interface MenuProps {
  id?: string;
  width?: number;
  arrowIcon?: React.ReactNode;
  list: MenuItem[];
  header?: React.ReactNode;
  context?: React.ReactElement<{ onClick?: any; 'aria-describedby'?: any }>;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  childrenProps?: {
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
  };
  zIndex?: number;
}

export type ToolbarItemType = {
  id: string;
  icon?: React.ReactNode;
  label?: string;
  tip?: string;
  shortcutKey?: string[];
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export type UploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
) => Promise<string>

export type TipType = 'error' | 'success' | 'info' | 'warning'

export type OnTipFunction = (type: TipType, tip: string) => void

export type EditorProps = {
  editor: Editor;
  menuInDragHandle?: MenuItem[]
  menuInBubbleMenu?: MenuItem[]
  height?: number | string;
  onTip?: OnTipFunction
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

export type ValidateUrlFunction = (url: string, type: 'image' | 'video' | 'audio' | 'iframe') => Promise<string> | string

export type EditorFnProps = {
  onError?: (error: Error) => void
  onUpload?: UploadFunction
  onTocUpdate?: (toc: TocList) => void
  onAiWritingGetSuggestion?: ({ prefix, suffix }: { prefix: string, suffix: string }) => Promise<string>
  onValidateUrl?: ValidateUrlFunction
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
  contentType?: UseEditorOptions['contentType']
}

export type UseTiptapProps = {
  onSave?: (editor: Editor) => void
} & ExtensionRelativeProps

export type GetExtensionsProps = ExtensionRelativeProps

export type UseTiptapReturn = {
  editor: Editor
  setContent: (value: string, type?: UseEditorOptions['contentType']) => void
  getContent: () => string
  getMarkdown: () => string
  getText: () => string
  getHTML: () => string
  getJSON: () => any
}

export interface SlashCommandItem {
  title: string
  icon: React.ReactNode
  command: (props: { editor: Editor; range: { from: number; to: number } }) => void
  attrs?: Record<string, unknown>
  shortcutKey?: string[]
  children?: SlashCommandItem[]
}

export interface SlashCommandsListProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
  editor: Editor
}

export interface SlashCommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}
