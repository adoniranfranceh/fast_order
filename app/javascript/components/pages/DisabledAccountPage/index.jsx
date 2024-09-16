import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const DisabledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  text-align: center;
`;

const DisabledContent = styled.div`
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius};
  background: ${theme.colors.white};
  box-shadow: ${theme.boxShadow};
  max-width: 500px;
  width: 100%;
`;

const DisabledTitle = styled.h1`
  font-size: ${theme.fontSizes.xlarge};
  margin-bottom: ${theme.spacing.medium};
`;

const DisabledMessage = styled.p`
  font-size: ${theme.fontSizes.medium};
  margin-bottom: ${theme.spacing.large};
  line-height: 1.6;
`;

const DisabledAccountPage = () => {
  return (
    <DisabledContainer>
      <DisabledContent>
        <DisabledTitle>Conta Desativada</DisabledTitle>
        <DisabledMessage>
          Sua conta foi desativada. Entre em contato com o seu administrador para mais informações.
        </DisabledMessage>
      </DisabledContent>
    </DisabledContainer>
  );
};

export default DisabledAccountPage;
