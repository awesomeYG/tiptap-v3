import { Editor, EditorThemeProvider, EditorToolbar, useTiptap } from '@ctzhian/tiptap';
import { Box } from '@mui/material';
import React from 'react';
import '../index.css';

const Reader = () => {
  const isMarkdown = true;
  const { editor } = useTiptap({
    editable: true,
    contentType: isMarkdown ? 'markdown' : 'html',
    exclude: ['invisibleCharacters'],
    onError: (error: Error) => {
      console.error('Editor Error:', error)
      alert(error.message)
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
      const value = isMarkdown ? editor.getMarkdown() : editor.getHTML();
      console.log(value)
      editor.chain().focus().setContent(value, {
        contentType: isMarkdown ? 'markdown' : 'html'
      }).run()
    },
    onAiWritingGetSuggestion: async ({ prefix, suffix }: { prefix: string, suffix: string }) => {
      console.log('onAiWritingGetSuggestion', prefix, suffix);
      return new Promise<string>((resolve) => {
        resolve([
          'this is a default suggestion.',
          'we are good.',
          'what is your name?',
          'how are you?',
          'what is your favorite color?',
          'what is your favorite food?',
          'what is your favorite animal?',
          'what is your favorite book?',
          'what is your favorite movie?',
          'what is your favorite song?',
          'what is your favorite artist?',
          'what is your favorite band?',
          'what is your favorite city?',
          'what is your favorite country?',
          'what is your favorite sport?',
        ][Math.floor(Math.random() * 10)]);
      })
    },
    // onTocUpdate: handleTocUpdate,
    // onMentionFilter: async ({ query }: { query: string }) => {
    //   return new Promise((resolve) => {
    //     resolve([
    //       'Winona Ryder',
    //       'Molly Ringwald',
    //       'Ally Sheedy',
    //       'Debbie Harry',
    //       'Olivia Newton-John',
    //       'Elton John',
    //       'Michael J. Fox',
    //       'Axl Rose',
    //       'Emilio Estevez',
    //       'Ralph Macchio',
    //       'Rob Lowe',
    //       'Jennifer Grey',
    //     ].filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
    //       .slice(0, 5))
    //   })
    // },
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
    content: `### Subscript

H~2~O

### Superscript

X^2^
`
  });

  return <EditorThemeProvider mode='light'>
    {/* <Button variant='contained' onClick={() => {
      editor.commands.insertContent('# 标题1\n\n<a target="_blank" type="icon" href="http://localhost:8000/components/editor" title="发生的发">发生的发</a>\n\n## 标题2\n标题*斜体*\n标题**加粗**\n标题~~删除线~~\n标题`代码`\n标题^上标^，标题~下标~\n标题==高亮==', {
        contentType: 'markdown'
      })
      // editor.commands.setContent('# 标题1\n## 标题2\n标题*斜体*\n标题**加粗**\n标题~~删除线~~\n标题`代码`\n标题^上标^，标题~下标~\n标题==高亮==', {
      //   contentType: 'markdown'
      // })
    }}>测试一下</Button> */}
    <Box sx={{
      border: '1px solid #eee',
      borderRadius: '10px',
      padding: '0 10px 10px',
      bgcolor: 'var(--mui-palette-background-default)',
    }}>
      <div style={{
        borderBottom: '1px solid #eee',
        marginBottom: '30px',
      }}>
        <EditorToolbar editor={editor} />
      </div>
      <Box sx={{
        '.tiptap': {
          minHeight: '500px',
          '.tableWrapper': {
            maxWidth: '100%',
            overflowX: 'auto',
          },
        }
      }}>
        <Editor editor={editor} />
      </Box>
    </Box>
  </EditorThemeProvider>
};

export default Reader;
