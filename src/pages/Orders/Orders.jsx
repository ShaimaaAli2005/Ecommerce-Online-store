import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import orderService from '../../services/orderService';

const HIDDEN_ORDERS_KEY = 'hidden_order_ids';

const Orders = () => {
  const { t, i18n } = useTranslation('orders');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isArabic = i18n.language === 'ar';

  const handleLanguageChange = () => {
    i18n.changeLanguage(isArabic ? 'en' : 'ar');
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await orderService.getMyOrders();

      console.log('STORE ORDERS RESPONSE:', response);

      const hiddenOrderIds = JSON.parse(
        localStorage.getItem(HIDDEN_ORDERS_KEY) || '[]'
      );

      const ordersData = Array.isArray(response?.orders)
        ? response.orders.filter(
            (order) => !hiddenOrderIds.includes(order._id)
          )
        : [];

      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);

      setError(
        err.response?.data?.message ||
          t('loadError', 'Failed to load your orders')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleClearOrders = () => {
    const currentOrderIds = orders.map((order) => order._id);

    const existingHiddenIds = JSON.parse(
      localStorage.getItem(HIDDEN_ORDERS_KEY) || '[]'
    );

    const updatedHiddenIds = [
      ...new Set([...existingHiddenIds, ...currentOrderIds]),
    ];

    localStorage.setItem(
      HIDDEN_ORDERS_KEY,
      JSON.stringify(updatedHiddenIds)
    );

    setOrders([]);
  };

  const handleCancel = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Error cancelling order:', err);

      setError(
        t('cancelError', 'Failed to cancel the order.')
      );
    }
  };

  if (loading) {
    return (
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className="flex justify-center items-center min-h-[400px]"
      >
        <p>{t('loading', 'Loading orders...')}</p>
      </div>
    );
  }

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="container mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
        <h1 className="text-3xl font-bold">
          {t('title', 'My Orders')}
        </h1>

        <div className="flex gap-3">
          {/* Language Button */}
          <button
            onClick={handleLanguageChange}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            {isArabic ? 'English' : 'العربية'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={loadOrders}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            {t('refresh', 'Refresh')}
          </button>

          {/* Clear Orders Button */}
          {orders.length > 0 && (
            <button
              onClick={handleClearOrders}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              {t('clearOrders', 'Clear Orders')}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-600">
          {error}
        </div>
      )}

      {/* Empty Orders */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {t('empty', 'You have no orders yet.')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-5 bg-white shadow-sm"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <div>
                  <h2 className="font-semibold">
                    {t('orderNumber', 'Order ID')} #{order._id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          isArabic ? 'ar-EG' : 'en-US'
                        )
                      : ''}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                  {order.status || t('pending', 'Pending')}
                </span>
              </div>

              {/* Order Items */}
              {Array.isArray(order.items) &&
                order.items.length > 0 && (
                  <div className="mb-5 space-y-3">
                    {order.items.map((item, index) => {
                      const image =
                        item?.image ||
                        item?.product?.images?.[0]?.url;

                      return (
                        <div
                          key={item._id || index}
                          className="flex items-center gap-4 border-b pb-3"
                        >
                          {image && (
                            <img
                              src={image}
                              alt={
                                item.name ||
                                item.product?.name ||
                                t('product', 'Product')
                              }
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}

                          <div className="flex-1">
                            <p className="font-medium">
                              {item.name ||
                                item.product?.name ||
                                t('product', 'Product')}
                            </p>

                            <p className="text-sm text-gray-500">
                              {t('quantity', 'Quantity')}:{' '}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="font-medium">
                            EGP{' '}
                            {Number(
                              item.price || 0
                            ).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>
                    {t('subtotal', 'Subtotal')}:
                  </span>

                  <span>
                    EGP{' '}
                    {Number(
                      order.subtotal || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    {t('shipping', 'Shipping')}:
                  </span>

                  <span>
                    EGP{' '}
                    {Number(
                      order.shippingFee || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    {t('tax', 'Tax')}:
                  </span>

                  <span>
                    EGP{' '}
                    {Number(
                      order.tax || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>
                    {t('total', 'Total')}:
                  </span>

                  <span>
                    EGP{' '}
                    {Number(
                      order.totalPrice || 0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Cancel Order */}
              {order.status === 'pending' && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      handleCancel(order._id)
                    }
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    {t('cancel', 'Cancel')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

