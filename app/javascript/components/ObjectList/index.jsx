import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ObjectList = ({ url, onEdit, refresh }) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao carregar dados');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchItems();
  }, [url, refresh]);

  const handleItemClick = (item) => {
    navigate(`/cliente/${item.id}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lista de Itens
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              background: '#f4f4f4',
              borderRadius: '6px',
              marginBottom: '10px',
              height: '80px',
              cursor: 'pointer'
            }}
            onClick={() => handleItemClick(item)}
          >
            <ListItemText primary={item.name} secondary={item.email} />
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                sx={{ mr: 1 }}
              >
                Editar
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ObjectList;
