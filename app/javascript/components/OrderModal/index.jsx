import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OrderForm from '../OrderForm';

const OrderModal = ({ open, onClose, onOrderSuccess, order }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOrderSuccess = () => {
    if (onOrderSuccess) {
      onOrderSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
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
      <DialogContent style={{ padding: '0 0 20px 0' }}>
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
