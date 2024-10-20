import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledAppBar, StyledToolbar, StyledButton, StyledIconButton, StyledDrawer, StyledMenuIcon } from './style';
import { 
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  Menu,
  MenuItem 
} from '@mui/material';

import { AuthContext } from '../../context/AuthContext';
import theme from '../theme';

const MyNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate(`/perfil/${currentUser.id}`);
    handleMenuClose();
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List sx={{ color: `${theme.colors.white}` }}>
        <ListItem button>
          <ListItemText onClick={() => navigate('/')} primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemText onClick={() => navigate('/pedidos')} primary="Pedidos" />
        </ListItem>
        <ListItem button>
          <ListItemText onClick={() => navigate('/clientes')} primary="Clientes" />
        </ListItem>
        {currentUser && currentUser.role === 'admin' && (
          <>
            <ListItem button>
              <ListItemText onClick={() => navigate('/produtos')} primary="Produtos" />
            </ListItem>
            <ListItem button>
              <ListItemText onClick={() => navigate('/colaboradores')} primary="Colaboradores" />
            </ListItem>
            <ListItem button>
              <ListItemText onClick={() => navigate('/dashboard')} primary="Dashboard" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={() => navigate('/')}
        >
          Ponto do Açaí
        </Typography>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1rem' }}>
          <StyledButton onClick={() => navigate('/')}>
            Home
          </StyledButton>
          <StyledButton onClick={() => navigate('/pedidos')}>
            Pedidos
          </StyledButton>
          <StyledButton onClick={() => navigate('/clientes')}>
            Clientes
          </StyledButton>
          {currentUser && currentUser.role === 'admin' && (
            <>
            <StyledButton onClick={() => navigate('/produtos')}>
                Produtos
              </StyledButton>
              <StyledButton onClick={() => navigate('/colaboradores')}>
                Colaboradores
              </StyledButton>
              <StyledButton onClick={() => navigate('/dashboard')}>
                Dashboard
              </StyledButton>
            </>
          )}
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <StyledIconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <StyledMenuIcon color={theme.colors.white} />
          </StyledIconButton>
          <StyledDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </StyledDrawer>
        </Box>

        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={currentUser?.profile?.photo_url}
              alt="User Avatar"
              sx={{ cursor: 'pointer' }}
              onClick={handleMenuOpen}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfileClick}>Meu Perfil</MenuItem>
            </Menu>
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default MyNavbar;
