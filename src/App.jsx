import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile'; 
import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './Components/MainLayout';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

const OrdersPlaceholder = () => (
  <div className="p-12 text-center font-['Inter']">
    <h2 className="text-2xl font-bold text-[#17233C] dark:text-white font-['Poppins']">My Orders</h2>
    <p className="text-[#7B8190] mt-2 text-sm">Protected route: Sign in required to view order history.</p>
  </div>
);

const CheckoutPlaceholder = () => (
  <div className="p-12 text-center font-['Inter']">
    <h2 className="text-2xl font-bold text-[#17233C] font-['Poppins']">
      Checkout & Shipping
    </h2>
    <p className="text-[#7B8190] mt-2 text-sm">
      Protected route: Requires authenticated customer identity.
    </p>
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
        <Routes>
          {/* Authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Store pages with Navbar and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<OrdersPlaceholder />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;