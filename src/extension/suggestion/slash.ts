import { slashCommands } from '@ctzhian/tiptap/contants/slash-commands'
import type { SlashCommandsListProps, SlashCommandsListRef } from '@ctzhian/tiptap/type'
import { updatePosition } from '@ctzhian/tiptap/util'
import { ReactRenderer } from '@tiptap/react'
import { SuggestionProps } from '@tiptap/suggestion'
import SlashCommandsList from '../component/SlashCommandsList/index'


export const slashSuggestion = () => {
  return {
    items: ({ query }: { query: string }) => {
      const commands = slashCommands
      if (!query) return commands
      return commands.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
    },
    command: ({ editor, range, props }: { editor: any; range: { from: number; to: number }; props: any }) => {
      props.command({ editor, range, attrs: props.attrs })
    },
    render: () => {
      let component: ReactRenderer<SlashCommandsListRef, SlashCommandsListProps> | null = null

      return {
        onStart: (props: SuggestionProps<any>) => {
          component = new ReactRenderer(SlashCommandsList, {
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
}

export default slashSuggestion
