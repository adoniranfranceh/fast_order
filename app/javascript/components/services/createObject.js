import axios from 'axios';

const createObject = async (url, payload) => {
  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return { error: 'Erro ao criar o pedido.' };
  }
};

export default createObject;
