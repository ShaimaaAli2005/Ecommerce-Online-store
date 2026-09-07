import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // أثناء استعادة الجلسة والتحقق من التوكن، نظهر شاشة تحميل خفيفة
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#17233C]"></div>
      </div>
    );
  }

  // إذا لم يكن مسجلاً، نوجهه لصفحة الدخول مع حفظ الصفحة التي كان يحاول زيارتها
  if (!user && !localStorage.getItem('token')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;