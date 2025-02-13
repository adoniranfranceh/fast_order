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
    return response.data
  } catch (error) {
    console.log('Erro ao atualizar pedido:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: `${error.response?.data?.errors?.base}`,
      confirmButtonText: 'OK'
    });

    throw error;
  }
};

export default updateObject;