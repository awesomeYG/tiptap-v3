import { Mathematics } from "@tiptap/extension-mathematics";

export const MathematicsExtension = Mathematics.configure({
  inlineOptions: {
    // optional options for the inline math node
  },
  blockOptions: {
    // optional options for the block math node
  },
  katexOptions: {
    // optional options for the KaTeX renderer
  },
});