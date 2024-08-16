import styled from 'styled-components';
import theme from '../theme';

export const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  @media(min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const Section = styled.div`
  background-color: ${({ $status }) => theme.colors[$status].background};
  border-left: 5px solid ${({ $status }) => theme.colors[$status].border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  
  @media(min-width: 768px) {
    flex: 1;
    margin: 0 10px 20px 10px;
    max-width: calc(50% - 20px);
  }
  
  @media(min-width: 1024px) {
    max-width: calc(33.33% - 20px);
  }
`;

export const SectionTitle = styled.h2`
  color: ${({ $status }) => theme.colors.text};
  font-weight: 700;
  font-size: 16;
  font-size: 24px;
  margin-bottom: 15px;
`;

export const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  @media(min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;
