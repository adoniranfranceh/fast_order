import axios from "axios";
import Swal from 'sweetalert2';

const updateObject = async (url, payload) => {
  try {
    const response = await axios.put(url, payload);
    response.data;
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Atualizado com sucesso.',
      confirmButtonText: 'OK'
    });
  } catch (error) {
    console.log('Erro ao atualizar pedido:', error);
    return Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: `${error.response?.data?.base}`,
      confirmButtonText: 'OK'
    });
  }
};

export default updateObject;