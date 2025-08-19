import FileHandler from "@tiptap/extension-file-handler";
import { UploadFunction } from "@yu-cq/tiptap/type";
import { formatFileSize, getFileType } from "@yu-cq/tiptap/util";

export const FileHandlerExtension = (props: { onUpload?: UploadFunction }) => FileHandler.configure({
  onDrop: async (editor, files, pos) => {
    if (!props.onUpload || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = getFileType(file);
      try {
        const tempId = `upload-${Date.now()}-${i}`;
        editor.chain().focus().insertContentAt(pos + i, {
          type: 'uploadProgress',
          attrs: {
            fileName: file.name,
            fileType: fileType,
            progress: 0,
            tempId: tempId,
          },
        }).run();
        const url = await props.onUpload(file, (progressEvent) => {
          editor.commands.updateUploadProgress(tempId, progressEvent.progress);
        });
        editor.commands.removeUploadProgress(tempId);
        switch (fileType) {
          case 'image':
            editor.commands.setImage({
              src: url,
              width: 760
            });
            break;
          case 'video':
            editor.commands.setVideo({
              src: url,
              width: 760,
              controls: true,
              autoplay: false
            });
            break;
          default:
            editor.commands.setInlineAttachment({
              url: url,
              title: file.name,
              size: formatFileSize(file.size)
            });
            break;
        }
      } catch (error) {
        console.error('文件上传失败:', error);
        const tempId = `upload-${Date.now()}-${i}`;
        editor.commands.removeUploadProgress(tempId);
        switch (fileType) {
          case 'image':
            editor.commands.setImage({
              src: '',
              width: 760
            });
            break;
          case 'video':
            editor.commands.setVideo({
              src: '',
              width: 760,
              controls: true,
              autoplay: false
            });
            break;
          default:
            editor.commands.setInlineAttachment({
              url: 'error',
              title: `上传失败: ${file.name}`,
              size: formatFileSize(file.size)
            });
            break;
        }
      }
    }
  },
  onPaste: async (editor, files) => {
    if (!props.onUpload || files.length === 0) return false;
    const { from } = editor.state.selection;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = getFileType(file);
        try {
          const tempId = `upload-${Date.now()}-${i}`;
          editor.chain().focus().insertContentAt(from + i, {
            type: 'uploadProgress',
            attrs: {
              fileName: file.name,
              fileType: fileType,
              progress: 0,
              tempId: tempId,
            },
          }).run();
          const url = await props.onUpload(file, (progressEvent) => {
            editor.commands.updateUploadProgress(tempId, progressEvent.progress);
          });
          editor.commands.removeUploadProgress(tempId);
          switch (fileType) {
            case 'image':
              editor.commands.setImage({
                src: url,
                width: 760
              });
              break;
            case 'video':
              editor.commands.setVideo({
                src: url,
                width: 760,
                controls: true,
                autoplay: false
              });
              break;
            default:
              editor.commands.setInlineAttachment({
                url: url,
                title: file.name,
                size: formatFileSize(file.size)
              });
              break;
          }
        } catch (error) {
          console.error('文件上传失败:', error);
          const tempId = `upload-${Date.now()}-${i}`;
          editor.commands.removeUploadProgress(tempId);
          switch (fileType) {
            case 'image':
              editor.commands.setImage({
                src: '',
                width: 760
              });
              break;
            case 'video':
              editor.commands.setVideo({
                src: '',
                width: 760,
                controls: true,
                autoplay: false
              });
              break;
            default:
              editor.commands.setInlineAttachment({
                url: 'error',
                title: `上传失败: ${file.name}`,
                size: formatFileSize(file.size)
              });
              break;
          }
        }
      }
    }
    return true;
  },
});