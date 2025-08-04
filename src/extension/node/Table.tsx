import { Extension } from '@tiptap/core';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { createTableContextMenuPlugin } from '../component/Table/TableContextMenuPlugin';

export const TableExtension = ({ editable }: { editable: boolean }) => [
  Table.configure({
    handleWidth: 5,
    cellMinWidth: 100,
    resizable: editable,
    lastColumnResizable: editable,
    allowTableNodeSelection: editable,
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
        ...(this.parent ? this.parent() : {}),
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