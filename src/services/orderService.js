import api from '../api/axios';

const orderService = {
  // جلب طلبات المستخدم الحالية (GET /orders/my)
  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders/my', { params });
    return response.data;
  },

  // جلب تفاصيل طلب محدد برقم المعرف (GET /orders/my/{id})
  getOrderById: async (id) => {
    const response = await api.get(`/orders/my/${id}`);
    return response.data;
  },

  // إلغاء طلب نشط (PATCH /orders/my/{id}/cancel)
  cancelOrder: async (id) => {
    const response = await api.patch(`/orders/my/${id}/cancel`);
    return response.data;
  },
};

export default orderService;