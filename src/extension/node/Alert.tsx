import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CheckboxCircleFillIcon, CloseCircleFillIcon, ErrorWarningFillIcon, Information2FillIcon } from "../../component/Icons";
import AlertViewWrapper from "../component/Alert/index";

// 定义 Alert 节点的属性类型
export interface AlertAttributes {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
}

// 扩展 Tiptap 的 NodeAttributes 类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    alert: {
      setAlert: (attributes: AlertAttributes) => ReturnType;
      updateAlert: (attributes: Partial<AlertAttributes>) => ReturnType;
    }
  }
}

// 创建 Alert 扩展
export const AlertExtension = () => Node.create({
  name: 'alert',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-alert-type') || 'info',
        renderHTML: attributes => {
          if (!attributes.type) {
            return {}
          }
          return {
            'data-alert-type': attributes.type,
          }
        },
      },
      title: {
        default: '',
        parseHTML: element => element.getAttribute('data-title') || '',
        renderHTML: attributes => {
          if (!attributes.title) {
            return {}
          }
          return {
            'data-title': attributes.title,
          }
        },
      },
    }
  },

  addCommands() {
    return {
      setAlert: (attributes: AlertAttributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
      updateAlert: (attributes: Partial<AlertAttributes>) => ({ commands }) => {
        return commands.updateAttributes(this.name, attributes)
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer((renderProps) =>
      AlertViewWrapper({
        ...renderProps,
        node: {
          ...renderProps.node,
          attrs: renderProps.node.attrs as AlertAttributes
        },
      })
    )
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-alert-type]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false
          return {
            type: element.getAttribute('data-alert-type'),
            title: element.getAttribute('data-title'),
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { type, title } = node.attrs as AlertAttributes
    return [
      'div',
      {
        ...HTMLAttributes,
        'data-alert-type': type,
        'data-title': title,
        class: `alert alert-${type}`,
      },
      [
        'div',
        { class: 'alert-content' },
        [
          'div',
          { class: 'alert-icon' },
          getIconComponent(type),
        ],
        [
          'div',
          { class: 'alert-body' },
          title ? [
            'div',
            { class: 'alert-title' },
            title,
          ] : null,
          [
            'div',
            { class: 'alert-text' },
            0, // 这里会被 Tiptap 替换为实际内容
          ],
        ],
      ],
    ]
  },
})

// 根据类型获取对应的图标组件
function getIconComponent(type: string) {
  switch (type) {
    case 'success':
      return CheckboxCircleFillIcon
    case 'warning':
      return ErrorWarningFillIcon
    case 'error':
      return CloseCircleFillIcon
    case 'info':
    default:
      return Information2FillIcon
  }
}
