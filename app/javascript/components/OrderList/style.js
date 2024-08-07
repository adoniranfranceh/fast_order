import styled from 'styled-components';

export const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

export const Section = styled.div`
  margin-bottom: 40px;
`;

export const SectionTitle = styled.h2`
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
`;

export const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

export const OrderCard = styled.div`
  background: ${({ status }) =>
    status === 'doing' ? '#ffeb3b' :
    status === 'delivered' ? '#4caf50' :
    status === 'paid' ? '#2196f3' :
    '#f44336'};
  padding: 20px;
  border-radius: 10px;
  color: #fff;
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
`;