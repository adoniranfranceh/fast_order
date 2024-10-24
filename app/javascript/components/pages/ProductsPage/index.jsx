import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ObjectList, CollaboratorForm, Button } from '../../index.js';
import { Box } from '@mui/material';
import 'moment/locale/pt-br';
import styled from "styled-components";
import theme from "../../theme/index.js";
import categoriesData from '../../../data/categories.json';
import formatPrice from '../../services/formatPrice.js';

const ProductsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const category = categoriesData.find(cat => cat.id === Number(id));

  const url = `/api/v1/products?category=${category.name}&paginate=true&`

  const handleNewProduct = () => {
    navigate('/produto/novo')
  };

  const renderProduct = (product) => [
    <span key="id">{product.id}</span>,
    <span key="name">{product.name}</span>,
    <span key="base_price">R$ {formatPrice(product.base_price)}</span>,
  ];

  const StyledButtonContainer = styled.div`
    margin-top: ${theme.spacing.medium};

    Button {
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
      &:hover {
        background-color: ${theme.colors.primaryHover};
      }
    }
  `;

  return (
    <Box sx={{ p: 2 }}>
      <StyledButtonContainer>
        <Button
          variant="contained" 
          color="primary" 
          onClick={handleNewProduct} 
          sx={{ mb: 2 }}
        >
          Novo produto
        </Button>
      </StyledButtonContainer>
      <ObjectList
        url={url}
        renderItem={renderProduct}
        detailName='produto'
        columns={['Id', 'Nome', 'Preço']}
        listTitle={category.name}
        objectName='products'
      />
    </Box>
  );
};

export default ProductsPage;
