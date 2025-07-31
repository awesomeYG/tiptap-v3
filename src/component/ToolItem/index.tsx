import { Box, Stack, Tooltip } from "@mui/material"
import React from "react"

const ToolItem = ({
  icon,
  size = 'medium',
  onClick,
  isActive,
  text,
  tip,
}: {
  icon: React.ReactNode
  size?: 'medium' | 'small'
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  isActive?: boolean
  text?: string
  tip?: string
}) => {
  return <Tooltip arrow title={tip ?? null}>
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{
        minWidth: size === 'small' ? '1.5rem' : '1.75rem',
        height: size === 'small' ? '1.5rem' : '1.75rem',
        cursor: 'pointer',
        p: '0.25rem',
        borderRadius: 'var(--mui-shape-borderRadius)',
        bgcolor: isActive ? 'action.selected' : 'transparent',
        '&:hover': {
          bgcolor: 'action.selected',
        },
        svg: {
          color: isActive ? 'primary.main' : 'text.primary',
          fontSize: '1rem',
        }
      }}
      onClick={onClick}
    >
      {icon}
      {text && <Box component={'span'} sx={{ fontSize: '0.875rem', ml: 0.5 }}>{text}</Box>}
    </Stack>
  </Tooltip>
}

export default ToolItem