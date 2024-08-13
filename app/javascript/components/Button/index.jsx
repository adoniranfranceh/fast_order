import React from "react"
import { StyledButton } from "./style"

const Button = ({ children, primary, onClick, disabled }) => {
  return (
    <StyledButton primary={primary} onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export default Button
