import api from './axios';

// 1. جلب السلة
export const getCartApi = async () => {
  const response = await api.get('/carts');
  return response.data;
};
export const getCart = getCartApi;

// 2. إضافة منتج للسلة
export const addToCartApi = async (productId, quantity = 1) => {
  const response = await api.post('/carts/items', {
    productId,
    quantity,
  });
  return response.data;
};
export const addItemToCart = addToCartApi;
export const addToCart = addToCartApi;

// 3. تحديث الكمية
export const updateCartQuantityApi = async (productId, quantity) => {
  const response = await api.patch(`/carts/items/${productId}`, {
    quantity,
  });
  return response.data;
};
export const updateCartItemApi = updateCartQuantityApi;
export const updateQuantityApi = updateCartQuantityApi;
export const updateItemQuantity = updateCartQuantityApi;

// 4. حذف منتج من السلة
export const removeFromCartApi = async (productId) => {
  const response = await api.delete(`/carts/items/${productId}`);
  return response.data;
};
export const removeCartItemApi = removeFromCartApi;
export const removeItemFromCart = removeFromCartApi;
export const removeFromCart = removeFromCartApi;

// 5. تفريغ السلة
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

// Export default شاطر يضم كل الأسماء البديلة القديمة كاملة
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
  removeItemFromCart,
  removeFromCart,
  clearCartApi,
  clearCart,
  applyCouponApi,
  applyCoupon,
  removeCouponApi,
  removeCoupon,
};