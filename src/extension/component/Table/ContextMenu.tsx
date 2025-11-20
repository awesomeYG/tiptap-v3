import {
  Box,
  MenuItem,
  MenuList,
  Stack
} from '@mui/material';
import { Editor } from '@tiptap/core';
import React from 'react';
import {
  DeleteLineIcon,
  MergeCellsHorizontalIcon,
  SplitCellsHorizontalIcon
} from '../../../component/Icons';

interface TableContextMenuProps {
  editor: Editor;
  onClose: () => void;
  onCommandExecute?: () => void;
  hasMultipleSelection: boolean;
  hasMultipleCellElements: boolean;
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({
  editor,
  onClose,
  hasMultipleSelection,
  hasMultipleCellElements,
  onCommandExecute
}) => {

  const handleCommand = (command: () => void) => {
    command();
    onCommandExecute?.();
    onClose();
  };

  const menuItems = [
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
      show: !hasMultipleSelection && hasMultipleCellElements
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