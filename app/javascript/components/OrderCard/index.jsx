import React from 'react';
import { FaHourglassHalf, FaTruck, FaCheck, FaBan } from 'react-icons/fa';
import {
  OrderCardContainer,
  OrderInfo,
  CustomerName,
  OrderDetails,
  OrderStatus,
  IconButtonContainer
} from './style';

const OrderCard = ({ order, onStatusChange }) => {
  const getOrderStatus = (status) => {
    const statusMap = {
      doing: 'Aguardando...',
      delivered: 'Entregue',
      paid: 'Pago',
      canceled: 'Cancelado',
    };
    return statusMap[status] || 'Desconhecido';
  };

  return (
    <OrderCardContainer>
      <OrderInfo>
        #{order.id}
        <CustomerName>{order.customer}</CustomerName>
        <OrderDetails>
          {order.table_info && `Mesa: ${order.table_info}`}<br />
          {order.pick_up_time && `Horário de retirada: ${order.pick_up_time}`}<br />
          {order.address && `Entrega - ${order.address}`}<br />
        </OrderDetails>
      </OrderInfo>
      <OrderStatus>Status: {getOrderStatus(order.status)}</OrderStatus>
      <IconButtonContainer>
        {order.status !== 'doing' && (
          <FaHourglassHalf
            onClick={() => onStatusChange(order.id, 'doing')}
            title="Em andamento"
          />
        )}
        {order.status !== 'delivered' && (
          <FaTruck
            onClick={() => onStatusChange(order.id, 'delivered')}
            title="Marcar como Entregue"
          />
        )}
        {order.status !== 'paid' && (
          <FaCheck
            onClick={() => onStatusChange(order.id, 'paid')}
            title="Marcar como Pago"
          />
        )}
        {order.status !== 'canceled' && (
        <FaBan
          onClick={() => onStatusChange(order.id, 'canceled')}
          title="Marcar como Cancelado"
        />
        )}
      </IconButtonContainer>
    </OrderCardContainer>
  );
};

export default OrderCard;
