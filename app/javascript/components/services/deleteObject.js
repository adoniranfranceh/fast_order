import axios from "axios";
import Swal from 'sweetalert2';

const deleteObject = (endpoint, id) => {
  return Swal.fire({
    title: 'Tem certeza que deseja excluir?',
    text: 'Essa ação não poderá ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      return axios
        .delete(`${endpoint}/${id}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'O objeto foi excluído com sucesso.',
            confirmButtonText: 'OK'
          });

          return true;
        })
        .catch((error) => {
          console.log('Erro ao excluir o objeto:', error.response?.data?.errors?.base);

          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: `Erro: ${error.response?.data?.errors?.base || 'Ocorreu um erro inesperado.'}`,
            confirmButtonText: 'OK'
          });

          return false;
        });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Cancelado',
        text: 'A exclusão foi cancelada.',
        confirmButtonText: 'OK'
      });

      return false;
    }
  });
};

export default deleteObject;
