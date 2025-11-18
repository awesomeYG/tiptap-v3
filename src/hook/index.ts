import { getExtensions } from '@ctzhian/tiptap/extension'
import { UseTiptapProps, UseTiptapReturn } from '@ctzhian/tiptap/type'
import { migrateMathStrings } from '@tiptap/extension-mathematics'
import { useEditor, UseEditorOptions } from '@tiptap/react'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'

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
  onAiWritingGetSuggestion,
  onValidateUrl,

  // editor
  editable = true,
  contentType,

  // other
  placeholder,
  ...options
}: UseTiptapProps & UseEditorOptions): UseTiptapReturn => {
  const extensions = getExtensions({
    contentType,
    exclude,
    extensions: extensionsProps,
    editable,
    mentionItems,
    onMentionFilter,
    onUpload,
    onError,
    onTocUpdate,
    onAiWritingGetSuggestion,
    onValidateUrl,
    placeholder,
  })

  const editor = useEditor({
    editable,
    extensions,
    ...(contentType === 'markdown' ? {
      contentType: 'markdown',
    } : {}),
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
          // 若开启了 aiWriting，则放行给扩展处理（Tab 接受建议），不再插入制表符
          const aiWritingEnabled = !!(editor as any)?.storage?.aiWriting?.enabled
          if (aiWritingEnabled) {
            return false
          }
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
      options.onCreate?.({ editor: currentEditor })
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
    setContent: (value, type) => {
      editor?.chain()?.focus()?.setContent(value, {
        contentType: type || (contentType === 'markdown' ? 'markdown' : 'html')
      })?.run()
    },
    getContent: () => {
      if (!editor) return ''
      if (contentType === 'markdown') {
        return editor.getMarkdown()
      }
      return editor.getHTML() || ''
    },
    getMarkdown: () => {
      if (!editor) return ''
      if (contentType === 'markdown') {
        return editor.getMarkdown()
      }
      return renderToMarkdown({
        extensions: editor.extensionManager.extensions,
        content: editor.getJSON(),
      })
    },
    getText: () => {
      return editor?.getText() || ''
    },
    getHTML: () => {
      return editor?.getHTML() || ''
    },
    getJSON: () => {
      return editor?.getJSON() || null
    },
  }
}

export default useTiptap;
