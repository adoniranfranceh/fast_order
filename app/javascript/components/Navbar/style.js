import styled from 'styled-components';
import {
  AppBar as MuiAppBar,
  Toolbar as MuiToolbar,
  Button as MuiButton,
  Drawer as MuiDrawer,
  IconButton as MuiIconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '../theme';

export const StyledAppBar = styled(MuiAppBar)`
  background-color: ${theme.colors.primary} !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1201;
`;

export const StyledToolbar = styled(MuiToolbar)`
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
`;

export const StyledButton = styled(MuiButton)`
  color: ${theme.colors.white} !important;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: ${theme.borderRadius};
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${theme.colors.secondary} !important;
    transform: translateY(-2px);
  }
`;

export const StyledIconButton = styled(MuiIconButton)`
  color: ${theme.colors.text} !important;
  transition: color 0.3s ease, transform 0.2s ease;

  &:hover {
    color: ${theme.colors.secondaryHover} !important;
    transform: rotate(20deg);
  }
`;

export const StyledDrawer = styled(MuiDrawer)`
  .MuiDrawer-paper {
    background-color: ${theme.colors.primary};
    padding: 16px;
    width: 240px;
  }
`;

export const StyledMenuIcon = styled(MenuIcon)`
  color: ${theme.colors.white} !important;
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.secondary} !important;
  }
`;
