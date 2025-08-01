import { Editor, EditorToolbar, useTiptap } from '@cq/tiptap';
import React from 'react';

const Reader = () => {
  const { editor } = useTiptap({
    editable: true,
    limit: 100,
    exclude: ['invisibleCharacters'],
    getMention: async ({ query }) => {
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
          progress += Math.random() * 1;
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
    # Markdown 语法示例大全

## 标题示例
# 一级标题 H1
## 二级标题 H2  
### 三级标题 H3
#### 四级标题 H4
##### 五级标题 H5
###### 六级标题 H6

## 文本样式
**粗体文本** 或 __粗体文本__
*斜体文本* 或 _斜体文本_
***粗斜体文本*** 或 ___粗斜体文本___
~~删除线文本~~
==高亮文本==
上标：X^2^
下标：H~2~O

## 链接和引用
[普通链接](https://www.example.com)
[带标题的链接](https://www.example.com "链接标题")
[相对链接](../path/to/file.md)
<https://www.example.com>
[引用链接][1]

[1]: https://www.example.com "引用链接标题"

## 图片
![图片描述](https://placehold.co/300x200)
![带链接的图片](https://placehold.co/300x200 "图片标题")

## 列表

### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
    - 子子项目 2.2.1
- 项目 3

* 使用星号的列表
+ 使用加号的列表

### 有序列表
1. 第一项
2. 第二项
   1. 子项目 2.1
   2. 子项目 2.2
3. 第三项

### 任务列表
- [x] 已完成任务
- [ ] 未完成任务
- [x] 另一个已完成任务
- [ ] 待办事项

## 代码

### 行内代码
这是 \`行内代码\` 示例。
使用 \`npm install\` 安装包。

### 代码块
\`\`\`javascript
// JavaScript 代码示例
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}

hello('World');
\`\`\`

\`\`\`python
# Python 代码示例
def hello(name):
    print(f"Hello, {name}!")

hello("World")
\`\`\`

\`\`\`html
<!-- HTML 代码示例 -->
<div class="container">
  <h1>标题</h1>
  <p>段落内容</p>
</div>
\`\`\`

\`\`\`css
/* CSS 代码示例 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
\`\`\`

## 引用

> 这是一个简单的引用。

> 这是一个多行引用。
> 它可以包含多行内容。
> 每行前面都有引用符号。

> ### 引用中的标题
> 引用中可以包含其他markdown元素：
> - 列表项目
> - **粗体文本**
> - \`代码\`

> 嵌套引用
>> 这是二级引用
>>> 这是三级引用

## 表格

### 基本表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

### 对齐表格
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:-------:|-------:|
| 左边   |  中间   |   右边 |
| 文本   |  数字   |   123  |

### 复杂表格
| 功能 | 语法 | 示例 |
|------|------|------|
| 粗体 | \`**text**\` | **粗体** |
| 斜体 | \`*text*\` | *斜体* |
| 代码 | \`\\\`code\\\`\` | \`代码\` |

## 分割线

---

***

___

- - -

## 换行
这是第一行  
这是第二行（使用两个空格+回车）

这是第三行（使用空行分段）

## 转义字符
\\* 星号  
\\_ 下划线  
\\# 井号  
\\+ 加号  
\\- 减号  
\\. 点号  
\\! 感叹号  
\\[ 方括号  
\\] 方括号  
\\( 圆括号  
\\) 圆括号

## 数学公式
行内公式：$E = mc^2$

块级公式：
$$
\\int_a^b f(x)dx = F(b) - F(a)
$$

## 脚注
这里有一个脚注[^1]，这里有另一个脚注[^2]。

[^1]: 这是第一个脚注的内容。
[^2]: 这是第二个脚注的内容。

## HTML标签
支持部分HTML标签：

<div style="color: red;">红色文字</div>
<span style="background-color: yellow;">黄色背景</span>

<details>
<summary>点击展开详情</summary>
这里是详细内容。
</details>

## 其他特殊符号
- 版权符号：&copy;
- 注册商标：&reg;
- 商标符号：&trade;
- 箭头：&larr; &uarr; &rarr; &darr;
- 数学符号：&plusmn; &times; &divide;

---

    <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. </div>
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

  return <div style={{
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
  </div>;
};

export default Reader; 