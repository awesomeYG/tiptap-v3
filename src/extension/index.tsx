
import Highlight from '@tiptap/extension-highlight';
import InvisibleCharacters from '@tiptap/extension-invisible-characters';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { PLACEHOLDER } from '../contants/placeholder';
import { GetExtensionsProps } from '../type';
import { AiWritingExtension, SlashCommands, StructuredDiffExtension } from './extension';
import { CodeExtension } from './mark/Code';
import {
  AlertExtension,
  AudioExtension,
  BlockAttachmentExtension,
  BlockLinkExtension,
  CodeBlockLowlightExtension,
  CustomBlockMathExtension,
  CustomInlineMathExtension,
  DetailsContentExtension,
  DetailsExtension,
  DetailsSummaryExtension,
  EmojiExtension,
  FileHandlerExtension,
  IframeExtension,
  ImageExtension,
  Indent,
  InlineAttachmentExtension,
  InlineLinkExtension,
  InlineUploadProgressExtension,
  ListExtension,
  MentionExtension,
  TableExtension,
  TableOfContents,
  UploadProgressExtension,
  VerticalAlign,
  VideoExtension,
  YoutubeExtension
} from './node';

export const getExtensions = ({
  limit,
  exclude,
  extensions: extensionsProps,
  youtube,
  editable,
  mentionItems,
  onMentionFilter,
  onUpload,
  onError,
  onTocUpdate,
  onAiWritingGetSuggestion,
}: GetExtensionsProps) => {
  const defaultExtensions: any = [
    StarterKit.configure({
      link: false,
      code: false,
      codeBlock: false,
      listItem: false,
      orderedList: false,
      bulletList: false,
      listKeymap: false,
      undoRedo: exclude?.includes('undoRedo') ? false : undefined,
      dropcursor: {
        color: 'var(--mui-palette-primary-main)',
        width: 2,
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    VerticalAlign.configure({
      types: ['textStyle'],
      defaultAlignment: null,
    }),
    TextStyleKit.configure({
      backgroundColor: {
        types: ['textStyle'],
      }
    }),
    ListExtension,
    CodeBlockLowlightExtension,
    CharacterCount.configure({
      limit: limit ?? null,
    }),
    Subscript,
    Superscript,
    Indent.configure({
      types: [
        'paragraph', 'heading', 'blockquote', 'alert', 'codeBlock', 'horizontalRule',
        'orderedList', 'bulletList', 'taskList', 'taskItem', 'listItem',
        'details', 'detailsContent', 'detailsSummary',
        'table',
        'image', 'video', 'audio', 'iframe',
        'blockAttachment', 'inlineAttachment', 'blockLink',
        'blockMath', 'inlineMath',
      ],
      maxLevel: 8,
      indentPx: 32,
    }),
    CodeExtension,
    AlertExtension,
    Highlight.configure({
      multicolor: true,
    }),
    Markdown.configure({
      indentation: {
        style: 'space',
        size: 2,
      },
    }),
    Placeholder.configure({
      emptyNodeClass: 'custom-placeholder-node',
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: true,
      placeholder: ({ editor, node, pos }) => {
        const { type, attrs } = node
        if (pos === 0 && editor.isEmpty) {
          return PLACEHOLDER.default
        }
        const aiWritingEnabled = !!(editor as any)?.storage?.aiWriting?.enabled
        if (!aiWritingEnabled) {
          if (type.name === 'heading') {
            return PLACEHOLDER.heading[attrs.level as keyof typeof PLACEHOLDER.heading]
          }
          if (PLACEHOLDER[type.name as keyof typeof PLACEHOLDER]) {
            return PLACEHOLDER[type.name as keyof typeof PLACEHOLDER] as string
          }
        }
        return ''
      },
    }),
    InlineLinkExtension,
    BlockLinkExtension,
    DetailsExtension,
    DetailsContentExtension,
    DetailsSummaryExtension,
    ...TableExtension({ editable }),
    TableOfContents({ onTocUpdate }),
    CustomInlineMathExtension({ onError }),
    CustomBlockMathExtension({ onError }),
    IframeExtension({ onError }),
    VideoExtension({ onUpload, onError }),
    AudioExtension({ onUpload, onError }),
    ImageExtension({ onUpload, onError }),
    InlineUploadProgressExtension,
    InlineAttachmentExtension({ onUpload, onError }),
    BlockAttachmentExtension({ onUpload, onError }),
  ]

  if (!exclude?.includes('emoji')) {
    const Emoji = EmojiExtension
    defaultExtensions.push(Emoji)
  }

  if (!exclude?.includes('mention') && (mentionItems && mentionItems.length > 0 || onMentionFilter)) {
    const Mention = MentionExtension({ mentionItems, onMentionFilter })
    defaultExtensions.push(Mention)
  }

  if (!exclude?.includes('youtube')) {
    const Youtube = YoutubeExtension(youtube)
    defaultExtensions.push(Youtube)
  }

  if (editable) { // 编辑模式
    if (!exclude?.includes('fileHandler')) {
      const FileHandler = FileHandlerExtension({ onUpload })
      defaultExtensions.push(FileHandler)
      const UploadProgress = UploadProgressExtension
      defaultExtensions.push(UploadProgress)
    }

    if (!exclude?.includes('slashCommands')) {
      defaultExtensions.push(SlashCommands)
    }

    if (!exclude?.includes('aiWriting') && onAiWritingGetSuggestion) {
      defaultExtensions.push(AiWritingExtension({ onAiWritingGetSuggestion }))
    }

    if (!exclude?.includes('invisibleCharacters')) {
      defaultExtensions.push(InvisibleCharacters)
    }
  } else { // 只读模式
    if (!exclude?.includes('structuredDiff')) {
      defaultExtensions.push(StructuredDiffExtension)
    }
  }

  if (extensionsProps && extensionsProps.length > 0) {
    defaultExtensions.push(...extensionsProps)
  }

  return defaultExtensions
}