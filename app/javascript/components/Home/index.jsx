import React, { useState, useEffect } from 'react';
import consumer from '../services/cable';

// const ws = new WebSocket("ws://localhost:3000/cable");

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("Iniciando a inscrição no OrdersChannel...");

    const subscription = consumer.subscriptions.create({ channel: "OrdersChannel" }, {
      connected() {
        console.log("Conectado ao OrdersChannel com sucesso!");
      },
      disconnected() {
        console.log("Desconectado do OrdersChannel.");
      },
      received(data) {
        console.log("Nova mensagem recebida do servidor:", data);
        setOrders(prevOrders => [...prevOrders, data]);
      }
    });

    console.log("Inscrição criada:", subscription);

    // Cleanup da inscrição quando o componente é desmontado
    return () => {
      console.log("Cancelando a inscrição no OrdersChannel...");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>Ordens Recebidas:</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>{order.costumer}</li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
