import axios from "axios";
import Swal from 'sweetalert2';

const putStatus = (endpoint, id, updateData, showNotification = true) => {
  return axios
    .put(`${endpoint}/${id}`, updateData)
    .then((response) => {
      if (showNotification) {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Status atualizado com sucesso.',
          confirmButtonText: 'OK'
        });
      }

      return { PromiseResult: true }; 
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

      return { PromiseResult: false };
    });
};

export default putStatus;
