import React, { useState } from 'react';
import { ObjectList, CollaboratorForm } from '../../index.js';
import { Button, Box } from '@mui/material';
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

  const renderCollaborator = (user) => [
    <span key="id">{user.id}</span>,
    <span key="name">{user.profile?.full_name || 'Sem nome'}</span>,
    <span key="email">{user.email}</span>,
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
        renderItem={renderCollaborator}
        detailName='cliente'
        columns={['Id', 'Nome', 'E-mail', 'Ações']}
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
