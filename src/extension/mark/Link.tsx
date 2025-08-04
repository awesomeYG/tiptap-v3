// import { Link } from "@tiptap/extension-link";

// const customLink = Link.extend({
//   addAttributes() {
//     return {
//       ...(this.parent as any)?.(),
//       type: {
//         default: 'link',
//         parseHTML: (element: HTMLElement) => {
//           return element.getAttribute('data-type') || 'link'
//         },
//         renderHTML: (attributes: any) => {
//           return {
//             'data-type': attributes.type,
//           }
//         }
//       },
//       title: {
//         default: '',
//         parseHTML: (element: HTMLElement) => {
//           return element.getAttribute('data-title') || ''
//         },
//         renderHTML: (attributes: any) => {
//           return {
//             'data-title': attributes.title,
//           }
//         }
//       },
//     }
//   },
//   addKeyboardShortcuts() {
//     return {
//       'Mod-k': () => {
//         return this.editor.commands.setLink({ href: '' })
//       }
//     }
//   },
//   // addMarkView() {
//   //   return ReactMarkViewRenderer(LinkViewWrapper, {
//   //     as: 'a',
//   //   })
//   // }
// })

// export const LinkExtension = customLink.configure({
//   autolink: true,
//   openOnClick: true,
//   enableClickSelection: true,
//   linkOnPaste: true,
//   protocols: ['http', 'https', 'mailto', 'tel'],
//   defaultProtocol: 'http',
//   HTMLAttributes: {
//     rel: null,
//     target: '_blank',
//   },
// })

// export default LinkExtension
