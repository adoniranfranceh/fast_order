import axios from "axios";
import Swal from 'sweetalert2';

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
      
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'O status do objeto foi atualizado com sucesso.',
        confirmButtonText: 'OK'
      });
      
      return true;
    })
    .catch((error) => {
      console.log('Erro ao atualizar o status do objeto:', error.response.data.base);
      
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Erro: ${error.response?.data?.base}`,
        confirmButtonText: 'OK'
      });
      
      return null;
    });
};

export default putStatus;
