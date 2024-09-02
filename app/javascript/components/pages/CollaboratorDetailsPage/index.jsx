import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Paper } from '@mui/material';

const CollaboratorDetailsPage = () => {
  const { id } = useParams();
  const [collaborator, setCollaborator] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchcollaborator = async () => {
      try {
        const response = await fetch(`/api/v1/users/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar os detalhes do cliente');
        }
        const data = await response.json();
        setCollaborator(data);
      } catch (error) {
        setError('Não foi possível carregar os detalhes do cliente.');
        console.error('Erro:', error);
      }
    };

    fetchcollaborator();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!collaborator) return <p>Carregando...</p>;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Detalhes do Colaborador
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Nome:</Typography>
            <Typography variant="body1" gutterBottom>{collaborator.profile?.full_name || 'Sem nome'}</Typography>

            <Typography variant="h6">Email:</Typography>
            <Typography variant="body1" gutterBottom>{collaborator.email}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CollaboratorDetailsPage;
