import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import { getShortcutKeyText } from "@yu-cq/tiptap/util";
import React, { useEffect, useState } from "react";
import { ArrowDownSLineIcon, AttachmentLineIcon, ImageLineIcon, MovieLineIcon, Music2LineIcon, UploadIcon } from "../../Icons";
import ToolbarItem from "../Item";

interface EditorInsertProps {
  editor: Editor;
}

const EditorInsert = ({ editor }: EditorInsertProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const InsertOptions = [
    { id: 'image', icon: <ImageLineIcon sx={{ fontSize: '1rem' }} />, label: '图片', shortcutKey: ['ctrl', '2'] },
    { id: 'video', icon: <MovieLineIcon sx={{ fontSize: '1rem' }} />, label: '视频', shortcutKey: ['ctrl', '3'] },
    { id: 'audio', icon: <Music2LineIcon sx={{ fontSize: '1rem' }} />, label: '音频', shortcutKey: ['ctrl', '4'] },
    { id: 'attachment', icon: <AttachmentLineIcon sx={{ fontSize: '1rem' }} />, label: '附件', shortcutKey: ['ctrl', '5'] },
  ];

  const updateSelection = () => {
    if (editor.isActive('image')) {
      setSelectedValue('image');
    } else if (editor.isActive('video')) {
      setSelectedValue('video');
    } else if (editor.isActive('audio')) {
      setSelectedValue('audio');
    } else if (editor.isActive('inlineAttachment') || editor.isActive('blockAttachment')) {
      setSelectedValue('attachment');
    } else {
      setSelectedValue('none');
    }
  };

  const handleChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    if (value === 'image') {
      editor.commands.setImage({ src: '', width: 760 });
    } else if (value === 'video') {
      editor.commands.setVideo({ src: '', width: 760, controls: true, autoplay: false });
    } else if (value === 'audio') {
      editor.commands.setAudio({ src: '', controls: true, autoplay: false });
    } else if (value === 'attachment') {
      editor.commands.setInlineAttachment({ url: '', title: '', size: '0' });
    }
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
    className={['image', 'video', 'audio', 'attachment'].includes(selectedValue) ? "tool-active" : ""}
    onChange={handleChange}
    renderValue={(value) => {
      return <ToolbarItem
        tip={'插入'}
        icon={<Stack direction={'row'} alignItems={'center'} sx={{ mr: 0.5, width: '1.5rem' }}>
          {InsertOptions.find(it => it.id === value)?.icon || <UploadIcon sx={{ fontSize: '1rem' }} />}
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
      <UploadIcon sx={{ fontSize: '1rem' }} />
      <Box sx={{ ml: 1 }}>无</Box>
    </MenuItem>
    {InsertOptions.map(it => (
      <MenuItem key={it.id} value={it.id}>
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

export default EditorInsert;