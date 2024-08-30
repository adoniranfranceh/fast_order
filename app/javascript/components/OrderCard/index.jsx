import React, { useEffect, useState } from 'react';
import { FaHourglassHalf, FaTruck, FaCheck, FaBan } from 'react-icons/fa';
import moment from 'moment';
import { useDrag } from 'react-dnd';
import {
  OrderCardContainer,
  OrderInfo,
  CustomerName,
  OrderDetails,
  OrderStatus,
  IconButtonContainer,
  DetailsButton
} from './style';
import OrderModal from '../OrderModal';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

const OrderCard = ({ order, onStatusChange, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ORDER',
    item: { id: order.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const getOrderStatus = (status) => {
    const statusMap = {
      doing: 'Aguardando...',
      delivered: 'Entregue',
      paid: 'Pago',
      canceled: 'Cancelado',
    };
    return statusMap[status] || 'Desconhecido';
  };

  const [showPaidIcon, setShowPaidIcon] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const openModal = () => setIsEditing(true);
  const closeModal = () => setIsEditing(false);

  const handleOrderSuccess = () => {
    closeModal();
  };

  useEffect(() => {
    if (order && order.items) {
      const allPaid = order.items.every(item => item.status === 'paid');
      setShowPaidIcon(allPaid);
    }
  }, [order]);  

  return (
    <OrderCardContainer
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <OrderInfo>
        #{order.id}
        <IconButton
          color="primary"
          onClick={() => {setIsEditing(true)}}
        >
          <EditIcon/>
        </IconButton>
        <CustomerName>{order.customer}</CustomerName>
        <OrderDetails>
          {order.table_info && `Mesa: ${order.table_info}`}<br />
          {order.pick_up_time && `Horário de retirada: ${moment.utc(order.pick_up_time).format('HH:mm')}`}<br />
          {order.address && `Entrega - ${order.address}`}<br />
        </OrderDetails>
      </OrderInfo>
      <OrderStatus>Status: {getOrderStatus(order.status)}</OrderStatus>
      <IconButtonContainer>
        {order.status !== 'doing' && (
          <FaHourglassHalf
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, 'doing');
            }}
            title="Em andamento"
          />
        )}
        {order.status !== 'delivered' && (
          <FaTruck
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, 'delivered');
            }}
            title="Marcar como Entregue"
          />
        )}
        {showPaidIcon && order.status !== 'paid' && (
          <FaCheck
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, 'paid');
            }}
            color='green'
            title="Marcar como Pago"
          />
        )}
        {order.status !== 'canceled' && order.status !== 'paid' && (
          <FaBan
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, 'canceled');
            }}
            title="Marcar como Cancelado"
            color='red'
          />
        )}
      </IconButtonContainer>
      <DetailsButton onClick={onClick}>Ver Detalhes</DetailsButton> 
      <OrderModal
        open={isEditing} 
        onClose={closeModal} 
        onOrderSuccess={handleOrderSuccess}
        order={order}
      ></OrderModal>
    </OrderCardContainer>
  );
};

export default OrderCard;
