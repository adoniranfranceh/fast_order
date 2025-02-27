import React, { useContext, useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import updateObject from '../services/updateObject';
import createObject from '../services/createObject';
import { AuthContext } from '../../context/AuthContext';

const CollaboratorForm = ({ open, onClose, onSubmit, collaboratorData }) => {
  const { currentUser } = useContext(AuthContext);
  const [collaborator, setCollaborator] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (collaboratorData) {
      setCollaborator(collaboratorData);
    } else {
      setCollaborator({
        email: '',
        password: ''
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
    onClose()
    
    const dataToSend = {
      user: {
        email: collaborator.email,
        password: collaborator.password
      }
    };
  
    console.log(collaboratorData)
    try {
      const result = collaboratorData 
        ? await updateObject(`/api/v1/users/${collaborator.id}?admin_id=${currentUser.admin_id}`, dataToSend) 
        : await createObject(`/api/v1/users?admin_id=${currentUser.admin_id}`, dataToSend);
  
      if (result.error) {
        throw new Error(result.error);
      }
  
      onSubmit(result);
    } catch (error) {
      console.error('Erro:', error);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
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
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {collaboratorData ? 'Editar Colaborador' : 'Registrar Colaborador'}
          </Typography>
          <TextField
            label="Email"
            name="email"
            value={collaborator.email || ''}
            onChange={handleChange}
            type="email"
            fullWidth
            sx={{
              marginBottom: '10px'
            }}
          />
          <TextField
            label="Senha"
            name="password"
            value={collaborator.password || ''}
            onChange={handleChange}
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {collaboratorData ? 'Salvar Alterações' : 'Registrar Cliente'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CollaboratorForm;
