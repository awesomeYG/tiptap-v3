import { Editor, EditorThemeProvider, EditorToolbar, useTiptap } from '@ctzhian/tiptap';
import { Box, Button } from '@mui/material';
import React from 'react';
import '../index.css';

const Reader = () => {
  const { editor } = useTiptap({
    editable: true,
    exclude: ['invisibleCharacters'],
    onSave: (editor) => {
      console.log(editor.getHTML(), editor.getMarkdown());
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
    content: `<blockquote><p>文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p></blockquote><audio src="/static-file/323483d4-f74a-4d2f-beb4-591dc4da2624/240c283e-7c08-47f5-a0a9-708346e887fe.mp4" poster="/static-file/4f149d6f-dc3b-4b2b-9c30-4c74cfb61030/219e2d4d-cc69-4549-81a5-7787580ffcce.jpeg" controls="true"></audio><hr><h1 id="62b48c1c-70cd-4231-bb98-06a50856fd68">这是一段一级标题</h1><p><span style="background-color: rgb(255, 204, 188);">文档内容为无意义乱码，无法生<code>有效</code>摘要。文档内容为 123203^<sup>1313&nbsp;</sup>无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要<sub>1</sub>。</span></p><p style="text-align: center;"><img src="/static-file/1bc14ef9-751a-4ddb-88d8-ed012bc311d4/d1caf813-9d82-439c-810b-5a27f01ddde3.webp" width="180"></p><ol class="ordered-list" data-type="orderedList"><li><p>文档内容为无意义乱码，无法生成有效摘要。</p></li><li><p>文档内容为无意义乱码，<code>无法生成有效摘要</code>。文档内容为无意义乱码，无法生成有效摘要。</p><ol class="ordered-list" data-type="orderedList"><li><p><span style="color: rgb(246, 78, 84);">文档内容为无意义乱码，无法生成有效摘要。</span>文档内容为无意义乱码，<a target="_blank" type="icon" href="https://www.baidu.com" title="无法生成有效摘要">无法生成有效摘要</a>。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。<strong>文档内容为无意义乱码</strong>，<span style="background-color: rgb(248, 187, 208);">无法生成有效摘要</span>。文档内容为无<u>意义乱码，无法生成有效摘要。文</u>档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p></li><li><p>文档内容为无意义乱码，<a target="_blank" type="text" href="http://localhost:5173/doc/editor/0198ea54-7b17-753d-ba0b-ede4145645b5" title="无法生成有效摘要">无法生成有效摘要</a>。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。<span style="background-color: rgb(220, 237, 200);">文档内容为无意义乱码</span>，无法生成有效摘要。<span data-latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}" data-type="inline-math"></span>。</p></li><li><p>文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，<span style="background-color: rgb(220, 237, 200);">无法生成有效摘要。文档内容为无意义乱码，</span>无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p></li></ol></li><li><p>文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内<span style="color: rgb(130, 221, 175);">容为无意义乱码，无法生成有</span>效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。<s>文档内容为无意义乱码，</s>无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。<span style="color: rgb(115, 181, 240);">文档内容为无意义乱码，无法生成有效摘要。</span>文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p></li></ol><h2 id="f983b68f-31d3-4997-95e9-206cccf67ca7">这个是一个二级标题</h2><div data-id="alert_glbsomkw6q" data-variant="info" data-type="icon" data-node="alert"><p>二级标题的警告提示框，单行内容。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p></div><p><span style="color: rgb(63, 68, 65);"><em>发生的发了圣诞节逢山开路文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</em></span></p><video class="video-wrapper" src="/static-file/aa8fc65a-bea8-4106-a653-619e4daf5367/b9c9ca65-7412-4e09-b739-ed6f9360d8e0.mp4" controls="true" width="1375"></video><h2 id="e3ceabee-1c6b-42dd-92a3-65a530b42cd8">还是一个二级标题！</h2><p>文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p><details class="cq-details" open=""><summary class="cq-details-summary">折叠面板标题：文档内容为无意义乱码，无法生成有效摘要。</summary><div class="cq-details-content" data-type="detailsContent"><h6 id="059a31bb-de5b-42a3-a035-6afcb537c83d">六级标题 H6</h6><p>此处为内容区域，文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p><p><img src="/static-file/9134bd1e-8568-48b0-88f9-42027a98c200/84fec93d-43d3-4891-a9a7-244a201cf738.gif" width="300"><img src="/static-file/634d2b46-feef-455d-92f2-07f97073db98/16467c5e-7509-4707-a97b-3bdfaf270b97.gif" width="300"><img src="/static-file/39e7c942-194f-4149-a735-9584d664b691/e1ec5a4a-fdc5-43ae-b13f-bf9000598690.gif" width="300"></p><hr><h6 id="1690714a-8b2b-4294-8b04-8bc1158269b2">六级标题 h6</h6><p><span style="background-color: rgb(231, 189, 255);">吧啦吧阿里此处为内容区域，</span><span style="background-color: rgb(255, 224, 178);">文档内容为无意义乱码，</span><span style="background-color: rgb(248, 187, 208);">无法生成有效摘要。</span><span style="background-color: rgb(240, 236, 179);">文档内容为无意义乱码，</span><span style="background-color: rgb(255, 204, 188);">无法生成有效摘要。</span>文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，<span style="background-color: rgb(179, 229, 252);">无法生成有效摘要。</span>文档内容为无意义乱码，<span style="background-color: rgb(200, 230, 201);">无法生成有效摘要。</span>文档内容为无意义乱码，<span style="background-color: rgb(187, 222, 251);">无法生成有效摘要。</span>此处为内容区域，<span style="background-color: rgb(220, 237, 200);">文档内容为无意义乱码，</span>无法生成有效摘要。文档内容为无意义乱码，<span style="background-color: rgba(42, 123, 83, 0.67); color: rgb(255, 255, 255);">无法生成有效摘要</span>。文档内容为无意义乱码，</p><div data-tag="attachment" url="" title="" size="0" data-url="/static-file/cb70d61c-3aeb-43b9-ad5f-128974eff555/db4b6a53-730d-461a-8488-11b7e528d7dd.md" data-title="雷池社区版自动SSL.md" data-size="2.85 KB"></div><div data-tag="attachment" url="" title="" size="0" data-url="/static-file/14d6c511-e942-4664-92eb-32b6b8ee0ccf/ad8e0b68-cf19-4fb9-becc-cb10333c7d03.md" data-title="身份认证 - CAS.md" data-size="2.79 KB"></div><p>无法生成有效摘要。<span style="vertical-align: bottom; font-size: 24px;">文档内容为无意义乱码，</span>无法生成有效摘要。<span style="vertical-align: top; font-size: 10px;">文档内容为无意义乱码，无法生成有效摘要。</span>文档内容为无意义乱码，无法生成有效摘要。此处为内容区域，文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p><iframe class="iframe-wrapper" width="1261" height="743" src="https://47.104.180.36:2443/" frameborder="0" allowfullscreen="true" autoplay="0" loop="0"></iframe><p>文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。此处为内容区域，文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，</p><div data-tag="attachment" url="" title="" size="0" data-url="/static-file/e919dac5-f275-468e-b52b-ca7dc4b46030/270b9ee9-bc19-4dbe-b619-e04186fbc09d.md" data-title="百川网站监测.md" data-size="1.14 KB"></div><p>无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p><div class="tableWrapper"><table style="width: 1146px;"><colgroup><col style="width: 571px;"><col style="width: 165px;"><col style="width: 196px;"><col style="width: 214px;"></colgroup><tbody><tr class="table-row"><th class="table-header" colspan="1" rowspan="1" colwidth="571"><p style="text-align: center;">fasdjklf</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="165"><p style="text-align: center;">fsdajkl</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="196"><p style="text-align: center;">fjklsdajfl</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="214"><p style="text-align: center;">fjdsakljk</p></th></tr><tr class="table-row"><td colspan="1" rowspan="1" colwidth="571" data-background-color="transparent" style="background-color: transparent;"><p style="text-align: center;">发大家撒快乐飞机啊收到啦开发建设卡德罗夫就啊数量的飞机阿里斯顿进来看</p></td><td colspan="1" rowspan="1" colwidth="165" data-background-color="transparent" style="background-color: transparent;"><p style="text-align: center;">12</p></td><td colspan="1" rowspan="1" colwidth="196" data-background-color="transparent" style="background-color: transparent;"><p style="text-align: center;">2342</p></td><td colspan="1" rowspan="1" colwidth="214" data-background-color="transparent" style="background-color: transparent;"><p style="text-align: center;">239</p></td></tr><tr class="table-row"><td colspan="1" rowspan="1" colwidth="571" data-background-color="transparent" style="background-color: transparent;"><p style="text-align: center;">文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。文档内容为无意义乱码，无法生成有效摘要。</p></td><td colspan="1" rowspan="1" colwidth="165" data-background-color="transparent" style="background-color: transparent;"><p style="text-align: center;">2332</p></td><td colspan="1" rowspan="1" colwidth="196" data-background-color="transparent" style="background-color: transparent;"><p style="text-align: center;">232</p></td><td colspan="1" rowspan="1" colwidth="214" data-background-color="transparent" style="background-color: transparent;"><p style="text-align: center;">9438</p></td></tr></tbody></table></div></div></details><h2 id="84cd9c21-dd66-418b-997d-1c9024e23d99">又一个二级标题</h2><h3 id="f21105ce-61ff-4542-98e6-9a6bbe1c3350">三级标题 1：无法生成有效摘要</h3><div data-latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}" data-type="block-math"></div><h3 id="b8e6c105-1131-4c69-9251-256679f6bcca">三级标题 2：无法生成有效摘要</h3><pre><code>&lt;!doctype html&gt;
&lt;html lang="en"&gt;

&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;link rel="icon" type="image/svg+xml" href="/logo.png" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
  &lt;title&gt;PandaWiki&lt;/title&gt;
  &lt;link rel="stylesheet" href="/panda-wiki.css"&gt;
&lt;/head&gt;

&lt;body&gt;
  &lt;div id="root"&gt;&lt;/div&gt;
  &lt;script type="module" src="/src/main.tsx"&gt;&lt;/script&gt;
&lt;/body&gt;

&lt;/html&gt;</code></pre><h3 id="c3c5e4b3-1827-4583-8099-0d1ff0c87af6">三级标题 3：无法生成有效摘要</h3><div class="tableWrapper"><table style="width: 1739px;"><colgroup><col style="width: 188px;"><col style="width: 207px;"><col style="width: 162px;"><col style="width: 198px;"><col style="width: 202px;"><col style="width: 141px;"><col style="width: 132px;"><col style="width: 172px;"><col style="width: 178px;"><col style="width: 159px;"></colgroup><tbody><tr class="table-row"><th class="table-header" colspan="1" rowspan="1" colwidth="188"><p>将圣诞快乐</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="207"><p>飞机啦深刻的发</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="162"><p>飞机速度快啦&nbsp;</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="198"><p>发撒尽量分开的</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="202"><p>飞机的快乐撒</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="141"><p>飞机收到了卡</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="132"><p>飞机的时空距离</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="172"><p>发大水啦快就发生了空间浪费</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="178"><p>飞机的索科洛夫就来刷卡解放快乐撒</p></th><th class="table-header" colspan="1" rowspan="1" colwidth="159"><p>发生尽量快点</p></th></tr><tr class="table-row"><td colspan="1" rowspan="1" colwidth="188" data-background-color="transparent" style="background-color: transparent;"><p>发滴漏式咖啡机阿里飞机滴漏式咖啡机收到了</p></td><td colspan="1" rowspan="1" colwidth="207" data-background-color="transparent" style="background-color: transparent;"><p>飞机啦开始减肥了上飞机了撒飞机阿杜里斯飞机了</p></td><td colspan="1" rowspan="1" colwidth="162" data-background-color="transparent" style="background-color: transparent;"><p>发了快三大解放了</p></td><td colspan="1" rowspan="1" colwidth="198" data-background-color="transparent" style="background-color: transparent;"><p>发到了撒看解放路口</p></td><td colspan="1" rowspan="1" colwidth="202" data-background-color="transparent" style="background-color: transparent;"><p>发了看到撒娇发来的快撒解放拉卡圣诞节发了睡觉了</p></td><td colspan="1" rowspan="1" colwidth="141" data-background-color="transparent" style="background-color: transparent;"><p>发了就看到撒娇发了快</p></td><td colspan="1" rowspan="1" colwidth="132" data-background-color="transparent" style="background-color: transparent;"><p>进来看发啦深刻的解放</p></td><td colspan="1" rowspan="1" colwidth="172" data-background-color="transparent" style="background-color: transparent;"><p>发了就开始打</p></td><td colspan="1" rowspan="1" colwidth="178" data-background-color="transparent" style="background-color: transparent;"><p>发了卡圣诞节发啦时代峰峻的拉卡上飞机了</p></td><td colspan="1" rowspan="1" colwidth="159" data-background-color="transparent" style="background-color: transparent;"><p>路口发撒几点了咖啡</p></td></tr><tr class="table-row"><td colspan="1" rowspan="1" colwidth="188" data-background-color="transparent" style="background-color: transparent;"><p>发了手机卡的解放啦圣诞节发了快撒飞机阿里上飞机啊上来的快</p></td><td colspan="1" rowspan="1" colwidth="207" data-background-color="transparent" style="background-color: transparent;"><p>发了快大水解放路口</p></td><td colspan="1" rowspan="1" colwidth="162" data-background-color="transparent" style="background-color: transparent;"><p>就发了看到撒娇快疯了圣诞节发了撒发</p></td><td colspan="1" rowspan="1" colwidth="198" data-background-color="transparent" style="background-color: transparent;"><p>了飞机的撒开就发了疯了</p></td><td colspan="1" rowspan="1" colwidth="202" data-background-color="transparent" style="background-color: transparent;"><p>弗萨的快乐飞机了圣诞节发了撒大解放了</p></td><td colspan="1" rowspan="1" colwidth="141" data-background-color="transparent" style="background-color: transparent;"><p>发撒尽量快点</p></td><td colspan="1" rowspan="1" colwidth="132" data-background-color="transparent" style="background-color: transparent;"><p>飞机啦深刻的</p></td><td colspan="1" rowspan="1" colwidth="172" data-background-color="transparent" style="background-color: transparent;"><p>书法家</p></td><td colspan="1" rowspan="1" colwidth="178" data-background-color="transparent" style="background-color: transparent;"><p>飞机上看啦大家</p></td><td colspan="1" rowspan="1" colwidth="159" data-background-color="transparent" style="background-color: transparent;"><p>发到手机卡</p></td></tr><tr class="table-row"><td colspan="1" rowspan="1" colwidth="188" data-background-color="transparent" style="background-color: transparent;"><p>飞机看啦圣诞节发</p></td><td colspan="1" rowspan="1" colwidth="207" data-background-color="transparent" style="background-color: transparent;"><p>解放啦深刻</p></td><td colspan="1" rowspan="1" colwidth="162" data-background-color="transparent" style="background-color: transparent;"><p>副书记</p></td><td colspan="1" rowspan="1" colwidth="198" data-background-color="transparent" style="background-color: transparent;"><p>发生简单啦快放假了的撒</p></td><td colspan="1" rowspan="1" colwidth="202" data-background-color="transparent" style="background-color: transparent;"><p>发生的接口</p></td><td colspan="1" rowspan="1" colwidth="141" data-background-color="transparent" style="background-color: transparent;"><p>撒到家乐福</p></td><td colspan="1" rowspan="1" colwidth="132" data-background-color="transparent" style="background-color: transparent;"><p>发撒尽量快</p></td><td colspan="1" rowspan="1" colwidth="172" data-background-color="transparent" style="background-color: transparent;"><p>发撒来的快放假了快撒大幅拉升路口飞机啊收到了</p></td><td colspan="1" rowspan="1" colwidth="178" data-background-color="transparent" style="background-color: transparent;"><p>发撒路口就到</p></td><td colspan="1" rowspan="1" colwidth="159" data-background-color="transparent" style="background-color: transparent;"><p>发撒的快乐飞机阿里斯顿开飞机大水路口飞机啊上了</p></td></tr></tbody></table></div><p></p>`
  });

  return <EditorThemeProvider mode='light'>
    <Button variant='contained' onClick={() => {
      editor.commands.extendMarkRange('code', {
        multiselect: true,
      })
    }}>测试一下</Button>
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