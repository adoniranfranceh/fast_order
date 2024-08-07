import consumer from "./consumer"

const ordersChannel = consumer.subscriptions.create("OrdersChannel", {
  received(data) {
    // Atualize o estado do React com os dados recebidos
    console.log("Recebido", data);
    // Implemente a lógica para atualizar o estado dos pedidos no React
  }
});

export default ordersChannel;
