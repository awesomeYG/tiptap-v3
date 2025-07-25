import { Editor } from '@tiptap/react'

// 判断文件类型
export const getFileType = (file: File): 'image' | 'video' | 'other' => {
  const { type } = file

  if (type.startsWith('image/')) {
    return 'image'
  }

  if (type.startsWith('video/')) {
    return 'video'
  }

  return 'other'
}

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取文件图标
export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return '📄'
    case 'doc':
    case 'docx':
      return '📝'
    case 'xls':
    case 'xlsx':
      return '📊'
    case 'ppt':
    case 'pptx':
      return '📋'
    case 'zip':
    case 'rar':
    case '7z':
      return '🗜️'
    case 'txt':
      return '📄'
    case 'mp3':
    case 'wav':
    case 'flac':
      return '🎵'
    default:
      return '📎'
  }
}

// 插入图片内容
export const insertImageContent = (editor: Editor, url: string, pos: number) => {
  editor.chain().focus().insertContentAt(pos, {
    type: 'image',
    attrs: {
      src: url,
    },
  }).run()
}

// 插入视频内容
export const insertVideoContent = (editor: Editor, url: string, pos: number) => {
  editor.chain().focus().insertContentAt(pos, {
    type: 'video',
    attrs: {
      src: url,
    },
  }).run()
}

// 插入附件内容
export const insertAttachmentContent = (editor: Editor, url: string, fileName: string, fileSize: number, pos: number) => {
  const icon = getFileIcon(fileName)
  const size = formatFileSize(fileSize)

  const attachmentHtml = `
    <div style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 12px; margin: 8px 0; background-color: #f8f9fa; display: flex; align-items: center; gap: 12px; max-width: 400px;">
      <span style="font-size: 24px;">${icon}</span>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 500; color: #1f2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <a href="${url}" target="_blank" style="color: #3b82f6; text-decoration: none;">${fileName}</a>
        </div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${size}</div>
      </div>
      <div style="color: #6b7280;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7,10 12,15 17,10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </div>
    </div>
  `
  editor.chain().focus().insertContentAt(pos, attachmentHtml).run()
}