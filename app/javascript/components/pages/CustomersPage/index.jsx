import React, { useState } from 'react';
import { ObjectList, CustomerForm, Button } from '../../index.js'
import { Box } from '@mui/material';
import { StyledButtonContainer} from './style.js'
import moment from 'moment';
import 'moment/locale/pt-br';

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

  const renderOrderItem = (customer) => [
    <span key="id">{customer.id}</span>,
    <span key="name">{customer.name}</span>,
    <span key="email">{customer.email}</span>,
    <span key="birthdate" >{ moment(customer.birthdate).format('DD [de] MMMM [de] YYYY')}</span>
  ];

  return (
    <Box sx={{ p: 2 }}>
      <StyledButtonContainer>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNewCustomer} 
          sx={{ mb: 2 }}
        >
          Novo Cliente
        </Button>
      </StyledButtonContainer>
      <ObjectList
        url='/api/v1/customers'
        onEdit={handleEdit}
        refresh={refreshList}
        renderItem={renderOrderItem}
        detailName='cliente'
        columns={['Id', 'Nome', 'E-mail', 'Data de nascimento', '']}
        listTitle='Clientes'
        objectName='customers'
        enableDateFilter
        dateLabel='Data de nascimento:'
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
