import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './Components/MainLayout';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/Profile/Profile';
import Shop from './pages/Shop/Shop';

const CheckoutPlaceholder = () => (
  <div className="p-12 text-center font-['Inter']">
    <h2 className="text-2xl font-bold text-[#17233C] font-['Poppins']">Checkout & Shipping</h2>
    <p className="text-[#7B8190] mt-2 text-sm">Protected route: Requires authenticated customer identity.</p>
  </div>
);

const OrdersPlaceholder = () => (
  <div className="p-12 text-center font-['Inter']">
    <h2 className="text-2xl font-bold text-[#17233C] font-['Poppins']">My Orders</h2>
    <p className="text-[#7B8190] mt-2 text-sm">Protected route: Sign in required to view order history.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      {/* حاوية الإشعارات لتظهر رسائل النجاح والخطأ في أي مكان بالتطبيق */}
      <Toaster position="top-center" reverseOrder={false} />

      <Router>
        <Routes>
          {/* 1. مسارات التوثيق (خارج الـ Layout العام: بدون Navbar أو Footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 2. مسارات التطبيق الرئيسية الملتزمة بالهيكل العام (MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* المسارات المحمية (تشترط تسجيل الدخول مع بقاء Navbar و Footer) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/checkout" element={<CheckoutPlaceholder />} />
              <Route path="/my-orders" element={<OrdersPlaceholder />} />
            </Route>
          </Route>

          {/* 3. التعامل مع المسارات غير المعروفة (Fallback Route) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;