import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import consumer from '../services/cable';
import OrderCard from '../OrderCard';
import axios from 'axios';
import {
  OrderListContainer,
  Section,
  SectionTitle,
  OrderGrid,
} from './style';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

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
      .get('/api/v1/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateOrderStatus = (id, newStatus) => {
    axios
      .put(`/api/v1/orders/${id}`, { status: newStatus })
      .then((response) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
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

  return (
    <DndProvider backend={HTML5Backend}>
      <OrderListContainer>
        {Object.keys(groupedOrders).map((status) => (
          <DroppableSection
            key={status}
            status={status}
            title={getSectionTitle(status)}
            orders={groupedOrders[status]}
            onDrop={(orderId) => updateOrderStatus(orderId, status)}
            onStatusChange={updateOrderStatus}
          />
        ))}
      </OrderListContainer>
    </DndProvider>
  );  
};

const DroppableSection = ({ status, title, orders, onDrop, onStatusChange }) => {
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
          />
        ))}
      </OrderGrid>
    </Section>
  );
};

const DraggableOrderCard = ({ order, onStatusChange }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ORDER',
    item: { id: order.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <OrderCard order={order} onStatusChange={onStatusChange} />
    </div>
  );
};

export default OrderList;
