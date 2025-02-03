import axios from 'axios';
import Swal from 'sweetalert2';

const createObject = async (url, payload) => {
  try {
    const response = await axios.post(url, payload);
    
    response.data;
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Criado com sucesso.',
      confirmButtonText: 'OK'
    });
  } catch (error) {
    console.log('Erro ao criar:', error.response.data);
    return Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: `${error.response?.data}`,
      confirmButtonText: 'OK'
    });
  }
};

export default createObject;
