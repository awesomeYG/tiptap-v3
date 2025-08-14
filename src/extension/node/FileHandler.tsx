import FileHandler from "@tiptap/extension-file-handler";
import { UploadFunction } from "@yu-cq/tiptap/type";
import { formatFileSize, getFileType } from "@yu-cq/tiptap/util";

export const FileHandlerExtension = (props: { onUpload?: UploadFunction }) => FileHandler.configure({
  onDrop: async (editor, files, pos) => {
    if (!props.onUpload || files.length === 0) return;

    // 处理多文件上传
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = getFileType(file);

      try {
        // 生成唯一的临时ID
        const tempId = `upload-${Date.now()}-${i}`;

        // 插入上传进度指示器
        editor.chain().focus().insertContentAt(pos + i, {
          type: 'uploadProgress',
          attrs: {
            fileName: file.name,
            fileType: fileType,
            progress: 0,
            tempId: tempId,
          },
        }).run();

        // 上传文件
        const url = await props.onUpload(file, (progressEvent) => {
          // 更新进度
          editor.commands.updateUploadProgress(tempId, progressEvent.progress);
        });

        // 移除进度指示器
        editor.commands.removeUploadProgress(tempId);

        // 插入最终内容
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

        // 移除进度指示器
        editor.commands.removeUploadProgress(tempId);

        // 插入错误状态的节点
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
  onPaste: async (editor, files, htmlContent) => {
    if (!props.onUpload || files.length === 0) return false;

    // 复用 onDrop 逻辑处理粘贴的文件
    const { from } = editor.state.selection;

    // 直接调用onDrop逻辑，避免重复创建扩展
    if (files.length > 0) {
      // 处理多文件上传
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = getFileType(file);

        try {
          // 生成唯一的临时ID
          const tempId = `upload-${Date.now()}-${i}`;

          // 插入上传进度指示器
          editor.chain().focus().insertContentAt(from + i, {
            type: 'uploadProgress',
            attrs: {
              fileName: file.name,
              fileType: fileType,
              progress: 0,
              tempId: tempId,
            },
          }).run();

          // 上传文件
          const url = await props.onUpload(file, (progressEvent) => {
            // 更新进度
            editor.commands.updateUploadProgress(tempId, progressEvent.progress);
          });

          // 移除进度指示器
          editor.commands.removeUploadProgress(tempId);

          // 插入最终内容
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

          // 移除进度指示器
          editor.commands.removeUploadProgress(tempId);

          // 插入错误状态的节点
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