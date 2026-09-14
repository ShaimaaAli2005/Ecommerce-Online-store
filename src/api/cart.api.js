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
export const removeFromCartApi = removeCartItemApi;
export const removeItemFromCart = removeCartItemApi;
export const removeFromCart = removeCartItemApi;

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
export const clearCart = clearCartApi;

// 6. الكوبونات
export const applyCouponApi = async (code) => {
  const response = await api.post('/carts/coupon', { code });
  return response.data;
};
export const applyCoupon = applyCouponApi;

export const removeCouponApi = async () => {
  const response = await api.delete('/carts/coupon');
  return response.data;
};
export const removeCoupon = removeCouponApi;

export default {
  getCart,
  getCartApi,
  addToCartApi,
  addItemToCart,
  addToCart,
  updateCartItemApi,
  updateCartQuantityApi,
  updateQuantityApi,
  updateItemQuantity,
  removeCartItemApi,
  removeFromCartApi,
  clearCartApi,
  applyCouponApi,
  removeCouponApi,
};