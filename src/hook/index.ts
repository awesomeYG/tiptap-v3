import { migrateMathStrings } from '@tiptap/extension-mathematics'
import { useEditor, UseEditorOptions } from '@tiptap/react'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'
import { getExtensions } from '@yu-cq/tiptap/extension'
import { UseTiptapProps } from '@yu-cq/tiptap/type'

const useTiptap = ({
  // extension 
  exclude,

  // mention
  mentionItems,
  onMentionFilter,

  // fn
  onError,
  onUpload,
  onTocUpdate,

  // editor
  editable = true,

  // other
  ...options
}: UseTiptapProps & UseEditorOptions) => {

  const extensions = getExtensions({
    exclude,
    editable,
    mentionItems,
    onMentionFilter,
    onUpload,
    onError,
    onTocUpdate,
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

  return {
    editor,
    getText: () => {
      return editor.getText()
    },
    getHTML: () => {
      return editor.getHTML()
    },
    getJSON: () => {
      return editor.getJSON()
    },
    getMarkdownByJSON: () => {
      return renderToMarkdown({
        extensions: editor.extensionManager.extensions,
        content: editor.getJSON(),
      })
    },
  }
}

export default useTiptap; 