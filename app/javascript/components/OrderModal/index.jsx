import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NewOrderForm from '../NewOrderForm';

const OrderModal = ({ open, onClose, onOrderSuccess }) => {
  const handleOrderSuccess = () => {
    if (onOrderSuccess) {
      onOrderSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Novo Pedido
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
        <NewOrderForm onClose={onClose} onOrderSuccess={handleOrderSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
