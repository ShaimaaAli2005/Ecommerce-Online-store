import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './Components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. المسارات العامة المستقلة (بدون Navbar أو Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 2. المسارات المحمية داخل تصميم المتجر الرئيسي */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/wishlist" replace />} />
            <Route path="/wishlist" element={<Wishlist />} />
            {/* أضف هنا أي مسارات أخرى للمتجر أو الدشبورد لاحقاً */}
          </Route>
        </Route>

        {/* 3. توجيه افتراضي لأي مسار غير معروف */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;