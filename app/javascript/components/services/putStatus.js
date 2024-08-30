import axios from "axios";

const putStatus = (endpoint, id, updateData, setObjects, objectType) => {
  return axios
    .put(`${endpoint}/${id}`, updateData)
    .then((response) => {
      if (objectType === 'order') {
        setObjects((prevOrder) => ({
          ...prevOrder,
          ...response.data.order,
        }));
      } else if (objectType === 'item') {
        setObjects((prevOrder) => ({
          ...prevOrder,
          items: prevOrder.items.map((item) =>
            item.id === updateData.id ? { ...item, status: updateData.status } : item
          ),
        }));
      }
    })
    .catch((error) => {
      console.log('Erro ao atualizar o status do objeto:', error.response.data.base);
      alert(`Erro: ${error.response?.data?.base}`);
    });
};

export default putStatus;
