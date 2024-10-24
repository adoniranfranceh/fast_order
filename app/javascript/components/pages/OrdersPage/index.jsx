import React, { useState } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon, HourglassFull as HourglassFullIcon, Payment as PaymentIcon } from '@mui/icons-material';
import moment from 'moment';
import formatPrice from '../../services/formatPrice.js';
import { ObjectList } from '../../index.js';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'doing':
        return (
          <Tooltip title="Em andamento">
            <HourglassFullIcon color="action" />
          </Tooltip>
        );
      case 'delivered':
        return (
          <Tooltip title="Entregue">
            <CheckCircleIcon color="primary" />
          </Tooltip>
        );
      case 'paid':
        return (
          <Tooltip title="Pago">
            <PaymentIcon color="success" />
          </Tooltip>
        );
      case 'canceled':
        return (
          <Tooltip title="Cancelado">
            <CancelIcon color="error" />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  const getDeliveryType = (deliveryType) => {
    switch (deliveryType) {
      case 'local':
        return 'Local';
      case 'delivery':
        return 'Delivery';
      case 'pickup':
        return 'Para retirada';
      default:
        return 'Desconhecido';
    }
  };

  const getDeliveryInfo = (order) => {
    switch (order.delivery_type) {
      case 'local':
        return `Mesa: ${order.table_info}`;
      case 'delivery':
        return order.address;
      case 'pickup':
        return moment.utc(order.pick_up_time).format('HH:mm');
      default:
        return 'Desconhecido';
    }
  };

  const renderOrderItem = (order) => [
    <span key="id">{order.code || ''}</span>,
    <span key="customer">{order.customer}</span>,
    <span key="status">{getStatusIcon(order.status)}</span>,
    <span key="delivery_type">{getDeliveryType(order.delivery_type)}</span>,
    <span key="delivery_info">{getDeliveryInfo(order)}</span>,
    <span key="total_price">R$ {formatPrice(order.total_price)}</span>
  ];

  return (
    <Box sx={{ p: 2 }}>
      <ObjectList
        url="/api/v1/orders"
        renderItem={renderOrderItem}
        listTitle="Lista de Pedidos"
        refresh={refreshList}
        detailName="pedido"
        columns={['Código', 'Cliente', 'Status', 'Tipo de Entrega', 'Info da Entrega', 'Valor']}
        objectName='orders'
        enableDateFilter
        dateLabel='Buscar pedidos do dia:'
      />
    </Box>
  );
};

export default OrdersPage;
