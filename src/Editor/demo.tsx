import { Editor, EditorThemeProvider, EditorToolbar, TocList, useTiptap } from '@yu-cq/tiptap';
import React from 'react';

const Reader = () => {
  const handleTocUpdate = (toc: TocList) => {
    console.log(toc)
  }
  const { editor } = useTiptap({
    editable: true,
    limit: 100,
    exclude: ['invisibleCharacters'],
    onSave: (editor) => {
      console.log(editor.getJSON())
      console.log('保存功能触发！内容:', editor.getHTML());
    },
    onTocUpdate: handleTocUpdate,
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
                resolve('https://placehold.co/800x400')
              } else if (file.type.startsWith('video/')) {
                resolve('http://vjs.zencdn.net/v/oceans.mp4')
              } else {
                resolve('https://placehold.co/800x400')
              }
            }, 200);
          } else {
            onProgress?.({ progress: progress / 100 });
          }
        }, 100);
      })
    },
    content: `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Description</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-background-color="#f00">Cyndi Lauper</td>
          <td style="font-size: 10px;">Singer</td>
          <td>Songwriter</td>
          <td>Actress</td>
        </tr>
        <tr>
          <td>Cyndi Lauper</td>
          <td>Singer</td>
          <td>Songwriter</td>
          <td>Actress</td>
        </tr>
      </tbody>
    </table>
    <div data-tag="attachment" data-title="test.pdf" data-type="icon" data-size="100KB" data-url="https://placehold.co/800x400"></div>
    <div data-tag="attachment" data-title="test.pdf" data-type="block" data-size="100KB" data-url="https://placehold.co/800x400"></div>
    <div data-tag="attachment" data-title="" data-type="icon" data-size="0" data-url=""></div>
    放假啊收到了开发<a href="https://github.com">github</a>飞机上岛咖啡就离开
    <hr/>
    \`\`\`javascript
    const a = 1;
    \`\`\`
    <code>
    <pre>$\\LaTeX$</pre>
  </code>
    \n\n
      <p>
        Do you want go deeper? Here is a list of all supported functions:
      </p>
      <p>This is a old $\\LaTeX$ calculation string with $3*5=15$ calculations.</p>
      <p>
        Did you know that <span data-type="inline-math" data-latex="3 * 3 = 9"></span>? Isn't that crazy? Also Pythagoras' theorem is <span data-type="inline-math" data-latex="a^2 + b^2 = c^2"></span>.<br />
        Also the square root of 2 is <span data-type="inline-math" data-latex="\\sqrt{2}"></span>. If you want to know more about <span data-type="inline-math" data-latex="\\LaTeX"></span> visit 
        <a href="https://katex.org/docs/supported.html" data-title='aaa' data-type='block' class="link" target="_blank">katex.org</a>.
      </p>
        <h1>
        This editor supports <span data-type="inline-math" data-latex="\\LaTeX"></span> math expressions. And it even supports converting old $\\sub(3*5=15)$ calculations.
      </h1>
      <ul>
        <li><span data-type="inline-math" data-latex="\\sin(x)"></span></li>
        <li><span data-type="inline-math" data-latex="\\cos(x)"></span></li>
        <li><span data-type="inline-math" data-latex="\\tan(x)"></span></li>
        <li><span data-type="inline-math" data-latex="\\log(x)"></span></li>
        <li><span data-type="inline-math" data-latex="\\ln(x)"></span></li>
        <li><span data-type="inline-math" data-latex="\\sqrt{x}"></span></li>
        <li><span data-type="inline-math" data-latex="\\sum_{i=0}^n x_i"></span></li>
        <li><span data-type="inline-math" data-latex="\\int_a^b x^2 dx"></span></li>
        <li><span data-type="inline-math" data-latex="\\frac{1}{x}"></span></li>
        <li><span data-type="inline-math" data-latex="\\binom{n}{k}"></span></li>
        <li><span data-type="inline-math" data-latex="\\sqrt[n]{x}"></span></li>
        <li><span data-type="inline-math" data-latex="\\left(\\frac{1}{x}\\right)"></span></li>
        <li><span data-type="inline-math" data-latex="\\left\\{\\begin{matrix}x&\\text{if }x>0\\\\0&\\text{otherwise}\\end{matrix}\\right."></span></li>
      </ul>
      <p>The math extension also supports block level math nodes:</p>
      <div data-type="block-math" data-latex="\\int_a^b x^2 dx"></div>
      <img width="300" src="" />
        <p>This is a basic example of implementing images. Drag to re-order.</p>
        <img width="300" src="https://placehold.co/800x400" />
        <img width="300" src="https://placehold.co/800x400/6A00F5/white" />
    <p>Tiptap now supports YouTube embeds! Awesome!</p>
    <video src="http://vjs.zencdn.net/v/oceans.mp4" controls></video>
      <p>Try adding your own video to this editor!</p>
      <ul data-type="taskList">
          <li data-type="taskItem" data-checked="true">A list item</li>
          <li data-type="taskItem" data-checked="false">And another one</li>
        </ul>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>
      <div data-youtube-video>
        <iframe src="https://www.youtube.com/watch?v=3lTUAWOgoHs"></iframe>
      </div>
      <p>
          I like lists. Let’s add one:
        </p>
        <ul>
          <li>This is a bullet list.</li>
          <li>And it has three list items.</li>
          <li>Here is the third one.</li>
        </ul>
        <p>
          Do you want to see one more? I bet! Here is another one:
        </p>
        <ol>
          <li>That’s a different list, actually it’s an ordered list.</li>
          <li>It also has three list items.</li>
          <li>And all of them are numbered.</li>
        </ol>
        <p>
          Lists would be nothing without list items.
        </p>
        <p>This is a paragraph.</p>
        <hr>
        <p>And this is another paragraph.</p>
        <hr>
        <p>But between those paragraphs are horizontal rules.</p>
        <h1>This is a 1st level heading</h1>
        <h2>This is a 2nd level heading</h2>
        <h3>This is a 3rd level heading</h3>
        <h4>This 4th level heading will be converted to a paragraph, because levels are configured to be only 1, 2 or 3.</h4>
        <p>
          This<br>
          is<br>
          a<br>
          single<br>
          paragraph<br>
          with<br>
          line<br>
          breaks.
        </p>
        <p>
        What do you all think about the new <span data-type="mention" data-id="Winona Ryder"></span> movie?
      </p>
      <p>
        These <span data-type="emoji" data-name="smiley"></span>
        are <span data-type="emoji" data-name="fire"></span>
        some <span data-type="emoji" data-name="smiley_cat"></span>
        emojis <span data-type="emoji" data-name="exploding_head"></span>
        rendered <span data-type="emoji" data-name="ghost"></span>
        as <span data-type="emoji" data-name="massage"></span>
        inline <span data-type="emoji" data-name="v"></span>
        nodes.
      </p>
      <p>
        Type <code>:</code> to open the autocomplete.
      </p>
      <p>
        Even <span data-type="emoji" data-name="octocat"></span>
        custom <span data-type="emoji" data-name="trollface"></span>
        emojis <span data-type="emoji" data-name="neckbeard"></span>
        are <span data-type="emoji" data-name="rage1"></span>
        supported.
      </p>
      <p>
        And unsupported emojis (without a fallback image) are rendered as just the shortcode <span data-type="emoji" data-name="this_does_not_exist"></span>.
      </p>
      <pre><code>In code blocks all emojis are rendered as plain text. 👩‍💻👨‍💻</code></pre>
      <p>
        There is also support for emoticons. Try typing <code><3</code>.
      </p>
      <p>Look at these details</p>
      <details>
        <summary>This is a summary</summary>
        <p>Surprise!</p>
      </details>
      <p>Nested details are also supported</p>
      <details open>
        <summary>This is another summary</summary>
        <p>And there is even more.</p>
        <details>
          <summary>We need to go deeper</summary>
          <p>Booya!</p>
        </details>
      </details>
      <p>
          That's a boring paragraph followed by a fenced code block:
        </p>
        <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}</code></pre>
        <p>
          Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
        </p>
<ul>
<li>A list item</li>
<li>And another one</li>
</ul>
<blockquote>
Nothing is impossible, the word itself says “I’m possible!”
</blockquote>
<p>Audrey Hepburn</p>`
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
        <EditorToolbar editor={editor} />
      </div>
      <div style={{
        backgroundColor: '#fff',
      }}>
        <Editor editor={editor} />
      </div>
    </div>
  </EditorThemeProvider>
};

export default Reader; 