import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const ObjectList = ({ 
  url, 
  onEdit, 
  renderItem, 
  refresh,
  listTitle = 'Lista de Itens',
  columns = [],
  detailName 
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao carregar dados');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Erro:', error);
        setError('Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [url, refresh]);

  const handleItemClick = (item) => {
    navigate(`/${detailName}/${item.id}`);
  };

  return (
    <Box sx={{ p: 2, overflowX: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {listTitle}
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align="left" sx={{ fontWeight: 'bold' }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow 
                key={item.id} 
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                hover
                onClick={() => handleItemClick(item)}
              >
                {renderItem(item).map((cell, index) => (
                  <TableCell key={index} align="left" sx={{ flex: 1 }}>
                    {cell}
                  </TableCell>
                ))}
                { onEdit && (
                  <TableCell align="left" sx={{ textAlign: 'center', width: '100px' }}>
                    {onEdit && (
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                ) }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ObjectList;
