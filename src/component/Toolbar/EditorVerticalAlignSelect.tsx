import { getShortcutKeyText } from "@baizhicloud/tiptap/util";
import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { AlignBottomIcon, AlignTopIcon, AlignVerticallyIcon, ArrowDownSLineIcon } from "../Icons";
import ToolbarItem from "./Item";

interface EditorVerticalAlignSelectProps {
  editor: Editor;
}

const EditorVerticalAlignSelect = ({ editor }: EditorVerticalAlignSelectProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const VerticalAlignOptions = [
    { id: 'top', icon: <AlignTopIcon sx={{ fontSize: '1rem' }} />, label: '顶部对齐', shortcutKey: ['ctrl', 'alt', 'T'] },
    { id: 'middle', icon: <AlignVerticallyIcon sx={{ fontSize: '1rem' }} />, label: '中间对齐', shortcutKey: ['ctrl', 'alt', 'M'] },
    { id: 'bottom', icon: <AlignBottomIcon sx={{ fontSize: '1rem' }} />, label: '底部对齐', shortcutKey: ['ctrl', 'alt', 'B'] },
  ];

  const updateSelection = () => {
    if (editor.isActive('textStyle', { verticalAlign: 'top' })) {
      setSelectedValue('top');
    } else if (editor.isActive('textStyle', { verticalAlign: 'middle' })) {
      setSelectedValue('middle');
    } else if (editor.isActive('textStyle', { verticalAlign: 'bottom' })) {
      setSelectedValue('bottom');
    } else {
      setSelectedValue('none'); // 默认无垂直对齐
    }
  };

  const handleVerticalAlignAction = (alignType: string) => {
    editor.chain().focus().toggleVerticalAlign(alignType).run();
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
    className={['top', 'middle', 'bottom'].includes(selectedValue) ? "tool-active" : ""}
    onChange={handleChange}
    renderValue={(value) => {
      return <ToolbarItem
        tip={'垂直对齐方式'}
        icon={<Stack direction={'row'} alignItems={'center'} sx={{ mr: 0.5, width: '1.5rem' }}>
          {VerticalAlignOptions.find(it => it.id === value)?.icon || <AlignVerticallyIcon sx={{ fontSize: '1rem' }} />}
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
      <AlignVerticallyIcon sx={{ fontSize: '1rem' }} />
      <Box sx={{ ml: 1 }}>无</Box>
    </MenuItem>
    {VerticalAlignOptions.map(it => (
      <MenuItem key={it.id} value={it.id} onClick={(e) => {
        e.stopPropagation();
        handleVerticalAlignAction(it.id);
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

export default EditorVerticalAlignSelect;
