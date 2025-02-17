import axios from "axios";
import Swal from 'sweetalert2';

const putStatus = (endpoint, id, updateData, showNotification = true) => {
  return axios
    .put(`${endpoint}/${id}`, updateData)
    .then(() => {
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
      if (showNotification) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: `Erro: ${error.response?.data?.errors?.base}`,
          confirmButtonText: 'OK'
        });
      }

      return { PromiseResult: false };
    });
};

export default putStatus;
