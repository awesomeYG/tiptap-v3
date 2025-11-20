// @ts-nocheck

import { Extension } from '@tiptap/core';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import type { Node } from '@tiptap/pm/model';
import { Plugin, TextSelection } from '@tiptap/pm/state';
import { TableView } from '@tiptap/pm/tables';
import { createTableContextMenuPlugin } from '../component/Table';
import { TableHandleExtension } from './TableHandler';

export const TableExtension = ({ editable }: { editable: boolean }) => [
  Table.extend({
    addNodeView() {
      return ({ node, HTMLAttributes }) => {
        class TiptapTableView extends TableView {
          private readonly tableWrapper: HTMLDivElement;
          private readonly innerTableContainer: HTMLDivElement;
          private readonly widgetsContainer: HTMLDivElement;

          declare readonly node: Node;
          declare readonly minCellWidth: number;
          private readonly containerAttributes: Record<string, string>;

          constructor(
            node: Node,
            minCellWidth: number,
            containerAttributes: Record<string, string>
          ) {
            super(node, minCellWidth);

            this.containerAttributes = containerAttributes ?? {};

            this.tableWrapper = this.createTableWrapper();
            this.innerTableContainer = this.createInnerTableContainer();
            this.widgetsContainer = this.createWidgetsContainer();

            this.setupDOMStructure();
          }

          private createTableWrapper(): HTMLDivElement {
            const container = document.createElement('div');
            container.className = 'tableWrapper';
            this.applyContainerAttributes(container);
            return container;
          }

          private createInnerTableContainer(): HTMLDivElement {
            const container = document.createElement('div');
            container.className = 'table-container';
            return container;
          }

          private createWidgetsContainer(): HTMLDivElement {
            const container = document.createElement('div');
            container.className = 'table-controls';
            container.style.position = 'relative';
            return container;
          }

          private applyContainerAttributes(element: HTMLDivElement): void {
            Object.entries(this.containerAttributes).forEach(([key, value]) => {
              if (key !== 'class') {
                element.setAttribute(key, value);
              }
            });
          }

          private setupDOMStructure(): void {
            const originalTable = this.dom;
            const tableElement = originalTable.firstChild!;

            // Move table into inner container
            this.innerTableContainer.appendChild(tableElement);

            // Build the hierarchy: tableWrapper > innerContainer + widgetsContainer
            this.tableWrapper.appendChild(this.innerTableContainer);
            this.tableWrapper.appendChild(this.widgetsContainer);

            this.dom = this.tableWrapper;
          }

          ignoreMutation(mutation: any): boolean {
            const target = mutation.target as HTMLElement;
            const isInsideTable = target.closest('.table-container');

            return !isInsideTable || super.ignoreMutation(mutation);
          }
        }

        const cellMinWidth =
          this.options.cellMinWidth < 100 ? 100 : this.options.cellMinWidth;
        return new TiptapTableView(node, cellMinWidth, HTMLAttributes);
      };
    },
    renderHTML({ node, HTMLAttributes }: {
      node: Node;
      HTMLAttributes: Record<string, any>;
    }) {
      const originalRender = this.parent?.({ node, HTMLAttributes });
      const wrapper = ['div', { class: 'tableWrapper' },
        ['div', { class: 'table-container' }, originalRender],
        ['div', { class: 'table-controls' }]
      ];
      return wrapper;
    },
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
        'Mod-9': () => this.editor.chain().insertTable({ rows: 3, cols: 4, withHeaderRow: true }).focus().run(),
      }
    },
  }).configure({
    handleWidth: 5,
    cellMinWidth: 100,
    resizable: editable,
    lastColumnResizable: editable,
    allowTableNodeSelection: editable,
  }),
  TableHeader.extend({
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
  }).configure({
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
          if (this.editor.chain().goToNextCell().focus().run()) {
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
  }),
  // 表格 handle 扩展
  editable ? TableHandleExtension : Extension.create({ name: 'tableHandleExtension' }),
  // Safari 中文输入 deleteCompositionText 修复
  Extension.create({
    name: 'safariCompositionDeleteFix',

    addProseMirrorPlugins() {
      if (!editable) return []

      const ZERO_WIDTH_SPACE = '\u200b'
      const isSafari = (() => {
        if (typeof navigator === 'undefined') return false
        const ua = navigator.userAgent
        const isAppleMobile = /iP(ad|hone|od)/.test(ua)
        const isMacSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua)
        return isAppleMobile || isMacSafari
      })()

      if (!isSafari) return []

      // 注意：这里不能使用上面从 ProseMirror 导入的 Node 类型，需判断 DOM 文本节点
      const isTextNode = (node: any): node is Text => !!node && (node as any).nodeType === 3

      return [new Plugin({
        props: {
          handleDOMEvents: {
            beforeinput: (_view, event: InputEvent) => {
              // 仅处理 Safari 在中文合成结束后触发的删除合成文本行为
              if ((event as any).inputType !== 'deleteCompositionText') {
                return false
              }
              const selection = window.getSelection()
              if (!selection || selection.rangeCount === 0) return false
              const range = selection.getRangeAt(0)
              const { startContainer, endContainer, startOffset, endOffset } = range
              if (
                isTextNode(startContainer) &&
                startContainer === endContainer &&
                startOffset === 0 &&
                endOffset === (startContainer as Text).length
              ) {
                startContainer.parentElement?.insertBefore(document.createTextNode(ZERO_WIDTH_SPACE), startContainer)
              }
              // 让 ProseMirror 照常处理
              return false
            },
            input: (_view, event: InputEvent) => {
              if ((event as any).inputType !== 'deleteCompositionText') {
                return false
              }
              const selection = window.getSelection()
              if (!selection || selection.rangeCount === 0) return false
              const range = selection.getRangeAt(0)
              const node = range.startContainer as any
              const parentEl: HTMLElement | null = node?.parentElement || null
              if (!parentEl) return false
              const textNodes = Array.from(parentEl.childNodes).filter(isTextNode)
              for (const textNode of textNodes) {
                if (textNode.textContent === ZERO_WIDTH_SPACE) {
                  textNode.remove()
                } else if (textNode.textContent && textNode.textContent.includes(ZERO_WIDTH_SPACE)) {
                  textNode.textContent = textNode.textContent.split(ZERO_WIDTH_SPACE).join('')
                }
              }
              return false
            },
          },
        },
      })]
    },
  })
]

export default TableExtension