import axios from "axios";

const updateObject = async (url, payload) => {
  try {
    const response = await axios.put(url, payload);
    return response.data;
  } catch (error) {
    console.log('Erro ao atualizar pedido:', error);
    return { error: 'Erro ao atualizar o objecto.' };
  }
};

export default updateObject;