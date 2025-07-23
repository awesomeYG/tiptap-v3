import FileHandler from "@tiptap/extension-file-handler";

export const FileHandlerExtension = FileHandler.configure({
  onDrop: async (editor, files, pos) => {
    console.log(editor, files, pos);
  },
  onPaste: async (editor, files, htmlContent) => {
    console.log(editor, files, htmlContent);
  },
});