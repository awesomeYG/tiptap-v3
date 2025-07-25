import { Stack } from "@mui/material"
import React from "react"

const ToolItem = ({
  icon,
  size = 'medium',
  onClick,
  isActive,
}: {
  icon: React.ReactNode
  size?: 'medium' | 'small'
  onClick?: () => void
  isActive?: boolean
}) => {
  return <Stack
    direction={'row'}
    alignItems={'center'}
    justifyContent={'center'}
    sx={{
      width: size === 'small' ? '1.25rem' : '1.5rem',
      cursor: 'pointer',
      p: '0.25rem',
      borderRadius: 'var(--mui-shape-borderRadius)',
      '&:hover': {
        backgroundColor: 'action.selected',
      },
      svg: {
        color: isActive ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-primary)',
        fontSize: size === 'small' ? '1rem' : '1.125rem',
      }
    }}
    onClick={onClick}
  >
    {icon}
  </Stack>
}

export default ToolItem