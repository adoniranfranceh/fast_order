import styled from 'styled-components';
import theme from '../../theme';

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.medium};
  background-color: ${theme.colors.background};
  min-height: 100vh;
`;

export const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  text-align: center;
  margin-bottom: ${theme.spacing.large};
`;

export const DashboardTitle = styled.h1`
  font-size: ${theme.fontSizes.large};
  color: ${theme.colors.text};
  margin: 0;
`;

export const Description = styled.p`
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.mutedText};
  margin-top: ${theme.spacing.small};
`;

export const ChartWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: ${theme.spacing.large};
`;

export const Canvas = styled.canvas`
  display: block;
  width: 100% !important;
  height: 400px !important;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
`;
