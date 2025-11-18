import { Editor, EditorThemeProvider, EditorToolbar, TocList, useTiptap } from '@ctzhian/tiptap';
import { Box } from '@mui/material';
import React from 'react';
import '../index.css';

const Reader = () => {
  const handleTocUpdate = (toc: TocList) => {
    console.log('toc', toc)
  }
  const { editor } = useTiptap({
    editable: true,
    exclude: ['invisibleCharacters'],
    onError: (error: Error) => {
      alert(error.message)
    },
    onValidateUrl: async (url: string, type: 'image' | 'video' | 'audio' | 'iframe') => {
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
    onTocUpdate: handleTocUpdate,
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
    content: `<pre><code>$$ sflsa $$

$fsjadl$</code></pre><p></p><p><span data-latex="x+y=1" data-type="inline-math"></span></p><div data-latex="ssss" data-type="block-math"></div><p></p><p>fadsjlfkas</p><div data-type="flow" data-code="C4Context
    title System Context diagram for Internet Banking System
    Enterprise_Boundary(b0, &quot;BankBoundary0&quot;) {
        Person(customerA, &quot;Banking Customer A&quot;, &quot;A customer of the bank, with personal bank accounts.&quot;)
        Person(customerB, &quot;Banking Customer B&quot;)
        Person_Ext(customerC, &quot;Banking Customer C&quot;, &quot;desc&quot;)

        Person(customerD, &quot;Banking Customer D&quot;, &quot;A customer of the bank, &lt;br/&gt; with personal bank accounts.&quot;)

        System(SystemAA, &quot;Internet Banking System&quot;, &quot;Allows customers to view information about their bank accounts, and make payments.&quot;)

        Enterprise_Boundary(b1, &quot;BankBoundary&quot;) {
            SystemDb_Ext(SystemE, &quot;Mainframe Banking System&quot;, &quot;Stores all of the core banking information about customers, accounts, transactions, etc.&quot;)

            System_Boundary(b2, &quot;BankBoundary2&quot;) {
                System(SystemA, &quot;Banking System A&quot;)
                System(SystemB, &quot;Banking System B&quot;, &quot;A system of the bank, with personal bank accounts. next line.&quot;)
            }

            System_Ext(SystemC, &quot;E-mail system&quot;, &quot;The internal Microsoft Exchange e-mail system.&quot;)
            SystemDb(SystemD, &quot;Banking System D Database&quot;, &quot;A system of the bank, with personal bank accounts.&quot;)

            Boundary(b3, &quot;BankBoundary3&quot;, &quot;boundary&quot;) {
                SystemQueue(SystemF, &quot;Banking System F Queue&quot;, &quot;A system of the bank.&quot;)
                SystemQueue_Ext(SystemG, &quot;Banking System G Queue&quot;, &quot;A system of the bank, with personal bank accounts.&quot;)
            }
        }
    }

    BiRel(customerA, SystemAA, &quot;Uses&quot;)
    BiRel(SystemAA, SystemE, &quot;Uses&quot;)
    Rel(SystemAA, SystemC, &quot;Sends e-mails&quot;, &quot;SMTP&quot;)
    Rel(SystemC, customerA, &quot;Sends e-mails to&quot;)" data-width="100%" data-height="auto"></div><p>fsajdlkfjadsl</p>`
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
