import styled from "styled-components";
import theme from "../theme";

export const StyledButtons = styled.div`
  .primary {
    background-color: ${theme.colors.primaryGreen};
  }

  .primary:hover {
    background-color: ${theme.colors.primaryGreenHover};
  }
`
