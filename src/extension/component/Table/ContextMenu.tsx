import { ToolbarItem } from '@ctzhian/tiptap/component/Toolbar';
import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Stack
} from '@mui/material';
import { Editor } from '@tiptap/core';
import React from 'react';
import {
  BoldIcon,
  DeleteColumnIcon,
  DeleteLineIcon,
  DeleteRowIcon,
  InsertColumnLeftIcon,
  InsertColumnRightIcon,
  InsertRowBottomIcon,
  InsertRowTopIcon,
  ItalicIcon,
  LayoutLeft2LineIcon,
  LayoutTop2LineIcon,
  MergeCellsHorizontalIcon,
  SplitCellsHorizontalIcon,
  StrikethroughIcon,
  UnderlineIcon
} from '../../../component/Icons';

interface TableContextMenuProps {
  editor: Editor;
  onClose: () => void;
  onCommandExecute?: () => void;
  hasMultipleSelection: boolean;
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({
  editor,
  onClose,
  hasMultipleSelection,
  onCommandExecute
}) => {

  const handleCommand = (command: () => void) => {
    command();
    onCommandExecute?.();
    onClose();
  };

  const menuItems = [
    {
      label: '在左侧插入列',
      icon: <InsertColumnLeftIcon sx={{ fontSize: '1rem' }} />,
      action: () => handleCommand(() => editor.chain().focus().addColumnBefore().run()),
      show: true
    },
    {
      label: '在右侧插入列',
      icon: <InsertColumnRightIcon sx={{ fontSize: '1rem' }} />,
      action: () => handleCommand(() => editor.chain().focus().addColumnAfter().run()),
      show: true
    },
    {
      label: '在上方插入行',
      icon: <InsertRowTopIcon sx={{ fontSize: '1rem' }} />,
      action: () => handleCommand(() => editor.chain().focus().addRowBefore().run()),
      show: true
    },
    {
      label: '在下方插入行',
      icon: <InsertRowBottomIcon sx={{ fontSize: '1rem' }} />,
      action: () => handleCommand(() => editor.chain().focus().addRowAfter().run()),
      show: true
    },
    {
      label: '合并单元格',
      icon: <MergeCellsHorizontalIcon sx={{ fontSize: '1rem' }} />,
      action: () => handleCommand(() => editor.chain().focus().mergeCells().run()),
      show: hasMultipleSelection
    },
    {
      label: '拆分单元格',
      icon: <SplitCellsHorizontalIcon sx={{ fontSize: '1rem' }} />,
      action: () => handleCommand(() => editor.chain().focus().splitCell().run()),
      show: true
    },
    {
      label: '切换表头行',
      icon: <LayoutTop2LineIcon sx={{ fontSize: '1rem' }} />,
      action: () => handleCommand(() => editor.chain().focus().toggleHeaderRow().run()),
      show: true
    },
    {
      label: '切换表头列',
      icon: <LayoutLeft2LineIcon sx={{ fontSize: '1rem' }} />,
      action: () => handleCommand(() => editor.chain().focus().toggleHeaderColumn().run()),
      show: true
    },
    {
      label: '删除当前列',
      icon: <DeleteColumnIcon sx={{ fontSize: '1rem', color: 'error.main' }} />,
      action: () => handleCommand(() => editor.chain().focus().deleteColumn().run()),
      show: true
    },
    {
      label: '删除当前行',
      icon: <DeleteRowIcon sx={{ fontSize: '1rem', color: 'error.main' }} />,
      action: () => handleCommand(() => editor.chain().focus().deleteRow().run()),
      show: true
    },
    {
      label: '删除表格',
      icon: <DeleteLineIcon sx={{ fontSize: '1rem', color: 'error.main' }} />,
      action: () => handleCommand(() => editor.chain().focus().deleteTable().run()),
      show: true
    }
  ];

  return (
    <>
      <Stack direction={'row'} alignItems={'center'} sx={{ p: 0.5 }}>
        <ToolbarItem
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<BoldIcon sx={{ fontSize: '1rem' }} />}
        />
        <ToolbarItem
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<ItalicIcon sx={{ fontSize: '1rem' }} />}
        />
        <ToolbarItem
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<StrikethroughIcon sx={{ fontSize: '1rem' }} />}
        />
        <ToolbarItem
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={<UnderlineIcon sx={{ fontSize: '1rem' }} />}
        />
      </Stack>
      <Divider />
      <MenuList sx={{ p: 0.5 }}>
        {menuItems.map((item, index) => (
          item.show ? <MenuItem
            key={index}
            onClick={item.action}
            sx={{
              py: 1,
              px: 2,
              fontSize: '0.875rem',
              borderRadius: 'var(--mui-shape-borderRadius)',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              {item.icon}
              <Box>{item.label}</Box>
            </Stack>
          </MenuItem> : null
        ))}
      </MenuList>
    </>
  );
};

export default TableContextMenu;