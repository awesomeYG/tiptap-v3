import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import AlertView from '../component/Alert'

export type AlertVariant = 'info' | 'warning' | 'error' | 'success' | 'default'
export type AlertType = 'text' | 'icon'

export interface AlertOptions {
  /**
   * HTML attributes to add to the alert element
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    alert: {
      /** 插入一个 Alert 节点 */
      setAlert: (attributes?: { variant?: AlertVariant, type?: AlertType }) => ReturnType
      /** 切换 Alert 的 variant */
      setAlertVariant: (variant: AlertVariant) => ReturnType
      /** 切换 Alert 的展示类型（是否显示图标） */
      setAlertType: (type: AlertType) => ReturnType
      /** 在当前块与 Alert 之间切换（将当前块转换为 Alert，若已是 Alert 则还原为段落） */
      toggleAlert: (attributes?: { variant?: AlertVariant, type?: AlertType }) => ReturnType
    }
  }
}

export const AlertExtension = Node.create<AlertOptions>({
  name: 'alert',
  group: 'block',
  content: 'block+',
  defining: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      id: {
        default: null,
        renderHTML: attributes => attributes.id ? { 'data-id': attributes.id } : {},
        parseHTML: element => (element as HTMLElement).getAttribute('data-id'),
      },
      variant: {
        default: 'info',
        renderHTML: attributes => ({ 'data-variant': attributes.variant }),
        parseHTML: element => (element as HTMLElement).getAttribute('data-variant') || 'info',
      },
      type: {
        default: 'icon',
        renderHTML: attributes => ({ 'data-type': attributes.type }),
        parseHTML: element => (element as HTMLElement).getAttribute('data-type') || 'icon',
      },
    }
  },

  parseHTML() {
    return [{
      tag: 'div[data-node="alert"]',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-node': 'alert' }), 0]
  },

  markdownTokenizer: {
    name: 'alert',
    level: 'block',
    start: (src: string) => src.indexOf(':::alert'),
    tokenize(src: string, _tokens: any, helpers: any) {
      const match = /^:::alert(?:\s+([^\s\n]+))?(?:\s+([^\s\n]+))?\s*\n([\s\S]*?)\n?:::(?:\s*\n|$)/.exec(src)
      if (!match) {
        return
      }

      const variant = match[1] || 'info'
      const alertType = match[2] || 'icon'
      const body = match[3] || ''

      return {
        type: 'alert',
        raw: match[0],
        variant,
        alertType,
        tokens: helpers.blockTokens(body),
      }
    },
  },

  renderMarkdown: (node: any, helpers: any) => {
    const variant = node.attrs?.variant || 'info'
    const alertType = node.attrs?.type || 'icon'
    const headerParts = [':::alert']
    if (variant && variant !== 'info') {
      headerParts.push(variant)
    }
    if (alertType && alertType !== 'icon') {
      headerParts.push(alertType)
    }

    const header = headerParts.join(' ')
    const content = node.content ? helpers.renderChildren(node.content, '\n\n') : ''
    const body = content ? `\n${content}` : ''

    return `${header}${body}\n:::`
  },

  parseMarkdown: (token: any, helpers: any) => {
    const variant = token.variant || 'info'
    const alertType = token.alertType || 'icon'
    const content = helpers.parseChildren(token.tokens || [])

    return helpers.createNode('alert', { variant, type: alertType }, content)
  },

  addCommands() {
    return {
      setAlert:
        (attrs = {}) => ({ commands }) => {
          const id = `alert_${Math.random().toString(36).slice(2)}`
          const variant: AlertVariant = (attrs.variant as AlertVariant) || 'info'
          const type: AlertType = (attrs.type as AlertType) || 'icon'
          return commands.wrapIn(this.name, { id, variant, type })
        },

      setAlertVariant:
        (variant: AlertVariant) => ({ commands }) => {
          return commands.updateAttributes(this.name, { variant })
        },

      setAlertType:
        (type: AlertType) => ({ commands }) => {
          return commands.updateAttributes(this.name, { type })
        },

      toggleAlert:
        (attrs = {}) => ({ commands }) => {
          const id = `alert_${Math.random().toString(36).slice(2)}`
          const variant: AlertVariant = (attrs.variant as AlertVariant) || 'info'
          const type: AlertType = (attrs.type as AlertType) || 'icon'
          return commands.toggleWrap(this.name, { id, variant, type })
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(AlertView)
  },
})

export default AlertExtension


