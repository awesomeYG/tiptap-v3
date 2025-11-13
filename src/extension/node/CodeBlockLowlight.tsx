// @ts-nocheck

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { all, createLowlight } from 'lowlight';
import CodeBlockView from "../component/CodeBlock";

const lowlight = createLowlight(all)

const CustomCodeBlock = CodeBlockLowlight.configure({
  enableTabIndentation: true,
  tabSize: 1,
  lowlight,
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-title'),
        renderHTML: (attributes: { title?: string }) => {
          if (!attributes.title) {
            return {}
          }
          return {
            'data-title': attributes.title,
          }
        },
      },
    }
  },
  parseMarkdown: (token, helpers) => {
    if (token.raw?.startsWith('```') === false && token.codeBlockStyle !== 'indented') {
      return []
    }
    if (token.lang === 'mermaid') {
      return helpers.createNode(
        'flow',
        { code: token.text || '', width: '100%' },
        []
      )
    }
    return helpers.createNode(
      'codeBlock',
      { language: token.lang || null },
      token.text ? [helpers.createTextNode(token.text)] : [],
    )
  },
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView)
  },
})

export const CodeBlockLowlightExtension = CustomCodeBlock