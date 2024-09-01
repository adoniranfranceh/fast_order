import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import updateObject from '../services/updateObject';
import createObject from '../services/createObject';

const CollaboratorForm = ({ open, onClose, onSubmit, collaboratorData }) => {
  const [collaborator, setCollaborator] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    description: '',
    favorite_order: '',
  });

  useEffect(() => {
    if (collaboratorData) {
      setCollaborator(collaboratorData);
    } else {
      setCollaborator({
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        description: '',
        favorite_order: '',
      });
    }
  }, [collaboratorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollaborator((prevCollaborator) => ({
      ...prevCollaborator,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, created_at, updated_at, ...dataToSend } = collaborator;
    try {
      const result = collaboratorData 
        ? await updateObject(`/api/v1/collaborators/${collaborator.id}`, dataToSend) 
        : await createObject('/api/v1/collaborators', dataToSend);
  
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
            {collaboratorData ? 'Editar Cliente' : 'Registrar Cliente'}
          </Typography>
          <TextField
            label="Nome"
            name="name"
            value={collaborator.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={collaborator.email}
            onChange={handleChange}
            type="email"
            fullWidth
          />
          <TextField
            label="Telefone"
            name="phone"
            value={collaborator.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Data de Nascimento"
            name="birthdate"
            value={collaborator.birthdate}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
          <TextField
            label="Descrição"
            name="description"
            value={collaborator.description}
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
          {collaboratorData ? 'Salvar Alterações' : 'Registrar Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollaboratorForm;
