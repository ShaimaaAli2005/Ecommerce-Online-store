import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import md5 from 'crypto-js/md5';

const getGravatarUrl = (email) => {
  if (!email) return '';
  const cleanEmail = email.trim().toLowerCase();
  const hash = md5(cleanEmail).toString();
  return `https://www.gravatar.com/avatar/${hash}?d=mp&s=160`;
};

const maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (name.length <= 3) return `${name[0]}***@${domain}`;
  const first = name.slice(0, 2);
  const last = name.slice(-2);
  return `${first}${'•'.repeat(Math.max(name.length - 4, 4))}${last}@${domain}`;
};

export default function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('profile');
  const isRtl = i18n.language === 'ar';

  const { user, setUser, refreshUser, logoutUser } = useAuth();
  const { wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showFullEmail, setShowFullEmail] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    country: 'Egypt',
    city: '',
    street: '',
    building: '',
    postalCode: '',
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAddresses(Array.isArray(user.addresses) ? user.addresses : []);
    }
  }, [user]);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const res = await orderService.getMyOrders({ limit: 20 });
      if (res && res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      } else if (Array.isArray(res)) {
        setOrders(res);
      } else if (res && Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch {
      // إبقاء السلة فارغة أو الحالة الحالية عند فشل التحميل
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenTracking = async (orderId) => {
    try {
      const res = await orderService.getOrderById(orderId);
      const data = res.order || res.data || res;
      setSelectedOrderDetails(data);
    } catch {
      toast.error(t('fetchOrderError', 'Failed to load order tracking details'));
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true);
      await orderService.cancelOrder(orderId);
      toast.success(t('orderCancelledSuccess', 'Order cancelled successfully!'));

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId || o.id === orderId ? { ...o, status: 'cancelled' } : o))
      );
      if (selectedOrderDetails?._id === orderId || selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails((prev) => ({ ...prev, status: 'cancelled' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t('cancelFailed', 'Cannot cancel order in its current status'));
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        addToCart(
          {
            _id: item.product || item._id,
            id: item.product || item._id,
            name: item.name,
            price: item.price,
            image: item.image,
          },
          item.quantity || 1
        );
      });
      toast.success(t('reorderedSuccess', 'All order items added back to your cart!'));
      navigate('/cart');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) return;

    const updatedAddresses = [
      ...addresses,
      {
        ...newAddress,
        defaultAddress: addresses.length === 0,
      },
    ];

    try {
      setLoading(true);
      const res = await userService.updateUserProfile(userId, { addresses: updatedAddresses });
      const updatedUser = res?.user || res?.data?.user || { ...user, addresses: updatedAddresses };

      if (setUser) setUser((prev) => ({ ...prev, ...updatedUser }));
      setAddresses(updatedAddresses);
      setNewAddress({ country: 'Egypt', city: '', street: '', building: '', postalCode: '' });
      setIsAddingAddress(false);
      toast.success(t('addressAdded', 'Address added successfully!'));
    } catch {
      toast.error(t('addressSaveError', 'Failed to save address to your account'));
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error(t('idError', 'Could not determine user identity'));
      return;
    }

    try {
      setLoading(true);
      const payload = { username: userData.username, phone: userData.phone };
      const res = await userService.updateUserProfile(userId, payload);

      const updatedUser = res?.user || res?.data?.user || {
        ...user,
        username: userData.username,
        phone: userData.phone,
      };

      if (setUser) setUser((prev) => ({ ...prev, ...updatedUser }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (refreshUser) await refreshUser();

      toast.success(t('updateSuccess', 'Profile updated successfully'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('updateError', 'Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!userData.email) {
      toast.error(t('emailMissing', 'Email is missing'));
      return;
    }
    try {
      setLoading(true);
      await userService.sendResetOtp(userData.email);
      toast.success(t('otpSentSuccess', 'Verification code sent'));
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || t('otpSendFailed', 'Failed to send OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error(t('otpRequired', 'Please enter the verification code'));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t('passwordMinLength', 'Password must be at least 6 characters'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordMismatch', 'Passwords do not match'));
      return;
    }

    try {
      setLoading(true);
      await userService.verifyResetOtp(userData.email, otp, newPassword);
      toast.success(t('passwordChanged', 'Password updated successfully'));
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveTab('overview');
    } catch (err) {
      toast.error(err.response?.data?.message || t('invalidOtp', 'Invalid or expired code'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      if (logoutUser) await logoutUser();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const displayName = userData.username || user?.username || user?.name || '';

  const renderStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-gray-300';

    if (s === 'delivered') badgeStyle = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400';
    else if (s === 'confirmed' || s === 'processing') badgeStyle = 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400';
    else if (s === 'shipped') badgeStyle = 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400';
    else if (s === 'cancelled') badgeStyle = 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400';

    const statusLabel = t(`status_${s}`, { defaultValue: status });

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
        {statusLabel}
      </span>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] text-slate-900 dark:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-['Inter'] transition-colors duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* الترويسة الرئيسية للحساب */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-5 z-10 text-center sm:text-start">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#E89A5B]/40 shadow-sm bg-slate-100 dark:bg-gray-700 shrink-0">
              <img
                src={user?.avatar && user.avatar !== 'string' ? user.avatar : getGravatarUrl(userData.email)}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/150x150?text=User';
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-slate-900 dark:text-white">
                  {displayName || t('userAccount', 'User Account')}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {user?.isVerified ? t('activeVerified', 'Verified ✓') : t('active', 'Active')}
                </span>
                {user?.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    Admin
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5" dir="ltr">
                <span className="text-xs sm:text-sm font-mono text-slate-500 dark:text-gray-400">
                  {showFullEmail ? userData.email : maskEmail(userData.email)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullEmail(!showFullEmail)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 p-1 rounded transition cursor-pointer"
                  title={showFullEmail ? t('hideEmail', 'Hide email') : t('showEmail', 'Show email')}
                >
                  <i className={showFullEmail ? 'fa-regular fa-eye-slash text-xs' : 'fa-regular fa-eye text-xs'}></i>
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="z-10 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
          >
            <i className={`fa-solid ${isRtl ? 'fa-arrow-left-from-bracket' : 'fa-arrow-right-from-bracket'} text-xs`}></i>
            <span>{t('logout', 'Sign Out')}</span>
          </button>
        </div>

        {/* المؤشرات السريعة (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
              <i className="fa-solid fa-box-archive"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-gray-400">{t('totalOrders', 'Total Orders')}</p>
              <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {ordersLoading ? '...' : orders.length}
              </h3>
            </div>
          </div>

          <Link
            to="/wishlist"
            className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-5 shadow-xs flex items-center gap-4 hover:border-[#E89A5B] transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
              <i className="fa-regular fa-heart"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-gray-400">{t('wishlistSaved', 'Wishlist Items')}</p>
              <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white">{wishlistCount}</h3>
            </div>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-gray-400">{t('savedAddresses', 'Saved Addresses')}</p>
              <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white">{addresses.length}</h3>
            </div>
          </div>
        </div>

        {/* جسم الصفحة: التبويبات والمحتوى */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* شريط التبويبات */}
          <aside className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-2.5 shadow-xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#17233C] dark:bg-[#E89A5B] text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
              }`}
            >
              <i className="fa-solid fa-clock-rotate-left text-sm"></i>
              <span>{t('tabOrders', 'My Orders')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-[#17233C] dark:bg-[#E89A5B] text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
              }`}
            >
              <i className="fa-regular fa-user text-sm"></i>
              <span>{t('personalInfo', 'Account Details')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#17233C] dark:bg-[#E89A5B] text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
              }`}
            >
              <i className="fa-solid fa-map-location-dot text-sm"></i>
              <span>{t('tabAddresses', 'Address Book')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-[#17233C] dark:bg-[#E89A5B] text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
              }`}
            >
              <i className="fa-solid fa-lock text-sm"></i>
              <span>{t('security', 'Security & Password')}</span>
            </button>
          </aside>

          {/* محتوى التبويب */}
          <main className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl border border-slate-200/80 dark:border-gray-700 p-6 sm:p-8 shadow-xs">
            
            {/* 1. قائمة الطلبات */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                      {t('recentOrders', 'Order History')}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      {t('recentOrdersSub', 'Track deliveries, cancel active requests, or re-order instantly')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchOrders}
                    className="text-xs font-semibold text-[#E89A5B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fa-solid fa-rotate-right text-[10px]"></i>
                    <span>{t('refresh', 'Refresh')}</span>
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-6 h-6 border-2 border-[#E89A5B] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">{t('loadingOrders', 'Loading your orders...')}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <i className="fa-solid fa-box-open text-3xl text-slate-300 dark:text-gray-600"></i>
                    <p className="text-xs text-slate-500 dark:text-gray-400">{t('noOrders', 'No orders placed yet')}</p>
                    <Link
                      to="/shop"
                      className="inline-block px-4 py-2 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white text-xs font-semibold rounded-xl transition shadow-xs"
                    >
                      {t('shopNow', 'Shop Now')}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => {
                      const orderId = ord._id || ord.id;
                      const isCancellable = ord.status === 'pending' || ord.status === 'confirmed';

                      return (
                        <div
                          key={orderId}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-gray-700/80 bg-slate-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                #{orderId.slice(-6).toUpperCase()}
                              </span>
                              {renderStatusBadge(ord.status)}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-gray-400">
                              {new Date(ord.createdAt || ord.date).toLocaleDateString()} • {ord.items?.length || 1} {t('itemsLabel', 'Items')}
                            </p>
                            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white block">
                              {ord.totalPrice || ord.total} {t('currency', 'EGP')}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenTracking(orderId)}
                              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                              <i className="fa-solid fa-receipt text-[11px] mx-1"></i>
                              {t('viewDetails', 'Track / Receipt')}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReorder(ord)}
                              className="px-3 py-1.5 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-gray-700 dark:hover:bg-[#E89A5B] text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                            >
                              <i className="fa-solid fa-rotate-right text-[10px]"></i>
                              <span>{t('reorder', 'Re-order')}</span>
                            </button>

                            {isCancellable && (
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(orderId)}
                                className="px-3 py-1.5 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition cursor-pointer"
                              >
                                {t('cancelOrder', 'Cancel Order')}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. قسم تعديل الحساب */}
            {activeTab === 'info' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-gray-700 pb-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                    {t('editInfo', 'Edit Account Details')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    {t('editInfoSub', 'Update your public username and phone number linked to your account.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                      {t('username', 'Username')}
                    </label>
                    <input
                      type="text"
                      value={userData.username}
                      onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:border-[#E89A5B] text-slate-900 dark:text-white outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                      {t('phone', 'Phone Number')}
                    </label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:border-[#E89A5B] text-slate-900 dark:text-white outline-none transition text-left"
                      dir="ltr"
                      placeholder="+20 100 000 0000"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                  >
                    {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    <span>{loading ? t('saving', 'Saving...') : t('save', 'Save Changes')}</span>
                  </button>
                </div>
              </form>
            )}

            {/* 3. قسم دفتر العناوين */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                      {t('addressBookTitle', 'Delivery Addresses')}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      {t('addressBookSub', 'Manage multiple shipping destinations for instant checkout')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="px-3.5 py-1.5 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    {isAddingAddress ? t('cancel', 'Cancel') : `+ ${t('addAddress', 'Add Address')}`}
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder={t('streetPlaceholder', 'Street Address (e.g. 123 Main St)')}
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl outline-none dark:text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder={t('buildingPlaceholder', 'Building / Apt (e.g. B5, Flat 4)')}
                        value={newAddress.building}
                        onChange={(e) => setNewAddress({ ...newAddress, building: e.target.value })}
                        className="px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl outline-none dark:text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder={t('cityPlaceholder', 'City (e.g. Cairo)')}
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl outline-none dark:text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder={t('postalCodePlaceholder', 'Postal Code (e.g. 11511)')}
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl outline-none dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-[#E89A5B] hover:bg-[#d4894d] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      {t('saveAddress', 'Save Address')}
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                        addr.defaultAddress
                          ? 'border-[#E89A5B] bg-[#E89A5B]/5 dark:bg-[#E89A5B]/10'
                          : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {addr.city}, {addr.country || 'Egypt'}
                          </span>
                          {addr.defaultAddress && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#E89A5B] text-white">
                              {t('defaultBadge', 'Default')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                          {addr.street} {addr.building ? `(${addr.building})` : ''}
                        </p>
                        {addr.postalCode && (
                          <p className="text-[11px] text-slate-400 mt-1 font-mono">ZIP: {addr.postalCode}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. قسم الأمان و OTP */}
            {activeTab === 'password' && (
              <div className="space-y-6 max-w-xl">
                <div className="border-b border-slate-100 dark:border-gray-700 pb-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                    {t('updatePassword', 'Update Password')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    {t('updatePasswordSub', 'Verification code will be sent to your registered email.')}
                  </p>
                </div>

                {!otpSent ? (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                      {t('otpExplain', 'We will send a one-time verification code to verify your identity before resetting your password.')}
                    </p>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                      <span>{loading ? t('sendingOtp', 'Sending code...') : t('sendOtp', 'Send Verification Code')}</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmReset} className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs rounded-xl flex items-center justify-between">
                      <span>{t('otpSentSuccess', 'Verification code sent')}</span>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-blue-700 dark:text-blue-300 hover:underline font-semibold cursor-pointer"
                      >
                        {t('resend', 'Resend')}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                        {t('otpCode', 'Verification Code (OTP)')}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.trim())}
                        placeholder="• • • • • •"
                        className="w-full text-center font-mono tracking-[0.5em] text-lg font-bold py-2 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl outline-none dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                        {t('newPassword', 'New Password')}
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl outline-none dark:text-white"
                        required
                      />

                      {newPassword && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${
                              passwordStrength <= 1 ? 'w-1/4 bg-rose-500' :
                              passwordStrength === 2 ? 'w-2/4 bg-amber-500' :
                              passwordStrength === 3 ? 'w-3/4 bg-blue-500' : 'w-full bg-emerald-500'
                            }`} />
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {passwordStrength <= 1 && t('passWeak', 'Weak password')}
                            {passwordStrength === 2 && t('passFair', 'Fair password')}
                            {passwordStrength === 3 && t('passGood', 'Good password')}
                            {passwordStrength === 4 && t('passStrong', 'Strong password ✓')}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                        {t('confirmPassword', 'Confirm New Password')}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl outline-none dark:text-white"
                        required
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        {loading ? t('verifying', 'Verifying...') : t('confirmAndSave', 'Confirm & Save')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="py-2.5 px-4 border border-slate-200 dark:border-gray-700 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {t('cancel', 'Cancel')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </main>
        </div>

      </div>

      {/* نافذة تفاصيل وتتبع الطلب والفاتورة (Live Tracking Modal) */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedOrderDetails(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 border border-slate-200 dark:border-gray-700 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                  {t('orderTrackingTitle', 'Order Status & Tracking')}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  #{(selectedOrderDetails._id || selectedOrderDetails.id).slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-500 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* شريط التقدم الفعلي */}
            <div className="py-2">
              <div className="flex items-center justify-between text-center relative">
                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-gray-300">
                    {t('track_placed', 'Placed')}
                  </span>
                </div>
                <div className={`flex-1 h-1 ${selectedOrderDetails.status !== 'cancelled' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-gray-700'}`} />

                <div className="flex flex-col items-center gap-1 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    ['confirmed', 'processing', 'shipped', 'delivered'].includes(selectedOrderDetails.status)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-gray-700 text-slate-500'
                  }`}>
                    2
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-gray-300">
                    {t('track_confirmed', 'Confirmed')}
                  </span>
                </div>
                <div className={`flex-1 h-1 ${['shipped', 'delivered'].includes(selectedOrderDetails.status) ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-gray-700'}`} />

                <div className="flex flex-col items-center gap-1 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedOrderDetails.status === 'delivered'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-gray-700 text-slate-500'
                  }`}>
                    3
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-gray-300">
                    {t('track_delivered', 'Delivered')}
                  </span>
                </div>
              </div>
            </div>

            {/* تفاصيل المنتجات المشتراة */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('purchasedItems', 'Purchased Items')}
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
                {selectedOrderDetails.items?.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {it.image && (
                        <img src={it.image} alt={it.name} className="w-9 h-9 rounded-lg object-cover bg-slate-100 dark:bg-gray-700" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-gray-200 line-clamp-1">{it.name}</p>
                        <span className="text-[10px] text-slate-400">{t('quantityShort', 'Qty')}: {it.quantity || 1}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{it.price} {t('currency', 'EGP')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* عنوان الشحن */}
            {selectedOrderDetails.shippingAddress && (
              <div className="p-3 bg-slate-50 dark:bg-gray-900 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-gray-200 block">{t('shippingDestination', 'Shipping Destination')}:</span>
                <p className="text-slate-600 dark:text-gray-400">
                  {selectedOrderDetails.shippingAddress.address}, {selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.country}
                </p>
              </div>
            )}

            {/* الحساب النهائي وزر الإلغاء */}
            <div className="pt-4 border-t border-slate-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">{t('totalPaid', 'Total Paid')}:</span>
                <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  {selectedOrderDetails.totalPrice || selectedOrderDetails.total} {t('currency', 'EGP')}
                </p>
              </div>

              {(selectedOrderDetails.status === 'pending' || selectedOrderDetails.status === 'confirmed') && (
                <button
                  type="button"
                  onClick={() => handleCancelOrder(selectedOrderDetails._id || selectedOrderDetails.id)}
                  className="px-4 py-2 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
                >
                  {t('cancelOrder', 'Cancel Order')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد تسجيل الخروج */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowLogoutModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full z-10 border border-slate-200 dark:border-gray-700 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto text-xl">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
              {t('confirmLogoutTitle', 'Confirm Sign Out?')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              {t('confirmLogoutSub', 'Are you sure you want to log out of your session?')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                {t('logout', 'Sign Out')}
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                {t('cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}