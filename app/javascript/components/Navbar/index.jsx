import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

const MyNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button>
          <ListItemText primary="Pedidos" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Clientes" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Promoções" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Relatórios" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Meu Projeto
        </Typography>
        
        {/* Menu para Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1rem' }}>
          <Button color="inherit">Pedidos</Button>
          <Button color="inherit">Clientes</Button>
          <Button color="inherit">Promoções</Button>
          <Button color="inherit">Relatórios</Button>
        </Box>

        {/* Menu Responsivo (Mobile) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MyNavbar;
