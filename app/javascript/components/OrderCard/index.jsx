import React from 'react';
import { OrderCardContainer, OrderInfo, CustomerName, OrderDetails, OrderStatus } from './style.js';

const OrderCard = ({ order }) => {
  const getOrderStatus = (status) => {
    return {
      doing: 'Aguardando...',
      delivered: 'Entregue',
      paid: 'Pago',
      canceled: 'Cancelado'
    }[status] || 'Desconhecido';
  };

  return (
    <OrderCardContainer data-testid={order.id} >
      <OrderInfo>
        <CustomerName>{order.customer}</CustomerName>
        <OrderDetails>
          {order.table_info && `Mesa: ${order.table_info}`}<br />
          {order.pick_up_time && `Horário de retirada: ${order.pick_up_time}`}<br />
          {order.address && `Entrega - ${order.address}`}<br />
        </OrderDetails>
      </OrderInfo>
      <OrderStatus>Status: {getOrderStatus(order.status)}</OrderStatus>
    </OrderCardContainer>
  );
};

export default OrderCard;
