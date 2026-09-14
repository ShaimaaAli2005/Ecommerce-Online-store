import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await orderService.getMyOrders();

      setOrders(response?.data?.orders || response?.data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel the order.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-600">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You don't have any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-5 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-semibold">
                    Order #{order._id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ''}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                  {order.status || 'Pending'}
                </span>
              </div>

              <div className="mb-4">
                <p>
                  <strong>Total:</strong>{' '}
                  {order.totalPrice ?? order.total ?? 0}
                </p>
              </div>

              {order.status !== 'cancelled' &&
                order.status !== 'Canceled' && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
