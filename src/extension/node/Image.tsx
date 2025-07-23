import Image from "@tiptap/extension-image";

export const ImageExtension = Image.configure({
  inline: true,
  allowBase64: true,
});