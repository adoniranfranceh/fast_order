import axios from 'axios';

export const createOrder = async (url, payload) => {
  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return { error: 'Erro ao criar o pedido.' };
  }
};

export const updateOrder = async (url, payload) => {
  try {
    const response = await axios.put(url, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return { error: 'Erro ao atualizar o pedido.' };
  }
};
