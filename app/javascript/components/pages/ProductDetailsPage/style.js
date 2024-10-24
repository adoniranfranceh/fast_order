import styled from 'styled-components';
import theme from '../../theme';
import { Typography, Button } from '@mui/material';

export const StyledPaper = styled.div`
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
  background-color: ${theme.colors.white};
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled(Typography)`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.primary};
  margin-bottom: ${theme.spacing.medium};
`;

export const DetailsContainer = styled.div`
  width: 100%;
  margin-bottom: ${theme.spacing.large};
  background-color: ${theme.colors.lightGrey};
  padding: ${theme.spacing.medium};
  border-radius: ${theme.borderRadius};
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.small};
`;

export const Label = styled(Typography)`
  font-weight: bold;
  color: ${theme.colors.darkGrey};
`;

export const Value = styled(Typography)`
  color: ${theme.colors.accent};
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.medium};
  width: 100%;
  justify-content: space-around;
`;

export const StyledButton = styled(Button)`
  flex: 1;
  max-width: 250px;
  text-transform: none;
`;

export const ErrorMessage = styled(Typography)`
  color: ${theme.colors.error};
  text-align: center;
  margin-top: ${theme.spacing.large};
`;
