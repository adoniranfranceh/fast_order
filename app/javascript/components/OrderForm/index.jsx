import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, Alert } from '@mui/material';
import { ItemList } from '../index.js';
import createObject from '../services/createObject.js';
import updateObject from '../services/updateObject.js';
import formatPrice from '../services/formatPrice.js';
import { AuthContext } from '../../context/AuthContext';

const DELIVERY_TYPES = [
  { value: 'local', label: 'Local' },
  { value: 'pickup', label: 'Retirada' },
  { value: 'delivery', label: 'Delivery' }
];

const OrderForm = ({ onClose, onOrderSuccess, initialOrderData }) => {
  const { currentUser } = useContext(AuthContext);
  const [orderData, setOrderData] = useState(initialOrderData || {
    delivery_type: '',
    customer: '',
    pick_up_time: '',
    items: [{ id: '', name: '', price: '', additional_fields: [] }],
    address: '',
    table_info: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const unsavedOrder = localStorage.getItem('unsavedOrder');
    if (unsavedOrder && !initialOrderData) {
      setOrderData(JSON.parse(unsavedOrder));
    }
  }, [initialOrderData]);

  const calculateTotalPrice = () => {
    return orderData.items.filter(item => !item._destroy).reduce((total, item) => {
      const itemTotal = parseFloat(item.price) || 0;
      const additionalTotal = item.additional_fields.reduce((acc, field) => acc + (parseFloat(field.additional_value) || 0), 0);
      return total + itemTotal + additionalTotal;
    }, 0);
  };

  const handleInputChange = (field, value) => {
    const updatedOrderData = { ...orderData, [field]: value };
    setOrderData(updatedOrderData);
    setErrors(prev => ({ ...prev, [field]: value === '' ? 'Este campo é obrigatório.' : undefined }));
  
    localStorage.setItem('unsavedOrder', JSON.stringify(updatedOrderData));
  };   

  const validateForm = () => {
    let validationErrors = {};
    let hasErrors = false;

    if (!orderData.delivery_type) {
      validationErrors.delivery_type = 'Tipo de entrega é obrigatório.';
      hasErrors = true;
    }

    if (orderData.delivery_type === 'local' && !orderData.table_info) {
      validationErrors.table_info = 'Info da mesa é obrigatória para entrega local.';
      hasErrors = true;
    }

    if (orderData.delivery_type === 'pickup' && !orderData.pick_up_time) {
      validationErrors.pick_up_time = 'Hora de retirada é obrigatória para retirada.';
      hasErrors = true;
    }

    if (orderData.delivery_type === 'delivery' && !orderData.address) {
      validationErrors.address = 'Endereço é obrigatório para delivery.';
      hasErrors = true;
    }

    if (orderData.items.length === 0 || orderData.items.some(item => !item.name || !item.price)) {
      validationErrors.items = 'Adicione pelo menos um item com nome e preço.';
      hasErrors = true;
    }

    setErrors(validationErrors);
    return !hasErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const payload = { 
      order: {
        user_id: orderData.user_id ? orderData.user_id : currentUser.id,
        customer: orderData.customer,
        delivery_type: orderData.delivery_type,
        table_info: orderData.table_info,
        pick_up_time: orderData.pick_up_time,
        address: orderData.address,
        items_attributes: orderData.items
          .filter(item => item.name && item.price)
          .map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            _destroy: item._destroy || false,
            additional_fields_attributes: item.additional_fields
              .filter(field => field.additional)
              .map(field => ({
                id: field.id, 
                additional: field.additional,
                additional_value: field.additional_value || 0,
                _destroy: field._destroy || false,
              }))
          }))
      }
    };
  
    try {
      const result = initialOrderData
        ? await updateObject(`/api/v1/orders/${initialOrderData.id}`, payload)
        : await createObject('/api/v1/orders', payload);
  
      if (!result.error) {
        onOrderSuccess();
        onClose();
        localStorage.removeItem('unsavedOrder');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      onClose();
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
      {errors.delivery_type && <Typography color="error">{errors.delivery_type}</Typography>}

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
        setItems={(items) => {
          setOrderData(prev => ({ ...prev, items }));
          if (!initialOrderData) {
            localStorage.setItem('unsavedOrder', JSON.stringify({ ...orderData, items }));
          }        
        }}
        errors={errors.items}
      />

      <Typography variant="h6" gutterBottom>
        Preço Total: R$ {formatPrice(calculateTotalPrice())}
      </Typography>

      <Button data-cy="save-button" type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {initialOrderData ? 'Salvar' : 'Criar Pedido'}
      </Button>

      <Button onClick={onClose} color="secondary" sx={{ mt: 2, ml: 2 }}>
        Cancelar
      </Button>
    </Box>
  );
};

export default OrderForm;
