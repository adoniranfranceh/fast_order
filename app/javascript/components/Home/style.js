import styled from "styled-components";
import theme from '../theme';

export const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.medium};
  background-color: ${theme.colors.white};
  font-family: ${theme.fonts.primary};
`;

export const StyledGreeting = styled.h1`
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small};
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeIn 1s ease-out 0.5s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledButtonContainer = styled.div`
  margin-top: ${theme.spacing.medium};
  
  Button {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    &:hover {
      background-color: ${theme.colors.primaryHover};
    }
  }
`;
