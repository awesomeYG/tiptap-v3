import { getShortcutKeyText } from "@ctzhian/tiptap/util"
import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material"
import { Editor } from "@tiptap/react"
import React, { useEffect, useState } from "react"
import { ArrowDownSLineIcon, H1Icon, H2Icon, H3Icon, H4Icon, H5Icon, H6Icon, HeadingIcon } from "../Icons"
import ToolItem from "./Item"

interface EditorHeadingProps {
  editor: Editor
}

const EditorHeading = ({ editor }: EditorHeadingProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("paragraph");
  const HeadingOptions = [
    { id: 'paragraph', icon: <HeadingIcon sx={{ fontSize: '1rem' }} />, label: 'Paragraph', shortcutKey: ['ctrl', 'alt', '0'] },
    { id: '1', icon: <H1Icon sx={{ fontSize: '1rem' }} />, label: 'Heading 1', shortcutKey: ['ctrl', 'alt', '1'] },
    { id: '2', icon: <H2Icon sx={{ fontSize: '1rem' }} />, label: 'Heading 2', shortcutKey: ['ctrl', 'alt', '2'] },
    { id: '3', icon: <H3Icon sx={{ fontSize: '1rem' }} />, label: 'Heading 3', shortcutKey: ['ctrl', 'alt', '3'] },
    { id: '4', icon: <H4Icon sx={{ fontSize: '1rem' }} />, label: 'Heading 4', shortcutKey: ['ctrl', 'alt', '4'] },
    { id: '5', icon: <H5Icon sx={{ fontSize: '1rem' }} />, label: 'Heading 5', shortcutKey: ['ctrl', 'alt', '5'] },
    { id: '6', icon: <H6Icon sx={{ fontSize: '1rem' }} />, label: 'Heading 6', shortcutKey: ['ctrl', 'alt', '6'] },
  ]

  const updateSelection = () => {
    const level = editor.getAttributes("heading").level || "paragraph";
    setSelectedValue(level);
  }

  const handleChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setSelectedValue(value);
    if (value !== 'paragraph') {
      const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level }).run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  }

  useEffect(() => {
    editor.on('selectionUpdate', updateSelection);
    editor.on('transaction', updateSelection);
    return () => {
      editor.off('selectionUpdate', updateSelection);
      editor.off('transaction', updateSelection);
    };
  }, [editor]);

  return <Select
    value={selectedValue}
    className={['1', '2', '3', '4', '5', '6'].includes(String(selectedValue)) ? "tool-active" : ""}
    onChange={handleChange}
    sx={{
      bgcolor: 'transparent',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderWidth: '0px !important',
        borderColor: 'transparent !important',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '0px !important',
        borderColor: 'transparent !important',
      },
    }}
    renderValue={(value) => {
      return <ToolItem
        tip={'标题'}
        icon={<Stack direction={'row'} alignItems={'center'} sx={{ mr: 0.5, width: '1.5rem' }}>
          {HeadingOptions.find(it => it.id === String(value))?.icon || <HeadingIcon sx={{ fontSize: '1rem' }} />}
        </Stack>}
      />
    }}
    IconComponent={({ className, ...rest }) => {
      return <ArrowDownSLineIcon
        sx={{
          position: 'absolute',
          right: 2,
          flexSelf: 'center',
          fontSize: '1rem',
          flexShrink: 0,
          mr: 0,
          color: 'text.disabled',
          transform: className?.includes('MuiSelect-iconOpen') ? 'rotate(-180deg)' : 'none',
          transition: 'transform 0.3s',
          cursor: 'pointer',
          pointerEvents: 'none'
        }}
        {...rest}
      />
    }}
  >
    {HeadingOptions.map(it => <MenuItem key={it.id} value={it.id}>
      <Tooltip arrow title={getShortcutKeyText(it.shortcutKey)} placement="right">
        <Stack direction={'row'} alignItems={'center'} justifyContent='center' gap={1}>
          {it.icon}
          <Box sx={{ ml: 1, fontSize: '0.875rem' }}>{it.label}</Box>
        </Stack>
      </Tooltip>
    </MenuItem>)}
  </Select>
}

export default EditorHeading