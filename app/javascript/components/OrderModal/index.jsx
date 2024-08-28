import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OrderForm from '../OrderForm';

const OrderModal = ({ open, onClose, onOrderSuccess, order }) => {
  const handleOrderSuccess = () => {
    if (onOrderSuccess) {
      onOrderSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {order ? 'Editar Pedido' : 'Novo Pedido'}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <OrderForm
          onClose={onClose}
          onOrderSuccess={handleOrderSuccess}
          initialOrderData={order}
          />
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
