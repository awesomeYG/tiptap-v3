import { computePosition, flip, shift } from '@floating-ui/dom'
import { EmojiItem, EmojiOptions } from '@tiptap/extension-emoji'
import { Editor, posToDOMRect, ReactRenderer } from '@tiptap/react'
import { SuggestionProps } from '@tiptap/suggestion'
import { EmojiList, EmojiListProps, EmojiListRef } from '../component/EmojiList'

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }: { x: number, y: number, strategy: string }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

export const emojiSuggestion: EmojiOptions["suggestion"] = {
  allowSpaces: false,
  items: ({ editor, query }: { editor: Editor, query: string }) => {
    return editor.storage.emoji.emojis
      .filter(({ shortcodes, tags }: EmojiItem) => {
        return (
          shortcodes.find(shortcode => shortcode.startsWith(query.toLowerCase())) ||
          tags.find(tag => tag.startsWith(query.toLowerCase()))
        )
      })
  },
  render: () => {
    let component: ReactRenderer<EmojiListRef, EmojiListProps> | null = null

    return {
      onStart: (props: SuggestionProps<any>) => {
        component = new ReactRenderer(EmojiList, {
          props,
          editor: props.editor,
        })
        if (!props.clientRect) return
        const element = component.element as HTMLElement
        element.style.position = 'absolute'
        document.body.appendChild(element)
        updatePosition(props.editor, element)
      },
      onUpdate(props: SuggestionProps<any>) {
        if (!component) return
        component.updateProps(props)
        if (!props.clientRect) return
        updatePosition(props.editor, component.element as HTMLElement)
      },
      onKeyDown(props: { event: KeyboardEvent }) {
        if (!component) return false
        if (props.event.key === 'Escape') {
          component.element.remove()
          component.destroy()
          return true
        }
        return component.ref?.onKeyDown(props) || false
      },
      onExit() {
        if (!component) return
        component.destroy()
        component.element.remove()
      },
    }
  },
}

export default emojiSuggestion