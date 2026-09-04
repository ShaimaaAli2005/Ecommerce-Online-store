import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Wishlist from './pages/Wishlist/Wishlist';

function App() {
  return (
    <Router>
      <Routes>
        {/* توجيه الصفحة الرئيسية مباشرة إلى تسجيل الدخول للتجربة */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* مسارات مهمتك */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* صفحة احتياطية في حال إدخال مسار غير موجود */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;