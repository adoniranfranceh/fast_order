const fetchProducts = async (currentUser, category = '') => {
  if (!currentUser || !currentUser.admin_id) {
    throw new Error('Usuário não autenticado');
  }

  const url = new URL('/api/v1/products', window.location.origin);
  url.searchParams.append('admin_id', currentUser.admin_id);

  if (category) {
    url.searchParams.append('category', category);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao buscar produtos');
  }
  return response.json();
};

export default fetchProducts;
