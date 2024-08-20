import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import LoyaltyCard from '../../LoyaltyCard';

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({ loyalty_cards: [] });
  const [error, setError] = useState(null);
  const [newCardName, setNewCardName] = useState('');

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
        setError('Não foi possível carregar os detalhes do cliente.');
        console.error('Erro:', error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleAddCard = async () => {
    try {
      const response = await fetch(`/api/v1/customers/${id}/loyalty_card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loyalty_card: { name: newCardName, status: 'active' } }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar o cartão de fidelidade');
      const newCard = await response.json();
      setCustomer(prevCustomer => ({
        ...prevCustomer,
        loyalty_cards: [...prevCustomer.loyalty_cards, newCard]
      }));
      setNewCardName('');
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleRemoveCard = async (cardId) => {
    try {
      const response = await fetch(`/api/v1/loyalty_cards/${cardId}/remove`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Erro ao remover o cartão de fidelidade');
      
      setCustomer(prevCustomer => ({
        ...prevCustomer,
        loyalty_cards: prevCustomer.loyalty_cards.filter(card => card.id !== cardId)
      }));
    } catch (error) {
      console.error('Erro:', error);
    }
  };  

  const handleStatusChange = (updatedCard) => {
    setCustomer(prevCustomer => ({
      ...prevCustomer,
      loyalty_cards: prevCustomer.loyalty_cards.map(card =>
        card.id === updatedCard.id ? updatedCard : card
      )
    }));
  };

  if (error) return <p>{error}</p>;
  if (!customer) return <p>Carregando...</p>;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const activeLoyaltyCards = customer.loyalty_cards?.filter(card => card.status === 'active') || [];

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Detalhes do Cliente
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Nome:</Typography>
            <Typography variant="body1" gutterBottom>{customer.name}</Typography>

            <Typography variant="h6">Email:</Typography>
            <Typography variant="body1" gutterBottom>{customer.email}</Typography>

            <Typography variant="h6">Telefone:</Typography>
            <Typography variant="body1" gutterBottom>{customer.phone}</Typography>

            <Typography variant="h6">Data de Nascimento:</Typography>
            <Typography variant="body1" gutterBottom>{formatDate(customer.birthdate)}</Typography>

            <Typography variant="h6">Data de Registro:</Typography>
            <Typography variant="body1" gutterBottom>{formatDate(customer.created_at)}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Cartões de Fidelidade
          </Typography>
          {activeLoyaltyCards.length > 0 ? (
            activeLoyaltyCards.map((card) => (
              <LoyaltyCard 
                key={card.id} 
                loyaltyCard={card} 
                onStatusChange={handleStatusChange} 
                onRemove={() => handleRemoveCard(card.id)} 
              />
            ))
          ) : (
            <Typography variant="body1" align="center">Nenhum cartão de fidelidade ativo.</Typography>
          )}
          <Box sx={{ mt: 4 }}>
            <TextField
              label="Nome do Novo Cartão"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCard}
              fullWidth
            >
              Adicionar Novo Cartão
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CustomerDetailsPage;
