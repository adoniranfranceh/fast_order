import React from "react"
import { StyledButton } from "./style"

const Button = ({ children, primary, onClick, disabled, type, width }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled} type={type} width={width} primary={primary} >
      {children}
    </StyledButton>
  );
};

export default Button
