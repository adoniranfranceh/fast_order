import styled from 'styled-components';
import theme from '../theme';

export const OrderCardContainer = styled.div`
  background: ${theme.colors.white};
  padding: ${theme.spacing.small};
  border-radius: ${theme.borderRadius};
  color: ${theme.colors.text};
  box-shadow: ${theme.boxShadow};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 350px;
  margin: ${theme.spacing.small};
`;

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.colors.mutedText};
  padding-bottom: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.small};
`;

export const OrderInfo = styled.div`
  margin-bottom: ${theme.spacing.small};
`;

export const CustomerName = styled.h3`
  font-size: ${theme.fontSizes.small};
  margin: 0;
`;

export const OrderDetails = styled.div`
  margin: 0;
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.mutedText};
`;

export const OrderStatus = styled.span`
  font-size: ${theme.fontSizes.small};
  font-weight: bold;
  color: ${theme.colors.text};
  margin-top: ${theme.spacing.small};
`;

export const IconButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: ${theme.spacing.small};

  svg {
    cursor: pointer;
    color: ${theme.colors.text};
    transition: color 0.2s;
    font-size: 24px;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

export const DetailsButton = styled.button`
  margin-top: ${theme.spacing.small};
  padding: ${theme.spacing.small} ${theme.spacing.small};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: ${theme.fontSizes.small};
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

export const TimeIconWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.small};
  margin-top: ${theme.spacing.small};
`;

export const TimeText = styled.span`
  margin-left: ${theme.spacing.small};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.small};
  display: flex;
  align-items: center;
`;
