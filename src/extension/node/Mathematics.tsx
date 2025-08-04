import { EditorFnProps } from "@cq/tiptap/type";
import { BlockMath, InlineMath } from "@tiptap/extension-mathematics";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React from "react";
import { MathematicsBlockViewWrapper, MathematicsInlineViewWrapper } from "../component/Mathematics";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    CustomInlineMath: {
      /**
       * Insert a inline math node with LaTeX string.
       * @param options - Options for inserting inline math.
       * @returns ReturnType
       */
      setInlineMath: (options: { latex: string }) => ReturnType
    }
    CustomBlockMath: {
      /**
       * Insert a block math node with LaTeX string.
       * @param options - Options for inserting block math.
       * @returns ReturnType
       */
      setBlockMath: (options: { latex: string }) => ReturnType
    }
  }
}

const CustomInlineMath = (options: EditorFnProps) => InlineMath.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-5': () => {
        return this.editor.commands.insertContent({
          type: this.name,
          attrs: {
            latex: ''
          },
        })
      }
    }
  },

  addCommands() {
    return {
      setInlineMath: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            latex: options.latex,
          },
        })
      }
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => <MathematicsInlineViewWrapper {...renderProps} {...options} />)
  },
})

const CustomBlockMath = (options: EditorFnProps) => BlockMath.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-6': () => {
        return this.editor.commands.insertContent({
          type: this.name,
          attrs: {
            latex: '',
          },
        })
      }
    }
  },
  addCommands() {
    return {
      setBlockMath: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            latex: options.latex,
          },
        })
      }
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer((renderProps) => <MathematicsBlockViewWrapper {...renderProps} {...options} />)
  },
})

export const CustomInlineMathExtension = (options: EditorFnProps) => CustomInlineMath(options).configure({
  katexOptions: {
    throwOnError: false,
    displayMode: false,
  },
})

export const CustomBlockMathExtension = (options: EditorFnProps) => CustomBlockMath(options).configure({
  katexOptions: {
    throwOnError: false,
    displayMode: true,
  },
})