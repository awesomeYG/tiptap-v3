import { EditorContent } from "@tiptap/react"
import React, { useEffect } from "react"
import useTiptap from "../hook"

interface EditorDiffProps {
  oldHtml: string
  newHtml: string
}

const EditorDiff = ({
  oldHtml,
  newHtml
}: EditorDiffProps) => {
  const editorRef = useTiptap({
    editable: false,
    content: newHtml,
    exclude: ['youtube', 'mention']
  })

  useEffect(() => {
    if (!editorRef.editor) return
    editorRef.editor.commands.showStructuredDiff(oldHtml, newHtml)
    return () => {
      editorRef.editor?.commands.hideStructuredDiff?.()
    }
  }, [oldHtml, newHtml, editorRef.editor])

  return <EditorContent editor={editorRef.editor} />
}

export default EditorDiff