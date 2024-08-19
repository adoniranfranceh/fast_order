export const updateOrder = async (url, orderData) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    return { error: 'Failed to update order' };
  }

  return response.json();
};
