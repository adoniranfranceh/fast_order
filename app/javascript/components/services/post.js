// src/services/post.js
export const createOrder = async (orderData) => {
  const response = await fetch('api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    return { error: 'Failed to create order' };
  }

  return response.json();
};
