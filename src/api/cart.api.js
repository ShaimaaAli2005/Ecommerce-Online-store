import api from './axios';

// 1. جلب السلة (GET /carts)
export const getCart = async () => {
  const response = await api.get('/carts');
  return response.data;
};
export const getCartApi = getCart;

// 2. إضافة منتج للسلة (POST /carts/items)
export const addToCartApi = async (rawPayload, maybeQty = 1) => {
  let cleanPayload = {};

  // تنقية البيانات سواء أُرسل كائن منتج كامل أو payload مجهز
  if (rawPayload && typeof rawPayload === 'object') {
    const id = rawPayload.productId || rawPayload.product || rawPayload._id || rawPayload.id;
    const qty = Number(rawPayload.quantity || maybeQty || 1);

    cleanPayload = {
      productId: id,
      quantity: qty,
    };
  } else if (typeof rawPayload === 'string') {
    cleanPayload = {
      productId: rawPayload,
      quantity: Number(maybeQty || 1),
    };
  }

  const response = await api.post('/carts/items', cleanPayload);
  return response.data;
};
export const addItemToCart = addToCartApi;
export const addToCart = addToCartApi;

// 3. تعديل كمية منتج (PATCH /carts/items)
export const updateCartItemApi = async (rawPayload, maybeQty) => {
  let cleanPayload = {};

  if (rawPayload && typeof rawPayload === 'object') {
    const id = rawPayload.productId || rawPayload.product || rawPayload._id || rawPayload.id;
    const qty = Number(rawPayload.quantity || maybeQty || 1);

    cleanPayload = {
      productId: id,
      quantity: qty,
    };
  } else if (typeof rawPayload === 'string') {
    cleanPayload = {
      productId: rawPayload,
      quantity: Number(maybeQty || 1),
    };
  }

  const response = await api.patch('/carts/items', cleanPayload);
  return response.data;
};


// المسمى المطلوب في CartContext.jsx
export const updateCartQuantityApi = updateCartItemApi;
export const updateQuantityApi = updateCartItemApi;
export const updateItemQuantity = updateCartItemApi;
export const updateCartItem = updateCartItemApi;

// 4. حذف منتج من السلة (DELETE /carts/items/:productId)
export const removeCartItemApi = async (productId) => {
  const response = await api.delete(`/carts/items/${productId}`);
  return response.data;
};
export const removeFromCartApi = removeCartItemApi;
export const removeItemFromCart = removeCartItemApi;
export const removeFromCart = removeCartItemApi;

// 5. تفريغ السلة بالكامل (DELETE /carts/clear)
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