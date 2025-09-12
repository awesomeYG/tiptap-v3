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
    content: `demo.tsx:12 <p>飞机啊的数<code>量咖啡就拉上飞机</code>啊老<a target="_blank" type="icon" href="https://www.baidu.com" title="师的飞机拉多">师的飞机拉多</a>少分，飞<a target="_blank" type="text" href="https://remixicon.com/" title="机啊上飞机拉德">机啊上飞机拉德</a>斯基弗拉索夫卢卡斯到家了飞机啊的数量咖啡就拉上飞机啊老师的飞机拉多少分，飞机啊上飞机拉德斯基分，飞机啊上<a target="_blank" type="icon" href="afsd" title="飞机拉德斯">飞机拉德斯</a>基弗拉索<img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" width="760"></p><p></p>`
  });

  return <EditorThemeProvider>
    <div style={{
      border: '1px solid #eee',
      borderRadius: '10px',
      padding: '0 10px 10px',
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
        backgroundColor: '#fff',
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
    </div>
  </EditorThemeProvider>
};

export default Reader; 