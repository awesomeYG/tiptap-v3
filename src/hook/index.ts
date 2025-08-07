import { migrateMathStrings } from '@tiptap/extension-mathematics'
import { useEditor, UseEditorOptions } from '@tiptap/react'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'
import { getExtensions } from '@yu-cq/tiptap/extension'
import { UseTiptapProps, UseTiptapReturn } from '@yu-cq/tiptap/type'

const useTiptap = ({
  // extension 
  exclude,

  // mention
  mentionItems,
  onMentionFilter,

  // fn
  onSave,
  onError,
  onUpload,
  onTocUpdate,

  // editor
  editable = true,

  // other
  ...options
}: UseTiptapProps & UseEditorOptions): UseTiptapReturn => {

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
    editorProps: {
      handleKeyDown: (view, event) => {
        // 编辑模式下保存
        if (event.key === 's' && (event.metaKey || event.ctrlKey) && editable) {
          event.preventDefault()
          onSave?.(editor)
          return true
        }
        // tab
        if (event.key === 'Tab') {
          const isInList = editor?.isActive('orderedList') ||
            editor?.isActive('bulletList') ||
            editor?.isActive('taskList')
          if (!isInList) {
            event.preventDefault()
            const tr = view.state.tr.insertText('\t')
            view.dispatch(tr)
            return true
          }
        }
      }
    },
    onCreate: ({ editor: currentEditor }) => {
      if (options.onCreate) {
        options.onCreate({ editor: currentEditor })
      }
      // 处理数学公式
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
      return editor?.getText() || ''
    },
    getHTML: () => {
      return editor?.getHTML() || ''
    },
    getJSON: () => {
      return editor?.getJSON() || null
    },
    getMarkdownByJSON: () => {
      if (!editor) return ''
      return renderToMarkdown({
        extensions: editor.extensionManager.extensions,
        content: editor.getJSON(),
      })
    },
  }
}

export default useTiptap; 