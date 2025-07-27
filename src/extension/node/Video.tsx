import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import VideoViewWrapper from '../component/Video'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * Insert a video
       */
      setVideo: (options: {
        src: string
        width?: number
        height?: number
        controls?: boolean
        autoplay?: boolean
        loop?: boolean
        muted?: boolean
        poster?: string
      }) => ReturnType
    }
  }
}

export const VideoExtension = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      class: {
        default: 'video-wrapper',
      },
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) return {}
          return { src: attributes.src }
        },
      },
      controls: {
        default: true,
        parseHTML: element => element.hasAttribute('controls'),
        renderHTML: attributes => {
          if (!attributes.controls) return {}
          return { controls: 'true' }
        },
      },
      autoplay: {
        default: false,
        parseHTML: element => element.hasAttribute('autoplay'),
        renderHTML: attributes => {
          if (!attributes.autoplay) return {}
          return { autoplay: 'true' }
        },
      },
      loop: {
        default: false,
        parseHTML: element => element.hasAttribute('loop'),
        renderHTML: attributes => {
          if (!attributes.loop) return {}
          return { loop: 'true' }
        },
      },
      muted: {
        default: false,
        parseHTML: element => element.hasAttribute('muted'),
        renderHTML: attributes => {
          if (!attributes.muted) return {}
          return { muted: 'true' }
        },
      },
      poster: {
        default: null,
        parseHTML: element => element.getAttribute('poster'),
        renderHTML: attributes => {
          if (!attributes.poster) return {}
          return { poster: attributes.poster }
        },
      },
      width: {
        default: 600,
        parseHTML: element => {
          const width = element.getAttribute('width')
          return width ? parseInt(width, 10) : 600
        },
        renderHTML: attributes => {
          return { width: attributes.width }
        },
      },
      height: {
        default: 480,
        parseHTML: element => {
          const height = element.getAttribute('height')
          return height ? parseInt(height, 10) : 480
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
        tag: 'video',
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) return false

          const src = dom.getAttribute('src')
          if (!src) return false

          return {
            src,
            controls: dom.hasAttribute('controls'),
            autoplay: dom.hasAttribute('autoplay'),
            loop: dom.hasAttribute('loop'),
            muted: dom.hasAttribute('muted'),
            poster: dom.getAttribute('poster'),
            width: dom.getAttribute('width') ? parseInt(dom.getAttribute('width')!, 10) : 600,
            height: dom.getAttribute('height') ? parseInt(dom.getAttribute('height')!, 10) : 480,
          }
        },
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setVideo: (options) => ({ commands }) => {
        // if (!options.src) {
        //   return false
        // }

        return commands.insertContent({
          type: this.name,
          attrs: {
            src: options.src,
            width: options.width || 600,
            height: options.height || 480,
            controls: options.controls !== false,
            autoplay: options.autoplay || false,
            loop: options.loop || false,
            muted: options.muted || false,
            poster: options.poster || null,
          },
        })
      },
    }
  },

  addInputRules() {
    return [
      // Auto-embed video URLs
      {
        find: /^https?:\/\/.*\.(mp4|webm|ogg|mov|m4v|avi|wmv|flv|mkv|mpg|mpeg|m4p|m4v|m4b|m4r|m4a)$/,
        handler: ({ state, range, match }) => {
          const { from, to } = range
          const videoUrl = match[0]

          state.tr.replaceWith(
            from,
            to,
            this.type.create({
              src: videoUrl,
            })
          )
        },
      },
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoViewWrapper)
  },
})

export default VideoExtension