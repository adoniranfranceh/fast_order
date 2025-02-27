import styled from 'styled-components';
import theme from '../theme';

export const StyledButton = styled.button`
  background-color: ${props => props.primary ? theme.colors.primary : theme.colors.secondary};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px 0 0 30px;
  width: ${props => props.width ? props.width : '13em'};

  &:hover {
    background-color: ${props => props.primary ? theme.colors.primaryHover : theme.colors.secondaryHover};
  }

  &:disabled {
    background-color: ${theme.colors.disabled};
    color: ${theme.colors.disabledText};
    cursor: not-allowed;
  }
`;
