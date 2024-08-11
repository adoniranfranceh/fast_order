import React from 'react';
import { OrderCardContainer, OrderInfo, CustomerName, OrderDetails, OrderStatus } from './style.js';

const OrderCard = ({ order }) => {
  return (
    <OrderCardContainer status={order.status}>
      <OrderInfo>
        <CustomerName>{order.customer}</CustomerName>
        <OrderDetails>
          {order.table_info && 'Mesa: '}{order.table_info || 'N/A'}<br />
          {order.address && 'Endereço: '}{order.address || 'N/A'}<br />
          {order.pick_up_time && 'Horário de retirada: '}{order.pick_up_time || 'N/A'}
        </OrderDetails>
      </OrderInfo>
      <OrderStatus>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</OrderStatus>
    </OrderCardContainer>
  );
};

export default OrderCard;
