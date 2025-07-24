
import { CharacterCount, Dropcursor } from '@tiptap/extensions';
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
  MentionExtension,
} from './node';

export const getExtensions = ({
  exclude,
  mentionItems,
  getMentionItems,
}: GetExtensionsProps) => {
  const defaultExtensions: any = [
    CodeBlockLowlightExtension,
    DetailsContentExtension,
    DetailsExtension,
    DetailsSummaryExtension,
    Dropcursor,
    FileHandlerExtension,
    ImageExtension,
    CharacterCount,
    StarterKit.configure({
      codeBlock: false,
      dropcursor: false,
    }),
  ]

  if ((mentionItems && mentionItems.length > 0 || getMentionItems) && !exclude?.includes('mention')) {
    const Mention = MentionExtension({ mentionItems, getMentionItems })
    defaultExtensions.push(Mention)
  }

  if (!exclude?.includes('emoji')) {
    const Emoji = EmojiExtension
    defaultExtensions.push(Emoji)
  }

  return defaultExtensions
}