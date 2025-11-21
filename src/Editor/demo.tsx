import { Editor, EditorThemeProvider, EditorToolbar, TocList, UploadFunction, useTiptap } from '@ctzhian/tiptap';
import { Box } from '@mui/material';
import { Editor as TiptapEditor } from '@tiptap/core';
import React from 'react';
import '../index.css';

const EDITABLE = true
const DEFAULT_CONTENT_TYPE = 'html'
const DEFAULT_CONTENT = `
<h6 id="a025f782-910f-4f17-9d0b-8f31f9cde175" data-toc-id="a025f782-910f-4f17-9d0b-8f31f9cde175"><span data-name="page_facing_up" data-type="emoji">📄</span> 文本处理</h6>
<p>PandaWiki 是一款 AI 大模<code>型驱动的开源知识库搭</code>建系统，F<strong>AQ 、 博客系统 ，借助大模型的力量为你提供 AI </strong>创作 、 AI 问答 、 AI 搜索 等能力。借<span style="color: rgb(90, 141, 218);">助大模型的</span><span style="background-color: rgb(255, 204, 188); color: rgb(90, 141, 218);">力量为你提</span><span style="color: rgb(90, 141, 218);">供 AI 创</span>作能力。PandaWiki 是<u>一款 AI 大模型驱动的开源知识库搭建系统，帮</u>助你快速构建智能化的 <s><u>产品文档、技术</u></s>文档、FAQ 、<s> 博客系统 ，借助大模型的</s>力量系统 ，<span style="background-color: rgb(172, 84, 84);">借助大模型的力量为你提供 AI 创作 、 AI 问</span>答 、 AI 搜索 等能力。的力量为<mark>你提供 AI 创作 、 AI 问答 、</mark> AI 搜索。</p>
<h6 id="746ea233-0e30-44a6-849a-090202217299" data-toc-id="746ea233-0e30-44a6-849a-090202217299">⚠️ 警告块</h6>
<div data-id="alert_5ysakwbhvqv" data-variant="warning" data-type="icon" data-node="alert"><p>此时这是一个警告块。</p></div>
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
<div class="tableWrapper"><div class="table-container"><table style="min-width: 400px;"><colgroup><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"></colgroup><tbody><tr class="table-row"><th class="table-header" colspan="1" rowspan="1" data-text-align="center" style="text-align: center;"><p>链接</p></th><th class="table-header" colspan="1" rowspan="1" data-text-align="center" style="text-align: center;"><p>复杂文本</p></th><th class="table-header" colspan="1" rowspan="1" data-text-align="center" style="text-align: center;"><p>图片</p></th><th class="table-header" colspan="1" rowspan="1" data-text-align="center" style="text-align: center;"><p>附件</p></th></tr><tr class="table-row"><td colspan="1" rowspan="1" data-text-align="center" data-vertical-align="middle" style="text-align: center; vertical-align: middle;"><p><a target="_blank" class="MuiBox-root css-1ivg9gg" type="icon" rel="noopener noreferrer" title="点击此处跳转" href="http://localhost:8000/components/editor">点击此处跳转</a></p></td><td colspan="1" rowspan="1" data-text-align="center" data-vertical-align="middle" style="text-align: center; vertical-align: middle;"><p><code>知</code><span style="background-color: rgb(255, 204, 188); color: rgb(90, 141, 218);">力</span><span style="color: rgb(90, 141, 218);">供</span><sup>历</sup><sub>史</sub><u>动</u><s>大</s><span style="background-color: rgb(172, 84, 84);">借</span><mark>答</mark></p></td><td colspan="1" rowspan="1" data-text-align="center" data-vertical-align="middle" style="text-align: center; vertical-align: middle;"><p><img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" width="100"></p></td><td colspan="1" rowspan="1" data-text-align="center" data-vertical-align="middle" style="text-align: center; vertical-align: middle;"><p><span data-tag="attachment" url="" title="" size="0" data-url="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" data-title="谁是我们的敌人.txt" data-size="18.27 KB"></span></p></td></tr></tbody></table></div><div class="table-controls"></div><div class="table-selection-overlay-container"></div></div>
<p></p>
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
    editable: EDITABLE,
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
