import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './Components/MainLayout';

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
    <Router>
      <Routes>
        {/* شاشات المصادقة المنفصلة (بدون Navbar أو Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* المتجر العام مع Navbar و Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* العمليات المحمية التي تتطلب توكن */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPlaceholder />} />
            <Route path="/my-orders" element={<OrdersPlaceholder />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;