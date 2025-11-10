import { Link } from "@tiptap/extension-link";
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ReactMarkViewRenderer } from "@tiptap/react";
import LinkViewWrapper from "../component/Link/Markdown";

const CustomLink = Link.extend({
  addMarkView() {
    return ReactMarkViewRenderer(LinkViewWrapper)
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      download: {
        default: null,
        parseHTML: element => element.getAttribute('download'),
        renderHTML: attributes => {
          if (!attributes.download) {
            return {};
          }
          return {
            download: attributes.download,
          };
        },
      },
    };
  },
  // 确保能够解析 HTML 中的 <a> 标签
  parseHTML() {
    return [
      {
        tag: 'a[href]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const href = (element as HTMLElement).getAttribute('href');
          if (!href) return false;
          return {
            href,
            target: (element as HTMLElement).getAttribute('target') || '_blank',
            download: (element as HTMLElement).getAttribute('download'),
          };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['a', HTMLAttributes, 0];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('linkDownloadHandler'),
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target as HTMLElement;
              const link = target.closest('a[download]');
              if (link) {
                const downloadAttr = link.getAttribute('download');
                const href = link.getAttribute('href');
                if (href && downloadAttr !== null) {
                  event.preventDefault();
                  const downloadLink = document.createElement('a');
                  downloadLink.href = href;
                  downloadLink.download = downloadAttr === '' ? href.split('/').pop() || 'download' : downloadAttr;
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                  return true;
                }
              }
              return false;
            },
          },
        },
      }),
    ];
  },
})

export default CustomLink
