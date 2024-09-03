import React from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { AdditionalFields } from '../index.js';

const ItemList = ({ items = [], setItems, errors }) => {
  const handleItemChange = (index, field, value) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { id: '', name: '', price: '', additional_fields: [] }]);
  };

  const handleRemoveItem = (id) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, _destroy: true } : item
    );
    setItems(updatedItems);
  };

  const visibleItems = items.filter(item => !item._destroy);

  return (
    <Box>
      {visibleItems.map((item, index) => (
        <Box key={item.id || index} mb={2} p={2} border={1} borderRadius={2}>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Nome"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              fullWidth
            />
            <TextField
              label="Preço"
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              fullWidth
              sx={{ ml: 2 }}
            />
            <IconButton onClick={() => handleRemoveItem(item.id)} color="error" sx={{ ml: 2 }}>
              <RemoveIcon />
            </IconButton>
          </Box>
          <AdditionalFields
            additionalFields={item.additional_fields}
            onChange={(updatedFields) => handleItemChange(index, 'additional_fields', updatedFields)}
          />
        </Box>
      ))}

      {errors && <Typography color="error">{errors}</Typography>}
      <Button onClick={handleAddItem} startIcon={<AddIcon />}>
        Adicionar Item
      </Button>
    </Box>
  );
};

export default ItemList;
