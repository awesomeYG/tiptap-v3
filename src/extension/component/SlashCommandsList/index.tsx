import { SlashCommandsListProps, SlashCommandsListRef } from '@baizhicloud/tiptap/type'
import {
  Box,
  MenuItem,
  MenuList,
  Paper,
  Stack
} from '@mui/material'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const SlashCommandsList = forwardRef<SlashCommandsListRef, SlashCommandsListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const menuItemsRef = useRef<(HTMLLIElement | null)[]>([])

    const selectItem = (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    }

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length)
    }

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length)
    }

    const enterHandler = () => {
      selectItem(selectedIndex)
    }

    // 自动滚动到选中的菜单项
    useEffect(() => {
      if (menuItemsRef.current[selectedIndex]) {
        menuItemsRef.current[selectedIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }, [selectedIndex])

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }

        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }

        if (event.key === 'Enter') {
          enterHandler()
          return true
        }

        return false
      },
    }))

    if (items.length === 0) {
      return null
    }

    return (
      <Paper
        elevation={8}
        sx={{
          maxHeight: '300px',
          overflow: 'auto',
          borderRadius: 'var(--mui-shape-borderRadius)',
          minWidth: '200px'
        }}
      >
        <MenuList sx={{ p: 0.5 }}>
          {items.map((item, index) => (
            <MenuItem
              key={index}
              ref={el => menuItemsRef.current[index] = el}
              selected={index === selectedIndex}
              onClick={() => selectItem(index)}
              sx={{
                py: 1,
                px: 2,
                fontSize: '0.875rem',
                borderRadius: 'var(--mui-shape-borderRadius)',
                '&:hover:not(.Mui-selected)': {
                  backgroundColor: 'action.hover'
                },
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                }
              }}
            >
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {item.icon}
                </Box>
                <Box>{item.title}</Box>
              </Stack>
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    )
  }
)

SlashCommandsList.displayName = 'SlashCommandsList'

export default SlashCommandsList
