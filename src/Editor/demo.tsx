import { Editor, EditorThemeProvider, EditorToolbar, useTiptap } from '@ctzhian/tiptap';
import { Box } from '@mui/material';
import React from 'react';
import '../index.css';

const Reader = () => {
  const { editor } = useTiptap({
    editable: true,
    exclude: ['invisibleCharacters'],
    onSave: (editor) => {
      console.log(editor.getHTML());
      editor.commands.setContent(editor.getHTML())
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
    onMentionFilter: async ({ query }: { query: string }) => {
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
    content: ``
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