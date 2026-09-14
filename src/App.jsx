import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import ProductGrid from './pages/ProductGrid/ProductGrid';
import Orders from './pages/Orders/Orders';

import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './Components/MainLayout';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; 

import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

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
      <CartProvider>
        <WishlistProvider>
          <Toaster position="top-center" reverseOrder={false} />

          <Router>
            <Routes>

              {/* Authentication pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Store pages with Navbar and Footer */}
              <Route element={<MainLayout />}>

                {/* Root path now loads ProductGrid instead of forcing login */}
                <Route
                  path="/"
                  element={<ProductGrid />}
                />

                <Route
                  path="/wishlist"
                  element={<Wishlist />}
                />

                <Route
                  path="/cart"
                  element={<Cart />}
                />

                {/* Product Grid */}
                <Route
                  path="/products"
                  element={<ProductGrid />}
                />

                {/* Product Details */}
                <Route
                  path="/products/:id"
                  element={<ProductDetails />}
                />

                {/* Protected Store Pages */}
                <Route element={<ProtectedRoute />}>

                  {/* Profile */}
                  <Route
                    path="/profile"
                    element={<Profile />}
                  />

                  {/* Checkout */}
                  <Route
                    path="/checkout"
                    element={<Checkout />}
                  />

                  {/* My Orders */}
                  <Route
                    path="/profile/orders"
                    element={<Orders />}
                  />

                </Route>

              </Route>

              {/* Unknown routes redirect to products instead of login */}
              <Route
                path="*"
                element={<Navigate to="/products" replace />}
              />

            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;