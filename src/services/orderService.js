import api from "../api/axios";

export const getMyOrders = async () => {
  const response = await api.get("/orders/my");

  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/my/${id}`);

  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.patch(`/my/${id}/cancel`);

  return response.data;
};