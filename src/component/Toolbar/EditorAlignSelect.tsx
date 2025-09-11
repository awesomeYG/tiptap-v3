import { getShortcutKeyText } from "@baizhicloud/tiptap/util";
import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, ArrowDownSLineIcon } from "../Icons";
import ToolbarItem from "./Item";

interface EditorAlignSelectProps {
  editor: Editor;
}

const EditorAlignSelect = ({ editor }: EditorAlignSelectProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const AlignOptions = [
    { id: 'left', icon: <AlignLeftIcon sx={{ fontSize: '1rem' }} />, label: '左侧对齐', shortcutKey: ['ctrl', 'shift', 'L'] },
    { id: 'center', icon: <AlignCenterIcon sx={{ fontSize: '1rem' }} />, label: '居中对齐', shortcutKey: ['ctrl', 'shift', 'E'] },
    { id: 'right', icon: <AlignRightIcon sx={{ fontSize: '1rem' }} />, label: '右侧对齐', shortcutKey: ['ctrl', 'shift', 'R'] },
    { id: 'justify', icon: <AlignJustifyIcon sx={{ fontSize: '1rem' }} />, label: '两端对齐', shortcutKey: ['ctrl', 'shift', 'J'] },
  ];

  const updateSelection = () => {
    if (editor.isActive({ textAlign: 'left' })) {
      setSelectedValue('left');
    } else if (editor.isActive({ textAlign: 'center' })) {
      setSelectedValue('center');
    } else if (editor.isActive({ textAlign: 'right' })) {
      setSelectedValue('right');
    } else if (editor.isActive({ textAlign: 'justify' })) {
      setSelectedValue('justify');
    } else {
      setSelectedValue('none');
    }
  };

  const handleAlignAction = (alignType: string) => {
    editor.chain().focus().toggleTextAlign(alignType).run();
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
    className={['left', 'center', 'right', 'justify'].includes(selectedValue) ? "tool-active" : ""}
    onChange={handleChange}
    renderValue={(value) => {
      return <ToolbarItem
        tip={'对齐方式'}
        icon={<Stack direction={'row'} alignItems={'center'} sx={{ mr: 0.5, width: '1.5rem' }}>
          {AlignOptions.find(it => it.id === value)?.icon || <AlignLeftIcon sx={{ fontSize: '1rem' }} />}
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
      <AlignLeftIcon sx={{ fontSize: '1rem' }} />
      <Box sx={{ ml: 1 }}>无</Box>
    </MenuItem>
    {AlignOptions.map(it => (
      <MenuItem key={it.id} value={it.id} onClick={(e) => {
        e.stopPropagation();
        handleAlignAction(it.id);
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

export default EditorAlignSelect;