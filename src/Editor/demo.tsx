import { Editor, EditorThemeProvider, EditorToolbar, useTiptap } from '@ctzhian/tiptap';
import { Box } from '@mui/material';
import React from 'react';
import { AiGenerate2Icon } from '../component/Icons';
import '../index.css';

const Reader = () => {
  const { editor } = useTiptap({
    editable: true,
    exclude: ['invisibleCharacters'],
    onSave: (editor) => {
      console.log(editor.getHTML());
      editor.commands.setContent(editor.getHTML())
    },
    // onTocUpdate: handleTocUpdate,
    onMentionFilter: async ({ query }) => {
      return new Promise((resolve) => {
        resolve([
          'Winona Ryder',
          'Molly Ringwald',
          'Ally Sheedy',
          'Debbie Harry',
          'Olivia Newton-John',
          'Elton John',
          'Michael J. Fox',
          'Axl Rose',
          'Emilio Estevez',
          'Ralph Macchio',
          'Rob Lowe',
          'Jennifer Grey',
        ].filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
          .slice(0, 5))
      })
    },
    onUpload: async (file, onProgress) => {
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
    content: `<p>demo.tsx:12</p><p>飞机啊的数<code>量咖啡就拉上飞机</code>啊老<a target="_blank" type="icon" href="https://www.baidu.com" title="师的飞机拉多">师的飞机拉多</a>少分，飞<a target="_blank" type="text" href="https://remixicon.com/" title="机啊上飞机拉德">机啊上飞机拉德</a>斯基弗拉索夫卢卡斯到家了飞机啊的数量咖啡就拉上飞机啊老师的飞机拉多少分，飞机啊上飞机拉德斯基分，飞机啊上<a target="_blank" type="icon" href="afsd" title="飞机拉德斯">飞机拉德斯</a>基弗拉索</p><div class="tableWrapper"><table style="min-width: 436px;"><colgroup><col style="width: 136px;"><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"></colgroup><tbody><tr class="table-row"><th class="table-header" colspan="1" rowspan="1" colwidth="136"><p>文本一</p></th><th class="table-header" colspan="1" rowspan="1"><p>文本而</p></th><th class="table-header" colspan="1" rowspan="1"><p>文本三</p></th><th class="table-header" colspan="1" rowspan="1"><p>文本四</p></th></tr><tr class="table-row"><td colspan="1" rowspan="1" colwidth="136" data-background-color="transparent" style="background-color: transparent;"><p>测试数据</p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p>历史事件</p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p>福克斯</p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p>拉萨</p></td></tr><tr class="table-row"><td colspan="1" rowspan="1" colwidth="136" data-background-color="transparent" style="background-color: transparent;"><p>收拾收拾</p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p>福克斯啦发大水</p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p>重新你哦问粉丝</p></td><td colspan="1" rowspan="1" data-background-color="transparent" style="background-color: transparent;"><p>飞机啊圣诞快乐</p></td></tr></tbody></table></div><p></p>`
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
        <EditorToolbar editor={editor} menuInToolbarMore={[
          {
            id: 'ai',
            icon: <AiGenerate2Icon sx={{ fontSize: '1rem' }} />,
            onClick: () => {
              alert('ai');
            },
            label: 'AI 文本润色',
          },
        ]} />
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
        <Editor
          editor={editor}
          menuInDragHandle={[
            {
              label: '文本润色',
              key: 'ai',
              icon: <AiGenerate2Icon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                alert('ai');
              },
            },
          ]}
          menuInBubbleMenu={[
            {
              label: '文本润色',
              key: 'ai',
              icon: <AiGenerate2Icon sx={{ fontSize: '1rem' }} />,
              onClick: () => {
                alert('ai');
              },
            },
          ]}
        />
      </Box>
    </Box>
  </EditorThemeProvider>
};

export default Reader; 