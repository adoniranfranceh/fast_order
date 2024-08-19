import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { createOrder } from '../services/post.js';
import { updateOrder } from '../services/put.js';

const CustomerForm = ({ open, onClose, onSubmit, customerData }) => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    description: '',
    favorite_order: '',
  });

  useEffect(() => {
    if (customerData) {
      setCustomer(customerData);
    } else {
      setCustomer({
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        description: '',
        favorite_order: '',
      });
    }
  }, [customerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = customerData 
        ? await updateOrder(`/api/v1/customers/${customer.id}`, customer) 
        : await createOrder('/api/v1/customers', customer);

      if (result.error) {
        throw new Error(result.error);
      }

      onSubmit(result);
      onClose();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2,
            maxWidth: '100%',
            width: '400px',
          }}
          onSubmit={handleSubmit}
        >
          <Typography variant="h6" gutterBottom>
            {customerData ? 'Editar Cliente' : 'Registrar Cliente'}
          </Typography>
          <TextField
            label="Nome"
            name="name"
            value={customer.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            type="email"
            fullWidth
          />
          <TextField
            label="Telefone"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Data de Nascimento"
            name="birthdate"
            value={customer.birthdate}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
          <TextField
            label="Pedido Favorito"
            name="favorite_order"
            value={customer.favorite_order}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Descrição"
            name="description"
            value={customer.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
          {customerData ? 'Salvar Alterações' : 'Registrar Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerForm;
