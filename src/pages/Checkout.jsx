import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { t, i18n } = useTranslation(['auth', 'wishlist']);
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();

  const currentLang = i18n.language || 'en';
  const isRtl = currentLang === 'ar';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: 'Egypt',
    city: '',
    address: '',
    postalCode: '',
    paymentMethod: 'cash',
    orderNotes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // حسابات الشحن والضرائب
  const shipping = cartTotal > 1000 || cartTotal === 0 ? 0 : 50;
  const tax = cartTotal * 0.14;
  const finalTotal = cartTotal + (cartTotal > 0 ? shipping : 0) + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = isRtl ? 'الاسم الكامل مطلوب' : 'Full Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = isRtl ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = isRtl ? 'المدينة مطلوبة' : 'City is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = isRtl ? 'العنوان تفصيلي مطلوب' : 'Address is required';
    }
    return newErrors;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!items || items.length === 0) {
      toast.error(isRtl ? 'السلة فارغة!' : 'Your cart is empty!');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(isRtl ? 'برجاء استكمال البيانات المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // محاكاة معالجة الطلب
    setTimeout(() => {
      const generatedOrderId = `LUMA-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderSuccess({
        id: generatedOrderId,
        total: finalTotal,
        itemsCount: items.reduce((acc, item) => acc + (item.quantity || 1), 0),
        address: `${formData.address}, ${formData.city}, ${formData.country}`,
      });
      clearCart();
      setIsSubmitting(false);
      toast.success(isRtl ? 'تم إرسال طلبك بنجاح!' : 'Order placed successfully!');
    }, 1200);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen w-full bg-[#F7F5F0] dark:bg-[#0F172A] py-8 sm:py-12 font-['Inter'] text-[#1F2937] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* عنوان الصفحة الرئيسي */}
        <h1 className="text-3xl font-bold font-['Poppins'] mb-8 text-[#17233C] dark:text-white">
          {isRtl ? 'إتمام الطلب (Checkout)' : 'Checkout'}
        </h1>

        {/* الصفحة الرئيسية للـ Checkout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* الجانب الأيسر: نموذج البيانات والدفع والنلاحظات */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* قسم عنوان الشحن (Shipping Address) */}
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#E89A5B]/15 dark:bg-[#E89A5B]/25 text-[#E89A5B] flex items-center justify-center font-bold text-base">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <h2 className="text-xl font-bold font-['Poppins'] text-[#17233C] dark:text-white">
                  {isRtl ? 'عنوان الشحن' : 'Shipping Address'}
                </h2>
              </div>

              <form onSubmit={handleSubmitOrder} id="checkout-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={isRtl ? 'أدخل اسمك بالكامل' : 'Enter full name'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white ${
                        errors.fullName
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 dark:border-gray-700 focus:border-[#E89A5B]'
                      }`}
                    />
                    {errors.fullName && <span className="text-xs text-red-500 mt-1 block">{errors.fullName}</span>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {isRtl ? 'رقم الهاتف *' : 'Phone *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={isRtl ? '01xxxxxxxxx' : '01xxxxxxxxx'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white ${
                        errors.phone
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 dark:border-gray-700 focus:border-[#E89A5B]'
                      }`}
                    />
                    {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {isRtl ? 'الدولة *' : 'Country *'}
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white font-medium cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {isRtl ? 'المدينة / المحافظة *' : 'City *'}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={isRtl ? 'مثال: القاهرة، الإسكندرية' : 'e.g. Cairo, Alexandria'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white ${
                        errors.city
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 dark:border-gray-700 focus:border-[#E89A5B]'
                      }`}
                    />
                    {errors.city && <span className="text-xs text-red-500 mt-1 block">{errors.city}</span>}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {isRtl ? 'العنوان التفصيلي *' : 'Address *'}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={isRtl ? 'اسم الشارع، رقم المبنى، رقم الشقة' : 'Street name, building number, apartment'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white ${
                        errors.address
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 dark:border-gray-700 focus:border-[#E89A5B]'
                      }`}
                    />
                    {errors.address && <span className="text-xs text-red-500 mt-1 block">{errors.address}</span>}
                  </div>

                  {/* Postal Code */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {isRtl ? 'الرمز البريدي (اختياري)' : 'Postal Code'}
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="12345"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:border-[#E89A5B]"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* قسم طريقة الدفع (Payment Method) */}
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#E89A5B]/15 dark:bg-[#E89A5B]/25 text-[#E89A5B] flex items-center justify-center font-bold text-base">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <h2 className="text-xl font-bold font-['Poppins'] text-[#17233C] dark:text-white">
                  {isRtl ? 'طريقة الدفع' : 'Payment Method'}
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.paymentMethod === 'cash'
                      ? 'border-[#E89A5B] bg-[#E89A5B]/10 dark:bg-[#E89A5B]/20 dark:border-[#E89A5B]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#E89A5B] focus:ring-0 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-xl bg-[#E89A5B]/15 text-[#E89A5B] dark:text-[#E89A5B] flex items-center justify-center text-lg shrink-0">
                      <i className="fa-solid fa-[#fa-money-bill-wave] fa-money-bill"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#17233C] dark:text-white">
                        {isRtl ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {isRtl ? 'ادفع نقداً فور استلام طلبيتك' : 'Pay when you receive your order'}
                      </p>
                    </div>
                  </div>
                </label>

                {/* Online Payment Card (Simulated) */}
                <label 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer opacity-80 ${
                    formData.paymentMethod === 'card'
                      ? 'border-[#E89A5B] bg-[#E89A5B]/10 dark:bg-[#E89A5B]/20 dark:border-[#E89A5B]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#E89A5B] focus:ring-0 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-xl bg-[#E89A5B]/15 text-[#E89A5B] dark:text-[#E89A5B] flex items-center justify-center text-lg shrink-0">
                      <i className="fa-regular fa-credit-card"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#17233C] dark:text-white">
                        {isRtl ? 'بطاقة ائتمانية / فيزا' : 'Credit / Debit Card'}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {isRtl ? 'دفع آمن عبر الإنترنت' : 'Secure online payment'}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* قسم ملاحظات الطلب (Order Notes) */}
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#E89A5B]/15 dark:bg-[#E89A5B]/25 text-[#E89A5B] flex items-center justify-center font-bold text-base">
                  <i className="fa-regular fa-clipboard"></i>
                </div>
                <h2 className="text-xl font-bold font-['Poppins'] text-[#17233C] dark:text-white">
                  {isRtl ? 'ملاحظات الطلب (اختياري)' : 'Order Notes (Optional)'}
                </h2>
              </div>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                rows="3"
                placeholder={isRtl ? 'أي ملاحظات خاصة بالتوصيل أو الموعد...' : 'Notes about your order, e.g. special notes for delivery.'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:border-[#E89A5B] transition-colors resize-none"
              ></textarea>
            </div>

          </div>

          {/* الجانب الأيمن: ملخص الطلب (Order Summary) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold font-['Poppins'] text-[#17233C] dark:text-white mb-6">
                {isRtl ? 'ملخص الطلب' : 'Order Summary'}
              </h3>

              {/* قائمة منتجات السلة المصغرة */}
              <div className="max-h-60 overflow-y-auto space-y-4 pr-1 mb-6 divide-y divide-gray-100 dark:divide-gray-700">
                {items && items.length > 0 ? (
                  items.map((item) => {
                    const itemId = item.id || item._id;
                    const itemImage = item.image || item.imageUrl;
                    const itemName = item.name || item.title;

                    return (
                      <div key={itemId} className="flex items-center justify-between pt-3 first:pt-0 gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={itemImage}
                            alt={itemName}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 dark:border-gray-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#17233C] dark:text-white truncate">
                              {itemName}
                            </h4>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                              x{item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#17233C] dark:text-white shrink-0">
                          EGP {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                    {isRtl ? 'لا توجد منتجات في السلة' : 'No items in cart'}
                  </p>
                )}
              </div>

              <hr className="border-gray-200 dark:border-gray-700 mb-4" />

              {/* المجموع الفرعي والضرائب والشحن */}
              <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-semibold text-[#17233C] dark:text-white">
                    EGP {cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{isRtl ? 'مصاريف الشحن' : 'Shipping'}</span>
                  <span className="font-semibold text-[#17233C] dark:text-white">
                    EGP {cartTotal === 0 ? 0 : shipping}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{isRtl ? 'الضريبة (14%)' : 'Tax (14%)'}</span>
                  <span className="font-semibold text-[#17233C] dark:text-white">
                    EGP {tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700 my-4" />

              {/* الإجمالي النهائي */}
              <div className="flex justify-between mb-6 text-lg font-bold text-[#17233C] dark:text-white">
                <span>{isRtl ? 'الإجمالي' : 'Total'}</span>
                <span className="text-[#E89A5B]">
                  EGP {finalTotal.toFixed(2)}
                </span>
              </div>

              {/* زر إتمام الطلب الرئيسي */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#E89A5B] hover:bg-[#d4874b] text-white font-extrabold text-base rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{isRtl ? 'جاري تنفيذ الطلب...' : 'Processing Order...'}</span>
                  </>
                ) : (
                  <span>{isRtl ? 'إتمام الطلب الآن' : 'Place Order'}</span>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* النافذة المنبثقة لنجاح الطلب (Success Modal) */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
              ✓
            </div>
            <h3 className="text-2xl font-bold font-['Poppins'] text-[#17233C] dark:text-white mb-2">
              {isRtl ? 'تم إرسال طلبك بنجاح!' : 'Order Placed Successfully!'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              {isRtl ? 'شكراً لتسوقك معنا، تم تأكيد الطلبية وجاري تجهيزها لشحنها إليك.' : 'Thank you for shopping with us. Your order is confirmed and being processed.'}
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">{isRtl ? 'رقم الطلب:' : 'Order ID:'}</span>
                <span className="font-bold text-[#4F46E5] dark:text-indigo-400">#{orderSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{isRtl ? 'العنوان:' : 'Delivery To:'}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                  {orderSuccess.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{isRtl ? 'الإجمالي:' : 'Total Amount:'}</span>
                <span className="font-bold text-gray-800 dark:text-white">EGP {orderSuccess.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/my-orders"
                className="flex-1 py-3 px-4 bg-[#17233C] dark:bg-white text-white dark:text-[#17233C] hover:bg-[#E89A5B] dark:hover:bg-[#E89A5B] dark:hover:text-white rounded-xl text-xs font-bold transition-colors no-underline"
              >
                {isRtl ? 'متابعة طلباتي' : 'View My Orders'}
              </Link>
              <Link
                to="/wishlist"
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-xs font-semibold transition-colors no-underline"
              >
                {isRtl ? 'مواصلة التسوق' : 'Continue Shopping'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
