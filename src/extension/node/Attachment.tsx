import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { EditorFnProps } from "@yu-cq/tiptap/type";
import AttachmentViewWrapper from "../component/Attachment";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    attachment: {
      /**
       * Insert a attachment
       */
      setAttachment: (options: {
        url: string
        title: string
        type: string
        size: string
      }) => ReturnType
    }
  }
}

export const AttachmentExtension = (props: EditorFnProps) => Node.create({
  name: 'attachment',
  group: 'inline',
  inline: true,
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        url: '',
        title: '',
        type: 'icon',
        size: '0',
      },
    }
  },

  addAttributes() {
    return {
      url: {
        default: this.options.HTMLAttributes.url,
        parseHTML: (element) => {
          return element.getAttribute('data-url')
        },
        renderHTML: (attributes) => {
          return {
            'data-url': attributes.url,
          }
        },
      },
      title: {
        default: this.options.HTMLAttributes.title,
        parseHTML: (element) => {
          return element.getAttribute('data-title')
        },
        renderHTML: (attributes) => {
          return {
            'data-title': attributes.title,
          }
        },
      },
      type: {
        default: this.options.HTMLAttributes.type,
        parseHTML: (element) => {
          return element.getAttribute('data-type') || 'icon'
        },
        renderHTML: (attributes) => {
          return {
            'data-type': attributes.type,
          }
        },
      },
      size: {
        default: this.options.HTMLAttributes.size,
        parseHTML: (element) => {
          return element.getAttribute('data-size') || '0'
        },
        renderHTML: (attributes) => {
          return {
            'data-size': attributes.size,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-tag="attachment"]',
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) return false
          return {
            url: dom.getAttribute('data-url') || '',
            title: dom.getAttribute('data-title') || '',
            type: dom.getAttribute('data-type') || 'icon',
            size: dom.getAttribute('data-size') || '0',
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-tag': 'attachment', ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes) }]
  },



  addKeyboardShortcuts() {
    return {
      'Mod-4': () => {
        return this.editor.commands.setAttachment({
          url: '',
          title: '',
          size: '0',
          type: 'icon',
        })
      }
    }
  },

  addCommands() {
    return {
      setAttachment: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            url: options.url || '',
            title: options.title || '',
            size: options.size || '0',
            type: options.type || 'icon',
          }
        })
      }
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => AttachmentViewWrapper({ ...renderProps, onUpload: props.onUpload, onError: props.onError }))
  },
});