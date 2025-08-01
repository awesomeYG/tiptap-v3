import { Editor } from '@tiptap/react'

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const insertNodeAfterPosition = (editor: Editor, pos: number, nodeContent: any) => {
  editor.chain().focus().insertContentAt(pos, nodeContent).run()
}