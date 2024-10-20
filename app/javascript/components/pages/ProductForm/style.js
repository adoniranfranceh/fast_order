import styled from 'styled-components';
import theme from '../../theme';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 20px;
  border-radius: ${theme.borderRadius};
  background-color: ${theme.colors.background};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
`;

export const Title = styled.h2`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.primary};
  text-align: center;
  margin-bottom: 20px;
`;

export const FieldContainer = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  transition: border-color 0.3s;
  
  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

export const StyledButton = styled.button`
  padding: 10px;
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;
