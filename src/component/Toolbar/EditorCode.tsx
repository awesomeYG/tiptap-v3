import { getShortcutKeyText } from "@ctzhian/tiptap/util";
import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { ArrowDownSLineIcon, CodeBoxLineIcon, CodeLineIcon, CodeSSlashLineIcon } from "../Icons";
import ToolbarItem from "./Item";

interface EditorCodeProps {
  editor: Editor;
}

const EditorCode = ({ editor }: EditorCodeProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const AlignOptions = [
    { id: 'code', icon: <CodeLineIcon sx={{ fontSize: '1rem' }} />, label: '行内代码', shortcutKey: ['ctrl', 'E'] },
    { id: 'codeBlock', icon: <CodeBoxLineIcon sx={{ fontSize: '1rem' }} />, label: '代码块', shortcutKey: ['ctrl', 'alt', 'C'] },
  ];

  const updateSelection = () => {
    if (editor.isActive('code')) {
      setSelectedValue('code');
    } else if (editor.isActive('codeBlock')) {
      setSelectedValue('codeBlock');
    } else {
      setSelectedValue('none');
    }
  };

  const handleCodeAction = (codeType: string) => {
    if (codeType === 'code') {
      editor.chain().focus().toggleCode().run();
    } else if (codeType === 'codeBlock') {
      editor.chain().focus().toggleCodeBlock().run();
    }
  };

  const handleChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setSelectedValue(value);
  };

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
    className={['code', 'codeBlock'].includes(selectedValue) ? "tool-active" : ""}
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
      return <ToolbarItem
        tip={'代码'}
        icon={<Stack direction={'row'} alignItems={'center'} sx={{ mr: 0.5, width: '1.5rem' }}>
          {AlignOptions.find(it => it.id === value)?.icon || <CodeSSlashLineIcon sx={{ fontSize: '1rem' }} />}
        </Stack>}
      />;
    }}
    IconComponent={({ className, ...rest }) => {
      return (
        <ArrowDownSLineIcon
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
      );
    }}
  >
    <MenuItem key={'none'} value={'none'} sx={{ display: 'none' }}>
      <CodeSSlashLineIcon sx={{ fontSize: '1rem' }} />
      <Box sx={{ ml: 1 }}>无</Box>
    </MenuItem>
    {AlignOptions.map(it => (
      <MenuItem key={it.id} value={it.id} onClick={(e) => {
        e.stopPropagation();
        handleCodeAction(it.id);
      }}>
        <Tooltip arrow title={getShortcutKeyText(it.shortcutKey || [])} placement="right">
          <Stack direction={'row'} alignItems={'center'} justifyContent='center' gap={1}>
            {it.icon}
            <Box sx={{ fontSize: '0.875rem' }}>{it.label}</Box>
          </Stack>
        </Tooltip>
      </MenuItem>
    ))}
  </Select>
};

export default EditorCode;