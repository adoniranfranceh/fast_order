const fetchProducts = async (category = '') => {
  const url = new URL('/api/v1/products', window.location.origin);

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
