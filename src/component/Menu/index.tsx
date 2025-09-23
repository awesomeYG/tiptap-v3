import { MenuItem, MenuProps } from '@ctzhian/tiptap/type';
import {
  Box,
  Popover
} from '@mui/material';
import React from 'react';
import NestedList from './NestedList';

const Menu: React.FC<MenuProps> = ({
  id = 'menu-select',
  width = 160,
  arrowIcon,
  list,
  header = null,
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (context?.props?.onClick) {
      context.props.onClick(event);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item: MenuItem) => {
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
      <Box sx={{ p: 0.5 }}>
        <Box onClick={handleClose}>
          {header}
        </Box>
        <NestedList
          width={width}
          list={list}
          arrowIcon={arrowIcon}
          childrenProps={childrenProps}
          onItemClick={handleItemClick}
        />
      </Box>
    </Popover>
  </>
};

export default Menu;