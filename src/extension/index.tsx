
import { Dropcursor } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import {
  CodeBlockLowlightExtension,
  DetailsContentExtension,
  DetailsExtension,
  DetailsSummaryExtension,
  EmojiExtension,
} from './node';

const extensions = [
  CodeBlockLowlightExtension,
  DetailsExtension,
  DetailsSummaryExtension,
  DetailsContentExtension,
  Dropcursor,
  EmojiExtension,
  StarterKit.configure({
    codeBlock: false,
    dropcursor: false,
  }),
]

export default extensions;