import {
  Box,
  Popover,
  PopoverOrigin,
  Stack,
  SxProps,
  Theme,
  Typography
} from '@mui/material';
import React from 'react';

interface Item {
  label?: React.ReactNode;
  customLabel?: React.ReactNode;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  selected?: boolean;
  children?: Item[];
  textSx?: SxProps<Theme>;
  key: number | string;
  minWidth?: number;
  maxHeight?: number;
  onClick?: () => void;
}

interface MenuProps {
  id?: string;
  arrowIcon?: React.ReactNode;
  list: Item[];
  context?: React.ReactElement<{ onClick?: any; 'aria-describedby'?: any }>;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  childrenProps?: {
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
  };
}

const Menu: React.FC<MenuProps> = ({
  id = 'menu-select',
  arrowIcon,
  list,
  context,
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
  },
  transformOrigin = {
    vertical: 'top',
    horizontal: 'right',
  },
  childrenProps = {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    }
  }
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [hoveredItem, setHoveredItem] = React.useState<Item | null>(null);
  const [subMenuAnchor, setSubMenuAnchor] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (context?.props?.onClick) {
      context.props.onClick(event);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoveredItem(null);
    setSubMenuAnchor(null);
  };

  const handleItemHover = (event: React.MouseEvent<HTMLElement>, item: Item) => {
    if (item.children?.length) {
      setHoveredItem(item);
      setSubMenuAnchor(event.currentTarget);
    }
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
    setSubMenuAnchor(null);
  };

  const handleItemClick = (item: Item) => {
    if (item.onClick) {
      item.onClick();
    }
    handleClose();
  };

  const open = Boolean(anchorEl);
  const curId = open ? id : undefined;
  return <>
    {context && React.cloneElement(context, { onClick: handleClick, 'aria-describedby': curId })}
    <Popover
      id={curId}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <Box className="menu-select-list" sx={{ p: 0.5, minWidth: 160, lineHeight: '1.5rem' }}>
        {list.map(item => item.customLabel ? <Box key={item.key}>
          {item.customLabel}
        </Box> : <Box
          key={item.key}
          className="menu-select-item"
          onMouseEnter={(e) => handleItemHover(e, item)}
          onMouseLeave={handleItemLeave}
          onClick={() => handleItemClick(item)}
          sx={{
            position: 'relative',
            cursor: 'pointer',
            borderRadius: 1,
            p: 1,
            ':hover': {
              bgcolor: 'action.hover',
            },
            ...(item.selected ? {
              color: 'primary.main',
              bgcolor: 'action.selected',
            } : {}),
          }}
        >
          <Stack alignItems="center" gap={1.5} direction="row">
            {item.icon}
            <Typography sx={{ flexGrow: 1, ...item.textSx }}>{item.label}</Typography>
            {item.extra}
            {item.children?.length ? arrowIcon : null}
          </Stack>
          {hoveredItem === item && item.children && <Popover
            open={Boolean(subMenuAnchor)}
            anchorEl={subMenuAnchor}
            onClose={handleItemLeave}
            sx={{ pointerEvents: 'none' }}
            {...childrenProps}
          >
            <Box className="menu-select-sub-list" sx={{
              pointerEvents: 'auto',
              p: 0.5,
              minWidth: 160,
              maxHeight: 360,
              overflow: 'auto',
              ...(item.minWidth ? { minWidth: item.minWidth } : {}),
              ...(item.maxHeight ? { maxHeight: item.maxHeight } : {}),
            }}>
              {item.children.map(child => child.customLabel ? <Box key={child.key}>
                {child.customLabel}
              </Box> : <Box
                key={child.key}
                className="menu-select-sub-item"
                onClick={() => handleItemClick(child)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  p: 1,
                  ':hover': {
                    bgcolor: 'action.hover',
                  },
                  ...(child.selected ? {
                    color: 'primary.main',
                    bgcolor: 'action.selected',
                  } : {}),
                }}
              >
                <Stack alignItems="center" gap={1.5} direction="row">
                  {child.icon}
                  <Typography sx={{ flexGrow: 1, ...child.textSx }}>
                    {child.label}
                  </Typography>
                  {child.extra}
                </Stack>
              </Box>)}
            </Box>
          </Popover>}
        </Box>)}
      </Box>
    </Popover>
  </>
};

export default Menu;