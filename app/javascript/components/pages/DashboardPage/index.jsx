import React, { useEffect, useState } from 'react';
import 'chart.js/auto';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement, ArcElement } from 'chart.js';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';
import { DashboardContainer, ChartWrapper, DashboardTitle, ChartTitle, ChartDescription } from './style';

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement, ArcElement);

const Dashboard = () => {
  const [data, setData] = useState({
    profits: [],
    new_clients: [],
    recent_orders: [],
    monthly_orders: [],
    new_employees: [],
    loyalty_cards: []
  });

  useEffect(() => {
    fetch('/api/v1/dashboard')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const getChartData = (labels, dataset) => ({
    labels,
    datasets: [
      {
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.borderColor,
        backgroundColor: dataset.backgroundColor,
      },
    ],
  });

  return (
    <ThemeProvider theme={theme}>
      <DashboardTitle>Dashboard</DashboardTitle>
      <DashboardContainer>
        <ChartWrapper>
          <ChartTitle>Lucros dos Últimos Meses</ChartTitle>
          <Line
            data={getChartData(Object.keys(data.profits), {
              label: 'Lucro',
              data: Object.values(data.profits),
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.3)',
            })}
          />
          <ChartDescription>Visualize a tendência dos lucros ao longo dos meses.</ChartDescription>
        </ChartWrapper>

        <ChartWrapper>
          <ChartTitle>Novos Clientes Cadastrados por Mês</ChartTitle>
          <Pie
            data={getChartData(Object.keys(data.new_clients), {
              label: 'Novos Clientes',
              data: Object.values(data.new_clients),
              backgroundColor: [
                'rgba(76, 175, 80, 0.3)',
                'rgba(33, 150, 243, 0.3)',
                'rgba(244, 67, 54, 0.3)',
                'rgba(255, 235, 59, 0.3)',
                'rgba(156, 39, 176, 0.3)',
                'rgba(255, 152, 0, 0.3)',
                'rgba(121, 85, 72, 0.3)',
                'rgba(63, 81, 181, 0.3)',
                'rgba(0, 188, 212, 0.3)',
                'rgba(233, 30, 99, 0.3)',
                'rgba(139, 195, 74, 0.3)',
                'rgba(96, 125, 139, 0.3)',
              ],
              borderColor: [
                '#4CAF50',
                '#2196F3',
                '#F44336',
                '#FFEB3B',
                '#9C27B0',
                '#FF9800',
                '#795548',
                '#3F51B5',
                '#00BCD4',
                '#E91E63',
                '#8BC34A',
                '#607D8B',
              ],
            })}
          />
          <ChartDescription>Distribuição dos novos clientes ao longo dos meses.</ChartDescription>
        </ChartWrapper>

        <ChartWrapper>
          <ChartTitle>Pedidos dos Últimos Sete Dias</ChartTitle>
          <Line
            data={getChartData(Object.keys(data.recent_orders), {
              label: 'Pedidos Recentes',
              data: Object.values(data.recent_orders),
              borderColor: '#F44336',
              backgroundColor: 'rgba(244, 67, 54, 0.3)',
            })}
          />
          <ChartDescription>Quantos pedidos foram realizados nos últimos sete dias.</ChartDescription>
        </ChartWrapper>

        <ChartWrapper>
          <ChartTitle>Cartões Fidelidade por Mês</ChartTitle>
          <Bar
            data={getChartData(Object.keys(data.loyalty_cards), {
              label: 'Cartões Fidelidade',
              data: Object.values(data.loyalty_cards),
              backgroundColor: 'rgba(33, 150, 243, 0.3)',
              borderColor: '#2196F3',
            })}
          />
          <ChartDescription>Quantidade de novos cartões fidelidade por mês.</ChartDescription>
        </ChartWrapper>

        <ChartWrapper>
          <ChartTitle>Novos Colaboradores</ChartTitle>
          <Bar
            data={getChartData(Object.keys(data.new_employees), {
              label: 'Novos Colaboradores',
              data: Object.values(data.new_employees),
              backgroundColor: 'rgba(76, 175, 80, 0.3)',
              borderColor: '#4CAF50',
            })}
          />
          <ChartDescription>Número de novos colaboradores.</ChartDescription>
        </ChartWrapper>

        <ChartWrapper>
          <ChartTitle>Pedidos Mensais</ChartTitle>
          <Bar
            data={getChartData(Object.keys(data.monthly_orders), {
              label: 'Pedidos Mensais',
              data: Object.values(data.monthly_orders),
              backgroundColor: 'rgba(244, 67, 54, 0.3)',
              borderColor: '#F44336',
            })}
          />
          <ChartDescription>Pedidos ao longo dos meses.</ChartDescription>
        </ChartWrapper>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;
