import React, { useState } from 'react';
import { ObjectList, CustomerForm } from '../../index.js';
import { Button, Box } from '@mui/material';

const CustomersPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleRefresh = () => {
    setRefreshList(prev => !prev);
  };

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
    handleRefresh();
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
      <ObjectList
        url='/api/v1/customers'
        onEdit={handleEdit}
        refresh={refreshList}
      />
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
