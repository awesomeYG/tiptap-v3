import { Box, Button, Stack, TextField } from "@mui/material"
import { Editor } from "@tiptap/react"
import React, { useEffect, useState } from "react"
import { HexAlphaColorPicker } from "react-colorful"
import ToolItem from "../ToolItem"

interface ColorPickerProps {
  editor: Editor
  colorPickerType: string
  setColorPickerType: (colorPickerType: string) => void
  defaultColor: string
}

const ColorPicker = ({ editor, colorPickerType, setColorPickerType, defaultColor }: ColorPickerProps) => {
  const isText = colorPickerType === 'text'

  const [customColor, setCustomColor] = useState(defaultColor)
  const [modifyColor, setModifyColor] = useState(false)

  const THEME_TEXT_COLOR = [
    'var(--mui-palette-primary-main)',
    'var(--mui-palette-success-main)',
    'var(--mui-palette-warning-main)',
    'var(--mui-palette-error-main)',
    '#D8A47F',
    '#73B5F0',
    '#CDDFA0',
    'var(--mui-palette-text-primary)',
    'var(--mui-palette-text-secondary)',
    'var(--mui-palette-common-white)',
  ]

  const THEME_TEXT_BG_COLOR = [
    '#FFFFFF',
    '#FFE0B2',
    '#F8BBD0',
    '#FFCDD2',
    '#FFECB3',
    '#FFCCBC',
    '#B3E5FC',
    '#C8E6C9',
    '#B2EBF2',
    '#BBDEFB',
    '#DCEDC8',
  ]

  const checkModifyColor = (color: string) => {
    if (color.startsWith('#')) {
      const colorValue = color.slice(1)
      if (/^[0-9A-Fa-f]{6}$/.test(colorValue) || /^[0-9A-Fa-f]{8}$/.test(colorValue) || /^[0-9A-Fa-f]{3}$/.test(colorValue)) {
        return true
      }
    }
    return false
  }

  useEffect(() => {
    setCustomColor(defaultColor)
  }, [defaultColor])

  return <>
    <Box sx={{
      backgroundColor: 'var(--mui-palette-background-default)',
      borderRadius: 'var(--mui-shape-borderRadius)',
      p: 0.5,
      mt: 0.5,
    }}>
      <Stack direction={'row'} alignItems={'center'}>
        {(isText ? THEME_TEXT_COLOR : THEME_TEXT_BG_COLOR).map((color) => (
          <ToolItem
            key={color}
            onClick={() => {
              const textStyle = isText ? { color } : { backgroundColor: color }
              editor.chain().focus().toggleTextStyle(textStyle).run()
              setColorPickerType('')
            }}
            icon={<Box sx={{
              cursor: 'pointer',
              width: 16,
              height: 16,
              border: '1px solid',
              borderColor: color === 'var(--mui-palette-common-white)' ? 'var(--mui-palette-divider)' : 'transparent',
              borderRadius: '50%',
              backgroundColor: color,
            }} />}
          />
        ))}
      </Stack>
    </Box>
    <Box sx={{
      mt: 0.5,
      '.react-colorful': { width: '100%', height: 150 },
      '.react-colorful__pointer': { width: 16, height: 16 },
      '.react-colorful__alpha, .react-colorful__hue': { height: '16px !important' }
    }}>
      <HexAlphaColorPicker color={customColor} onChange={setCustomColor} />
      <Stack direction="row" alignItems="center" sx={{ mt: 1 }} justifyContent="space-between">
        {!modifyColor ? <Box
          onClick={() => setModifyColor(true)}
          sx={{ fontSize: 14, color: 'text.secondary', fontFamily: 'monospace', cursor: 'text' }}
        >
          {customColor}
        </Box> : <TextField
          value={customColor}
          size='small'
          onChange={(e) => setCustomColor(e.target.value)}
          slotProps={{
            input: {
              sx: {
                fontSize: 14, color: 'text.secondary', fontFamily: 'monospace', width: 100
              }
            }
          }}
        />}
        <Button
          size="small"
          variant="outlined"
          disabled={!checkModifyColor(customColor)}
          onClick={() => {
            const textStyle = isText ? { color: customColor } : { backgroundColor: customColor }
            editor.chain().focus().toggleTextStyle(textStyle).run()
            setColorPickerType('')
            setModifyColor(false)
          }}
        >
          确定
        </Button>
      </Stack>
    </Box>
  </>
}

export default ColorPicker