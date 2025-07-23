import { getExtensions } from '@cq/tiptap/extension'
import { UseTiptapProps } from '@cq/tiptap/type'
import { useEditor, UseEditorOptions } from '@tiptap/react'

const useTiptap = ({
  mentionItems,
  getMentionItems,
  exclude,
  editable = true,
  ...options
}: UseTiptapProps & UseEditorOptions) => {
  const extensions = getExtensions({ exclude, mentionItems, getMentionItems })
  const editor = useEditor({
    ...options,
    extensions,
    editable,
  })

  return editor
}

export default useTiptap; 