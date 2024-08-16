import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';

const ObjectList = ({ onEdit }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/v1/customers');
        if (!response.ok) {
          throw new Error('Erro ao carregar clientes');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lista de Clientes
      </Typography>
      <List>
        {customers.map((customer) => (
          <ListItem key={customer.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={customer.name} secondary={customer.email} />
            <Button variant="contained" color="primary" onClick={() => onEdit(customer)}>
              Editar
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ObjectList;
