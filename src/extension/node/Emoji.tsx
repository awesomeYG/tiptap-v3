import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import { emojiSuggestion } from "../suggestion/emoji";

export const EmojiExtension = Emoji.configure({
  emojis: gitHubEmojis,
  enableEmoticons: true,
  suggestion: emojiSuggestion,
});