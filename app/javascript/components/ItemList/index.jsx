import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, IconButton, TextField, Typography, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { AdditionalFields } from '../index.js';
import fetchProducts from '../services/fetchProducts.js';
import theme from '../theme/index.js';
import { AuthContext } from '../../context/AuthContext/index.jsx';

const ItemList = ({ items = [], setItems, errors }) => {
  const [products, setProducts] = useState([]);
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts(currentUser);
        setProducts(fetchedProducts.products);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    loadProducts();
  }, []);

  const handleProductSelection = (index, productName) => {
    const selectedProduct = products.find((product) => product.name === productName);

    if (selectedProduct) {
      const updatedItems = itemFiltered.map((item, i) =>
        i === index ? {
          ...item,
          name: selectedProduct.name,
          price: selectedProduct.base_price,
          max_additional_quantity: selectedProduct.max_additional_quantity,
          additional_fields: []
        } : item
      );
      setItems(updatedItems);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = itemFiltered.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value || item[field] };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    const newItem = { id: '', name: '', price: '', additional_fields: [] };
    setItems([...items, newItem]);
  };

  const itemFiltered = items.filter(item => !item._destroy)

  const handleRemoveItem = (index) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, _destroy: true } : item
    );  
    setItems(updatedItems);
  };

  return (
    <Box>
      {itemFiltered.map((item, index) => (
        <Box key={item.id || index} mb={2} p={2} border={1} borderRadius={2} style={{ paddingRight: '0px' }} index={index}>
          <Typography variant="caption" style={{color: theme.colors.primaryHover}}>
            {item.name}
          </Typography>
          <Box display="flex" alignItems="center">
            <Autocomplete
              freeSolo
              options={products.map((product) => product.name)}
              value={item.name || ''}
              onChange={(_, newValue) => {
                if (newValue) {
                  handleProductSelection(index, newValue);
                }
              }}
              onInputChange={(e, newValue) => {
                if (newValue.trim() !== '') {
                  handleItemChange(index, 'name', newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nome"
                  fullWidth
                  sx={{
                    flex: 2,
                    mr: { xs: 7, sm: 25 }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} style={{ whiteSpace: 'normal' }}>
                  {option}
                </li>
              )}
              noOptionsText="Nenhum produto encontrado"
              sx={{
                '& .MuiAutocomplete-option': {
                  whiteSpace: 'normal',
                },
              }}
            />
            <TextField
              label="Preço"
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              fullWidth
              sx={{
                ml: 2,
                width: { xs: '30%', sm: '24%' }
              }}
            />
            {itemFiltered.length != 0 && (
              <IconButton onClick={() => handleRemoveItem(index)} color="error" sx={{ ml: 2, margin: '0', height: '40px' }}>
                <RemoveIcon />
              </IconButton>
            )}
          </Box>
          <div style={{display: 'flex', margin: '2px'}}>
              <Typography data-cy="additionals-list" variant="caption" style={{color: theme.colors.primaryHover}}>
                Adicionais: {item.additional_fields?.map((add) => 
                  `${add.additional}`).join(', ')}
              </Typography>
          </div>
          <AdditionalFields
            additionalFields={item.additional_fields}
            onChange={(updatedFields) => handleItemChange(index, 'additional_fields', updatedFields)}
            maxAdditionals={products.find(product => product.name === item.name)?.max_additional_quantity || 0}
          />
        </Box>
      ))}
      {errors && <Typography color="error">{errors}</Typography>}
      <Button onClick={handleAddItem} startIcon={<AddIcon />}>
        Adicionar Item
      </Button>
    </Box>
  );
};

export default ItemList;
