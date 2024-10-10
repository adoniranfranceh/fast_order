import axios from "axios";

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
      text: `Erro: ${error.response?.data?.base}`,
      confirmButtonText: 'OK'
    });
  }
};

export default updateObject;