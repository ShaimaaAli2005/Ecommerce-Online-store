import api from '../api/axios';

const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get logged-in user's orders
 getMyOrders: async () => {
  const response = await api.get('/orders/my');
  return response.data;
},

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/my/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.patch(`/orders/my/${id}/cancel`);
    return response.data;
  },
};

export default orderService;