import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Paper } from '@mui/material';
import theme from '../../theme';

const CollaboratorDetailsPage = () => {
  const { id } = useParams();
  const [collaborator, setCollaborator] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollaborator = async () => {
      try {
        const response = await fetch(`/api/v1/users/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar os detalhes do colaborador');
        }
        const data = await response.json();
        setCollaborator(data);
      } catch (error) {
        setError('Não foi possível carregar os detalhes do colaborador.');
        console.error('Erro:', error);
      }
    };

    fetchCollaborator();
  }, [id]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!collaborator) return <Typography>Carregando...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ 
        padding: 3, 
        borderRadius: theme.borderRadius, 
        boxShadow: theme.boxShadow, 
        backgroundColor: theme.colors.white,
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ 
          color: theme.colors.primary,
          fontFamily: theme.fonts.primary,
        }}>
          Detalhes do Colaborador
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 3, 
          backgroundColor: theme.colors.background, 
          padding: 2, 
          borderRadius: theme.borderRadius 
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: theme.colors.text }}>
              Nome:
            </Typography>
            <Typography variant="body1" sx={{ color: theme.colors.mutedText }} gutterBottom>
              {collaborator.profile?.full_name || 'Sem nome'}
            </Typography>

            <Typography variant="h6" sx={{ color: theme.colors.text }}>
              Email:
            </Typography>
            <Typography variant="body1" sx={{ color: theme.colors.mutedText }} gutterBottom>
              {collaborator.email}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CollaboratorDetailsPage;
