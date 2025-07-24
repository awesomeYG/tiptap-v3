import { Grid, Paper } from '@mui/material'
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
    <Paper sx={{
      position: 'relative',
      overflowY: 'auto',
      p: 1,
      width: 'calc(1.5rem * 10)',
      maxHeight: 300,
    }}>
      <Grid container spacing={0.5}>
        {props.items.map((item, index) => (
          <Grid size={1.5} key={index} onClick={() => selectItem(index)} sx={{
            cursor: 'pointer',
            lineHeight: 1,
            fontSize: 14,
            width: '1.5rem',
            height: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            img: {
              width: '1rem',
              height: '1rem',
            },
            transition: 'background-color 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'action.selected',
            },
            ...(index === selectedIndex && {
              backgroundColor: 'action.selected',
            }),
          }}>
            {item.fallbackImage ? <img src={item.fallbackImage} /> : item.emoji}
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
})