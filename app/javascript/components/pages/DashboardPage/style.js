import styled from 'styled-components';
import theme from '../../theme';

export const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: space-between;
  align-items: stretch;
`;

export const ChartWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0.2, 0.1, 0.1, 0.1);
  padding: 20px;
  flex: 1 1 calc(33.333% - 40px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 300px;
  max-width: 100%;
  
  @media (max-width: 1200px) {
    flex: 1 1 calc(50% - 40px);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }

  canvas {
    max-height: 250px;
  }
`;

export const DashboardTitle = styled.h1`
  font-size: 25px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.primary};
  text-align: center;
  margin: 40px;
`;

export const ChartTitle = styled.h3`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 10px;
`;

export const ChartDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.tertiary};
  margin-top: 10px;
`;


export const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  text-align: center;
  margin-bottom: ${theme.spacing.large};
`;

export const Description = styled.p`
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.mutedText};
  margin-top: ${theme.spacing.small};
`;

export const Canvas = styled.canvas`
  display: block;
  width: 100% !important;
  height: 400px !important;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
`;
