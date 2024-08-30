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
} from './style';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateObjectStatus = async (id, newStatus) => {
    putStatus('/api/v1/orders', id, { status: newStatus }, setOrders);
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

  return (
    <Section
      ref={drop}
      $status={status}
      style={{ backgroundColor: isOver ? 'lightgray' : 'white' }}
    >
      <SectionTitle>{title}</SectionTitle>
      <OrderGrid>
        {orders.map((order) => (
          <DraggableOrderCard
            key={order.id}
            order={order}
            onStatusChange={onStatusChange}
            onClick={() => onCardClick(order.id)}
          />
        ))}
      </OrderGrid>
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
