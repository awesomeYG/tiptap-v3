import { EditorMarkdown, EditorThemeProvider, useTiptap } from '@ctzhian/tiptap';
import { Box } from '@mui/material';
import React, { useState } from 'react';
import '../index.css';

const Reader = () => {
  const [mdContent, setMdContent] = useState('');
  const { editor } = useTiptap({
    editable: false,
    contentType: 'markdown',
    exclude: ['invisibleCharacters'],
    onError: (error: Error) => {
      console.error('Editor Error:', error)
    },
    onValidateUrl: async (url: string, type: 'image' | 'video' | 'audio' | 'iframe') => {
      console.log(`验证 ${type} 链接:`, url)

      // 拦截 base64 链接
      if (url.startsWith('data:')) {
        throw new Error(`不支持 base64 链接，请使用可访问的 ${type} URL`)
      }

      // 根据不同类型做不同的验证
      switch (type) {
        case 'image':
          if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
            console.warn('图片链接可能不是有效的图片格式')
          }
          break
        case 'video':
          if (!url.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i)) {
            console.warn('视频链接可能不是有效的视频格式')
          }
          break
        case 'audio':
          if (!url.match(/\.(mp3|wav|ogg|m4a|flac|aac|wma)(\?.*)?$/i)) {
            console.warn('音频链接可能不是有效的音频格式')
          }
          break
        case 'iframe':
          // iframe 可以嵌入任何 URL，但可以检查是否是 HTTPS
          if (url.startsWith('http://') && !url.includes('localhost')) {
            console.warn('建议使用 HTTPS 链接以确保安全性')
          }
          break
      }

      return url
    },
    onSave: (editor) => {
      // const value = editor.getMarkdown();
      // editor.chain().focus().setContent(value, {
      //   contentType: 'markdown'
      // }).run()
    },
    onUpload: async (file: File, onProgress?: (progress: { progress: number }) => void) => {
      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            onProgress?.({ progress: progress / 100 });
            clearInterval(interval);
            setTimeout(() => {
              if (file.type.startsWith('image/')) {
                resolve('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
              } else if (file.type.startsWith('video/')) {
                resolve('http://vjs.zencdn.net/v/oceans.mp4')
              } else {
                resolve('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
              }
            }, 200);
          } else {
            onProgress?.({ progress: progress / 100 });
          }
        }, 100);
      })
    },
    content: mdContent
  });

  return <EditorThemeProvider mode='light'>
    <Box sx={{
      '.tiptap': {
        minHeight: '500px',
        '.tableWrapper': {
          maxWidth: '100%',
          overflowX: 'auto',
        },
      }
    }}>
      <EditorMarkdown
        editor={editor}
        height={'500px'}
        value={mdContent}
        onAceChange={setMdContent}
      />
    </Box>
  </EditorThemeProvider>
};

export default Reader;
