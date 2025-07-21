import extensions from '@cq/tiptap/extension'
import { UseTiptapProps } from '@cq/tiptap/type'
import { useEditor, UseEditorOptions } from '@tiptap/react'

const useTiptap = ({
  content,
  editable,
  autofocus = 'end',
  immediatelyRender = true,
  ...options
}: UseTiptapProps & UseEditorOptions) => {
  const editor = useEditor({
    extensions,
    content,
    editable,
    autofocus,
    immediatelyRender,
    ...options,
  })

  return editor
}

export default useTiptap; 