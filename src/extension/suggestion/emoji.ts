import { updatePosition } from '@ctzhian/tiptap/util'
import { EmojiItem, EmojiOptions } from '@tiptap/extension-emoji'
import { Editor, ReactRenderer } from '@tiptap/react'
import { SuggestionProps } from '@tiptap/suggestion'
import { EmojiList, EmojiListProps, EmojiListRef } from '../component/EmojiList'

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