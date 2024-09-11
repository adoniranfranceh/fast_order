import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box, Divider } from '@mui/material';
import styled from 'styled-components';
import putStatus from '../services/putStatus';
import formatPrice from '../services/formatPrice.js';
import theme from '../theme';

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  margin-bottom: 20px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemDetails = styled.div`
  flex: 1;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const TotalContainer = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: right;
`;

const ConfirmButton = styled(Button)`
  margin-top: 20px;
  width: calc(50% + 8vh);
`;

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [itemStatuses, setItemStatuses] = useState({});
  const [remainingTotal, setRemainingTotal] = useState(0);
  const { id } = useParams();

  const calculateRemainingTotal = useCallback((items) => {
    const total = items.reduce((acc, item) => {
      if (item.status === "pendent") {
        const additionalsSum = item.additional_fields?.reduce((sum, additional) => sum + parseFloat(additional.additional_value || 0), 0) || 0;
        return acc + (parseFloat(item.price) || 0) + additionalsSum;
      }
      return acc;
    }, 0);
    setRemainingTotal(total);
  }, []);

  const fetchOrderDetails = useCallback(() => {
    axios.get(`/api/v1/orders/${id}`)
      .then(({ data }) => {
        setOrder(data);
        const initialStatuses = data.items?.reduce((acc, item) => ({ ...acc, [item.id]: item.status || "pendent" }), {}) || {};
        setItemStatuses(initialStatuses);
        calculateRemainingTotal(data.items || []);
      })
      .catch(console.error);
  }, [id, calculateRemainingTotal]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleItemStatusChange = useCallback(async (itemId, newStatus) => {
    const updatedItems = order.items.map((item) => item.id === itemId ? { ...item, status: newStatus } : item);
    await putStatus('/api/v1/orders', id, { items_attributes: [{ id: itemId, status: newStatus }] }, setOrder, 'order');
    setOrder((prev) => ({ ...prev, items: updatedItems }));
    setItemStatuses((prev) => ({ ...prev, [itemId]: newStatus }));
    calculateRemainingTotal(updatedItems);
  }, [id, order, calculateRemainingTotal]);

  const handleItemPayment = useCallback((itemId) => {
    if (itemStatuses[itemId] !== "paid") handleItemStatusChange(itemId, "paid");
  }, [itemStatuses, handleItemStatusChange]);

  const handleItemUndoPayment = useCallback((itemId) => {
    if (itemStatuses[itemId] !== "pendent") handleItemStatusChange(itemId, "pendent");
    fetchOrderDetails();
  }, [itemStatuses, handleItemStatusChange]);

  const handleConfirmPayment = useCallback(async () => {
    if (remainingTotal > 0) return;
    await putStatus('/api/v1/orders', id, { status: 'paid' }, setOrder, 'order');
    fetchOrderDetails();
  }, [remainingTotal, id, fetchOrderDetails]);

  const handlePayAll = useCallback(async () => {
    const updatedItems = order.items.map((item) => ({ ...item, status: 'paid' }));
    await putStatus('/api/v1/orders', id, { items_attributes: updatedItems.map(({ id }) => ({ id, status: 'paid' })) }, setOrder, 'order');
    setOrder((prev) => ({ ...prev, items: updatedItems }));
    setItemStatuses((prev) => updatedItems.reduce((acc, { id }) => ({ ...acc, [id]: 'paid' }), prev));
    calculateRemainingTotal(updatedItems);
  }, [order, id, calculateRemainingTotal]);

  const getStatus = useCallback((status) => ({
    doing: 'Aguardando',
    delivered: 'Entregue',
    paid: 'Pago',
    canceled: 'Cancelado',
  }[status] || 'Desconhecido'), [order]);

  const getDeliveryType = useCallback((delivery) => ({
    pickup: 'Para retirada',
    delivery: 'Delivery',
    local: 'Local',
  }[delivery] || 'Desconhecido'), []);

  const getStatusStyles = useCallback((status) => ({
    doing: { backgroundColor: theme.colors.doing.background, borderColor: theme.colors.doing.border, color: theme.colors.doing.text },
    delivered: { backgroundColor: theme.colors.delivered.background, borderColor: theme.colors.delivered.border, color: theme.colors.delivered.text },
    paid: { backgroundColor: theme.colors.paid.background, borderColor: theme.colors.paid.border, color: theme.colors.paid.text },
    canceled: { backgroundColor: theme.colors.canceled.background, borderColor: theme.colors.canceled.border, color: theme.colors.canceled.text },
  }[status] || { backgroundColor: theme.colors.background, borderColor: '#000', color: theme.colors.text }), []);

  if (!order) return <Typography>Carregando...</Typography>;

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <OrderHeader>
          <Typography variant="h4" gutterBottom>Pedido #{order.code}</Typography>
          <Typography><strong>Cliente:</strong> {order.customer}</Typography>
          <Typography><strong>Tipo de Entrega:</strong> {getDeliveryType(order.delivery_type)}</Typography>
          <Typography><strong>Por:</strong> {order.user.profile?.full_name || order.user.email}</Typography>
        </OrderHeader>
        <Box sx={{ py: 0.5, px: 1, borderRadius: theme.borderRadius, display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '.05rem', textTransform: 'uppercase', height: '50px', width: '120px', justifyContent: 'center', ...getStatusStyles(order.status) }}>
          {getStatus(order.status)}
        </Box>
      </div>

      {order.items?.map((item) => {
        const additionalsSum = item.additional_fields?.reduce((acc, additional) => acc + parseFloat(additional.additional_value || 0), 0) || 0;
        const totalItemPrice = (parseFloat(item.price) || 0) + additionalsSum;

        return (
          <React.Fragment key={item.id}>
            <ItemRow>
              <ItemDetails>
                <Typography variant="body1"><strong>{item.name}</strong> - R$ {formatPrice(item.price)}</Typography>
                <Typography variant="caption" color="gray">
                  Adicionais: {item.additional_fields?.map((add) => 
                    `${add.additional} (R$ ${formatPrice(add.additional_value)})`).join(', ')}
                </Typography>
                <strong>R$ {formatPrice(totalItemPrice)}</strong>
              </ItemDetails>
              <Actions>
                {itemStatuses[item.id] === 'paid' ? (
                  <Button variant="contained" color="warning" onClick={() => handleItemUndoPayment(item.id)}>Reverter</Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={() => handleItemPayment(item.id)}>Pagar</Button>
                )}
              </Actions>
            </ItemRow>
            <Divider />
          </React.Fragment>
        );
      })}

      <TotalContainer>
        {order.status === 'paid'
          ? `Total Pago: R$ ${formatPrice(order.total_price)}`
          : `Total Restante: R$ ${formatPrice(remainingTotal)}`}
      </TotalContainer>

      {remainingTotal === 0 && order.status !== 'paid' && (
        <ConfirmButton variant="contained" color="success" onClick={handleConfirmPayment}>Confirmar Pagamento</ConfirmButton>
      )}

      {remainingTotal !== 0 && (
        <Button variant="contained" color="primary" onClick={handlePayAll}>Pagar todos</Button>
      )}
    </Container>
  );
};

export default React.memo(OrderDetails);
