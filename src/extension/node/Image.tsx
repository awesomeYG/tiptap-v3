import { EditorFnProps } from "@cq/tiptap/type";
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageViewWrapper from "../component/Image";

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
    return ReactNodeViewRenderer((renderProps) => ImageViewWrapper({ ...renderProps, onUpload: props.onUpload, onError: props.onError }))
  },
})

export const ImageExtension = (props: ImageExtensionProps) => customImage(props).configure({
  inline: true,
  allowBase64: true,
});