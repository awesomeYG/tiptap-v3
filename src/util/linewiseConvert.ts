import { Fragment, Node as PMNode } from '@tiptap/pm/model'
import { Editor } from '@tiptap/react'

export type LinewiseTarget =
  | { type: 'paragraph' }
  | { type: 'heading', level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: 'orderedList' }
  | { type: 'bulletList' }
  | { type: 'taskList' }
  | { type: 'blockquote' }
  | { type: 'codeBlock' }
  | { type: 'alert', attrs?: { variant?: string, type?: 'icon' | 'text' } }

/**
 * 提取节点的“行”文本：
 * - paragraph/heading：单行
 * - blockquote：子块逐段（按段）
 * - codeBlock：按换行
 * - alert：按换行
 * - list（ordered/bullet/task）：每个 listItem 作为一行（包含其文本内容）
 * - 其他：作为单行处理
 */
export function extractLinesFromNode(node: PMNode): string[] {
  const type = node.type.name

  // Helper: split textContent by \n and去除首尾空白但保留空行的结构
  const splitByNewline = (text: string) => text.split('\n')

  if (type === 'paragraph' || type === 'heading') {
    return [node.textContent]
  }

  if (type === 'blockquote') {
    const lines: string[] = []
    node.forEach(child => {
      const text = child.textContent
      if (text.includes('\n')) {
        lines.push(...splitByNewline(text))
      } else {
        lines.push(text)
      }
    })
    return lines
  }

  if (type === 'codeBlock') {
    return splitByNewline(node.textContent)
  }

  if (type === 'alert') {
    return splitByNewline(node.textContent)
  }

  if (type === 'orderedList' || type === 'bulletList' || type === 'taskList') {
    const lines: string[] = []
    node.forEach(listItem => {
      const text = listItem.textContent
      if (text.includes('\n')) {
        lines.push(...splitByNewline(text))
      } else {
        lines.push(text)
      }
    })
    return lines
  }

  return [node.textContent]
}

/**
 * 根据目标类型，构造对应的节点或片段。
 */
export function buildNodeFromLines(editor: Editor, lines: string[], target: LinewiseTarget): PMNode | Fragment {
  const { schema } = editor

  const createParagraph = (text: string) => schema.nodes.paragraph.create(undefined, text ? schema.text(text) : undefined)
  const createHeading = (text: string, level: number) => schema.nodes.heading.create({ level }, text ? schema.text(text) : undefined)
  const createListItem = (text: string) => schema.nodes.listItem.create(undefined, createParagraph(text))
  const createTaskItem = (text: string) => schema.nodes.taskItem
    ? schema.nodes.taskItem.create({ checked: false }, createParagraph(text))
    : createListItem(text)

  switch (target.type) {
    case 'paragraph': {
      const nodes = lines.map(l => createParagraph(l))
      return Fragment.fromArray(nodes)
    }
    case 'heading': {
      const nodes = lines.map(l => createHeading(l, target.level))
      return Fragment.fromArray(nodes)
    }
    case 'orderedList': {
      const items = lines.map(l => createListItem(l))
      return schema.nodes.orderedList.create(undefined, Fragment.fromArray(items))
    }
    case 'bulletList': {
      const items = lines.map(l => createListItem(l))
      return schema.nodes.bulletList.create(undefined, Fragment.fromArray(items))
    }
    case 'taskList': {
      const items = lines.map(l => createTaskItem(l))
      if (schema.nodes.taskList) {
        return schema.nodes.taskList.create(undefined, Fragment.fromArray(items))
      }
      return schema.nodes.bulletList.create(undefined, Fragment.fromArray(items))
    }
    case 'blockquote': {
      const paragraphs = lines.map(l => createParagraph(l))
      return schema.nodes.blockquote.create(undefined, Fragment.fromArray(paragraphs))
    }
    case 'codeBlock': {
      const text = lines.join('\n')
      return schema.nodes.codeBlock.create(undefined, text ? schema.text(text) : undefined)
    }
    case 'alert': {
      const attrs = target.attrs || { variant: 'info', type: 'icon' }
      // 使用 hardBreak 分隔行
      const pieces: PMNode[] = [] as unknown as PMNode[]
      lines.forEach((l, i) => {
        if (l) pieces.push(schema.text(l))
        if (i < lines.length - 1) {
          if (schema.nodes.hardBreak) {
            pieces.push(schema.nodes.hardBreak.create())
          } else {
            // 退化：用文本换行符
            pieces.push(schema.text('\n'))
          }
        }
      })
      const content = pieces.length > 0 ? Fragment.fromArray(pieces) : undefined
      return schema.nodes.alert.create(attrs as any, content as any)
    }
  }
}

/**
 * 将给定位置的节点转换为目标类型（按行规则）。
 */
export function convertNodeAt(editor: Editor, pos: number, node: PMNode, target: LinewiseTarget) {
  const lines = extractLinesFromNode(node)
  const replacement = buildNodeFromLines(editor, lines, target)
  const from = pos
  const to = pos + node.nodeSize
  const tr = editor.state.tr
  // Fragment 或 Node 均可传入 replaceWith
  tr.replaceWith(from, to, replacement as any)
  editor.view.dispatch(tr)
  editor.view.focus()
}


