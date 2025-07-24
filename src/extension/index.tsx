
import { CharacterCount } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { GetExtensionsProps } from '../type';
import {
  CodeBlockLowlightExtension,
  DetailsContentExtension,
  DetailsExtension,
  DetailsSummaryExtension,
  EmojiExtension,
  FileHandlerExtension,
  ImageExtension,
  ListExtension,
  MathematicsExtension,
  MentionExtension,
  TableExtension,
} from './node';

export const getExtensions = ({
  exclude,
  editable,
  mentionItems,
  getMention,
}: GetExtensionsProps) => {
  const defaultExtensions: any = [
    CodeBlockLowlightExtension,
    FileHandlerExtension,
    ImageExtension,
    CharacterCount,
    StarterKit.configure({
      codeBlock: false,
      listItem: false,
      orderedList: false,
      bulletList: false,
      listKeymap: false,
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
    const Mathematics = MathematicsExtension
    defaultExtensions.push(Mathematics)
  }

  if (!exclude?.includes('table')) {
    const Table = TableExtension({ editable })
    defaultExtensions.push(Table)
  }

  if (!exclude?.includes('list')) {
    const List = ListExtension
    defaultExtensions.push(List)
  }

  return defaultExtensions
}