import React, { useContext, useState } from 'react';
import { Button, OrderModal, OrderList } from '../index.js';
import { AuthContext } from '../../context/AuthContext';
import { StyledGreeting, StyledHome, StyledButtonContainer } from './style';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOrderSuccess = () => {
    closeModal();
  };

  return (
    <StyledHome>
      <StyledGreeting>
        Olá {currentUser?.profile?.full_name || currentUser?.email}
      </StyledGreeting>
      <StyledButtonContainer>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={openModal}
        >
          Novo pedido
        </Button>
      </StyledButtonContainer>

      <OrderModal 
        open={isModalOpen} 
        onClose={closeModal} 
        onOrderSuccess={handleOrderSuccess}
      />
      <OrderList />
    </StyledHome>
  );
};

export default Home;
