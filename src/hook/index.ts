import { getExtensions } from '@cq/tiptap/extension'
import { UseTiptapProps } from '@cq/tiptap/type'
import { migrateMathStrings } from '@tiptap/extension-mathematics'
import { useEditor, UseEditorOptions } from '@tiptap/react'

const useTiptap = ({
  mentionItems,
  getMentionItems,
  exclude,
  editable = true,
  ...options
}: UseTiptapProps & UseEditorOptions) => {

  const extensions = getExtensions({
    exclude,
    editable,
    mentionItems,
    getMentionItems
  })

  const editor = useEditor({
    editable,
    extensions,
    ...options,
    onCreate: ({ editor: currentEditor }) => {
      migrateMathStrings(currentEditor)
      if (options.onCreate) {
        options.onCreate({ editor: currentEditor })
      }
    },
  })

  return editor
}

export default useTiptap; 