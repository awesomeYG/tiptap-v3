import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view'

export interface AiWritingOptions {
  // 触发请求前的最小字符数（避免空文、极短文本触发）
  minChars?: number
  // 防抖毫秒，默认 1000ms
  debounceMs?: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiWriting: {
      setAiWriting: (enabled: boolean) => ReturnType
    }
  }
}

type SuggestionState = {
  enabled: boolean
  pos: number | null
  text: string
  decorations: DecorationSet
  lastDocText: string
}

const aiWritingPluginKey = new PluginKey<SuggestionState>('aiWritingPlugin')

// 简单防抖
function debounce<F extends (...args: any[]) => void>(fn: F, wait: number) {
  let timer: any = null
  return (...args: Parameters<F>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

function getFullText(view: EditorView): string {
  const { doc } = view.state
  return (doc as any).textBetween(0, doc.content.size, '\n', '\n') as string
}

function isAtEndWithNoContentAfter(view: EditorView): boolean {
  const { state } = view
  const { selection, doc } = state
  if (!selection.empty) return false
  // 文档需非空
  const fullText = getFullText(view)
  if (!fullText || fullText.trim().length === 0) return false
  // 光标后文档范围内无可见字符
  const afterText = (doc as any).textBetween(selection.from, doc.content.size, '\n', '\n') as string
  if (afterText && afterText.trim().length > 0) return false
  // 同时在当前文本块末尾（不在块中间）
  const $from: any = selection.$from
  const atEndOfBlock = $from.parentOffset === $from.parent.content.size
  return !!atEndOfBlock
}

function createSuggestionWidget(text: string) {
  const dom = document.createElement('span')
  dom.className = 'ai-writing-suggestion'
  dom.textContent = text
  return dom
}

export const AiWritingExtension = (props: { onAiWritingGetSuggestion?: ({ text }: { text: string }) => Promise<string> }) => Extension.create<AiWritingOptions>({
  name: 'aiWriting',

  addOptions() {
    return {
      minChars: 1,
      debounceMs: 1000,
    }
  },

  addStorage() {
    return {
      enabled: false as boolean,
    }
  },

  addCommands() {
    return {
      setAiWriting:
        (enabled: boolean) =>
          ({ tr, state, dispatch }) => {
            if (dispatch) {
              const meta = { type: 'setEnabled', enabled }
              dispatch(tr.setMeta(aiWritingPluginKey, meta))
                // 同步到 storage，便于外部判断
                ; (this as any).storage.enabled = !!enabled
            }
            return true
          },
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        const pluginState = aiWritingPluginKey.getState(this.editor.state)
        if (!pluginState || !pluginState.enabled) return false
        const { text, pos } = pluginState
        if (!text || text.length === 0 || pos == null) return false

        return this.editor.commands.command(({ tr, state, dispatch }) => {
          if (!dispatch) return true
          const insertPos = state.selection.from
          tr.insertText(text, insertPos)
          // 接受后清空建议
          dispatch(tr.setMeta(aiWritingPluginKey, { type: 'clearSuggestion' }))
          return true
        })
      },
    }
  },

  addProseMirrorPlugins() {
    const minChars = this.options.minChars ?? 1
    const debounceMs = this.options.debounceMs ?? 1000

    let debouncedRequest: ((view: EditorView) => void) | null = null

    const request = async (view: EditorView) => {
      const state = aiWritingPluginKey.getState(view.state)
      if (!state || !state.enabled) return
      if (!isAtEndWithNoContentAfter(view)) return

      const text = getFullText(view)
      if ((text?.length || 0) < minChars) return

      // 避免重复请求同一内容
      if (state.lastDocText === text) return

      let suggestion = ''
      try {
        suggestion = await props.onAiWritingGetSuggestion?.({ text }) ?? ''
      } catch (error) {
        console.error('getSuggestion error', error)
      }

      const tr = view.state.tr.setMeta(aiWritingPluginKey, {
        type: 'setSuggestion',
        text: suggestion,
        pos: view.state.selection.from,
        lastDocText: text,
      })
      view.dispatch(tr)
    }

    const ensureDebounced = () => {
      if (!debouncedRequest) {
        debouncedRequest = debounce((view: EditorView) => request(view), debounceMs)
      }
      return debouncedRequest
    }

    return [
      new Plugin<SuggestionState>({
        key: aiWritingPluginKey,
        state: {
          init: (_config, state) => ({
            enabled: false,
            pos: null,
            text: '',
            decorations: DecorationSet.create(state.doc, []),
            lastDocText: '',
          }),
          apply: (tr, pluginState, _old, newState) => {
            let next = pluginState

            // 装饰位置随映射移动
            if (tr.docChanged) {
              const mapped = pluginState.decorations.map(tr.mapping, tr.doc)
              next = { ...next, decorations: mapped }
              // 用户输入则清空建议（除非是我们主动 setSuggestion 立即覆盖）
              if (!tr.getMeta(aiWritingPluginKey)) {
                next = { ...next, text: '', pos: null, decorations: DecorationSet.create(newState.doc, []) }
              }
            }

            const meta = tr.getMeta(aiWritingPluginKey)
            if (meta) {
              switch (meta.type) {
                case 'setEnabled': {
                  const enabled = !!meta.enabled
                  // 关闭时清空
                  const cleared = enabled ? next.decorations : DecorationSet.create(newState.doc, [])
                  return { ...next, enabled, text: enabled ? next.text : '', pos: enabled ? next.pos : null, decorations: cleared }
                }
                case 'setSuggestion': {
                  const text: string = meta.text || ''
                  const pos: number | null = typeof meta.pos === 'number' ? meta.pos : null
                  const lastDocText: string = meta.lastDocText ?? next.lastDocText
                  if (!text || pos == null) {
                    return { ...next, text: '', pos: null, decorations: DecorationSet.create(newState.doc, []), lastDocText }
                  }
                  const deco = Decoration.widget(pos, () => createSuggestionWidget(text), { side: 1, ignoreSelection: true })
                  const decoSet = DecorationSet.create(newState.doc, [deco])
                  return { ...next, text, pos, decorations: decoSet, lastDocText }
                }
                case 'clearSuggestion': {
                  return { ...next, text: '', pos: null, decorations: DecorationSet.create(newState.doc, []) }
                }
              }
            }

            return next
          },
        },
        view: (view) => {
          // 每次视图更新时尝试触发请求（防抖）
          const handler = () => {
            const state = aiWritingPluginKey.getState(view.state)
            if (!state || !state.enabled) return
            if (!isAtEndWithNoContentAfter(view)) return
            ensureDebounced()(view)
          }

          handler()

          return {
            update: handler,
            destroy: () => {
              // noop
            },
          }
        },
        props: {
          decorations: (state) => aiWritingPluginKey.getState(state)?.decorations || null,
          // 用户任意输入时隐藏建议（例如组合键输入不一定触发 docChanged 前）
          handleKeyDown: (view, event) => {
            const ps = aiWritingPluginKey.getState(view.state)
            if (!ps || !ps.enabled) return false
            // Tab 的处理放在 addKeyboardShortcuts
            if (event.key === 'Tab') return false
            if (ps.text) {
              // 任何按键都清空（如箭头、字符、Enter 等），让体验更贴近代码编辑器
              view.dispatch(view.state.tr.setMeta(aiWritingPluginKey, { type: 'clearSuggestion' }))
            }
            return false
          },
        },
      }),
    ]
  },
})

export type { SuggestionState }


