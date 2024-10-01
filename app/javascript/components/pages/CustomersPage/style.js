import styled from "styled-components";
import theme from "../../theme";

export const StyledHome = styled.div`
  display: block;
`


export const StyledButton = styled.div`
  display: flex;
`

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
