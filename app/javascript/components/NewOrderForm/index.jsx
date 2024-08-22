import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, Alert, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createOrder } from '../services/post.js';

const DELIVERY_TYPES = [
  { value: 'local', label: 'Local' },
  { value: 'pickup', label: 'Retirada' },
  { value: 'delivery', label: 'Delivery' }
];

const initialOrderData = {
  deliveryType: '',
  customer: '',
  pickUpTime: '',
  items: [{ id: Date.now(), name: '', price: '', additionalFields: [] }],
  address: '',
  tableInfo: '',
};

const NewOrderForm = ({ onClose, onOrderSuccess }) => {
  const [orderData, setOrderData] = useState(() => {
    const savedData = localStorage.getItem('orderFormData');
    return savedData ? JSON.parse(savedData) : initialOrderData;
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('orderFormData', JSON.stringify(orderData));
  }, [orderData]);

  const calculateTotalPrice = () => {
    return orderData.items.reduce((total, item) => {
      const itemTotal = parseFloat(item.price) || 0;
      const additionalTotal = item.additionalFields.reduce((acc, field) => acc + (parseFloat(field.additionalValue) || 0), 0);
      return total + itemTotal + additionalTotal;
    }, 0);
  };

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    if (value === '') {
      setErrors(prev => ({ ...prev, [field]: 'Este campo é obrigatório.' }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleItemChange = (itemIndex, field, value) => {
    setOrderData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[itemIndex][field] = value;
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddItem = () => {
    setOrderData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), name: '', price: '', additionalFields: [] }]
    }));
  };

  const handleRemoveItem = (itemIndex) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter((_, index) => index !== itemIndex)
    }));
  };

  const handleAddAdditionalField = (itemIndex) => {
    setOrderData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[itemIndex].additionalFields.push({ id: Date.now(), additional: '', additionalValue: '' });
      return { ...prev, items: updatedItems };
    });
  };

  const handleRemoveAdditionalField = (itemIndex, fieldIndex) => {
    setOrderData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[itemIndex].additionalFields.splice(fieldIndex, 1);
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let hasErrors = false;
    let validationErrors = {};

    if (!orderData.deliveryType) {
      validationErrors.deliveryType = 'Tipo de entrega é obrigatório.';
      hasErrors = true;
    }

    if (orderData.items.length === 0 || orderData.items.every(item => item.name === '' || item.price === '')) {
      validationErrors.items = 'Adicione pelo menos um item ao pedido e defina o preço.';
      hasErrors = true;
    }

    if (orderData.deliveryType === 'local' && !orderData.tableInfo) {
      validationErrors.tableInfo = 'Info da Mesa é obrigatória.';
      hasErrors = true;
    }

    if (orderData.deliveryType === 'pickup' && !orderData.pickUpTime) {
      validationErrors.pickUpTime = 'Hora de Retirada é obrigatória.';
      hasErrors = true;
    }

    if (orderData.deliveryType === 'delivery' && !orderData.address) {
      validationErrors.address = 'Endereço é obrigatório.';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    const orderPayload = {
      order: {
        user_id: 1,
        customer: orderData.customer,
        delivery_type: orderData.deliveryType,
        table_info: orderData.deliveryType === 'local' ? orderData.tableInfo : '',
        address: orderData.deliveryType === 'delivery' ? orderData.address : '',
        pick_up_time: orderData.deliveryType === 'pickup' ? orderData.pickUpTime : '',
        items_attributes: orderData.items.map(item => ({
          name: item.name,
          price: item.price,
          additional_fields_attributes: item.additionalFields.map(field => ({
            additional: field.additional,
            additional_value: field.additionalValue,
          })),
        })),
      },
    };

    try {
      const result = await createOrder('/api/v1/orders', orderPayload);
      if (result.error) {
        console.error(result.error);
      } else {
        if (onOrderSuccess) {
          onOrderSuccess();
        }
        setOrderData(initialOrderData);
        localStorage.removeItem('orderFormData');
        onClose();
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <Box
      component="form"
      noValidate autoComplete="off"
      onSubmit={handleSubmit}
      p={3}
      maxWidth="600px"
      mx="auto"
    >
      <Typography variant="h6" gutterBottom>
        Criar Novo Pedido
      </Typography>

      {errors.general && (
        <Alert severity="error" style={{ marginBottom: '1rem' }}>
          {errors.general}
        </Alert>
      )}

      <TextField 
        label="Nome do Cliente (opcional)"
        value={orderData.customer}
        onChange={(e) => handleInputChange('customer', e.target.value)}
        fullWidth
        margin="normal"
      />

      <Select
        label="Tipo de Entrega"
        value={orderData.deliveryType}
        onChange={(e) => handleInputChange('deliveryType', e.target.value)}
        fullWidth
        error={!!errors.deliveryType}
        displayEmpty
      >
        <MenuItem value="">
          <em>Selecione o tipo de entrega</em>
        </MenuItem>
        {DELIVERY_TYPES.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </Select>

      {orderData.deliveryType === 'local' && (
        <TextField 
          label="Info da Mesa" 
          value={orderData.tableInfo}
          onChange={(e) => handleInputChange('tableInfo', e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.tableInfo}
          helperText={errors.tableInfo}
        />
      )}

      {orderData.deliveryType === 'pickup' && (
        <TextField 
          label="Hora de Retirada" 
          type="time"
          value={orderData.pickUpTime}
          onChange={(e) => handleInputChange('pickUpTime', e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.pickUpTime}
          helperText={errors.pickUpTime}
        />
      )}

      {orderData.deliveryType === 'delivery' && (
        <TextField 
          label="Endereço" 
          value={orderData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.address}
          helperText={errors.address}
        />
      )}

      {errors.items && (
        <Alert severity="error" style={{ marginBottom: '1rem' }}>
          {errors.items}
        </Alert>
      )}

      {orderData.items.map((item, itemIndex) => (
        <Box key={item.id} display="flex" flexDirection="column" mb={3} padding={2} border={1} borderRadius={2}>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Item"
              value={item.name}
              onChange={(e) => handleItemChange(itemIndex, 'name', e.target.value)}
              fullWidth
              margin="normal"
              style={{ marginRight: '0.5rem' }}
            />
            <TextField
              label="Preço"
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(itemIndex, 'price', e.target.value)}
              fullWidth
              margin="normal"
            />
            <IconButton onClick={() => handleRemoveItem(itemIndex)} aria-label="remove item">
              <RemoveIcon />
            </IconButton>
          </Box>

          {item.additionalFields.map((field, fieldIndex) => (
            <Box key={field.id} display="flex" alignItems="center" mb={1}>
              <TextField
                label="Campo Adicional"
                value={field.additional}
                onChange={(e) => {
                  const newFields = [...item.additionalFields];
                  newFields[fieldIndex].additional = e.target.value;
                  handleItemChange(itemIndex, 'additionalFields', newFields);
                }}
                fullWidth
                margin="normal"
                style={{ marginRight: '0.5rem' }}
              />
              <TextField
                label="Valor Adicional"
                type="number"
                value={field.additionalValue}
                onChange={(e) => {
                  const newFields = [...item.additionalFields];
                  newFields[fieldIndex].additionalValue = e.target.value;
                  handleItemChange(itemIndex, 'additionalFields', newFields);
                }}
                fullWidth
                margin="normal"
              />
              <IconButton onClick={() => handleRemoveAdditionalField(itemIndex, fieldIndex)} aria-label="remove field">
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => handleAddAdditionalField(itemIndex)}
            startIcon={<AddIcon />}
          >
            Adicionar Campo Adicional
          </Button>
        </Box>
      ))}

      <Button
        variant="outlined"
        onClick={handleAddItem}
        startIcon={<AddIcon />}
        style={{ marginBottom: '1rem' }}
      >
        Adicionar Item
      </Button>

      <Typography variant="h6" gutterBottom>
        Preço Total: R$ {calculateTotalPrice().toFixed(2)}
      </Typography>

      <Button type="submit" variant="contained" color="primary">
        Criar Pedido
      </Button>
      <Button variant="text" color="secondary" onClick={onClose} style={{ marginLeft: '1rem' }}>
        Cancelar
      </Button>
    </Box>
  );
};

export default NewOrderForm;
