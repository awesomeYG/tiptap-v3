
import { Attachment2Icon } from "@ctzhian/tiptap/component/Icons"
import { EditorFnProps } from "@ctzhian/tiptap/type"
import { insertNodeAfterPosition } from "@ctzhian/tiptap/util"
import { Box, CircularProgress } from "@mui/material"
import { Editor } from "@tiptap/core"
import { NodeViewWrapper } from "@tiptap/react"
import React, { useEffect, useRef, useState } from "react"
import { AttachmentAttributes } from "."

type InsertAttachmentProps = {
  editor: Editor
  selected: boolean
  attrs: AttachmentAttributes
  updateAttributes: (attrs: AttachmentAttributes) => void
  deleteNode?: () => void
} & EditorFnProps

const InsertAttachment = ({
  editor,
  selected,
  deleteNode,
  onUpload,
  onError
}: InsertAttachmentProps) => {
  const [uploading, setUploading] = useState(false)
  const [successCount, setSuccessCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleConfirmUpload = async (selectedFiles: File[]) => {
    const file = selectedFiles[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    const fileSize = formatFileSize(file.size)
    const { from } = editor.state.selection
    try {
      const result = await onUpload?.(file, ({ progress }) => {
        setUploadProgress(Math.round(progress * 100))
      })
      insertNodeAfterPosition(editor, from, {
        type: 'blockAttachment',
        attrs: { url: result || '', type: 'block', size: fileSize, title: file.name },
      })
      setSuccessCount(prev => prev + 1)
    } catch (error) {
      insertNodeAfterPosition(editor, from, {
        type: 'blockAttachment',
        attrs: {
          url: 'error',
          type: 'block',
          size: fileSize,
          title: error instanceof Error ? error.message : '上传失败',
        }
      })
      setErrorCount(prev => prev + 1)
      onError?.(error as Error)
    } finally {
      setUploading(false)
    }
    handleConfirmUpload(selectedFiles.slice(1))
  }

  const handleClickAddAttachment = () => fileInputRef.current?.click()

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles)
      setTotal(filesArray.length)
      handleConfirmUpload(filesArray)
    }
  }

  useEffect(() => {
    if (errorCount + successCount === total && total > 0) {
      deleteNode?.()
    }
  }, [errorCount, successCount, total])

  return <NodeViewWrapper
    className={`attachment-wrapper${selected ? ' ProseMirror-selectednode' : ''}`}
    as={'span'}
  >
    <input
      ref={fileInputRef}
      type="file"
      multiple
      onChange={handleChangeFile}
      style={{ display: 'none' }}
      accept="*/*"
    />
    <Box
      id="insert-attachment-box"
      component="span"
      onClick={uploading ? undefined : handleClickAddAttachment}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 'var(--mui-shape-borderRadius)',
        px: 2,
        py: 1.5,
        fontSize: 14,
        color: 'text.secondary',
        ...(!uploading ? {
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover'
          },
          '&:active': {
            bgcolor: 'action.selected',
          },
        } : {
          "&::before": {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${uploadProgress}%`,
            bgcolor: 'primary.main',
            opacity: 0.1,
            transition: 'width 0.3s ease',
            zIndex: 0,
          }
        }),
        transition: 'background-color 0.2s ease',
      }}>
      {uploading ? <CircularProgress size={'1rem'} value={uploadProgress} />
        : <Attachment2Icon sx={{ fontSize: '1rem', flexShrink: 0 }} />}
      {uploading ? <Box component={'span'}>
        正在上传第 <Box component={'span'} sx={{ fontWeight: 'bold' }}>
          {successCount + errorCount + 1}
        </Box> / {total} 个附件 <Box sx={{ display: 'inline-block', width: '2.5rem', textAlign: 'right', fontSize: 12 }}>
          {uploadProgress}%
        </Box>
      </Box> : <Box component={'span'}>添加附件</Box>}
    </Box>
  </NodeViewWrapper>
}

export default InsertAttachment