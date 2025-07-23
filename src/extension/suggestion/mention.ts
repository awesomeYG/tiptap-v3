import { computePosition, flip, shift } from '@floating-ui/dom'
import { Editor, posToDOMRect, ReactRenderer } from '@tiptap/react'
import { SuggestionProps } from '@tiptap/suggestion'
import { MentionList, MentionListProps, MentionListRef } from '../component/MentionList'

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

export default {
  items: ({ query }: { query: string }) => {
    return ['Lea Thompson',
      'Cyndi Lauper',
      'Tom Cruise',
      'Madonna',
      'Jerry Hall',].filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5)
  },
  render: () => {
    let reactRenderer: ReactRenderer<MentionListRef, MentionListProps> | null = null

    return {
      onStart: (props: SuggestionProps<any>) => {
        if (!props.clientRect || !reactRenderer) return
        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })
        reactRenderer.element.style.position = 'absolute'
        document.body.appendChild(reactRenderer.element)
        updatePosition(props.editor, reactRenderer.element)
      },
      onUpdate(props: SuggestionProps<any>) {
        reactRenderer.updateProps(props)
        if (!props.clientRect) {
          return
        }
        updatePosition(props.editor, reactRenderer.element)
      },
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          reactRenderer.destroy()
          reactRenderer.element.remove()
          return true
        }
        return reactRenderer.ref?.onKeyDown(props)
      },
      onExit() {
        reactRenderer.destroy()
        reactRenderer.element.remove()
      },
    }
  },
}