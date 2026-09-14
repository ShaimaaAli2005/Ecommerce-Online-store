import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // انتظر انتهاء قراءة التوكن من الـ Storage والـ API
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] dark:bg-[#0F172A]">
        <div className="w-8 h-8 border-3 border-[#E89A5B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // إذا لم يكن مسجلاً، وجهه لصفحة تسجيل الدخول مع حفظ مساره السابق
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}