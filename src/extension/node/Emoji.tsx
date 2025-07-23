import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";

export const EmojiExtension = Emoji.configure({
  emojis: gitHubEmojis,
  enableEmoticons: true,
  // suggestion: emojiSuggestion,
});