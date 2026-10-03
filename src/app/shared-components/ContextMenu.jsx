import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const ContextMenu = ({ items }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMenuOpen = (e) => {
    if (!menuOpen) {
      e.preventDefault();
      setMenuOpen(true);
      setPosition({ top: e.clientY, left: e.clientX });
    }
  };

  window.oncontextmenu = (e) => {
    if (menuOpen) {
      e.preventDefault();
    }
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <Box className="w-full h-full absolute top-0 right-0" onContextMenu={handleMenuOpen}>
      <Menu
        open={menuOpen}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={position}
        closeAfterTransition
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={async (e) => {
              e.stopPropagation();
              await item.action();
              handleMenuClose();
            }}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            {item.label && <ListItemText>{item.label}</ListItemText>}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ContextMenu;
