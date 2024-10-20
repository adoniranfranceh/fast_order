import React, { useEffect, useState } from 'react';
import { Box, TextField, IconButton, Autocomplete } from '@mui/material';
import { Button } from '../index.js';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import fetchProducts from '../services/fetchProducts.js';

const AdditionalFields = ({ additionalFields = [], onChange, maxAdditionals = 2 }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts('Adicional');
        setProducts(fetchedProducts.products);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    loadProducts();
  }, []);

  const handleFieldChange = (index, field, value) => {
    console.log(maxAdditionals)
    const updatedFields = [...additionalFields];
    updatedFields[index][field] = value;
    onChange(updatedFields);
  };

  const handleAddField = () => {
    const newField = { id: '', additional: '', additional_value: '' };
    onChange([...additionalFields, newField]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = additionalFields.filter((_, i) => i !== index);
    onChange(updatedFields);
  };

  const visibleAdditionals = additionalFields.filter(additional => !additional._destroy);

  return (
    <Box>
      {visibleAdditionals.map((field, index) => (
        <Box key={field.id || index} display="flex" alignItems="center" mb={1}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name || ''}
            value={products.find((product) => product.name === field.additional) || null}
            onChange={(event, newValue) => {
              handleFieldChange(index, 'additional', newValue?.name || '');

              if (newValue && additionalFields.length > maxAdditionals) {
                handleFieldChange(index, 'additional_value', newValue.base_price || '');
              } else {
                handleFieldChange(index, 'additional_value', '');
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Adicional" fullWidth />
            )}
            sx={{
              flex: 2,
              mr: { xs: 2, sm: 0 },
              mb: { xs: 2, sm: 0 },
            }}
          />
          <TextField
            label="Valor"
            type="number"
            value={field.additional_value}
            onChange={(e) => handleFieldChange(index, 'additional_value', e.target.value)}
            fullWidth
            sx={{
              ml: 2,
              width: { xs: '30%', sm: '24%' },
              mb: { xs: 2, sm: 0 }
            }}
          />
          <IconButton onClick={() => handleRemoveField(index)} color="error" sx={{ ml: 2, margin: '0', height: '40px' }}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}

      <Button width='8em' onClick={handleAddField} type="button" startIcon={<AddIcon />}>
        + Adicional
      </Button>
    </Box>
  );
};

export default AdditionalFields;
