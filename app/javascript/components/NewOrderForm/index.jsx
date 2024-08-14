// src/components/NewOrderForm.js
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { SelectInput, PriceInput, PlusInput, TextInput } from '../index.js';
import { createOrder } from '../services/post.js';

const deliveryTypes = [
  { value: 'local', label: 'Local' },
  { value: 'retirada', label: 'Retirada' },
  { value: 'delivery', label: 'Delivery' }
];

const NewOrderForm = () => {
  const [deliveryType, setDeliveryType] = useState('');
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([{ id: Date.now(), name: '', additionalFields: [] }]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', additionalFields: [] }]);
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleAddAdditionalField = (index) => {
    const updatedItems = [...items];
    updatedItems[index].additionalFields.push({ id: Date.now(), additional: '', additionalValue: '' });
    setItems(updatedItems);
  };

  const handleRemoveAdditionalField = (itemIndex, fieldIndex) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].additionalFields.splice(fieldIndex, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const orderData = {
      order: {
        user_id: 1,
        customer: customer,
        delivery_type: deliveryType,
        items_attributes: items.map(item => ({
          name: item.name,
          additional_fields_attributes: item.additionalFields.map(field => ({
            additional: field.additional,
            additional_value: field.additionalValue,
          })),
        })),
      },
    };

    try {
      const result = await createOrder(orderData);
      if (result.error) {
        console.error(result.error);
        // Handle error
      } else {
        // Handle success
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      // Handle error
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextInput 
        label="Nome do Cliente (opcional)"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />

      <SelectInput
        label="Tipo de Entrega"
        value={deliveryType}
        onChange={(e) => setDeliveryType(e.target.value)}
        options={deliveryTypes}
      />

      {deliveryType === 'local' && (
        <TextInput label="Info da Mesa" />
      )}

      {deliveryType === 'retirada' && (
        <TextInput label="Hora de Retirada (opcional)" type="time" />
      )}

      {deliveryType === 'delivery' && (
        <TextInput label="Endereço" />
      )}

      {items.map((item, index) => (
        <Box key={item.id} display="flex" flexDirection="column" mb={2}>
          <PlusInput
            label="Item"
            value={item.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            onAdd={() => handleAddAdditionalField(index)}
          />
          {item.additionalFields.map((field, fieldIndex) => (
            <Box key={field.id} display="flex" alignItems="center" ml={2} mb={1}>
              <TextInput
                label="Adicional"
                value={field.additional}
                onChange={(e) => handleChange(index, 'additionalFields', item.additionalFields.map((f, i) => i === fieldIndex ? { ...f, additional: e.target.value } : f))}
                style={{ marginRight: '0.5rem' }}
              />
              <PriceInput
                label="Valor do Adicional"
                value={field.additionalValue}
                onChange={(e) => handleChange(index, 'additionalFields', item.additionalFields.map((f, i) => i === fieldIndex ? { ...f, additionalValue: e.target.value } : f))}
                style={{ marginRight: '0.5rem' }}
              />
              <Button
                onClick={() => handleRemoveAdditionalField(index, fieldIndex)}
                variant="outlined"
                color="error"
              >
                Remover
              </Button>
            </Box>
          ))}
        </Box>
      ))}

      <Button type="button" onClick={handleAddItem} variant="outlined" color="primary">
        Adicionar Item
      </Button>

      <Button type="submit" variant="contained" color="primary">
        Finalizar Pedido
      </Button>
    </Box>
  );
};

export default NewOrderForm;
