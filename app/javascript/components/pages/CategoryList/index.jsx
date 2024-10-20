import React from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import theme from "../../theme";

const categories = [
  { id: 1, name: 'Açaís', imageUrl: '/images/acai.jpg' },
  { id: 2, name: 'Pastéis', imageUrl: '/images/pasteis.jpg' },
  { id: 3, name: 'Cremes', imageUrl: '/images/cremes.jpg' },
  { id: 4, name: 'Guaranás', imageUrl: '/images/guaranas.webp' },
  { id: 5, name: 'Bebidas', imageUrl: '/images/bebidas.png' },
  { id: 6, name: 'Adicionais', imageUrl: '/images/adicionais.jpg' },
];

const CategoryList = () => {
  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        padding: 4, 
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 4, fontWeight: 'bold', color: '#333' }}>
        Categorias de Produtos
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={10} md={4} key={category.id}>
            <Box
              component={Link}
              to={`/categoria/${category.id}`}
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  '& > div': {
                    transform: 'scale(1.1)',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                    bgcolor: '#e0e0e0',
                    border: `2px solid ${theme.colors.primary}`,
                  },
                },
              }}
            >
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
                }}
              >
                <CardMedia
                  component="img"
                  alt={category.name}
                  height="190"
                  image={category.imageUrl}
                  sx={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                />
                <CardContent>
                  <Typography variant="h5" component="div" align="center" sx={{ fontWeight: '600', color: '#555' }}>
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryList;
