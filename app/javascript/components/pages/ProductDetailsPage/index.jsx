import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Snackbar, Typography } from '@mui/material';
import theme from '../../theme';
import formatPrice from '../../services/formatPrice';
import {
  StyledPaper,
  Title,
  DetailsContainer,
  DetailRow,
  Label,
  Value,
  ButtonContainer,
  StyledButton,
  ErrorMessage
} from './style';
import ProductForm from '../ProductForm';
import deleteObject from '../../services/deleteObject'

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/products/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar os detalhes do produto');
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        setError('Não foi possível carregar os detalhes do produto.');
      }
    };
    fetchProduct();
  }, [id]);

  const handleEditProduct = () => {
    setIsEditing(true);
  };

  const handleDeleteProduct = async () => {
    try {
      const response = deleteObject('/api/v1/products', id);

      console.log(response === true)

      if(response && response === true) {
        navigate('/produtos')
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!product) return <Typography>Carregando...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <StyledPaper elevation={3}>
        {isEditing ? (
          <ProductForm productData={product} onSubmit={() => setIsEditing(false)} />
        ) : (
          <>
            <Title variant="h4">Detalhes do Produto</Title>
            <DetailsContainer>
              <DetailRow>
                <Label variant="body1">Nome:</Label>
                <Value color={theme.colors.primary} variant="body1">{product.name}</Value>
              </DetailRow>
              <DetailRow>
                <Label variant="body1">Descrição:</Label>
                <Value color={theme.colors.primary} variant="body1">{product.description || 'Sem descrição'}</Value>
              </DetailRow>
              <DetailRow>
                <Label variant="body1">Preço:</Label>
                <Value variant="body1" style={{ color: theme.colors.secondary }}>R$ {formatPrice(product.base_price)}</Value>
              </DetailRow>
              <DetailRow>
                <Label variant="body1">Quantidade Máxima de Adicionais:</Label>
                <Value color={theme.colors.primary} variant="body1">{product.max_additional_quantity || 'N/A'}</Value>
              </DetailRow>
              <DetailRow>
                <Label variant="body1">Categoria:</Label>
                <Value color={theme.colors.primary} variant="body1">{product.category}</Value>
              </DetailRow>
            </DetailsContainer>

            <ButtonContainer>
              <StyledButton
                variant="contained"
                onClick={handleEditProduct}
                sx={{
                  backgroundColor: theme.colors.primary, 
                  '&:hover': {
                    backgroundColor: theme.colors.primaryHover,
                  }
                }}
              >
                Editar Produto
              </StyledButton>
              <StyledButton
                variant="outlined"
                color="error"
                onClick={handleDeleteProduct}
              >
                Excluir Produto
              </StyledButton>
            </ButtonContainer>

            <Snackbar
              open={openSnackbar}
              onClose={handleCloseSnackbar}
              message="Produto excluído com sucesso!"
              autoHideDuration={2000}
            />
          </>
        )}
      </StyledPaper>
    </Container>
  );
};

export default ProductDetailsPage;
