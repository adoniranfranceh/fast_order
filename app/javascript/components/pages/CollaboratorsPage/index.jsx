import React, { useState } from 'react';
import { ObjectList, CollaboratorForm, Button } from '../../index.js';
import { Box } from '@mui/material';
import 'moment/locale/pt-br';
import styled from "styled-components";
import theme from "../../theme";

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

  const StyledButtonContainer = styled.div`
    margin-top: ${theme.spacing.medium};
    
    Button {
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
      &:hover {
        background-color: ${theme.colors.primaryHover};
      }
    }
  `;

  return (
    <Box sx={{ p: 2 }}>
      <StyledButtonContainer>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNewCollaborator} 
          sx={{ mb: 2 }}
        >
          Novo Colaborador
        </Button>
      </StyledButtonContainer>
      <ObjectList
        url='/api/v1/users'
        onEdit={handleEdit}
        refresh={refreshList}
        renderItem={renderCollaborator}
        detailName='perfil'
        columns={['Id', 'Nome', 'E-mail', '']}
        listTitle='Colaboradores'
        objectName='users'
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
