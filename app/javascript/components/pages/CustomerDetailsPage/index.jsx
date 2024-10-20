import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import LoyaltyCard from '../../LoyaltyCard';
import theme from '../../theme';
import deleteObject from '../../services/deleteObject';

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({ loyalty_cards: [] });
  const [error, setError] = useState(null);
  const [newCardName, setNewCardName] = useState('');
  const navigate = useNavigate();

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
    setCustomer(prevCustomer => ({
      ...prevCustomer,
      loyalty_cards: prevCustomer.loyalty_cards.filter(card => card.id !== cardId)
    }));
  };

  const handleDeleteCustomer = async () => {
    const response = await deleteObject('/api/v1/customers', customer.id, setCustomer, 'customer')
    console.log(response)
    if(response && response === true) {
      navigate('/clientes');
    }else{
      console.log('aqui entrei')
      console.error('Erro:', error);
    }
  }

  const usedLoyaltyCardsCount = customer.loyalty_cards.filter(card => card.status === 'used').length;

  if (error) return <p>{error}</p>;
  if (!customer) return <p>Carregando...</p>;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const activeLoyaltyCards = customer.loyalty_cards?.filter(card => card.status === 'active') || [];

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
          Detalhes do Cliente
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2, 
          backgroundColor: theme.colors.background, 
          padding: 2, 
          borderRadius: theme.borderRadius 
        }}>
          {[
            { label: 'Nome', value: customer.name },
            { label: 'Email', value: customer.email },
            { label: 'Telefone', value: customer.phone },
            { label: 'Data de Nascimento', value: formatDate(customer.birthdate) },
            { label: 'Data de Registro', value: formatDate(customer.created_at) },
            { label: 'Quantidade cartões completados', value: usedLoyaltyCardsCount }
          ].map((info, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 0'
              }}
            >
              <Typography variant="h6" sx={{ color: theme.colors.text }}>
                {info.label}:
              </Typography>
              <Typography variant="body1" sx={{ color: theme.colors.mutedText }}>
                {info.value}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.colors.secondary }}>
            Cartões de Fidelidade
          </Typography>

          {activeLoyaltyCards.length > 0 ? (
            activeLoyaltyCards.map((card) => (
              <LoyaltyCard
                key={card.id} 
                loyaltyCard={card} 
                onRemove={() => handleRemoveCard(card.id)} 
              />
            ))
          ) : (
            <Typography variant="body1" align="center" sx={{ color: theme.colors.mutedText }}>
              Nenhum cartão de fidelidade ativo.
            </Typography>
          )}

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            {/* <TextField
              label="Nome do Novo Cartão"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            /> */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCard}
              fullWidth
              sx={{
                backgroundColor: theme.colors.primary,
                '&:hover': { backgroundColor: theme.colors.primaryHover },
                flex: 1,
                padding: '12px 16px',
              }}
            >
              Adicionar Novo Cartão
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteCustomer}
              fullWidth
              sx={{
                backgroundColor: theme.colors.danger,
                '&:hover': { backgroundColor: theme.colors.dangerHover },
                flex: 1,
                padding: '12px 16px',
              }}
            >
              Excluir Cliente
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CustomerDetailsPage;
