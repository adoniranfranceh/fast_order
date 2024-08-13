// src/components/style.js
import styled from 'styled-components';
import { AppBar as MuiAppBar, Toolbar as MuiToolbar, Button as MuiButton, Drawer as MuiDrawer, IconButton as MuiIconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '../theme';

export const StyledAppBar = styled(MuiAppBar)`
  background-color: ${theme.colors.primary} !important;
`;

export const StyledToolbar = styled(MuiToolbar)`
  display: flex;
  justify-content: space-between;
`;

export const StyledButton = styled(MuiButton)`
  color: ${theme.colors.white} !important;
  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

export const StyledIconButton = styled(MuiIconButton)`
  color: ${theme.colors.text} !important;
`;

export const StyledDrawer = styled(MuiDrawer)`
  .MuiDrawer-paper {
    background-color: ${theme.colors.primary};
  }
`;

export const StyledMenuIcon = styled(MenuIcon)`
  color: ${theme.colors.text} !important;
`;
