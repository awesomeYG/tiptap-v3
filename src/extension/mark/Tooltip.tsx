import { Mark, mergeAttributes } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { ReactMarkViewRenderer } from '@tiptap/react'
import TooltipView from '../component/Tooltip'

export interface TooltipOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tooltip: {
      /**
       * Set a tooltip mark
       */
      setTooltip: (tooltip: string) => ReturnType
      /**
       * Toggle a tooltip mark
       */
      toggleTooltip: (tooltip?: string) => ReturnType
      /**
       * Unset a tooltip mark
       */
      unsetTooltip: () => ReturnType
    }
  }
}

export const Tooltip = Mark.create<TooltipOptions>({
  name: 'tooltip',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      tooltip: {
        default: null,
        parseHTML: element => element.getAttribute('data-tooltip'),
        renderHTML: attributes => {
          if (!attributes.tooltip) {
            return {}
          }

          return {
            'data-tooltip': attributes.tooltip,
            'class': 'tooltip-mark',
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-tooltip]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setTooltip:
        (tooltip: string) =>
          ({ commands }) => {
            return commands.setMark(this.name, { tooltip })
          },
      toggleTooltip:
        (tooltip?: string) =>
          ({ commands }) => {
            return commands.toggleMark(this.name, { tooltip })
          },
      unsetTooltip:
        () =>
          ({ commands }) => {
            return commands.unsetMark(this.name)
          },
    }
  },

  addMarkView() {
    return ReactMarkViewRenderer(TooltipView)
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: state => {
            const decorations: Decoration[] = []

            state.doc.descendants((node, pos) => {
              const mark = node.marks.find(mark => mark.type.name === this.name)
              if (mark) {
                const tooltip = mark.attrs.tooltip
                if (tooltip) {
                  decorations.push(
                    Decoration.inline(pos, pos + node.nodeSize, {
                      class: 'tooltip-mark',
                      'data-tooltip': tooltip,
                    })
                  )
                }
              }
            })

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },

  markdownTokenName: 'tooltip',

  markdownTokenizer: {
    name: 'tooltip',
    level: 'inline',
    start: (src: string) => src.indexOf('{'),
    tokenize(src: string, _tokens: any, helpers: any) {
      const match = /^\{([^}]+)\}\(([^)]+)\)/.exec(src)
      if (!match) {
        return
      }

      const text = match[1]
      const tooltip = match[2]

      return {
        type: 'tooltip',
        raw: match[0],
        text: text,
        tooltip: tooltip,
        tokens: helpers.inlineTokens(text),
      }
    },
  },

  parseMarkdown(token: any, helpers: any) {
    let content = helpers.parseInline(token.tokens || [])
    if (!Array.isArray(content)) {
      content = content ? [content] : []
    }
    if (content.length === 0 && token.text) {
      content = [helpers.createTextNode(token.text)]
    }
    return helpers.applyMark('tooltip', content, { tooltip: token.tooltip })
  },

  renderMarkdown(node: any, helpers: any) {
    const content = helpers.renderChildren(node)
    const tooltip = node.attrs?.tooltip || ''
    if (!tooltip) {
      return content
    }
    return `{${content}}(${tooltip})`
  },
})

export default Tooltip
