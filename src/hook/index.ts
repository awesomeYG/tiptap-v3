import { useEditor, UseEditorOptions } from '@tiptap/react'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'
import { getExtensions } from '@yu-cq/tiptap/extension'
import { UseTiptapProps, UseTiptapReturn } from '@yu-cq/tiptap/type'
import { migrateMathStrings } from '@yu-cq/tiptap/util'

const useTiptap = ({
  // extension 
  exclude,
  extensions: extensionsProps,

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
    extensions: extensionsProps,
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
          const isInTable = editor?.isActive('table')
          if (!isInList && !isInTable) {
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
      // 处理数学公式 - 延迟执行确保文档完全准备好
      setTimeout(() => {
        try {
          migrateMathStrings(currentEditor)
        } catch (error) {
          console.warn('数学公式迁移失败:', error)
          onError?.(error as Error)
        }
      }, 100)
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