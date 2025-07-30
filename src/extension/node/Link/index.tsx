import { mergeAttributes, Node } from '@tiptap/core'
import { registerCustomProtocol, reset } from 'linkifyjs'
import { UNICODE_WHITESPACE_REGEX_GLOBAL } from './helpers/whitespace'

export interface LinkProtocolOptions {
  /**
   * The protocol scheme to be registered.
   * @default '''
   * @example 'ftp'
   * @example 'git'
   */
  scheme: string

  /**
   * If enabled, it allows optional slashes after the protocol.
   * @default false
   * @example true
   */
  optionalSlashes?: boolean
}

/**
 * @deprecated The default behavior is now to open links when the editor is not editable.
 */
type DeprecatedOpenWhenNotEditable = 'whenNotEditable'

export interface LinkOptions {
  /**
 * If enabled, the extension will automatically add links as you type.
 * @default true
 * @example false
 */
  autolink: boolean

  /**
   * An array of custom protocols to be registered with linkifyjs.
   * @default []
   * @example ['ftp', 'git']
   */
  protocols: Array<LinkProtocolOptions | string>

  /**
   * Default protocol to use when no protocol is specified.
   * @default 'http'
   */
  defaultProtocol: string
  /**
   * If enabled, links will be opened on click.
   * @default true
   * @example false
   */
  openOnClick: boolean | DeprecatedOpenWhenNotEditable
  /**
   * If enabled, the link will be selected when clicked.
   * @default false
   * @example true
   */
  enableClickSelection: boolean
  /**
   * Adds a link to the current selection if the pasted content only contains an url.
   * @default true
   * @example false
   */
  linkOnPaste: boolean

  /**
   * HTML attributes to add to the link element.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>

  /**
   * @deprecated Use the `shouldAutoLink` option instead.
   * A validation function that modifies link verification for the auto linker.
   * @param url - The url to be validated.
   * @returns - True if the url is valid, false otherwise.
   */
  validate: (url: string) => boolean

  /**
   * A validation function which is used for configuring link verification for preventing XSS attacks.
   * Only modify this if you know what you're doing.
   *
   * @returns {boolean} `true` if the URL is valid, `false` otherwise.
   *
   * @example
   * isAllowedUri: (url, { defaultValidate, protocols, defaultProtocol }) => {
   * return url.startsWith('./') || defaultValidate(url)
   * }
   */
  isAllowedUri: (
    /**
     * The URL to be validated.
     */
    url: string,
    ctx: {
      /**
       * The default validation function.
       */
      defaultValidate: (url: string) => boolean
      /**
       * An array of allowed protocols for the URL (e.g., "http", "https"). As defined in the `protocols` option.
       */
      protocols: Array<LinkProtocolOptions | string>
      /**
       * A string that represents the default protocol (e.g., 'http'). As defined in the `defaultProtocol` option.
       */
      defaultProtocol: string
    },
  ) => boolean

  /**
   * Determines whether a valid link should be automatically linked in the content.
   *
   * @param {string} url - The URL that has already been validated.
   * @returns {boolean} - True if the link should be auto-linked; false if it should not be auto-linked.
   */
  shouldAutoLink: (url: string) => boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    alink: {
      /**
       * Set a link mark
       * @param attributes The link attributes
       * @example editor.commands.setALink({ href: 'https://tiptap.dev' })
       */
      setALink: (attributes: {
        href: string
        target?: string | null
        rel?: string | null
        class?: string | null
        title?: string | null
        type?: string | null
      }) => ReturnType
      /**
       * Toggle a link mark
       * @param attributes The link attributes
       * @example editor.commands.toggleALink({ href: 'https://tiptap.dev' })
       */
      toggleALink: (attributes?: {
        href: string
        target?: string | null
        rel?: string | null
        class?: string | null
        title?: string | null
        type?: string | null
      }) => ReturnType
      /**
       * Unset a link mark
       * @example editor.commands.unsetALink()
       */
      unsetALink: () => ReturnType
    }
  }
}

