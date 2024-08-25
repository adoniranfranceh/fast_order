import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledAppBar, StyledToolbar, StyledButton, StyledIconButton, StyledDrawer, StyledMenuIcon } from './style';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

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

  const navigate = useNavigate()

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={() => navigate('/')}>
          Meu Projeto
        </Typography>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1rem' }}>
          <StyledButton  onClick={() => navigate('/pedidos')}>
            Pedidos
          </StyledButton>
          <StyledButton onClick={() => navigate('/clientes')}>
            Clientes
          </StyledButton>
          <StyledButton>Promoções</StyledButton>
          <StyledButton>Relatórios</StyledButton>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <StyledIconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <StyledMenuIcon />
          </StyledIconButton>
          <StyledDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </StyledDrawer>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default MyNavbar;
