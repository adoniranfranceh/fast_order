import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Grid, Typography, Paper, TextField, Button, Box } from '@mui/material';

const LoyaltyCardContainer = styled(Card)`
  padding: 16px;
  background-color: #4B0082 !important;
  color: #FFD700 !important;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background-position: center;
`;

const StampsGrid = styled(Grid)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

const StampContainer = styled(Paper)`
  width: 5em;
  height: 5em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  color: #FF4500;
  flex-direction: column;
  border: 1px solid #000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  @media (max-width: 600px) {
    width: 4em;
    height: 4em;
  }
`;

const EditStampModal = ({ stamp, onSave, onClose }) => {
  const [item, setItem] = useState(stamp ? stamp.item : '');

  const handleSave = () => {
    onSave(item);
    onClose();
  };

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 2 }}>
      <TextField
        value={item}
        onChange={(e) => setItem(e.target.value)}
        placeholder="Item do Pedido"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        fullWidth
      >
        Salvar
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onClose}
        fullWidth
        sx={{ mt: 1 }}
      >
        Fechar
      </Button>
    </Box>
  );
};

const LoyaltyCard = ({ loyaltyCard, onStatusChange, onRemove }) => {
  const maxStamps = 10;
  const [selectedStampIndex, setSelectedStampIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stamps, setStamps] = useState(loyaltyCard.stamps || []);

  const handleStampClick = (index) => {
    setSelectedStampIndex(index);
    setModalOpen(true);
  };

  const handleSaveStamp = async (item) => {
    if (selectedStampIndex === null) return;

    if (stamps[selectedStampIndex]) {
      try {
        const response = await fetch(`/api/v1/loyalty_cards/stamps/${stamps[selectedStampIndex].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ item }),
        });
        if (!response.ok) throw new Error('Erro ao editar o selo');
        const updatedStamp = await response.json();
        setStamps(stamps.map((stamp, i) => (i === selectedStampIndex ? updatedStamp : stamp)));
      } catch (error) {
        console.error('Erro:', error);
      }
    } else {
      try {
        const response = await fetch(`/api/v1/loyalty_cards/${loyaltyCard.id}/stamps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ item }),
        });
        if (!response.ok) throw new Error('Erro ao adicionar o selo');
        const newStamp = await response.json();
        setStamps([...stamps, newStamp]);
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleRemoveCard = async () => {
    try {
      const response = await fetch(`/api/v1/loyalty_cards/${loyaltyCard.id}/remove`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Erro ao remover o cartão de fidelidade');
      
      onRemove();
    } catch (error) {
      console.error('Erro:', error);
    }
  };  

  return (
    <LoyaltyCardContainer>
      <Typography variant="h6" align="center" gutterBottom>
        Complete 10 selos e ganhe um prêmio
      </Typography>
      <StampsGrid container spacing={1}>
        {Array.from({ length: maxStamps }).map((_, index) => (
          <Grid item key={index}>
            <StampContainer elevation={3} onClick={() => handleStampClick(index)}>
              {stamps[index] ? (
                <Typography variant="body2" align="center">
                  {stamps[index].item}
                </Typography>
              ) : (
                <Typography variant="body2" align="center" style={{ color: '#FF4500' }}>
                  Clique para adicionar selo
                </Typography>
              )}
            </StampContainer>
          </Grid>
        ))}
      </StampsGrid>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleRemoveCard}
        >
          Remover Cartão
        </Button>
      </Box>
      {modalOpen && (
        <EditStampModal
          stamp={stamps[selectedStampIndex]}
          onSave={handleSaveStamp}
          onClose={() => setModalOpen(false)}
        />
      )}
    </LoyaltyCardContainer>
  );
};

export default LoyaltyCard;
