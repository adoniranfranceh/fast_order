import React, { useState, useEffect } from 'react';
import consumer from '../services/cable';
import { OrderCard } from '../index.js'
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
    const subscription = consumer.subscriptions.create({ channel: "OrdersChannel" }, {
      received(data) {
        setOrders(prevOrders => {
          const existingOrderIndex = prevOrders.findIndex(order => order.id === data.id);
  
          if (existingOrderIndex !== -1) {
            const updatedOrders = [...prevOrders];
            updatedOrders[existingOrderIndex] = data;
            return updatedOrders;
          } else {
            return [...prevOrders, data];
          }
        });
      }
    });

    fetchOrders();

    return () => {
      subscription.unsubscribe();
    }; 
  }, []);

  const fetchOrders = () => {
    axios.get('api/v1/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const groupedOrders = {
    doing: [],
    delivered: [],
    paid: [],
    canceled: []
  };

  const getSectionTitle = (status) => {
    return {
      doing: 'Novos Pedidos',
      delivered: 'Entregues',
      paid: 'Pagos',
      canceled: 'Cancelados'
    }[status] || 'Desconhecido';
  };

  orders.forEach(order => {
    console.log(order);
    if (groupedOrders[order.status]) {
      groupedOrders[order.status].push(order);
    } else {
    }
  });

  return (
    <OrderListContainer>
      {Object.keys(groupedOrders).map(status => (
        <Section key={status} $status={status} status-type={status}>
          <SectionTitle>{getSectionTitle(status)}</SectionTitle>
          <OrderGrid>
            {groupedOrders[status].map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </OrderGrid>
        </Section>
      ))}
    </OrderListContainer>
  );
};

export default OrderList;
