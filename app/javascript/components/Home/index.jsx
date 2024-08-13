// src/pages/Home.js
import React, { useState } from 'react';
import { Button , OrderModal, OrderList} from '../index.js';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Button primary onClick={openModal}>
          Novo pedido
        </Button>

      <OrderModal open={isModalOpen} onClose={closeModal} />
      <OrderList></OrderList>
    </div>
  );
};

export default Home;
