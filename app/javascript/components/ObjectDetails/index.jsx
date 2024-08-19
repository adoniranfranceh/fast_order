import React from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';

const ObjectDetails = ({ open, onClose, itemData }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2,
            maxWidth: '100%',
            width: '400px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Detalhes do Cliente
          </Typography>
          <TextField
            label="Nome"
            value={itemData.name}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Email"
            value={itemData.email}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Telefone"
            value={itemData.phone}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Data de Nascimento"
            value={itemData.birthdate}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Pedido Favorito"
            value={itemData.favorite_order}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Descrição"
            value={itemData.description}
            multiline
            rows={4}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ObjectDetails;
