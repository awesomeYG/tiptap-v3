import { EditorFnProps } from "@ctzhian/tiptap/type";
import { getFileType } from "@ctzhian/tiptap/util";
import Image from "@tiptap/extension-image";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageViewWrapper, { getImageDimensionsFromFile } from "../component/Image";

export type ImageExtensionProps = EditorFnProps

const customImage = (props: ImageExtensionProps) => Image.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-2': () => {
        return this.editor.commands.setImage({ src: '', width: 760 })
      }
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => ImageViewWrapper({ ...renderProps, onUpload: props.onUpload, onError: props.onError, onValidateUrl: props.onValidateUrl }))
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imagePasteHandler'),
        props: {
          handlePaste: (view, event) => {
            if (!props.onUpload) return false;

            const items = Array.from(event.clipboardData?.items || []);
            const imageFiles = items
              .map(item => item.getAsFile())
              .filter((file): file is File => file !== null && getFileType(file) === 'image');

            if (imageFiles.length === 0) return false;

            const { from } = view.state.selection;
            const editor = this.editor;

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

            (async () => {
              if (!props.onUpload) return;

              for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const tempId = `upload-${Date.now()}-${i}`;
                const insertPosition = from + i;

                try {
                  editor.chain().insertContentAt(insertPosition, {
                    type: 'inlineUploadProgress',
                    attrs: {
                      fileName: file.name,
                      fileType: 'image',
                      progress: 0,
                      tempId,
                    },
                  }).focus().run();

                  const progressPos = findNodePosition('inlineUploadProgress', tempId);

                  const url = await props.onUpload(file, (progressEvent) => {
                    const progressValue = progressEvent.progress;
                    editor.chain().updateInlineUploadProgress(tempId, progressValue).focus().run();
                  });

                  editor.chain().removeInlineUploadProgress(tempId).focus().run();

                  const chain = editor.chain().focus();
                  if (progressPos !== null) {
                    chain.setTextSelection(progressPos);
                  }

                  try {
                    const dimensions = await getImageDimensionsFromFile(file);
                    chain.setImage({
                      src: url,
                      width: Math.min(dimensions.width, 760)
                    }).run();
                  } catch (error) {
                    const fallbackChain = editor.chain().focus();
                    if (progressPos !== null) {
                      fallbackChain.setTextSelection(progressPos);
                    }
                    fallbackChain.setImage({
                      src: url,
                      width: 760
                    }).run();
                  }
                } catch (error) {
                  editor.chain().removeInlineUploadProgress(tempId).focus().run();

                  const progressPos = findNodePosition('inlineUploadProgress', tempId);
                  const chain = editor.chain().focus();
                  if (progressPos !== null) {
                    chain.setTextSelection(progressPos);
                  }

                  chain.setImage({
                    src: '',
                    width: 760
                  }).run();
                }
              }
            })();

            return true;
          }
        }
      })
    ];
  }
})

export const ImageExtension = (props: ImageExtensionProps) => customImage(props).configure({
  inline: true,
  allowBase64: true,
});
