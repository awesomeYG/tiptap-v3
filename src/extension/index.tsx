
import InvisibleCharacters from '@tiptap/extension-invisible-characters';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import UniqueID from '@tiptap/extension-unique-id';
import { CharacterCount } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { GetExtensionsProps } from '../type';
import {
  CodeBlockLowlightExtension,
  CustomBlockMathExtension,
  CustomInlineMathExtension,
  DetailsContentExtension,
  DetailsExtension,
  DetailsSummaryExtension,
  EmojiExtension,
  FileHandlerExtension,
  ImageExtension,
  LinkExtension,
  ListExtension,
  MentionExtension,
  TableExtension,
  VideoExtension,
  YoutubeExtension
} from './node';

export const getExtensions = ({
  limit,
  exclude,
  youtube,
  editable,
  mentionItems,
  getMention,
  onUpload,
  onError,
}: GetExtensionsProps) => {
  const defaultExtensions: any = [
    StarterKit.configure({
      link: false,
      codeBlock: false,
      listItem: false,
      orderedList: false,
      bulletList: false,
      listKeymap: false,
      dropcursor: {
        color: 'var(--mui-palette-primary-main)',
        width: 2,
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    CodeBlockLowlightExtension,
    CharacterCount.configure({
      limit: limit ?? null,
    }),
    Subscript,
    Superscript,
    TextStyleKit,
    UniqueID.configure({
      types: ['heading']
    }),
  ]

  if (!exclude?.includes('mention') && (mentionItems && mentionItems.length > 0 || getMention)) {
    const Mention = MentionExtension({ mentionItems, getMention })
    defaultExtensions.push(Mention)
  }

  if (!exclude?.includes('details')) {
    const Details = DetailsExtension
    const DetailsContent = DetailsContentExtension
    const DetailsSummary = DetailsSummaryExtension
    defaultExtensions.push(Details)
    defaultExtensions.push(DetailsContent)
    defaultExtensions.push(DetailsSummary)
  }

  if (!exclude?.includes('emoji')) {
    const Emoji = EmojiExtension
    defaultExtensions.push(Emoji)
  }

  if (!exclude?.includes('mathematics')) {
    const CustomInlineMath = CustomInlineMathExtension({ onError })
    const CustomBlockMath = CustomBlockMathExtension({ onError })
    defaultExtensions.push(CustomInlineMath)
    defaultExtensions.push(CustomBlockMath)
  }

  if (!exclude?.includes('table')) {
    const Table = TableExtension({ editable })
    defaultExtensions.push(Table)
  }

  if (!exclude?.includes('list')) {
    const List = ListExtension
    defaultExtensions.push(List)
  }

  if (!exclude?.includes('video')) {
    const Video = VideoExtension({ onUpload, onError })
    defaultExtensions.push(Video)
  }

  if (!exclude?.includes('image')) {
    const Image = ImageExtension({ onUpload, onError })
    defaultExtensions.push(Image)
  }

  if (!exclude?.includes('youtube')) {
    const Youtube = YoutubeExtension(youtube)
    defaultExtensions.push(Youtube)
  }

  if (!exclude?.includes('fileHandler')) {
    const FileHandler = FileHandlerExtension({ onUpload })
    defaultExtensions.push(FileHandler)
  }

  if (!exclude?.includes('invisibleCharacters') && editable) {
    defaultExtensions.push(InvisibleCharacters)
  }

  if (!exclude?.includes('link')) {
    defaultExtensions.push(LinkExtension)
  }

  return defaultExtensions
}