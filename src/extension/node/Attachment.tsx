import { EditorFnProps } from "@ctzhian/tiptap/type";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import AttachmentViewWrapper from "../component/Attachment";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineAttachment: {
      /**
       * Insert an inline attachment
       */
      setInlineAttachment: (options: {
        url: string
        title: string
        size: string
      }) => ReturnType
    }
    blockAttachment: {
      /**
       * Insert a block attachment
       */
      setBlockAttachment: (options: {
        url: string
        title: string
        size: string
      }) => ReturnType
    }
  }
}

// 内联附件扩展
export const InlineAttachmentExtension = (props: EditorFnProps) => Node.create({
  name: 'inlineAttachment',
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
        tag: 'span[data-tag="attachment"]',
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) return false
          return {
            url: dom.getAttribute('data-url') || '',
            title: dom.getAttribute('data-title') || '',
            size: dom.getAttribute('data-size') || '0',
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-tag': 'attachment', ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes) }]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-5': () => {
        return this.editor.commands.setInlineAttachment({
          url: '',
          title: '',
          size: '0',
        })
      }
    }
  },

  addCommands() {
    return {
      setInlineAttachment: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            url: options.url || '',
            title: options.title || '',
            size: options.size || '0',
          }
        })
      }
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => AttachmentViewWrapper({ ...renderProps, onUpload: props.onUpload, onError: props.onError, attachmentType: 'icon' }))
  },
});

// 块级附件扩展
export const BlockAttachmentExtension = (props: EditorFnProps) => Node.create({
  name: 'blockAttachment',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        url: '',
        title: '',
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
            size: dom.getAttribute('data-size') || '0',
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-tag': 'attachment', ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes) }]
  },

  addCommands() {
    return {
      setBlockAttachment: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            url: options.url || '',
            title: options.title || '',
            size: options.size || '0',
          }
        })
      }
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => AttachmentViewWrapper({ ...renderProps, onUpload: props.onUpload, onError: props.onError, attachmentType: 'block' }))
  },
});