import { Stack } from "@mui/material"
import React from "react"

const ToolItem = ({
  icon,
  onClick,
  isActive,
}: {
  icon: React.ReactNode
  onClick: () => void
  isActive: boolean
}) => {
  return <Stack
    direction={'row'}
    alignItems={'center'}
    justifyContent={'center'}
    gap={0.5}
    sx={{
      width: '1.5rem',
      height: '1.5rem',
      cursor: 'pointer',
      borderRadius: 'var(--mui-shape-borderRadius)',
      '&:hover': {
        backgroundColor: 'action.selected',
      },
      svg: {
        color: isActive ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-primary)',
        fontSize: 18,
      }
    }}
    onClick={onClick}
  >
    {icon}
  </Stack>
}

export default ToolItem