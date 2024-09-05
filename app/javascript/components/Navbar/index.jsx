import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledAppBar, StyledToolbar, StyledButton, StyledIconButton, StyledDrawer, StyledMenuIcon } from './style';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { AuthContext } from '../../context/AuthContext';
import theme from '../theme';

const MyNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250}}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List sx={{color: `${theme.colors.white}`}}>
        <ListItem button>
          <ListItemText onClick={() => navigate('/')} primary="Pedidos" />
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
              <ListItemText onClick={() => navigate('/colaboradores')} primary="Colaboradores" />
            </ListItem>
            <ListItem button>
              <ListItemText onClick={() => navigate('/colaboradores')} primary="Relatórios" />
            </ListItem>
          </>
        ) }
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
          <StyledButton  onClick={() => navigate('/')}>
            Home
          </StyledButton>
          <StyledButton  onClick={() => navigate('/pedidos')}>
            Pedidos
          </StyledButton>
          <StyledButton onClick={() => navigate('/clientes')}>
            Clientes
          </StyledButton>
          {currentUser && currentUser.role === 'admin' && (
            <>
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
            <StyledMenuIcon  color={theme.colors.white}/>
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
