import { Link } from "@tiptap/extension-link";
import { ReactMarkViewRenderer } from "@tiptap/react";
import { LinkViewWrapper } from "../component/Link";

const customLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      type: {
        default: 'link',
        parseHTML: (element) => {
          return element.getAttribute('data-type') || 'link'
        },
        renderHTML: (attributes) => {
          return {
            'data-type': attributes.type,
          }
        }
      },
      title: {
        default: '',
        parseHTML: (element) => {
          return element.getAttribute('data-title') || ''
        },
        renderHTML: (attributes) => {
          return {
            'data-title': attributes.title,
          }
        }
      },
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        return this.editor.commands.setLink({ href: '' })
      }
    }
  },
  addMarkView() {
    return ReactMarkViewRenderer(LinkViewWrapper, {
      as: 'a',
      attrs: {
        href: this.options.HTMLAttributes.href || '',
        target: this.options.HTMLAttributes.target || '',
        class: this.options.HTMLAttributes.class || '',
        'data-title': this.options.HTMLAttributes['data-title'] || '',
        'data-type': this.options.HTMLAttributes['data-type'] || 'link',
      }
    })
  }
})

export const LinkExtension = customLink.configure({
  autolink: true,
  openOnClick: true,
  enableClickSelection: true,
  linkOnPaste: true,
  protocols: ['http', 'https', 'mailto', 'tel'],
  defaultProtocol: 'http',
  HTMLAttributes: {
    rel: null,
    target: '_blank',
  },
})

export default LinkExtension
