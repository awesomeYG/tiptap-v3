import { EditorFnProps } from '@ctzhian/tiptap/type'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import IframeViewWrapper from '../component/Iframe'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: {
        src: string
        width?: number
        height?: number
      }) => ReturnType
    }
  }
}

export type IframeExtensionProps = EditorFnProps

export const IframeExtension = (props: IframeExtensionProps) => Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      class: {
        default: 'iframe-wrapper',
      },
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) return {}
          return { src: attributes.src }
        },
      },
      width: {
        default: 760,
        parseHTML: element => {
          const width = element.getAttribute('width')
          return width ? parseInt(width, 10) : 760
        },
        renderHTML: attributes => {
          return { width: attributes.width }
        },
      },
      height: {
        default: 400,
        parseHTML: element => {
          const height = element.getAttribute('height')
          return height ? parseInt(height, 10) : 400
        },
        renderHTML: attributes => {
          return { height: attributes.height }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) return false

          const src = dom.getAttribute('src')
          if (!src) return false

          const width = dom.getAttribute('width') ? parseInt(dom.getAttribute('width')!, 10)
            : dom.style.width ? parseInt(dom.style.width, 10) : 760
          const height = dom.getAttribute('height') ? parseInt(dom.getAttribute('height')!, 10)
            : dom.style.height ? parseInt(dom.style.height, 10) : 400

          return {
            src,
            width,
            height,
          }
        },
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, ...rest } = HTMLAttributes as any
    return ['iframe', mergeAttributes(this.options.HTMLAttributes, { ...rest, src, frameborder: '0', allowfullscreen: 'true' })]
  },

  addCommands() {
    return {
      setIframe: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            src: options.src,
            width: options.width || 760,
            height: options.height || 400,
          },
        })
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => IframeViewWrapper({ ...renderProps, onError: props.onError }))
  },
})

export default IframeExtension


