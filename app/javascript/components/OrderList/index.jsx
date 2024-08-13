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
          const existingOrder = prevOrders.findIndex(order => order.id === data.id);
  
          if(existingOrder !== -1) {
            const updateOrders = [...prevOrders];
            updateOrders[existingOrder] = data;
            return updateOrders
          } else {
            return [...prevOrders, data];
          }
        })
      }
    });

    fetchOrders()

    return () => {
      subscription.unsubscribe();
    }; 

  }, []);

  const fetchOrders = () => {
    axios.get('api/v1/orders')
      .then(function (response) {
        setOrders(response.data)
      })
      .catch(function (error) {
      })
  }

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
    if (groupedOrders[order.status]) {
      groupedOrders[order.status].push(order);
    } else {
    }
  });

  return (
    <OrderListContainer>
      {Object.keys(groupedOrders).map(status => (
        <Section key={status} status={status}>
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
