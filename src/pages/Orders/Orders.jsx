import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import orderService from "../../services/orderService";

const Orders = () => {
  const { t } = useTranslation("orders");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await orderService.getMyOrders();

      setOrders(
        data.orders ||
        data.data ||
        data ||
        []
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await orderService.cancelOrder(id);
      await fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(t("cancelError"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] bg-[#F7F5F0] py-16 text-center">
        <p className="text-[#7B8190]">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[500px] bg-[#F7F5F0] py-16 text-center">
        <p className="text-[#C95C5C]">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F7F5F0] px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 font-['Poppins'] text-3xl font-bold text-[#17233C]">
          {t("title")}
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-[#7B8190]">
              {t("empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >

                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                  <div>
                    <p className="text-sm text-[#7B8190]">
                      {t("orderId")}
                    </p>

                    <p className="font-semibold text-[#17233C]">
                      {order._id}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F7F5F0] px-4 py-2 text-sm font-medium capitalize text-[#17233C]">
                    {order.status}
                  </span>

                </div>

                <div className="space-y-3">

                  {order.items?.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center gap-4 border-b border-[#E5E7EB] pb-3"
                    >

                      <img
                        src={item.image || "/placeholder-product.png"}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />

                      <div className="flex-1">

                        <p className="font-semibold text-[#17233C]">
                          {item.name}
                        </p>

                        <p className="text-sm text-[#7B8190]">
                          {t("quantity")}: {item.quantity}
                        </p>

                      </div>

                      <p className="font-semibold text-[#17233C]">
                        {item.price} EGP
                      </p>

                    </div>
                  ))}

                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm text-[#7B8190]">
                      {t("total")}
                    </p>

                    <p className="text-xl font-bold text-[#17233C]">
                      {order.totalPrice} EGP
                    </p>
                  </div>

                  {(order.status === "pending" ||
                    order.status === "confirmed") && (
                    <button
                      type="button"
                      onClick={() => handleCancel(order._id)}
                      className="rounded-xl bg-[#C95C5C] px-5 py-2.5 font-semibold text-white hover:opacity-90"
                    >
                      {t("cancel")}
                    </button>
                  )}

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Orders;