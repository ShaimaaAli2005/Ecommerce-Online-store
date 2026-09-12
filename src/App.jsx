import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile';
import Shop from './pages/Shop/Shop';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './Components/MainLayout';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// إعادة التمرير للأعلى تلقائياً عند تغيير أي مسار في المتجر
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const OrdersPlaceholder = () => (
  <div className="p-12 text-center font-['Inter']">
    <h2 className="text-2xl font-bold text-[#17233C] dark:text-white font-['Poppins']">My Orders</h2>
    <p className="text-[#7B8190] mt-2 text-sm">Protected route: Sign in required to view order history.</p>
  </div>
);

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />

      <Router>
        <ScrollToTop />
        <Routes>
          {/* 1. مسارات التوثيق (خارج الـ Layout العام) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 2. مسارات المتجر مع Navbar و Footer */}
          <Route element={<MainLayout />}>
feature/navbar-and-routes
            <Route path="/" element={<Wishlist />} />
            <Route path="/shop" element={<Wishlist />} />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/shop" element={<Shop />} />
 develop
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />

            {/* المسارات المحمية */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<OrdersPlaceholder />} />
            </Route>
          </Route>

          {/* 3. مسار إعادة التوجيه الافتراضي */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;