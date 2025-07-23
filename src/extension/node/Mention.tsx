import Mention from "@tiptap/extension-mention";

export const MentionExtension = Mention.configure({
  HTMLAttributes: {
    class: 'mention',
  },
  // suggestion: mentionSuggestion,
});