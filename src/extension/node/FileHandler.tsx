import FileHandler from "@tiptap/extension-file-handler";
import { getFileType, insertAttachmentContent, insertImageContent, insertVideoContent } from "../../util/fileHandler";

export const FileHandlerExtension = (props: { onUpload?: (file: File) => Promise<string> }) => FileHandler.configure({
  onDrop: async (editor, files, pos) => {
    files.forEach(async (file) => {
      if (props.onUpload) {
        const url = await props.onUpload(file)
        const fileType = getFileType(file)
        switch (fileType) {
          case 'image':
            insertImageContent(editor, url, pos)
            break
          case 'video':
            insertVideoContent(editor, url, pos)
            break
          default:
            insertAttachmentContent(editor, url, file.name, file.size, pos)
            break
        }
      }
    })
  },
  onPaste: async (editor, files, htmlContent) => {
    // return await handlePaste(editor, files, htmlContent || '', props.onUpload);
  },
});