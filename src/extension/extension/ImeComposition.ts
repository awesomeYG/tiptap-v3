import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Extension to fix IME (Input Method Editor) composition issues
 * 
 * This extension provides basic IME composition support by tracking composition state
 * and preventing keyboard handlers from interrupting IME input.
 * 
 * Also fixes Safari-specific issue where composition text is deleted after composition ends.
 * This Safari bug occurs at any input position (not just in tables), so this extension
 * provides a global fix for all editor instances.
 */
const imeCompositionPluginKey = new PluginKey('imeComposition')

interface ImeCompositionState {
  isComposing: boolean
}

export const ImeComposition = Extension.create({
  name: 'imeComposition',

  addProseMirrorPlugins() {
    const ZERO_WIDTH_SPACE = '\u200b'

    // 检测是否为 Safari 浏览器
    const isSafari = (() => {
      if (typeof navigator === 'undefined') return false
      const ua = navigator.userAgent
      const isAppleMobile = /iP(ad|hone|od)/.test(ua)
      const isMacSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua)
      return isAppleMobile || isMacSafari
    })()

    // 判断是否为文本节点
    const isTextNode = (node: any): node is Text => !!node && (node as any).nodeType === 3

    return [
      new Plugin<ImeCompositionState>({
        key: imeCompositionPluginKey,
        state: {
          init(): ImeCompositionState {
            return { isComposing: false }
          },
          apply(tr, value): ImeCompositionState {
            // 从 transaction meta 中获取组合状态
            const meta = tr.getMeta(imeCompositionPluginKey) as ImeCompositionState | undefined
            if (meta) {
              return { isComposing: meta.isComposing }
            }
            return value
          },
        },
        props: {
          handleKeyDown: (view, event) => {
            const pluginState = imeCompositionPluginKey.getState(view.state)
            // 如果正在输入法组合中，不处理键盘事件
            // 检查 event.isComposing 和插件状态，确保 IME 输入不被键盘处理器打断
            if (event.isComposing || pluginState?.isComposing) {
              return false
            }
            return false
          },
          handleDOMEvents: {
            // 监听输入法组合开始事件
            compositionstart: (view, event) => {
              const { state, dispatch } = view
              const tr = state.tr
                .setMeta(imeCompositionPluginKey, { isComposing: true })
                .setMeta('composition', true)
              dispatch(tr)
              return false
            },
            // 监听输入法组合结束事件
            compositionend: (view, event) => {
              const { state, dispatch } = view
              const tr = state.tr
                .setMeta(imeCompositionPluginKey, { isComposing: false })
                .setMeta('composition', false)
              dispatch(tr)
              return false
            },
            // Safari 特定的修复：处理中文合成结束后触发的删除合成文本行为
            // 这个问题在 Safari 中会在任意输入位置出现，不仅仅是 table
            beforeinput: isSafari ? (view, event) => {
              // 仅处理 Safari 在中文合成结束后触发的删除合成文本行为
              const inputEvent = event as InputEvent
              if ((inputEvent as any).inputType !== 'deleteCompositionText') {
                return false
              }
              const selection = window.getSelection()
              if (!selection || selection.rangeCount === 0) return false
              const range = selection.getRangeAt(0)
              const { startContainer, endContainer, startOffset, endOffset } = range

              // 如果选中的是整个文本节点，在节点前插入零宽空格防止被删除
              if (
                isTextNode(startContainer) &&
                startContainer === endContainer &&
                startOffset === 0 &&
                endOffset === (startContainer as Text).length
              ) {
                startContainer.parentElement?.insertBefore(
                  document.createTextNode(ZERO_WIDTH_SPACE),
                  startContainer
                )
              }
              // 让 ProseMirror 照常处理
              return false
            } : undefined,
            // Safari 特定的修复：清理零宽空格
            input: isSafari ? (view, event) => {
              const inputEvent = event as InputEvent
              if ((inputEvent as any).inputType !== 'deleteCompositionText') {
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
            } : undefined,
          },
        },
      }),
    ]
  },
})

