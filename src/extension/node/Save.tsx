import { Extension } from '@tiptap/core';
import { EditorFnProps } from '@yu-cq/tiptap/type';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    save: {
      /**
       * 保存编辑器内容
       * @returns ReturnType
       */
      save: () => ReturnType
    }
  }
}

export const SaveExtension = (options: EditorFnProps) => Extension.create({
  name: 'save',

  addKeyboardShortcuts() {
    return {
      'Mod-s': () => {
        if (options.onSave) {
          options.onSave(this.editor);
          return true;
        }
        return false;
      }
    }
  },

  addCommands() {
    return {
      save: () => () => {
        if (options.onSave) {
          options.onSave(this.editor);
          return true;
        }
        return false;
      }
    }
  },
});
