import api from './axios';

// جلب بيانات السلة من الباك إند
export const getCartApi = async () => {
  const response = await api.get('/api/carts');
  return response.data;
};

// إضافة منتج إلى السلة عبر الانبوينت
export const addToCartApi = async (productId, quantity = 1) => {
  const response = await api.post('/api/carts/items', { productId, quantity });
  return response.data;
};

// تعديل كمية منتج في السلة
export const updateCartQuantityApi = async (productId, quantity) => {
  const response = await api.patch(`/api/carts/items/${productId}`, { quantity });
  return response.data;
};

// حذف منتج من السلة
export const removeFromCartApi = async (productId) => {
  const response = await api.delete(`/api/carts/items/${productId}`);
  return response.data;
};

// تفريغ السلة بالكامل
export const clearCartApi = async () => {
  const response = await api.delete('/api/carts/clear');
  return response.data;
};
