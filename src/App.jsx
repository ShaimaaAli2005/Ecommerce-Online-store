import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './Components/MainLayout';

// مكونات تجريبية للأماكن التي تتطلب بيانات المستخدم
const CheckoutPlaceholder = () => (
  <div className="p-12 text-center font-['Inter']">
    <h2 className="text-2xl font-bold text-[#17233C] font-['Poppins']">إتمام الطلب والشحن (Checkout)</h2>
    <p className="text-[#7B8190] mt-2 text-sm">صفحة الشحن والدفع تتطلب تسجيل حسابك لحفظ العنوان وتفاصيل الفاتورة.</p>
  </div>
);

const OrdersPlaceholder = () => (
  <div className="p-12 text-center font-['Inter']">
    <h2 className="text-2xl font-bold text-[#17233C] font-['Poppins']">طلباتي السابقة (My Orders)</h2>
    <p className="text-[#7B8190] mt-2 text-sm">سجل دخولك لتتمكن من تتبع شحناتك وسجل مشترياتك.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. صفحات الدخول والتسجيل (مستقلة وبدون قوائم) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 2. تجربة المتجر الأساسية مع الهيدر والفوتر (مفتوحة للتصفح) */}
        <Route element={<MainLayout />}>
          {/* صفحات عامة للزوار: تصفح المنتجات والأقسام */}
          <Route path="/" element={<Navigate to="/wishlist" replace />} />
          <Route path="/wishlist" element={<Wishlist />} />
          {/* هنا يضاف لاحقاً مسار الـ Categories والـ Products */}

          {/* 3. العمليات التي تتطلب بيانات شخصية أو مالية (إلزامية الحماية) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPlaceholder />} />
            <Route path="/my-orders" element={<OrdersPlaceholder />} />
            <Route path="/profile" element={<OrdersPlaceholder />} />
          </Route>
        </Route>

        {/* مسار احتياطي */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;