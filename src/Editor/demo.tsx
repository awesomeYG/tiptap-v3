import { Editor, useTiptap } from '@cq/tiptap';
import React from 'react';

const Reader = () => {
  const editor = useTiptap({
    editable: true,
    getMentionItems: async ({ query }) => {
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
    content: `<p>
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
    padding: '10px',
  }}>
    <div style={{
      backgroundColor: '#fff',
    }}>
      <Editor editor={editor} height={800} />
    </div>
  </div>;
};

export default Reader; 