import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';

const PlusInput = ({ label, value, onChange, onAdd, icon = <AddCircleIcon />, ...props }) => (
  <Box display="flex" alignItems="center">
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      margin="normal"
      value={value}
      onChange={onChange}
      {...props}
    />
    <IconButton onClick={onAdd} color="primary" style={{ marginLeft: '1rem' }}>
      {icon}
    </IconButton>
  </Box>
);

export default PlusInput;