export function isAllowedUri(uri: string | undefined, protocols?: LinkOptions['protocols']) {
  const allowedProtocols: string[] = ['http', 'https', 'ftp', 'ftps', 'mailto', 'tel', 'callto', 'sms', 'cid', 'xmpp']

  if (protocols) {
    protocols.forEach(protocol => {
      const nextProtocol = typeof protocol === 'string' ? protocol : protocol.scheme

      if (nextProtocol) {
        allowedProtocols.push(nextProtocol)
      }
    })
  }

  return (
    !uri ||
    uri.replace(UNICODE_WHITESPACE_REGEX_GLOBAL, '').match(
      new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^(?:(?:${allowedProtocols.join('|')}):|[^a-z]|[a-z0-9+.\-]+(?:[^a-z+.\-:]|$))`,
        'i',
      ),
    )
  )
}


const LinkNode = Node.create<LinkOptions>({
  name: 'alink',
  group: 'inline',
  inline: true,
  content: 'inline*',
  atom: true,
  selectable: true,
  draggable: true,
  allowGapCursor: true,
  priority: 1000,

  onCreate() {
    if (this.options.validate && !this.options.shouldAutoLink) {
      // Copy the validate function to the shouldAutoLink option
      this.options.shouldAutoLink = this.options.validate
      console.warn('The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.')
    }
    this.options.protocols.forEach(protocol => {
      if (typeof protocol === 'string') {
        registerCustomProtocol(protocol)
        return
      }
      registerCustomProtocol(protocol.scheme, protocol.optionalSlashes)
    })
  },

  onDestroy() {
    reset()
  },

  addOptions() {
    return {
      autolink: true,
      linkOnPaste: false,
      protocols: [],
      defaultProtocol: 'http',
      openOnClick: true,
      enableClickSelection: false,
      HTMLAttributes: {
        target: '_blank',
        class: null,
        type: 'link',
      },
      isAllowedUri: (url, ctx) => !!isAllowedUri(url, ctx.protocols),
      validate: url => !!url,
      shouldAutoLink: url => !!url,
    }
  },

  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute('href')
        },
        renderHTML: (attributes) => {
          return {
            href: attributes.href,
          }
        },
      },
      target: {
        default: this.options.HTMLAttributes.target,
        parseHTML: (element) => {
          return element.getAttribute('target')
        },
        renderHTML: (attributes) => {
          return {
            target: attributes.target,
          }
        },
      },
      rel: {
        default: this.options.HTMLAttributes.rel,
        parseHTML: (element) => {
          return element.getAttribute('rel')
        },
        renderHTML: (attributes) => {
          return {
            rel: attributes.rel,
          }
        },
      },
      class: {
        default: this.options.HTMLAttributes.class,
        parseHTML: (element) => {
          return element.getAttribute('class')
        },
        renderHTML: (attributes) => {
          return {
            class: attributes.class,
          }
        },
      },
      title: {
        default: this.options.HTMLAttributes.title,
        parseHTML: (element) => {
          return element.getAttribute('data-title')
        },
        renderHTML: (attributes) => {
          return {
            'data-title': attributes.title,
          }
        },
      },
      type: {
        default: this.options.HTMLAttributes.type,
        parseHTML: (element) => {
          return element.getAttribute('data-type') || 'link'
        },
        renderHTML: (attributes) => {
          return {
            'data-type': attributes.type,
          }
        },
      },
    }
  },

  addCommands() {
    return {
      setALink: (options) => ({ chain }) => {
        return chain().setNode(this.name, options).run()
      },
      toggleALink: (options) => ({ chain }) => {
        return chain().toggleNode(this.name, 'a', options).run()
      },
      unsetALink: () => ({ chain }) => {
        return chain().deleteNode(this.name).run()
      },
    }
  },

  // parseHTML() {
  //   return [
  //     {
  //       tag: 'a[href]',
  //       getAttrs: (node) => {
  //         return {
  //           href: node.getAttribute('href') ,
  //           target: node.getAttribute('target') || '_blank',
  //           rel: node.getAttribute('rel') ,
  //           class: node.getAttribute('class') ,
  //           title: node.getAttribute('data-title') ,
  //           type: node.getAttribute('data-type') || 'link',
  //         }
  //       },
  //     },
  //   ]
  // },

  parseHTML() {
    return [
      {
        tag: 'a[href]',
        getAttrs: dom => {
          const href = (dom as HTMLElement).getAttribute('href')

          // prevent XSS attacks
          if (
            !href ||
            !this.options.isAllowedUri(href, {
              defaultValidate: url => !!isAllowedUri(url, this.options.protocols),
              protocols: this.options.protocols,
              defaultProtocol: this.options.defaultProtocol,
            })
          ) {
            return false
          }
          return null
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // prevent XSS attacks
    if (
      !this.options.isAllowedUri(HTMLAttributes.href, {
        defaultValidate: href => !!isAllowedUri(href, this.options.protocols),
        protocols: this.options.protocols,
        defaultProtocol: this.options.defaultProtocol,
      })
    ) {
      // strip out the href
      return ['a', mergeAttributes(this.options.HTMLAttributes, { ...HTMLAttributes, href: '' }), 0]
    }

    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(LinkViewWrapper)
  // },
})

export const LinkExtension = LinkNode.extend({

})