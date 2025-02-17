import axios from 'axios';

export const createObject = async (url, payload) => {
  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    return { error: `Erro ao atualizar o pedido. ${error}` };
  }
};

export const updateObject = async (url, payload) => {
  try {
    const response = await axios.put(url, payload);
    return response.data;
  } catch (error) {
    return { error: `Erro ao atualizar o pedido. ${error}` };
  }
};
