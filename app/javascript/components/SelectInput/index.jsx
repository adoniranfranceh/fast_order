import React from 'react';
import { InputLabel, Select, MenuItem } from '@mui/material';

const SelectInput = ({ label, value, onChange, options, ...props }) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Select
      fullWidth
      value={value}
      onChange={onChange}
      displayEmpty
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </>
);

export default SelectInput;
