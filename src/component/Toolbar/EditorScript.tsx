import { getShortcutKeyText } from "@ctzhian/tiptap/util";
import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { ArrowDownSLineIcon, SubscriptIcon, SuperscriptIcon } from "../Icons";
import ToolbarItem from "./Item";

interface EditorScriptProps {
  editor: Editor;
}

const EditorScript = ({ editor }: EditorScriptProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const ScriptOptions = [
    { id: 'superscript', icon: <SuperscriptIcon sx={{ fontSize: '1rem' }} />, label: '上标', shortcutKey: ['ctrl', '.'] },
    { id: 'subscript', icon: <SubscriptIcon sx={{ fontSize: '1rem' }} />, label: '下标', shortcutKey: ['ctrl', ','] },
  ];

  const handleScriptAction = (scriptType: string) => {
    if (scriptType === 'superscript') {
      editor.chain().focus().toggleSuperscript().run();
    } else if (scriptType === 'subscript') {
      editor.chain().focus().toggleSubscript().run();
    }
  };

  const handleChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setSelectedValue(value);
  };

  const updateSelection = () => {
    if (editor.isActive('superscript')) {
      setSelectedValue('superscript');
    } else if (editor.isActive('subscript')) {
      setSelectedValue('subscript');
    } else {
      setSelectedValue('none');
    }
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
    className={['superscript', 'subscript'].includes(selectedValue) ? "tool-active" : ""}
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
        tip={'上标/下标'}
        icon={<Stack direction={'row'} alignItems={'center'} sx={{ mr: 0.5, width: '1.5rem' }}>
          {ScriptOptions.find(it => it.id === value)?.icon || <SuperscriptIcon sx={{ fontSize: '1rem' }} />}
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
      <SuperscriptIcon sx={{ fontSize: '1rem' }} />
      <Box sx={{ ml: 1 }}>无</Box>
    </MenuItem>
    {ScriptOptions.map(it => (
      <MenuItem key={it.id} value={it.id} onClick={(e) => {
        e.stopPropagation();
        handleScriptAction(it.id);
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
}

export default EditorScript;