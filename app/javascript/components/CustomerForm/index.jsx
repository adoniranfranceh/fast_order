import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const CustomerForm = ({ onSubmit }) => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    description: '',
    favorite_order: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    birthdate: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: !customer.name.trim(),
      birthdate: !customer.birthdate.trim(),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.birthdate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('/api/v1/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customer }),
        });
  
        if (!response.ok) {
          throw new Error('Erro ao registrar cliente');
        }
  
        const data = await response.json();
        onSubmit(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        maxWidth: '100%',
        width: '500px',
        mx: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Formulário de Cliente
      </Typography>
      <TextField
        label="Nome"
        name="name"
        value={customer.name}
        onChange={handleChange}
        error={errors.name}
        helperText={errors.name ? 'Nome é obrigatório' : ''}
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
        error={errors.birthdate}
        helperText={errors.birthdate ? 'Data de nascimento é obrigatória' : ''}
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

      <Button type="submit" variant="contained" color="primary">
        Registrar Cliente
      </Button>
    </Box>
  );
};

export default CustomerForm;
