import axios from "axios";
import Swal from 'sweetalert2';

const putStatus = (endpoint, id, updateData, setObjects, objectType, showNotification = true) => {
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

      if (showNotification) {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Status atualizado com sucesso.',
          confirmButtonText: 'OK'
        });
      }
      
      return true;
    })
    .catch((error) => {
      console.log('Erro ao atualizar o status:', error.response?.data?.base);

      if (showNotification) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: `Erro: ${error.response?.data?.base}`,
          confirmButtonText: 'OK'
        });
      }
      
      return null;
    });
};

export default putStatus;
