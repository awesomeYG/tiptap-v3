import { Box, MenuItem, Select, Stack } from "@mui/material";
import { MoreLineIcon, Notification3LineIcon } from "@yu-cq/tiptap/component/Icons";
import ToolbarItem from "@yu-cq/tiptap/component/Toolbar/Item";
import { ToolbarItemType } from "@yu-cq/tiptap/type";
import React, { useState } from "react";
import NotificationDialog from "./NotificationDialog";

export interface EditorMoreProps {
  more?: ToolbarItemType[]
}

const EditorMore = ({ more = [] }: EditorMoreProps) => {
  const [showDialog, setShowDialog] = useState('');

  const options = [
    { id: 'notification', icon: <Notification3LineIcon sx={{ fontSize: '1rem' }} />, label: '查看快捷键' },
  ];

  const handleChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    if (value === 'notification') {
      setShowDialog('notification');
    } else {
      more.find(it => it.id === value)?.onClick?.();
    }
  };

  return <>
    <Select
      value={'none'}
      onChange={handleChange}
      renderValue={() => {
        return <ToolbarItem
          tip={'更多'}
          icon={<Stack direction={'row'} alignItems={'center'} justifyContent='center' sx={{ mr: 0.5 }}>
            <MoreLineIcon sx={{ fontSize: '1rem' }} />
          </Stack>}
        />;
      }}
      IconComponent={() => null}
    >
      <MenuItem key={'none'} value={'none'} sx={{ display: 'none' }}>
        <MoreLineIcon sx={{ fontSize: '1rem' }} />
        <Box sx={{ ml: 1 }}>无</Box>
      </MenuItem>
      {[...more, ...options].map(it => (
        <MenuItem key={it.id} value={it.id}>
          <Stack direction={'row'} alignItems={'center'} justifyContent='center' gap={1}>
            {it.icon}
            <Box sx={{ fontSize: '0.875rem' }}>{it.label}</Box>
          </Stack>
        </MenuItem>
      ))}
    </Select>
    <NotificationDialog open={showDialog === 'notification'} onClose={() => setShowDialog('')} />
  </>
}

export default EditorMore