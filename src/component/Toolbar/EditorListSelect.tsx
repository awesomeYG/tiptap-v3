import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import { getShortcutKeyText } from "@yu-cq/tiptap/util/shortcutKey";
import React, { useEffect, useState } from "react";
import { ArrowDownSLineIcon, ListCheck3Icon, ListOrdered2Icon, ListUnorderedIcon } from "../Icons";
import ToolItem from "./Item";

interface EditorListSelectProps {
  editor: Editor;
}

const EditorListSelect = ({ editor }: EditorListSelectProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const ListOptions = [
    { id: 'orderedList', icon: <ListOrdered2Icon sx={{ fontSize: '1rem' }} />, label: '有序列表', shortcutKey: ['ctrl', 'shift', '7'] },
    { id: 'bulletList', icon: <ListUnorderedIcon sx={{ fontSize: '1rem' }} />, label: '无序列表', shortcutKey: ['ctrl', 'shift', '8'] },
    { id: 'taskList', icon: <ListCheck3Icon sx={{ fontSize: '1rem' }} />, label: '待办列表', shortcutKey: ['ctrl', 'shift', '9'] },
  ];

  const updateSelection = () => {
    if (editor.isActive('orderedList')) {
      setSelectedValue('orderedList');
    } else if (editor.isActive('bulletList')) {
      setSelectedValue('bulletList');
    } else if (editor.isActive('taskList')) {
      setSelectedValue('taskList');
    } else {
      setSelectedValue('none');
    }
  };

  const handleListAction = (listType: string) => {
    if (listType === 'orderedList') {
      editor.chain().focus().toggleOrderedList().run();
    } else if (listType === 'taskList') {
      editor.chain().focus().toggleTaskList().run();
    } else if (listType === 'bulletList') {
      editor.chain().focus().toggleBulletList().run();
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
    className={['orderedList', 'taskList', 'bulletList'].includes(selectedValue) ? "tool-active" : ""}
    onChange={handleChange}
    renderValue={(value) => {
      return <ToolItem
        tip={'列表'}
        icon={<Stack direction={'row'} alignItems={'center'} sx={{ mr: 0.5, width: '1.5rem' }}>
          {ListOptions.find(it => it.id === value)?.icon || <ListUnorderedIcon sx={{ fontSize: '1rem' }} />}
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
      <ListUnorderedIcon sx={{ fontSize: '1rem' }} />
      <Box sx={{ ml: 1 }}>无</Box>
    </MenuItem>
    {ListOptions.map(it => (
      <MenuItem
        key={it.id}
        value={it.id}
        onClick={(e) => {
          e.stopPropagation();
          handleListAction(it.id);
        }}
      >
        <Tooltip arrow title={getShortcutKeyText(it.shortcutKey)} placement="right">
          <Stack direction={'row'} alignItems={'center'} justifyContent='center' gap={1}>
            {it.icon}
            <Box sx={{ fontSize: '0.875rem' }}>{it.label}</Box>
          </Stack>
        </Tooltip>
      </MenuItem>
    ))}
  </Select>
}

export default EditorListSelect;