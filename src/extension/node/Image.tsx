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
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 760,
        parseHTML: element => {
          const width = element.getAttribute('width');
          return width ? parseInt(width, 10) : 760;
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => ImageViewWrapper({ ...renderProps, onUpload: props.onUpload, onError: props.onError }))
  },
})

export const ImageExtension = (props: ImageExtensionProps) => customImage(props).configure({
  inline: true,
  allowBase64: true,
});