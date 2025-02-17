import axios from 'axios';
import Swal from 'sweetalert2';

const createObject = async (url, payload) => {
  try {
    const response = await axios.post(url, payload);
    
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Criado com sucesso.',
      confirmButtonText: 'OK'
    });
    return response.data;
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: `${error.response?.data?.errors}`,
      confirmButtonText: 'OK'
    });

    throw error;
  }
};

export default createObject;
