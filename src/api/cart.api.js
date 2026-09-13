import api from './axios';

export const getCartApi = async () => {
  const response = await api.get('/carts');
  return response.data;
};

export const addToCartApi = async (productId, quantity = 1) => {
  const response = await api.post('/carts/items', {
    productId,
    quantity,
  });

  return response.data;
};

export const updateCartQuantityApi = async (productId, quantity) => {
  const response = await api.patch(`/carts/items/${productId}`, {
    quantity,
  });
  return response.data;
};

export const removeFromCartApi = async (productId) => {
  const response = await api.delete(`/carts/items/${productId}`);
  return response.data;
};

export const clearCartApi = async () => {
  const response = await api.delete('/carts/clear');
  return response.data;
};
