import { EditorFnProps } from '@ctzhian/tiptap/type'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import FlowViewWrapper from '../../component/Flow'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    flow: {
      /**
       * Insert a flow diagram
       */
      setFlow: (options: {
        code?: string
        width?: string | number
      }) => ReturnType
    }
  }
}

export type FlowExtensionProps = EditorFnProps

export const FlowExtension = (props: FlowExtensionProps) => Node.create({
  name: 'flow',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      code: {
        default: '',
        parseHTML: element => element.getAttribute('data-code') || '',
        renderHTML: attributes => {
          if (!attributes.code) return {}
          return { 'data-code': attributes.code }
        },
      },
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('data-width') || '100%',
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { 'data-width': String(attributes.width) }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="flow"]',
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) return false
          const code = dom.getAttribute('data-code') || ''
          const width = dom.getAttribute('data-width') || '100%'
          return { code, width }
        },
      }
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs = node.attrs as { code?: string; width?: string | number }
    return ['div', mergeAttributes(
      { 'data-type': 'flow' },
      attrs.code ? { 'data-code': attrs.code } : {},
      attrs.width ? { 'data-width': String(attrs.width) } : {},
      this.options.HTMLAttributes,
      HTMLAttributes
    )]
  },

  renderMarkdown(node) {
    const { code } = node.attrs as { code?: string; }
    if (!code) return ''
    return `\`\`\`mermaid\n${code}\n\`\`\``
  },

  addCommands() {
    return {
      setFlow: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            code: options.code || '',
            width: options.width || '100%',
          },
        })
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => FlowViewWrapper({ ...renderProps, onError: props.onError }))
  },
})

export default FlowExtension

