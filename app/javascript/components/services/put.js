export const updateOrder = async (url, orderData) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // console.error('Error response:', errorText);
      return { error: `Failed to update order: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    // console.error('Fetch error:', error);
    return { error: 'Failed to update order due to a network error' };
  }
};
