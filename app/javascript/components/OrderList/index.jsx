import React, { useState, useEffect } from 'react';
import consumer from '../services/cable';
import axios from 'axios';
import {
  OrderListContainer,
  Section,
  SectionTitle,
  OrderGrid,
  OrderCard,
  OrderInfo,
  CustomerName,
  OrderDetails,
  OrderStatus,
} from './style';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("Iniciando a inscrição no OrdersChannel...");

    const subscription = consumer.subscriptions.create({ channel: "OrdersChannel" }, {
      connected() {
        console.log("Conectado ao OrdersChannel com sucesso!");
      },
      disconnected() {
        console.log("Desconectado do OrdersChannel.");
      },
      received(data) {
        console.log("Nova mensagem recebida do servidor:", data);
        setOrders(prevOrders => {
          const existingOrder = prevOrders.findIndex(order => order.id === data.id);
  
          console.log('---------' + existingOrder)
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

    console.log("Inscrição criada:", subscription);
    fetchOrders()

    return () => {
      console.log("Cancelando a inscrição no OrdersChannel...");
      subscription.unsubscribe();
    }; 

  }, []);

  const fetchOrders = () => {
    axios.get('api/v1/orders')
      .then(function (response) {
        setOrders(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const groupedOrders = {
    doing: [],
    delivered: [],
    paid: [],
    canceled: []
  };

  orders.forEach(order => {
    if (groupedOrders[order.status]) {
      groupedOrders[order.status].push(order);
    } else {
      console.error(`Status desconhecido: ${order.status}`);
    }
  });

  return (
    <OrderListContainer>
      <Section>
        <SectionTitle>Novos Pedidos</SectionTitle>
        <OrderGrid>
          {groupedOrders.doing.map(order => (
            <OrderCard key={order.id} status="doing">
              <OrderInfo>
                <CustomerName>{order.customer}</CustomerName>
                <OrderDetails>Mesa: {order.table || 'N/A'}</OrderDetails>
              </OrderInfo>
              <OrderStatus>Fazendo</OrderStatus>
            </OrderCard>
          ))}
        </OrderGrid>
      </Section>
      
      <Section>
        <SectionTitle>Entregues</SectionTitle>
        <OrderGrid>
          {groupedOrders.delivered.map(order => (
            <OrderCard key={order.id} status="delivered">
              <OrderInfo>
                <CustomerName>{order.customer}</CustomerName>
                <OrderDetails>Mesa: {order.table || 'N/A'}</OrderDetails>
              </OrderInfo>
              <OrderStatus>Entregue</OrderStatus>
            </OrderCard>
          ))}
        </OrderGrid>
      </Section>
      
      <Section>
        <SectionTitle>Pagos</SectionTitle>
        <OrderGrid>
          {groupedOrders.paid.map(order => (
            <OrderCard key={order.id} status="paid">
              <OrderInfo>
                <CustomerName>{order.customer}</CustomerName>
                <OrderDetails>Mesa: {order.table || 'N/A'}</OrderDetails>
              </OrderInfo>
              <OrderStatus>Pago</OrderStatus>
            </OrderCard>
          ))}
        </OrderGrid>
      </Section>
      
      <Section>
        <SectionTitle>Cancelados</SectionTitle>
        <OrderGrid>
          {groupedOrders.canceled.map(order => (
            <OrderCard key={order.id} status="canceled">
              <OrderInfo>
                <CustomerName>{order.customer}</CustomerName>
                <OrderDetails>Mesa: {order.table || 'N/A'}</OrderDetails>
              </OrderInfo>
              <OrderStatus>Cancelado</OrderStatus>
            </OrderCard>
          ))}
        </OrderGrid>
      </Section>
    </OrderListContainer>
  );
};

export default OrderList;
