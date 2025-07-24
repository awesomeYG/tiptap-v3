import { EmojiItem } from '@tiptap/extension-emoji'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export type EmojiListProps = {
  items: EmojiItem[]
  command: (props: { name: string }) => void
}

export type EmojiListRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export const EmojiList = forwardRef<EmojiListRef, EmojiListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command({ name: item.name })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => {
    return {
      onKeyDown: (x: { event: KeyboardEvent }) => {
        if (x.event.key === 'ArrowUp') {
          upHandler()
          return true
        }

        if (x.event.key === 'ArrowDown') {
          downHandler()
          return true
        }

        if (x.event.key === 'Enter') {
          enterHandler()
          return true
        }

        return false
      },
    }
  }, [upHandler, downHandler, enterHandler])

  return (
    <div className="dropdown-menu">
      {props.items.map((item, index) => (
        <button className={index === selectedIndex ? 'is-selected' : ''} key={index} onClick={() => selectItem(index)}>
          {item.fallbackImage ? <img src={item.fallbackImage} /> : item.emoji}:{item.name}:
        </button>
      ))}
    </div>
  )
})