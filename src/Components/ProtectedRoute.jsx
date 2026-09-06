import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // فحص هل المستخدم مسجل دخول (وجود Token)
  const token = localStorage.getItem('token');

  // إذا لم يوجد توكن، يتم تحويله لصفحة الدخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان مسجلاً، يتم عرض الصفحة المطلوبة
  return <Outlet />;
};

export default ProtectedRoute;