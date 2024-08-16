import React, { useState } from 'react';
import { ObjectList, CustomerForm } from '../../index.js';
import { Button, Box } from '@mui/material';

const CustomersPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleFormSubmit = (updatedCustomer) => {
    console.log('Cliente atualizado/registrado:', updatedCustomer);
    setIsFormOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleNewCustomer} 
        sx={{ mb: 2 }}
      >
        Novo Cliente
      </Button>
      <ObjectList onEdit={handleEdit} />
      <CustomerForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        customerData={selectedCustomer}
      />
    </Box>
  );
};

export default CustomersPage;
