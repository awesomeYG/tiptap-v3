import { Editor, EditorThemeProvider, EditorToolbar, TocList, UploadFunction, useTiptap } from '@ctzhian/tiptap';
import { Box } from '@mui/material';
import { Editor as TiptapEditor } from '@tiptap/core';
import React from 'react';
import '../index.css';

const DEFAULT_CONTENT_TYPE = 'html'
const DEFAULT_CONTENT = `
<h6 id="ebb64062-9efb-4de8-887f-7f8b7f9e54ca" data-toc-id="ebb64062-9efb-4de8-887f-7f8b7f9e54ca"><span data-name="bar_chart" data-type="emoji">📊</span> 流程图操作</h6>
<div data-type="flow" data-code="mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness&lt;br/&gt;and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid" data-width="246px"></div>
<h6 id="4b8d8c4e-29dc-4674-928b-b9ded0e363ae" data-toc-id="4b8d8c4e-29dc-4674-928b-b9ded0e363ae"><span data-name="watch" data-type="emoji">⌚</span> 表格操作</h6>
<table style="min-width: 400px;"><colgroup><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"></colgroup><tbody><tr class="table-row"><th class="table-header" colspan="1" rowspan="1"><p>1</p></th><th class="table-header" colspan="1" rowspan="1"><p>2</p></th><th class="table-header" colspan="1" rowspan="1"><p>3</p></th><th class="table-header" colspan="1" rowspan="1"><p>4</p></th></tr><tr class="table-row"><td colspan="1" rowspan="1"><p>5</p></td><td colspan="1" rowspan="1"><p>6</p></td><td colspan="1" rowspan="1"><p>7</p></td><td colspan="1" rowspan="1"><p>8</p></td></tr><tr class="table-row"><td colspan="1" rowspan="1"><p>9</p></td><td colspan="1" rowspan="1"><p>10</p></td><td colspan="1" rowspan="1"><p>11</p></td><td colspan="1" rowspan="1"><p>12</p></td></tr></tbody></table><p></p>
`

const Reader = () => {
  const handleSave = (editor: TiptapEditor) => {
    const value = DEFAULT_CONTENT_TYPE === 'html' ? editor.getHTML() : editor.getMarkdown();
    console.log(`⬇️ ========= ${DEFAULT_CONTENT_TYPE} mode ========= ⬇️`)
    console.log(`%c${value}`, 'color: #42b983;');
    console.log(`⬆️ ========= end ========= ⬆️`)
  }
  const handleError = (error: Error) => {
    alert(error.message)
  }
  const handleAiWritingGetSuggestion = async ({ prefix, suffix }: { prefix: string, suffix: string }) => {
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
  }
  const handleUpload: UploadFunction = async (file: File, onProgress?: (progress: { progress: number }) => void) => {
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
  }
  const handleTocUpdate = (toc: TocList) => {
    // console.log('toc', toc)
  }
  const handleValidateUrl = async (url: string, type: 'image' | 'video' | 'audio' | 'iframe') => {
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
  }
  const { editor } = useTiptap({
    editable: true,
    content: DEFAULT_CONTENT,
    contentType: DEFAULT_CONTENT_TYPE,
    exclude: ['invisibleCharacters'],
    onError: handleError,
    onValidateUrl: handleValidateUrl,
    onSave: handleSave,
    onAiWritingGetSuggestion: handleAiWritingGetSuggestion,
    onTocUpdate: handleTocUpdate,
    onUpload: handleUpload,
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
  });

  return <EditorThemeProvider mode='light'>
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
        <EditorToolbar editor={editor} mode='advanced' />
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
