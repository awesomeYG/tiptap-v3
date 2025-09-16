import { mergeAttributes, Node } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { ReactNodeViewRenderer } from '@tiptap/react'
import AlertView from '../component/Alert'

export type AlertVariant = 'info' | 'warning' | 'error' | 'success'
export type AlertType = 'text' | 'icon'

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

export const AlertExtension = Node.create({
  name: 'alert',
  group: 'block',
  content: 'inline*',
  defining: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'cq-alert',
      },
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
    return [
      {
        tag: 'div.cq-alert',
      },
      {
        tag: 'div[data-node="alert"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-node': 'alert' }), 0]
  },

  addCommands() {
    return {
      setAlert:
        (attrs = {}) => ({ chain }) => {
          const id = `alert_${Math.random().toString(36).slice(2)}`
          const variant: AlertVariant = (attrs.variant as AlertVariant) || 'info'
          const type: AlertType = (attrs.type as AlertType) || 'icon'

          const ok = chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { id, variant, type },
            })
            .run()

          if (!ok) {
            // 尝试在当前块之后插入
            const { state } = this.editor
            const $from = state.selection.$from
            const afterPos = $from.after($from.depth)
            const fallback = this.editor.commands.insertContentAt(afterPos, {
              type: this.name,
              attrs: { id, variant, type },
            })
            if (!fallback) return false
          }

          // 将光标移动到刚插入的 Alert 内部
          try {
            const { doc } = this.editor.state
            let posInside = null as number | null
            doc.descendants((node, pos) => {
              if (node.type.name === this.name && (node.attrs as any).id === id) {
                posInside = pos + 1
                return false
              }
              return true
            })
            if (posInside != null) {
              this.editor.commands.setTextSelection(posInside)
            }
          } catch { }

          return true
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
        (attrs = {}) => ({ state, dispatch, editor }) => {
          const { tr, selection, schema } = state
          const $from = selection.$from
          const currentNode = $from.node($from.depth)
          const posStart = $from.before($from.depth)
          const posEnd = posStart + currentNode.nodeSize

          const variant: AlertVariant = (attrs.variant as AlertVariant) || 'info'
          const type: AlertType = (attrs.type as AlertType) || 'icon'

          // 已是 Alert -> 还原为段落
          if (currentNode.type === this.type) {
            const paragraph = schema.nodes.paragraph.create(undefined, currentNode.content)
            tr.replaceWith(posStart, posEnd, paragraph)
            tr.setSelection(TextSelection.near(tr.doc.resolve(posStart + 1)))
            if (dispatch) dispatch(tr)
            editor.view.focus()
            return true
          }

          // 将当前块替换为 Alert，尽量保留 inline 内容
          let inlineContent = null
          if (currentNode.isTextblock) {
            inlineContent = currentNode.content
          } else {
            const textContent = currentNode.textContent || ''
            inlineContent = textContent ? schema.text(textContent) : undefined
          }
          const id = `alert_${Math.random().toString(36).slice(2)}`
          const alertNode = schema.nodes.alert.create({ id, variant, type }, inlineContent as any)
          tr.replaceWith(posStart, posEnd, alertNode)
          tr.setSelection(TextSelection.near(tr.doc.resolve(posStart + 1)))
          if (dispatch) dispatch(tr)
          editor.view.focus()
          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        if (!this.editor.isActive(this.name)) return false
        // 按回车退出当前 Alert，并在后面新起一段落
        return this.editor.chain().command(({ state, tr, dispatch }) => {
          const { $from } = state.selection
          // 寻找最近的 alert 节点位置
          let pos = $from.before()
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth)
            if (node.type === this.type) {
              pos = $from.before(depth)
              break
            }
          }
          const node = tr.doc.nodeAt(pos)
          if (!node || node.type !== this.type) return false
          const insertPos = pos + node.nodeSize
          tr.insert(insertPos, this.editor.schema.nodes.paragraph.create())
          tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 1)))
          if (dispatch) dispatch(tr)
          return true
        }).run()
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(AlertView)
  },
})

export default AlertExtension


