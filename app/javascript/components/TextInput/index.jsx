import React from 'react';
import { TextField } from '@mui/material';

const TextInput = ({ label, value, onChange, type = 'text', ...props }) => (
  <TextField
    fullWidth
    label={label}
    variant="outlined"
    margin="normal"
    value={value}
    onChange={onChange}
    type={type}
    {...props}
  />
);

export default TextInput;
