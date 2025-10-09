import { UploadFunction } from "@ctzhian/tiptap/type";
import { formatFileSize, getFileType } from "@ctzhian/tiptap/util";
import FileHandler from "@tiptap/extension-file-handler";
import { getImageDimensionsFromFile } from "../component/Image";

export const FileHandlerExtension = (props: { onUpload?: UploadFunction }) => FileHandler.configure({
  onDrop: async (editor, files, pos) => {
    if (!props.onUpload || files.length === 0) return;

    const findNodePosition = (typeName: string, tempId: string) => {
      let targetPos: number | null = null;
      editor.state.doc.descendants((node, position) => {
        if (node.type.name === typeName && node.attrs.tempId === tempId) {
          targetPos = position;
          return false;
        }
        return undefined;
      });
      return targetPos;
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = getFileType(file);
      const tempId = `upload-${Date.now()}-${i}`;
      const insertPosition = pos + i;
      const isImage = fileType === 'image';
      const progressNodeType = isImage ? 'inlineUploadProgress' : 'uploadProgress';

      try {
        editor.chain().insertContentAt(insertPosition, {
          type: progressNodeType,
          attrs: {
            fileName: file.name,
            fileType,
            progress: 0,
            tempId,
          },
        }).focus().run();

        const progressPos = findNodePosition(progressNodeType, tempId);

        const url = await props.onUpload(file, (progressEvent) => {
          const progressValue = progressEvent.progress;
          if (isImage) {
            editor.chain().updateInlineUploadProgress(tempId, progressValue).focus().run();
          } else {
            editor.chain().updateUploadProgress(tempId, progressValue).focus().run();
          }
        });

        if (isImage) {
          editor.chain().removeInlineUploadProgress(tempId).focus().run();
        } else {
          editor.chain().removeUploadProgress(tempId).focus().run();
        }

        const chain = editor.chain().focus();
        if (progressPos !== null) {
          chain.setTextSelection(progressPos);
        }

        switch (fileType) {
          case 'image':
            try {
              const dimensions = await getImageDimensionsFromFile(file);
              chain.setImage({
                src: url,
                width: Math.min(dimensions.width, 760) // 使用原始宽度，但不超过760px
              }).run();
            } catch (error) {
              console.warn('无法获取图片尺寸，使用默认宽度:', error);
              const fallbackChain = editor.chain().focus();
              if (progressPos !== null) {
                fallbackChain.setTextSelection(progressPos);
              }
              fallbackChain.setImage({
                src: url,
                width: 760
              }).run();
            }
            break;
          case 'video':
            chain.setVideo({
              src: url,
              width: 760,
              controls: true,
              autoplay: false
            }).run();
            break;
          default:
            chain.setBlockAttachment({
              url: url,
              title: file.name,
              size: formatFileSize(file.size)
            }).run();
            break;
        }
      } catch (error) {
        console.error('文件上传失败:', error);
        if (isImage) {
          editor.chain().removeInlineUploadProgress(tempId).focus().run();
        } else {
          editor.chain().removeUploadProgress(tempId).focus().run();
        }

        const progressPos = findNodePosition(progressNodeType, tempId);
        const chain = editor.chain().focus();
        if (progressPos !== null) {
          chain.setTextSelection(progressPos);
        }

        switch (fileType) {
          case 'image':
            chain.setImage({
              src: '',
              width: 760
            }).run();
            break;
          case 'video':
            chain.setVideo({
              src: '',
              width: 760,
              controls: true,
              autoplay: false
            }).run();
            break;
          default:
            chain.setBlockAttachment({
              url: 'error',
              title: `上传失败: ${file.name}`,
              size: formatFileSize(file.size)
            }).run();
            break;
        }
      }
    }
  },
  // onPaste: async (editor, files, pasteContent) => {
  //   if (!props.onUpload || files.length === 0 || !!pasteContent) return false;
  //   const { from } = editor.state.selection;
  //   if (files.length > 0) {
  //     const findNodePosition = (typeName: string, tempId: string) => {
  //       let targetPos: number | null = null;
  //       editor.state.doc.descendants((node, position) => {
  //         if (node.type.name === typeName && node.attrs.tempId === tempId) {
  //           targetPos = position;
  //           return false;
  //         }
  //         return undefined;
  //       });
  //       return targetPos;
  //     };
  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       const fileType = getFileType(file);
  //       const tempId = `upload-${Date.now()}-${i}`;
  //       const insertPosition = from + i;
  //       const isImage = fileType === 'image';
  //       const progressNodeType = isImage ? 'inlineUploadProgress' : 'uploadProgress';
  //       try {
  //         editor.chain().insertContentAt(insertPosition, {
  //           type: progressNodeType,
  //           attrs: {
  //             fileName: file.name,
  //             fileType,
  //             progress: 0,
  //             tempId,
  //           },
  //         }).focus().run();

  //         const progressPos = findNodePosition(progressNodeType, tempId);

  //         const url = await props.onUpload(file, (progressEvent) => {
  //           const progressValue = progressEvent.progress;
  //           if (isImage) {
  //             editor.chain().updateInlineUploadProgress(tempId, progressValue).focus().run();
  //           } else {
  //             editor.chain().updateUploadProgress(tempId, progressValue).focus().run();
  //           }
  //         });

  //         if (isImage) {
  //           editor.chain().removeInlineUploadProgress(tempId).focus().run();
  //         } else {
  //           editor.chain().removeUploadProgress(tempId).focus().run();
  //         }

  //         const chain = editor.chain().focus();
  //         if (progressPos !== null) {
  //           chain.setTextSelection(progressPos);
  //         }

  //         switch (fileType) {
  //           case 'image':
  //             try {
  //               const dimensions = await getImageDimensionsFromFile(file);
  //               chain.setImage({
  //                 src: url,
  //                 width: Math.min(dimensions.width, 760) // 使用原始宽度，但不超过760px
  //               }).run();
  //             } catch (error) {
  //               console.warn('无法获取图片尺寸，使用默认宽度:', error);
  //               const fallbackChain = editor.chain().focus();
  //               if (progressPos !== null) {
  //                 fallbackChain.setTextSelection(progressPos);
  //               }
  //               fallbackChain.setImage({
  //                 src: url,
  //                 width: 760
  //               }).run();
  //             }
  //             break;
  //           case 'video':
  //             chain.setVideo({
  //               src: url,
  //               width: 760,
  //               controls: true,
  //               autoplay: false
  //             }).run();
  //             break;
  //           default:
  //             chain.setBlockAttachment({
  //               url: url,
  //               title: file.name,
  //               size: formatFileSize(file.size)
  //             }).run();
  //             break;
  //         }
  //       } catch (error) {
  //         console.error('文件上传失败:', error);
  //         const tempId = `upload-${Date.now()}-${i}`;
  //         const isImage = fileType === 'image';
  //         const progressNodeType = isImage ? 'inlineUploadProgress' : 'uploadProgress';
  //         const progressPos = findNodePosition(progressNodeType, tempId);

  //         if (isImage) {
  //           editor.chain().removeInlineUploadProgress(tempId).focus().run();
  //         } else {
  //           editor.chain().removeUploadProgress(tempId).focus().run();
  //         }

  //         const chain = editor.chain().focus();
  //         if (progressPos !== null) {
  //           chain.setTextSelection(progressPos);
  //         }
  //         switch (fileType) {
  //           case 'image':
  //             chain.setImage({
  //               src: '',
  //               width: 760
  //             }).run();
  //             break;
  //           case 'video':
  //             chain.setVideo({
  //               src: '',
  //               width: 760,
  //               controls: true,
  //               autoplay: false
  //             }).run();
  //             break;
  //           default:
  //             chain.setBlockAttachment({
  //               url: 'error',
  //               title: `上传失败: ${file.name}`,
  //               size: formatFileSize(file.size)
  //             }).run();
  //             break;
  //         }
  //       }
  //     }
  //   }
  //   return true;
  // },
});