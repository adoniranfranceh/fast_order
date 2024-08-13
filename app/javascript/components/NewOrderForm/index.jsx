// src/components/NewOrderForm.js
import React, { useState } from 'react';
import { TextField, MenuItem, InputLabel, Select, Box, IconButton } from '@mui/material';
import { Add as AddIcon, AddCircle as AddCircleIcon } from '@mui/icons-material';
import { InputFormatMoney, Button } from '../index.js'

const deliveryTypes = [
  { value: 'local', label: 'Local' },
  { value: 'retirada', label: 'Retirada' },
  { value: 'delivery', label: 'Delivery' }
];

const NewOrderForm = () => {
  const [deliveryType, setDeliveryType] = useState('');
  const [items, setItems] = useState([{ id: Date.now(), name: '', additionalFields: [] }]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', additionalFields: [] }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddAdditionalField = (index) => {
    const newItems = [...items];
    newItems[index].additionalFields.push({ id: Date.now(), additional: '', additionalValue: '' });
    setItems(newItems);
  };

  const handleRemoveAdditionalField = (itemIndex, fieldIndex) => {
    const newItems = [...items];
    newItems[itemIndex].additionalFields = newItems[itemIndex].additionalFields.filter((_, i) => i !== fieldIndex);
    setItems(newItems);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        fullWidth
        label="Nome do Cliente (opcional)"
        variant="outlined"
        margin="normal"
      />
      <InputLabel id="delivery-type-label">Tipo de Entrega</InputLabel>
      <Select
        fullWidth
        labelId="delivery-type-label"
        value={deliveryType}
        onChange={(e) => setDeliveryType(e.target.value)}
        displayEmpty
        inputProps={{ 'aria-label': 'Tipo de entrega' }}
        style={{ marginBottom: '1rem' }}
      >
        {deliveryTypes.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </Select>

      {deliveryType === 'local' && (
        <TextField
          fullWidth
          label="Info da Mesa"
          variant="outlined"
          margin="normal"
        />
      )}

      {deliveryType === 'retirada' && (
        <TextField
          fullWidth
          label="Hora de Retirada (opcional)"
          type="time"
          variant="outlined"
          margin="normal"
        />
      )}

      {deliveryType === 'delivery' && (
        <>
          <TextField
            fullWidth
            label="Endereço"
            variant="outlined"
            margin="normal"
          />
        </>
      )}

      {items.map((item, itemIndex) => (
        <Box key={item.id} display="flex" flexDirection="column" mb={2}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Item"
              variant="outlined"
              margin="normal"
              value={item.name}
              onChange={(e) => handleChange(itemIndex, 'name', e.target.value)}
            />
            <IconButton
              onClick={() => handleAddAdditionalField(itemIndex)}
              color="primary"
              style={{ marginLeft: '1rem' }}
            >
              <AddCircleIcon />
            </IconButton>
            <Button
              onClick={() => handleRemoveItem(item.id)}
              variant="outlined"
              color="error"
              style={{ marginLeft: '1rem' }}
            >
              Remover
            </Button>
          </Box>

          {item.additionalFields.map((field, fieldIndex) => (
            <Box key={field.id} display="flex" alignItems="center" ml={2} mb={1}>
              <TextField
                label="Adicional"
                variant="outlined"
                margin="normal"
                value={field.additional}
                onChange={(e) => handleChange(itemIndex, 'additionalFields', item.additionalFields.map((f, i) => i === fieldIndex ? { ...f, additional: e.target.value } : f))}
                style={{ marginRight: '0.5rem' }}
              />
              <InputFormatMoney
                label="Valor do Adicional"
                value={item.additionalValue}
                onChange={(value) => handleChange(index, 'additionalValue', value)}
                style={{ marginLeft: '1rem' }}
                variant="outlined"
              />
              <Button
                onClick={() => handleRemoveAdditionalField(itemIndex, fieldIndex)}
                variant="outlined"
                color="error"
              >
                Remover
              </Button>
            </Box>
          ))}
        </Box>
      ))}

      <Button
        onClick={handleAddItem}
        startIcon={<AddIcon />}
        variant="outlined"
        color="primary"
        style={{ marginTop: '1rem' }}
      >
        Adicionar Item
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: '1rem' }}
        primary
      >
        Finalizar Pedido
      </Button>
    </Box>
  );
};

export default NewOrderForm;
