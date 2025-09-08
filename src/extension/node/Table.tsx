// @ts-nocheck

import { Extension } from '@tiptap/core';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { Node } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import { createTableContextMenuPlugin } from '../component/Table';

export const TableExtension = ({ editable }: { editable: boolean }) => [
  Table.configure({
    handleWidth: 5,
    cellMinWidth: 100,
    resizable: editable,
    lastColumnResizable: editable,
    allowTableNodeSelection: editable,
  }).extend({
    addCommands() {
      return {
        ...this.parent?.(),
        cancelSelection: () => ({ state, dispatch }) => {
          if (dispatch) {
            const { selection } = state;
            const { $from } = selection;

            // 找到当前单元格的起始和结束位置
            let cellStart = $from.pos;
            let cellEnd = $from.pos;
            let depth = $from.depth;

            // 向上查找直到找到表格单元格
            while (depth > 0) {
              const node = $from.node(depth);
              if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
                cellStart = $from.start(depth);
                cellEnd = $from.end(depth);
                break;
              }
              depth--;
            }

            // 设置选区为单元格的最后位置（不选中文本）
            const newSelection = TextSelection.create(state.doc, cellEnd - 1);
            dispatch(state.tr.setSelection(newSelection));
          }

          return true;
        },
      }
    },
    addKeyboardShortcuts() {
      return {
        'Mod-9': () => this.editor.commands.insertTable({ rows: 3, cols: 4, withHeaderRow: true }),
      }
    },
    renderHTML({ node, HTMLAttributes }: {
      node: Node;
      HTMLAttributes: Record<string, any>;
    }) {
      const originalRender = this.parent?.({ node, HTMLAttributes });
      const wrapper = ['div', { class: 'tableWrapper' }, originalRender];
      return wrapper;
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: 'table-header',
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: 'table-row',
    },
  }),
  TableCell.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        bgcolor: {
          default: 'transparent',
          parseHTML: (element: HTMLElement) => {
            return element.getAttribute('data-background-color') || element.style.backgroundColor;
          },
          renderHTML: (attributes: Record<string, any>) => {
            return {
              'data-background-color': attributes.bgcolor,
              style: `background-color: ${attributes.bgcolor}`,
            };
          },
        },
        textAlign: {
          default: null,
          parseHTML: (element: HTMLElement) => {
            return element.getAttribute('data-text-align') || element.style.textAlign;
          },
          renderHTML: (attributes: Record<string, any>) => {
            if (!attributes.textAlign) return {};
            return {
              style: `text-align: ${attributes.textAlign}`,
              'data-text-align': attributes.textAlign,
            };
          },
        },
        fontSize: {
          default: null,
          parseHTML: (element: HTMLElement) => {
            return element.getAttribute('data-font-size') || element.style.fontSize;
          },
          renderHTML: (attributes: Record<string, any>) => {
            if (!attributes.fontSize) return {};
            return {
              style: `font-size: ${attributes.fontSize}`,
              'data-font-size': attributes.fontSize,
            };
          },
        },
        fontWeight: {
          default: null,
          parseHTML: (element: HTMLElement) => {
            return element.getAttribute('data-font-weight') || element.style.fontWeight;
          },
          renderHTML: (attributes: Record<string, any>) => {
            if (!attributes.fontWeight) return {};
            return {
              style: `font-weight: ${attributes.fontWeight}`,
              'data-font-weight': attributes.fontWeight,
            };
          },
        },
      };
    },
    addKeyboardShortcuts() {
      return {
        Tab: () => {
          if (this.editor.commands.goToNextCell()) {
            return this.editor.chain().cancelSelection().run()
          } else if (!this.editor.can().addRowAfter()) {
            return false
          } else {
            return this.editor.chain().addRowAfter().goToNextCell().cancelSelection().run()
          }
        },
        'Shift-Tab': () => this.editor.chain().goToPreviousCell().cancelSelection().run(),
      };
    },
  }),
  // 表格右键菜单插件
  Extension.create({
    name: 'tableContextMenu',

    addProseMirrorPlugins() {
      return editable ? [
        createTableContextMenuPlugin(this.editor),
      ] : [];
    },
  })
]

export default TableExtension