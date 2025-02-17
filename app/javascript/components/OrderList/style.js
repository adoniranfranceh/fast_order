import styled from 'styled-components';
import theme from '../theme';

export const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  color: ${theme.colors.text};
  font-weight: 700;
  font-size: 16px;
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

export const OrderCount = styled.span`
  font-size: 14px;
  color: #888;
  margin-left: 10px;
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 4px 8px;
  font-weight: normal;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 10px;
  font-size: 14px;

  button {
    background-color: #008CBA;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  span {
    display: flex;
    align-items: center;
  }
`;
