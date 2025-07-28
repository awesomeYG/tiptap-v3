import { getExtensions } from '@cq/tiptap/extension'
import { UseTiptapProps } from '@cq/tiptap/type'
import { migrateMathStrings } from '@tiptap/extension-mathematics'
import { useEditor, UseEditorOptions } from '@tiptap/react'

const useTiptap = ({
  // extension 
  exclude,

  // mention
  mentionItems,
  getMention,

  // fn
  onError,
  onUpload,

  // editor
  editable = true,

  // other
  ...options
}: UseTiptapProps & UseEditorOptions) => {

  const extensions = getExtensions({
    exclude,
    editable,
    mentionItems,
    getMention,
    onUpload,
    onError
  })

  const editor = useEditor({
    editable,
    extensions,
    ...options,
    onCreate: ({ editor: currentEditor }) => {
      if (options.onCreate) {
        options.onCreate({ editor: currentEditor })
      }
      migrateMathStrings(currentEditor)
    },
    onSelectionUpdate: (props) => {
      if (options.onSelectionUpdate) {
        options.onSelectionUpdate(props)
      }
    },
    onContentError: (props) => {
      if (options.onContentError) {
        options.onContentError(props)
      }
      onError?.(props.error)
    }
  })

  return editor
}

export default useTiptap; 