import { MenuItem } from '@ctzhian/tiptap/type';
import { Box, Popover, PopoverOrigin, Stack } from '@mui/material';
import React from 'react';

export interface NestedMenuListProps {
  list: MenuItem[];
  width?: number;
  arrowIcon?: React.ReactNode;
  childrenProps?: {
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
  };
  onItemClick?: (item: MenuItem) => void;
}

const NestedList: React.FC<NestedMenuListProps> = ({
  list,
  width,
  arrowIcon,
  childrenProps = {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    transformOrigin: {
      vertical: 4,
      horizontal: 'left',
    }
  },
  onItemClick,
}) => {
  const [hoveredItem, setHoveredItem] = React.useState<MenuItem | null>(null);
  const [subMenuAnchor, setSubMenuAnchor] = React.useState<HTMLElement | null>(null);

  const handleItemHover = (event: React.MouseEvent<HTMLElement>, item: MenuItem) => {
    if (item.children?.length) {
      setHoveredItem(item);
      setSubMenuAnchor(event.currentTarget);
    }
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
    setSubMenuAnchor(null);
  };

  const handleItemClickInternal = (item: MenuItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <Box className="menu-select-list" sx={{ minWidth: 160, lineHeight: 1.625, ...(width ? { width } : {}) }}>
      {list.map(item => item.customLabel ? (
        <Box key={item.key}>
          {item.customLabel}
        </Box>
      ) : (
        <Box
          key={item.key}
          className="menu-select-item"
          onMouseEnter={(e) => handleItemHover(e, item)}
          onMouseLeave={handleItemLeave}
          onClick={() => handleItemClickInternal(item)}
          sx={{
            position: 'relative',
            cursor: 'pointer',
            borderRadius: 1,
            fontSize: 14,
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
            <Box sx={{ flexGrow: 1, ...item.textSx }}>{item.label}</Box>
            {item.extra}
            {item.children?.length ? arrowIcon : null}
          </Stack>
          {hoveredItem === item && item.children && (
            <Popover
              open={Boolean(subMenuAnchor)}
              anchorEl={subMenuAnchor}
              onClose={handleItemLeave}
              sx={{ pointerEvents: 'none' }}
              disableScrollLock
              disableAutoFocus
              disableEnforceFocus
              disableRestoreFocus
              {...childrenProps}
            >
              <Box className="menu-select-sub-list" sx={{
                pointerEvents: 'auto',
                p: 0.5,
                minWidth: 160,
                maxHeight: 360,
                overflow: 'auto',
                ...(item.width ? { width: item.width } : {}),
                ...(item.minWidth ? { minWidth: item.minWidth } : {}),
                ...(item.maxHeight ? { maxHeight: item.maxHeight } : {}),
              }}>
                {item.children.map(child => child.customLabel ? (
                  <Box key={child.key}>
                    {child.customLabel}
                  </Box>
                ) : (
                  <Box
                    key={child.key}
                    className="menu-select-sub-item"
                    onClick={() => handleItemClickInternal(child)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
                      fontSize: 14,
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
                      <Box sx={{ flexGrow: 1, ...child.textSx }}>
                        {child.label}
                      </Box>
                      {child.extra}
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Popover>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default NestedList;


