import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Button } from '../index.js';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const AdditionalFields = ({ additionalFields, onChange }) => {
  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...additionalFields];
    updatedFields[index][field] = value;
    onChange(updatedFields);
  };

  const handleAddField = () => {
    onChange([...additionalFields, { id: '', additional: '', additional_value: '' }]);
  };

  const handleRemoveField = (id) => {
    const updatedFields = additionalFields.map(field =>
      field.id === id ? { ...field, _destroy: true } : field
    );
    onChange(updatedFields);
  };

  const visibleAdditionals = additionalFields.filter(additional => !additional._destroy);

  return (
    <Box>
      {visibleAdditionals.map((field, index) => (
        <Box key={field.id || index} display="flex" alignItems="center" mb={1}>
          <TextField
            label="Adicional"
            value={field.additional}
            onChange={(e) => handleFieldChange(index, 'additional', e.target.value)}
            fullWidth
          />
          <TextField
            label="Valor"
            type="number"
            value={field.additional_value}
            onChange={(e) => handleFieldChange(index, 'additional_value', e.target.value)}
            fullWidth
            sx={{ ml: 2 }}
          />
          <IconButton onClick={() => handleRemoveField(field.id)} color="error" sx={{ ml: 2 }}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}

      <Button onClick={handleAddField} type="button" startIcon={<AddIcon />}>
        Adicionar Adicional
      </Button>
    </Box>
  );
};

export default AdditionalFields;
