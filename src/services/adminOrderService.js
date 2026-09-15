import api from '../api/axios';

const adminOrderService = {
  // Get all orders
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders/admin', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/admin/${id}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/admin/${id}/status`, {
      status,
    });
    return response.data;
  },
};

export default adminOrderService;
