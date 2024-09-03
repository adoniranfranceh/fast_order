import React, { useEffect, useState } from 'react';
import 'chart.js/auto';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement, ArcElement } from 'chart.js';
import styled from 'styled-components';

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement, ArcElement);

const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
`;

const ChartWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #f9f9f9;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  flex: 1 1 100%;
  max-width: 100%;
  
  @media (min-width: 768px) {
    flex: 1 1 calc(50% - 20px);
  }

  @media (min-width: 1024px) {
    flex: 1 1 calc(33.333% - 20px);
  }

  &.small {
    flex: 1 1 100%;
    max-width: 25%;
  }

  &.wide {
    flex: 1 1 calc(75% - 20px);
    max-width: calc(75% - 20px);
  }
`;

const ChartTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 1.25rem;
  color: #333;
`;

const ChartDescription = styled.p`
  margin: 10px 0;
  font-size: 0.875rem;
  color: #666;
`;

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
        backgroundColor: dataset.backgroundColor
      }
    ]
  });

  return (
    <DashboardContainer>
      <ChartWrapper className="wide">
        <ChartTitle>Lucros dos Últimos Meses</ChartTitle>
        <Line
          data={getChartData(
            Object.keys(data.profits),
            {
              label: 'Lucro',
              data: Object.values(data.profits),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)'
            }
          )}
        />
        <ChartDescription>Visualize a tendência dos lucros ao longo dos meses.</ChartDescription>
      </ChartWrapper>

      <ChartWrapper className="small">
        <ChartTitle>Novos Clientes Cadastrados por Mês</ChartTitle>
        <Pie
          data={getChartData(
            Object.keys(data.new_clients),
            {
              label: 'Novos Clientes',
              data: Object.values(data.new_clients),
              backgroundColor: [
                'rgba(153, 102, 255, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
              ],
              borderColor: [
                'rgb(153, 102, 255)',
                'rgb(75, 192, 192)',
                'rgb(255, 159, 64)',
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)'
              ]
            }
          )}
        />
        <ChartDescription>Distribuição dos novos clientes ao longo dos meses.</ChartDescription>
      </ChartWrapper>

      <ChartWrapper>
        <ChartTitle>Quantidade de Pedidos dos Últimos Sete Dias</ChartTitle>
        <Line
          data={getChartData(
            Object.keys(data.recent_orders),
            {
              label: 'Pedidos Recentes',
              data: Object.values(data.recent_orders),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)'
            }
          )}
        />
        <ChartDescription>Quantos pedidos foram realizados nos últimos sete dias.</ChartDescription>
      </ChartWrapper>

      <ChartWrapper>
        <ChartTitle>Quantidade de Pedidos por Mês</ChartTitle>
        <Bar
          data={getChartData(
            Object.keys(data.monthly_orders),
            {
              label: 'Pedidos Mensais',
              data: Object.values(data.monthly_orders),
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgb(255, 159, 64)'
            }
          )}
        />
        <ChartDescription>Visualize a quantidade de pedidos ao longo dos meses.</ChartDescription>
      </ChartWrapper>

      <ChartWrapper>
        <ChartTitle>Novos Colaboradores</ChartTitle>
        <Bar
          data={getChartData(
            Object.keys(data.new_employees),
            {
              label: 'Novos Colaboradores',
              data: Object.values(data.new_employees),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)'
            }
          )}
        />
        <ChartDescription>Quantidade de novos colaboradores adicionados.</ChartDescription>
      </ChartWrapper>

      <ChartWrapper>
        <ChartTitle>Novos Cartões Fidelidade por Mês</ChartTitle>
        <Bar
          data={getChartData(
            Object.keys(data.loyalty_cards),
            {
              label: 'Cartões Fidelidade',
              data: Object.values(data.loyalty_cards),
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgb(255, 206, 86)'
            }
          )}
        />
        <ChartDescription>Visualize a quantidade de novos cartões fidelidade ao longo dos meses.</ChartDescription>
      </ChartWrapper>
    </DashboardContainer>
  );
};

export default Dashboard;
