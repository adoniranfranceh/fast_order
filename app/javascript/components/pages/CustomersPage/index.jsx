import React, { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import { CustomerForm } from '../../index.js';

const CustomersPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (customerData) => {
    console.log('Dados do cliente:', customerData);

    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Registrar Novo Cliente
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Abrir Formulário
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' },
            maxWidth: '700px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Registrar Cliente
          </Typography>
          <CustomerForm onSubmit={handleSubmit} />
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomersPage;
