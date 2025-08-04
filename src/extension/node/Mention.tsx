import Mention from "@tiptap/extension-mention";
import { MentionExtensionProps } from "@yu-cq/tiptap/type";
import mentionSuggestion from "../suggestion/mention";

export const MentionExtension = (props: MentionExtensionProps) => Mention.configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion: mentionSuggestion(props),
});