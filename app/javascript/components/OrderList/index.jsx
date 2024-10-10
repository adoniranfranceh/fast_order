import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import consumer from '../services/cable';
import OrderCard from '../OrderCard';
import putStatus from '../services/putStatus';
import {
  OrderListContainer,
  Section,
  SectionTitle,
  OrderGrid,
  OrderCount,
  Pagination,
} from './style';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = consumer.subscriptions.create(
      { channel: 'OrdersChannel' },
      {
        received(data) {
          setOrders((prevOrders) => {
            const existingOrderIndex = prevOrders.findIndex(
              (order) => order.id === data.id
            );

            if (existingOrderIndex !== -1) {
              const updatedOrders = [...prevOrders];
              updatedOrders[existingOrderIndex] = data;
              return updatedOrders;
            } else {
              return [...prevOrders, data];
            }
          });
        },
      }
    );

    fetchOrders();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrders = () => {
    axios
      .get('/api/v1/orders?query=today')
      .then((response) => {
        setOrders(response.data.orders);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateObjectStatus = async (id, newStatus) => {
    try {
      const response = await putStatus('/api/v1/orders', id, { status: newStatus }, setOrders, 'orders', false);
      console.log(response);
  
      if (response && response.PromiseResult === true) {
        console.log("Status atualizado com sucesso");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro: Verifique se todos os itens do pedido estão pagos',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Ocorreu um erro ao atualizar o status. Tente novamente.',
        confirmButtonText: 'OK'
      });
    }
  };  

  const groupedOrders = {
    doing: [],
    delivered: [],
    paid: [],
    canceled: [],
  };

  orders.forEach((order) => {
    if (groupedOrders[order.status]) {
      groupedOrders[order.status].push(order);
    }
  });

  const getSectionTitle = (status) => {
    return {
      doing: 'Novos Pedidos',
      delivered: 'Entregues',
      paid: 'Pagos',
      canceled: 'Cancelados',
    }[status] || 'Desconhecido';
  };

  const handleCardClick = (id) => {
    navigate(`/pedido/${id}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <OrderListContainer>
        {Object.keys(groupedOrders).map((status) => (
          <DroppableSection
            key={status}
            status={status}
            title={getSectionTitle(status)}
            orders={groupedOrders[status]}
            onDrop={(orderId) => updateObjectStatus(orderId, status)}
            onStatusChange={updateObjectStatus}
            onCardClick={handleCardClick}
          />
        ))}
      </OrderListContainer>
    </DndProvider>
  );
};

const DroppableSection = ({ status, title, orders, onDrop, onStatusChange, onCardClick }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'ORDER',
    drop: (item) => {
      onDrop(item.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <Section
      ref={drop}
      $status={status}
      status-type={status}
      style={{ backgroundColor: isOver ? 'lightgray' : 'white' }}
    >
      <SectionTitle>
        {title}
        <OrderCount>{orders.length}</OrderCount>
      </SectionTitle>
      
      <OrderGrid>
        {displayedOrders.map((order) => (
          <DraggableOrderCard
            key={order.id}
            order={order}
            onStatusChange={onStatusChange}
            onClick={() => onCardClick(order.id)}
          />
        ))}
      </OrderGrid>

      <Pagination>
        {currentPage > 1 && (
          <button onClick={goToPreviousPage}>
            Anterior
          </button>
        )}
        
        {totalPages > 1 && <span>Página {currentPage} de {totalPages}</span>}
        
        {currentPage < totalPages && (
          <button onClick={goToNextPage}>
            Próximo
          </button>
        )}
      </Pagination>
    </Section>
  );
};

const DraggableOrderCard = ({ order, onStatusChange, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ORDER',
    item: { id: order.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <OrderCard order={order} onStatusChange={onStatusChange} onClick={onClick} />
    </div>
  );
};

export default OrderList;
