import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loyaltyCard, setLoyaltyCard] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/v1/customers/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar os detalhes do cliente');
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleLoyaltyCardChange = (e) => {
    setLoyaltyCard(e.target.value);
  };

  const handleAddLoyaltyCard = async () => {
    try {
      const response = await fetch(`/api/v1/customers/${id}/loyalty_card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ card: loyaltyCard }),
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar o cartão fidelidade');
      }
      alert('Cartão fidelidade adicionado com sucesso');
      setLoyaltyCard('');
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  if (!customer) return <p>Carregando...</p>;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Detalhes do Cliente
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Nome:</Typography>
          <Typography variant="body1" gutterBottom>{customer.name}</Typography>
          
          <Typography variant="h6">Email:</Typography>
          <Typography variant="body1" gutterBottom>{customer.email}</Typography>

          <Typography variant="h6">Telefone:</Typography>
          <Typography variant="body1" gutterBottom>{customer.phone}</Typography>

          <Typography variant="h6">Data de Nascimento:</Typography>
          <Typography variant="body1" gutterBottom>{customer.birthdate}</Typography>

          <Typography variant="h6">Pedido Favorito:</Typography>
          <Typography variant="body1" gutterBottom>{customer.favorite_order}</Typography>

          <Typography variant="h6">Descrição:</Typography>
          <Typography variant="body1" gutterBottom>{customer.description}</Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Número do Cartão Fidelidade"
            value={loyaltyCard}
            onChange={handleLoyaltyCardChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLoyaltyCard}
            fullWidth
          >
            Adicionar Cartão Fidelidade
          </Button>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          fullWidth
        >
          Voltar
        </Button>
      </Paper>
    </Container>
  );
};

export default CustomerDetailsPage;
