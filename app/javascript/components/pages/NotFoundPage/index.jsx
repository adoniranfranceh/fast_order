import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../../theme';

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  text-align: center;
`;

const NotFoundContent = styled.div`
  padding: ${theme.spacing.medium};
  border-radius: ${theme.borderRadius};
  background: ${theme.colors.white};
  box-shadow: ${theme.boxShadow};
`;

const NotFoundTitle = styled.h1`
  font-size: ${theme.fontSizes.large};
  margin-bottom: ${theme.spacing.medium};
`;

const NotFoundMessage = styled.p`
  font-size: ${theme.fontSizes.medium};
  margin-bottom: ${theme.spacing.large};
`;

const NotFoundLink = styled(Link)`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.medium};
  text-decoration: none;

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundTitle>404 - Página Não Encontrada</NotFoundTitle>
        <NotFoundMessage>
          Desculpe, a página que você está procurando não existe.
        </NotFoundMessage>
        <NotFoundLink to="/">Voltar para a Página Inicial</NotFoundLink>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
