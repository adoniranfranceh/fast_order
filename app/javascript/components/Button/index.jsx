import React from "react"
import { StyledButton } from "./style"

const Button = ({ children, primary, onClick, disabled, type }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled} type={type} >
      {children}
    </StyledButton>
  );
};

export default Button
