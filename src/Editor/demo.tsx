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
    content: `<p>飞机啊收到啦放假啦大水飞机阿拉山口的飞机阿里斯顿激发了开发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。</p><ul class="bullet-list" data-type="bulletList"><li><p>飞机阿里斯顿激发拉上看解放拉卡上飞机拉上飞机拉卡上打飞机</p></li><li><p>发圣诞节路口发生解放了三大解放拉卡上打飞机拉屎</p></li><li><p>发圣诞节路口飞机啊死了点开飞机阿里</p></li></ul><p>发大水六块腹肌阿拉山口飞机上了大开发了开始减肥啊飞开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。飞机啊数量飞机啊死了</p><p>发大水六块腹肌阿拉山口飞机上了大开发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦</p><blockquote><p>发拉卡上大解放拉屎的飞机；阿杜里斯解放看拉上假发；师傅。</p></blockquote><div class="cq-alert" data-id="alert_5ahr0ijo1l9" data-variant="info" data-type="icon" data-node="alert">发生江东父老看见啊上；飞机啊上；发生；飞机啊上来的的飞机啊上浪费。机啊上；发生；飞机啊上来的飞机啊上来的飞机啊上浪费。机啊上；发生；飞机啊上来的飞机啊上来的飞机啊上浪费。</div><p>飞机啊收到啦放假啦大水飞机阿拉山口的飞机阿里斯顿激发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。发了开始减肥啊飞机阿里的是飞机阿里斯顿飞机啦。发了开始减肥啊飞机阿里的是飞机飞机阿里的是飞机阿里斯顿飞机啦。</p>`
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