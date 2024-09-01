import React, { useState } from 'react';
import { ObjectList, CollaboratorForm } from '../../index.js';
import { Button, Box, ListItemText } from '@mui/material';
import moment from 'moment';
import 'moment/locale/pt-br';

const CollaboratorsPage = () => {
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleRefresh = () => {
    setRefreshList(prev => !prev);
  };

  const handleEdit = (collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsFormOpen(true);
  };

  const handleNewCollaborator = () => {
    setSelectedCollaborator(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCollaborator(null);
  };

  const handleFormSubmit = (updatedCollaborator) => {
    handleRefresh();
    setIsFormOpen(false);
  };

  const renderOrderItem = (user) => [
    <span key="id">{user.id}</span>,
    <span key="name">{user.profile.full_name}</span>,
    <span key="email">{user.email}</span>,
    // <span key="birthdate" >{ moment(customer.birthdate).format('DD [de] MMMM [de] YYYY')}</span>
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleNewCollaborator} 
        sx={{ mb: 2 }}
      >
        Novo Colaborador
      </Button>
      <ObjectList
        url='/api/v1/users'
        onEdit={handleEdit}
        refresh={refreshList}
        renderItem={renderOrderItem}
        detailName='cliente'
        columns={['Id', 'Nome', 'E-mail', 'Data de aniversário', 'Ações']}
      />
      <CollaboratorForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        collaboratorData={selectedCollaborator}
      />
    </Box>
  );
};

export default CollaboratorsPage;
