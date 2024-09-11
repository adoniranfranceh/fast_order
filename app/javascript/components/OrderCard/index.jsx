import React, { useEffect, useState } from 'react';
import { FaHourglassHalf, FaTruck, FaCheck, FaBan, FaClock } from 'react-icons/fa';
import moment from 'moment';
import { useDrag } from 'react-dnd';
import {
  OrderCardContainer,
  OrderHeader,
  OrderInfo,
  CustomerName,
  OrderDetails,
  OrderStatus,
  IconButtonContainer,
  DetailsButton,
  TimeIconWrapper,
  TimeText
} from './style';
import OrderModal from '../OrderModal';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';

import { Avatar, IconButton, Tooltip } from '@mui/material';
import useOrderTimer from '../../hooks/useOrderTimer';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order, onStatusChange, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ORDER',
    item: { id: order.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const elapsedTime = useOrderTimer(order.id, order.time_started, order.time_stopped, order.status);
  const navigate = useNavigate();

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

  const handleProfileClick = (userId) => {
    navigate(`/perfil/${userId}`);
  };

  return (
    <OrderCardContainer
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <OrderHeader>
        <strong>Pedido #{order.code}</strong>
        <IconButton color="primary" onClick={openModal}>
          <EditIcon />
        </IconButton>
      </OrderHeader>
      <OrderInfo>
        <CustomerName>{order.customer}</CustomerName>
        <OrderDetails>
          {order.table_info && <p>Mesa: {order.table_info}</p>}
          {order.pick_up_time && <p>Horário de retirada: {moment.utc(order.pick_up_time).format('HH:mm')}</p>}
          {order.address && <p>Entrega - {order.address}</p>}
        </OrderDetails>
      </OrderInfo>

      <Tooltip title={order.user?.profile?.full_name || order.user?.email} arrow>
        <Avatar
          alt="User Avatar"
          src={order.user?.profile?.photo_url}
          onClick={() => handleProfileClick(order.user_id)}
          style={{ cursor: 'pointer', width: '40px', height: '40px', marginBottom: '10px' }}
        />
      </Tooltip>

      <OrderStatus>Status: {getOrderStatus(order.status)}</OrderStatus>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <TimeIconWrapper>
          <Tooltip title={`Tempo de espera: ${moment.utc(elapsedTime * 1000).format('HH:mm:ss')}`} arrow>
            <div>
              <FaClock size={20} />
            </div>
          </Tooltip>
          <TimeText>
            {moment.utc(elapsedTime * 1000).format('HH:mm:ss')}
          </TimeText>
        </TimeIconWrapper>
        <Tooltip title="Imprimir Nota" arrow>
          <IconButton onClick={() => window.open(`api/v1/orders/${order.id}/print_invoice`, '_blank')}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </div>

      <IconButtonContainer>
        {order.status !== 'doing' && order.time_stopped === moment().subtract(2, 'hours') && (
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
      />
    </OrderCardContainer>
  );
};

export default OrderCard;
