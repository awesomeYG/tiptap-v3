import { EditorFnProps } from '@ctzhian/tiptap/type'
import { getFileType } from '@ctzhian/tiptap/util'
import { InputRule, mergeAttributes, Node } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
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
        controls?: boolean
        autoplay?: boolean
        loop?: boolean
        muted?: boolean
        poster?: string
      }) => ReturnType
    }
  }
}

export type VideoExtensionProps = EditorFnProps

export const VideoExtension = (props: VideoExtensionProps) => Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addKeyboardShortcuts() {
    return {
      'Mod-3': () => {
        return this.editor.commands.setVideo({ src: '', width: 760, controls: true, autoplay: false })
      }
    }
  },

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
        default: 760,
        parseHTML: element => {
          const width = element.getAttribute('width')
          return width ? parseInt(width, 10) : 760
        },
        renderHTML: attributes => {
          return { width: attributes.width }
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
            width: dom.getAttribute('width') ? parseInt(dom.getAttribute('width')!, 10) : 760,
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
        return commands.insertContent({
          type: this.name,
          attrs: {
            src: options.src,
            width: options.width || 760,
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
      new InputRule({
        find: /^https?:\/\/.*\.(mp4|webm|ogg|mov|m4v|avi|wmv|flv|mkv|mpg|mpeg|m4p|m4v|m4b|m4r|m4a)$/,
        handler: ({ range, match, commands }) => {
          const { from, to } = range
          const videoUrl = match[0]
          commands.insertContentAt({ from, to }, {
            type: this.name,
            attrs: { src: videoUrl },
          })
        },
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => VideoViewWrapper({ ...renderProps, onUpload: props.onUpload, onError: props.onError }))
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('videoPasteHandler'),
        props: {
          handlePaste: (view, event) => {
            if (!props.onUpload) return false

            const items = Array.from(event.clipboardData?.items || [])
            const videoFiles = items
              .map(item => item.getAsFile())
              .filter((file): file is File => file !== null && getFileType(file) === 'video')

            if (videoFiles.length === 0) return false

            const { from } = view.state.selection
            const editor = this.editor

            const findNodePosition = (typeName: string, tempId: string) => {
              let targetPos: number | null = null
              editor.state.doc.descendants((node, position) => {
                if (node.type.name === typeName && node.attrs.tempId === tempId) {
                  targetPos = position
                  return false
                }
                return undefined
              })
              return targetPos
            };
            (async () => {
              if (!props.onUpload) return

              for (let i = 0; i < videoFiles.length; i++) {
                const file = videoFiles[i]
                const tempId = `upload-${Date.now()}-${i}`
                const insertPosition = from + i

                try {
                  editor.chain().insertContentAt(insertPosition, {
                    type: 'uploadProgress',
                    attrs: {
                      fileName: file.name,
                      fileType: 'video',
                      progress: 0,
                      tempId,
                    },
                  }).focus().run()

                  const progressPos = findNodePosition('uploadProgress', tempId)

                  const url = await props.onUpload(file, (progressEvent) => {
                    const progressValue = progressEvent.progress
                    editor.chain().updateUploadProgress(tempId, progressValue).focus().run()
                  })

                  editor.chain().removeUploadProgress(tempId).focus().run()

                  const chain = editor.chain().focus()
                  if (progressPos !== null) {
                    chain.setTextSelection(progressPos)
                  }

                  chain.setVideo({
                    src: url,
                    width: 760,
                    controls: true,
                    autoplay: false,
                  }).run()
                } catch (error) {
                  console.error('视频上传失败:', error)
                  editor.chain().removeUploadProgress(tempId).focus().run()

                  const progressPos = findNodePosition('uploadProgress', tempId)
                  const chain = editor.chain().focus()
                  if (progressPos !== null) {
                    chain.setTextSelection(progressPos)
                  }

                  chain.setVideo({
                    src: '',
                    width: 760,
                    controls: true,
                    autoplay: false,
                  }).run()
                }
              }
            })()

            return true
          }
        }
      })
    ]
  }
})

export default VideoExtension