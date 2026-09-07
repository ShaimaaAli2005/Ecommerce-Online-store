import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // توجيه الزائر لصفحة الدخول مع تذكر المسار الذي كان يريده
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;