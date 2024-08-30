import React, { useState } from 'react';
import { Box, Typography, Button, TimeField, TextField, Select, MenuItem, Alert } from '@mui/material';
import { ItemList } from '../index.js';
import { createOrder, updateOrder } from '../services/orderService.js';
import formatPrice from '../services/formatPrice.js';
const DELIVERY_TYPES = [
  { value: 'local', label: 'Local' },
  { value: 'pickup', label: 'Retirada' },
  { value: 'delivery', label: 'Delivery' }
];

const OrderForm = ({ onClose, onOrderSuccess, initialOrderData }) => {
  const [orderData, setOrderData] = useState(initialOrderData || {
    delivery_type: '',
    customer: '',
    pick_up_time: '',
    items: [{ id: '', name: '', price: '', additional_fields: [] }],
    address: '',
    table_info: '',
  });
  const [errors, setErrors] = useState({});

  const calculateTotalPrice = () => {
    return orderData.items.reduce((total, item) => {
      const itemTotal = parseFloat(item.price) || 0;
      const additionalTotal = item.additional_fields.reduce((acc, field) => acc + (parseFloat(field.additional_value) || 0), 0);
      return total + itemTotal + additionalTotal;
    }, 0);
  };

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: value === '' ? 'Este campo é obrigatório.' : undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let validationErrors = {};
    let hasErrors = false;
  
    if (!orderData.delivery_type) {
      validationErrors.delivery_type = 'Tipo de entrega é obrigatório.';
      hasErrors = true;
    }
  
    if (orderData.items.length === 0) {
      validationErrors.items = 'Adicione pelo menos um item.';
      hasErrors = true;
    }
  
    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }
  
    const payload = { 
      order: {
        customer: orderData.customer,
        status: orderData.status,
        delivery_type: orderData.delivery_type,
        table_info: orderData.table_info,
        pick_up_time: orderData.pick_up_time,
        address: orderData.address,
        items_attributes: orderData.items
          .map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            status: item.status,
            _destroy: item._destroy,
            additional_fields_attributes: item.additional_fields
              .map(field => ({
                id: field.id, 
                additional: field.additional,
                additional_value: field.additional_value,
                _destroy: field._destroy
              }))
          }))
      }
    };
  
    try {
      const result = initialOrderData
        ? await updateOrder(`/api/v1/orders/${initialOrderData.id}`, payload)
        : await createOrder('/api/v1/orders', payload);
  
      if (!result.error) {
        onOrderSuccess();
        onClose();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Erro ao salvar o pedido.' });
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {initialOrderData ? 'Editar Pedido' : 'Criar Novo Pedido'}
      </Typography>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <TextField
        label="Cliente"
        value={orderData.customer}
        onChange={(e) => handleInputChange('customer', e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.customer}
        helperText={errors.customer}
      />

      <Select
        value={orderData.delivery_type}
        onChange={(e) => handleInputChange('delivery_type', e.target.value)}
        fullWidth
        error={!!errors.delivery_type}
        displayEmpty
        sx={{ mb: 2 }}
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

      {orderData.delivery_type === 'local' && (
        <TextField
          label="Info da Mesa"
          value={orderData.table_info}
          onChange={(e) => handleInputChange('table_info', e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.table_info}
          helperText={errors.table_info}
        />
      )}

      {orderData.delivery_type === 'pickup' && (
        <TextField
          label="Hora de retirada"
          type="time"
          value={orderData.pick_up_time}
          onChange={(e) => handleInputChange('pick_up_time', e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.pick_up_time}
          helperText={errors.pick_up_time}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, 
          }}
        />
      )}

      {orderData.delivery_type === 'delivery' && (
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

      <ItemList
        items={orderData.items}
        setItems={(items) => setOrderData(prev => ({ ...prev, items }))}
        errors={errors.items}
      />

      <Typography variant="h6" gutterBottom>
        Preço Total: R$ {formatPrice(calculateTotalPrice())}
      </Typography>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {initialOrderData ? 'Salvar' : 'Criar Pedido'}
      </Button>

      <Button onClick={onClose} color="secondary" sx={{ mt: 2, ml: 2 }}>
        Cancelar
      </Button>
    </Box>
  );
};

export default OrderForm;
