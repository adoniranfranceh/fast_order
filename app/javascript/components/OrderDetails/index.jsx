import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box, Divider } from '@mui/material';
import styled from 'styled-components';
import putStatus from '../services/putStatus';

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
`;

const ItemPrice = styled.div`
  font-weight: bold;
  margin-top: 5px;
`;

const ItemAdditionals = styled.div`
  font-size: 0.85rem;
  color: gray;
  margin-top: 5px;
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
  width: 100%;
`;

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [itemStatuses, setItemStatuses] = useState({});
  const [remainingTotal, setRemainingTotal] = useState(0);
  const { id } = useParams();

  const calculateRemainingTotal = useCallback((items) => {
    const total = items
      .filter((item) => item.status === "pendent")
      .reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
    setRemainingTotal(total);
  }, []);

  const fetchOrderDetails = useCallback(() => {
    axios
      .get(`/api/v1/orders/${id}`)
      .then((response) => {
        const orderData = response.data;
        setOrder(orderData);

        const initialStatuses = orderData.items?.reduce((acc, item) => ({
          ...acc,
          [item.id]: item.status || "pendent",
        }), {}) || {};

        setItemStatuses(initialStatuses);
        calculateRemainingTotal(orderData.items || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, calculateRemainingTotal]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleItemStatusChange = useCallback((itemId, newStatus) => {
    if (!order || !order.items) return;

    const updatedItems = order.items.map((item) =>
      item.id === itemId ? { ...item, status: newStatus } : item
    );

    putStatus('/api/v1/orders', id, {
      items_attributes: [{ id: itemId, status: newStatus }]
    }, setOrder, 'order').then(() => {
      setOrder((prevOrder) => ({
        ...prevOrder,
        items: updatedItems
      }));

      setItemStatuses((prevStatuses) => ({
        ...prevStatuses,
        [itemId]: newStatus
      }));

      calculateRemainingTotal(updatedItems);
    });
  }, [id, order, calculateRemainingTotal]);

  const handleItemPayment = useCallback((itemId) => {
    if (itemStatuses[itemId] === "paid") return;
    handleItemStatusChange(itemId, "paid");
  }, [itemStatuses, handleItemStatusChange]);

  const handleItemUndoPayment = useCallback((itemId) => {
    if (itemStatuses[itemId] === "pendent") return;
    handleItemStatusChange(itemId, "pendent");
  }, [itemStatuses, handleItemStatusChange]);

  const handleConfirmPayment = useCallback(() => {
    if (remainingTotal > 0) return;
    putStatus('/api/v1/orders', id, { status: 'paid' }, setOrder, 'order').then(() => {
      fetchOrderDetails();
    });
  }, [remainingTotal, id, fetchOrderDetails]);

  if (!order) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Container>
      <OrderHeader>
        <Typography variant="h4" gutterBottom>
          Pedido #{order.id}
        </Typography>
        <Typography><strong>Cliente:</strong> {order.customer}</Typography>
        <Typography><strong>Tipo de Entrega:</strong> {order.delivery_type}</Typography>
      </OrderHeader>

      {order.items?.map((item) => (
        <React.Fragment key={item.id}>
          <ItemRow>
            <ItemDetails>
              <Typography variant="body1"><strong>{item.name}</strong></Typography>
              <ItemPrice>R$ {(parseFloat(item.price) || 0).toFixed(2)}</ItemPrice>
              {item.additional_fields && item.additional_fields.length > 0 && (
                <ItemAdditionals>
                  Adicionais: {item.additional_fields.map((additional) => (
                    <span key={additional.id}>
                      {additional.additional}
                      {additional.additional_value && (
                        <span> (R$ {parseFloat(additional.additional_value).toFixed(2)})</span>
                      )}
                      {", "}
                    </span>
                  ))}
                </ItemAdditionals>
              )}
            </ItemDetails>
            <Actions>
              {itemStatuses[item.id] === 'paid' ? (
                <Button variant="contained" color="warning" onClick={() => handleItemUndoPayment(item.id)}>
                  Reverter
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={() => handleItemPayment(item.id)}>
                  Pago
                </Button>
              )}
            </Actions>
          </ItemRow>
          <Divider />
        </React.Fragment>
      ))}

      <TotalContainer>
        Total Restante: R$ {remainingTotal.toFixed(2)}
      </TotalContainer>

      {remainingTotal <= 0 && (
        <ConfirmButton variant="contained" color="success" onClick={handleConfirmPayment}>
          Confirmar Pagamento
        </ConfirmButton>
      )}
    </Container>
  );
};

export default OrderDetails;
