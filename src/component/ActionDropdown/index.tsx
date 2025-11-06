import { ToolbarItem } from '@ctzhian/tiptap/component/Toolbar';
import { MenuItem } from '@ctzhian/tiptap/type';
import {
  Box,
  Popover,
  PopoverOrigin,
  Stack
} from '@mui/material';
import React from 'react';
import { ArrowDownSLineIcon } from '../Icons';

export interface ActionDropdownProps {
  /** 菜单列表 */
  list: MenuItem[];
  /** 当前选中项的 key */
  selected: string | number;
  /** 触发器提示 */
  tip?: string;
  /** Popover ID */
  id?: string;
  /** 菜单宽度 */
  width?: number;
  /** 菜单最小宽度 */
  minWidth?: number;
  /** 右侧箭头图标 */
  arrowIcon?: React.ReactNode;
  /** Popover 锚点位置 */
  anchorOrigin?: PopoverOrigin;
  /** Popover 变换位置 */
  transformOrigin?: PopoverOrigin;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  list,
  selected,
  tip,
  id = 'action-dropdown',
  width,
  minWidth = 160,
  arrowIcon,
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin = {
    vertical: 'top',
    horizontal: 'left',
  },
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  // 根据 selected 找到当前选中的项
  const selectedItem = React.useMemo(() => {
    return list.find(item => item.key === selected);
  }, [list, selected]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (event: React.MouseEvent<HTMLDivElement>, item: MenuItem) => {
    event.preventDefault();
    event.stopPropagation();

    // 立即执行回调
    if (item.onClick) {
      item.onClick();
    }

    // 然后关闭菜单
    handleClose();
  };

  const open = Boolean(anchorEl);
  const curId = open ? id : undefined;

  return (
    <>
      <ToolbarItem
        icon={selectedItem?.icon}
        text={
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Box component="span">{selectedItem?.label}</Box>
            <ArrowDownSLineIcon
              sx={{
                fontSize: 16,
                transition: 'transform 0.2s ease-in-out',
                transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
              }}
            />
          </Stack>
        }
        tip={tip}
        onClick={handleClick}
        aria-describedby={curId}
      />
      <Popover
        id={curId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        disableScrollLock
        disableAutoFocus
        disableEnforceFocus
        slotProps={{
          root: {
            slotProps: {
              backdrop: {
                invisible: true,
              },
            },
          },
        }}
      >
        <Box
          sx={{
            p: 0.5,
            minWidth,
            lineHeight: 1.625,
            ...(width ? { width } : {}),
          }}
        >
          {list.map((item) =>
            item.customLabel ? (
              <Box key={item.key}>{item.customLabel}</Box>
            ) : (
              <Box
                key={item.key}
                onMouseDown={(e) => handleItemClick(e, item)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  fontSize: 14,
                  p: 1,
                  userSelect: 'none',
                  ':hover': {
                    bgcolor: 'action.hover',
                  },
                  ...(item.key === selected
                    ? {
                      color: 'primary.main',
                      bgcolor: 'action.selected',
                    }
                    : {}),
                }}
              >
                <Stack alignItems="center" gap={1.5} direction="row">
                  {item.icon}
                  <Box sx={{ flexGrow: 1, ...item.textSx }}>{item.label}</Box>
                  {item.extra}
                  {item.children?.length ? arrowIcon : null}
                </Stack>
              </Box>
            )
          )}
        </Box>
      </Popover>
    </>
  );
};

export default ActionDropdown;