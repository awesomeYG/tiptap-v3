import { Editor, EditorThemeProvider, EditorToolbar, useTiptap } from '@ctzhian/tiptap';
import { Box } from '@mui/material';
import React from 'react';
import '../index.css';

const Reader = () => {
  const { editor } = useTiptap({
    editable: true,
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
      const value = editor.getHTML();
      console.log(value)
      editor.chain().focus().setContent(value, {
        contentType: 'html'
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
    content: `<p>这里是正文部分，啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</p><p></p><h1 id="b8f46431-15cc-4d9a-823f-3b99a5048e9d">这是一级标题</h1><h2 id="ef598fd2-24f8-472f-bedc-a5e4e39e5373">二级标题</h2><h3 id="2ea03e39-c201-49ae-9236-3acf23b14965">三级标题</h3><h4 id="9a0dd00d-e0b8-4ae4-9371-b6f2e49ce0af">四级标题</h4><p></p><ol class="ordered-list" data-type="orderedList"><li><p>这是有序列表</p><ol class="ordered-list" data-type="orderedList"><li><p>这是有序列表</p></li><li><p>这是有序列表</p><ol class="ordered-list" data-type="orderedList"><li><p>这是有序列表</p></li><li><p>这是有序列表</p><ol class="ordered-list" data-type="orderedList"><li><p>这是有序列表</p></li><li><p>这是有序列表</p></li></ol></li></ol></li></ol></li><li><p>这是有序列表</p></li><li><p>这是有序列表</p></li></ol><p></p><ul class="bullet-list" data-type="bulletList"><li><p>这是无序列表</p><ul class="bullet-list" data-type="bulletList"><li><p>这是无序列表</p></li><li><p>这是无序列表</p><ul class="bullet-list" data-type="bulletList"><li><p>这是无序列表</p></li><li><p>这是无序列表</p><ul class="bullet-list" data-type="bulletList"><li><p>这是无序列表</p></li><li><p>这是无序列表</p></li></ul></li></ul></li></ul></li><li><p>这是无序列表</p></li><li><p>这是无序列表</p></li></ul><p></p><ul data-type="taskList"><li class="task-item" data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>任务列表</p><ul data-type="taskList"><li class="task-item" data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>任务列表</p></div></li><li class="task-item" data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>任务列表</p></div></li></ul></div></li><li class="task-item" data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>任务列表</p></div></li><li class="task-item" data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>任务列表</p></div></li></ul><p></p><blockquote><p>这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容</p><p>换一段，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容，这里是引用内容</p></blockquote><p></p><pre><code class="language-c">#include &lt;stdio.h&gt;

int main(int argc, char* argv[]) {
    return 0;
}</code></pre><p></p><div data-id="alert_d89jtsekma" data-variant="warning" data-type="icon" data-node="alert"><p>这里是高亮块</p></div><div data-id="alert_y52bknyrhp" data-variant="default" data-type="icon" data-node="alert"><p></p></div><div data-id="alert_8kccvrutm1b" data-variant="error" data-type="icon" data-node="alert"><p><span style="color: rgb(254, 69, 69);">这里是高亮块</span></p></div><p></p><p><a target="_blank" type="text" href="搜索" title="这是链接">这是链接</a></p><p><a target="_blank" type="text" href="http://a123123" title="http://a123123">http://a123123</a></p><a target="_blank" type="block" href="http://localhost:8000/components/%E6%90%9C%E7%B4%A2" title="这是链接">这是链接</a><hr class="custom-horizontal-rule"><p>这是分割线</p><hr class="custom-horizontal-rule"><p></p><p><span data-latex="a, b, c \neq \{ \{ a\}, b, c\}" data-type="inline-math"></span></p><div data-latex="\frac{\int_{0}^{\frac{\pi}{2}}}{\sum_{i=1}^{n}} = 1" data-type="block-math"></div><p></p><p style="text-align: center;"><img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" width="375"></p><p style="text-align: left;"></p><div data-tag="attachment" url="" title="" size="0" data-url="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" data-title="4174c1ae-6d06-4287-a184-0b24c7c698fd.png" data-size="193.47 KB"></div><div data-tag="attachment" url="" title="" size="0" data-url="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" data-title="默认知识库222.lakebook" data-size="170.5 KB"></div><p style="text-align: left;"></p><div class="tableWrapper"><table style="min-width: 400px;"><colgroup><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"></colgroup><tbody><tr class="table-row"><th class="table-header" colspan="1" rowspan="1"><p>阿斯顿</p></th><th class="table-header" colspan="1" rowspan="1"><p>得到的</p></th><th class="table-header" colspan="1" rowspan="1"><p>上上色</p></th><th class="table-header" colspan="1" rowspan="1"><p>可控哇</p></th></tr><tr class="table-row"><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p><img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" width="100"></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td></tr><tr class="table-row"><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td></tr><tr class="table-row"><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td></tr><tr class="table-row"><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p></p></td></tr></tbody></table></div><p></p><p>丰小学校园生活<strong>加醋加醋</strong><em>写题写题</em></p>`
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
