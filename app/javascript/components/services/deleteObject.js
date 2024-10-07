import axios from "axios";
import Swal from 'sweetalert2';

const deleteObject = (endpoint, id, setObjects, objectType) => {
  return axios
    .delete(`${endpoint}/${id}`)
    .then((response) => {
      if (objectType === 'order') {
        setObjects((prevOrder) => ({
          ...prevOrder,
          orders: prevOrder.orders.filter(order => order.id !== id),
        }));
      } else if (objectType === 'item') {
        setObjects((prevOrder) => ({
          ...prevOrder,
          items: prevOrder.items.filter(item => item.id !== id),
        }));
      }

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'O objeto foi excluído com sucesso.',
        confirmButtonText: 'OK'
      });

      return true;
    })
    .catch((error) => {
      console.log('Erro ao excluir o objeto:', error.response.data.base);
      
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Erro: ${error.response?.data?.base}`,
        confirmButtonText: 'OK'
      });
      
      return null;
    });
};

export default deleteObject;
