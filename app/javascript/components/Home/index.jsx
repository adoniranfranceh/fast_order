import React, { useContext, useState } from 'react';
import { Button, OrderModal, OrderList } from '../index.js';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOrderSuccess = () => {
    closeModal();
  };

  return (
    <div>
      Olá {currentUser?.profile?.full_name || currentUser?.email}
      <Button primary onClick={openModal}>
        Novo pedido
      </Button>

      <OrderModal 
        open={isModalOpen} 
        onClose={closeModal} 
        onOrderSuccess={handleOrderSuccess}
      />
      <OrderList />
    </div>
  );
};

export default Home;
