import styled from 'styled-components';

export const OrderCardContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const OrderInfo = styled.div`
  margin-bottom: 10px;
`;

export const CustomerName = styled.h3`
  font-size: 20px;
  margin: 0;
`;

export const OrderDetails = styled.p`
  margin: 0;
  font-size: 16px;
`;

export const OrderStatus = styled.span`
  align-self: flex-end;
  font-size: 14px;
  font-weight: bold;
`;

export const IconButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;

  svg {
    cursor: pointer;
    color: #333;
    transition: color 0.2s;

    &:hover {
      color: #007bff;
    }
  }
`;
