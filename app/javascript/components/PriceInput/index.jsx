import React from 'react';
import { TextField } from '@mui/material';

const PriceInput = ({ label, value, onChange, ...props }) => (
  <TextField
    fullWidth
    label={label}
    variant="outlined"
    margin="normal"
    value={value}
    onChange={onChange}
    type="number"
    {...props}
  />
);

export default PriceInput;
