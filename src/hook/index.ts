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
    onUpload
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
    onSelectionUpdate: (props) => {
      console.log(props.editor.$nodes)
      if (options.onSelectionUpdate) {
        options.onSelectionUpdate(props)
      }
    }
  })

  return editor
}

export default useTiptap; 