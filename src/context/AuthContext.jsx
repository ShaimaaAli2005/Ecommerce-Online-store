import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi, logoutApi, register as registerApi } from '../api/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // استعادة الجلسة والتحقق من المستخدم عند فتح الموقع
  const fetchSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMe();
      setUser(data.user || data);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // دالة تسجيل الدخول
  const loginUser = async (credentials) => {
    const data = await loginApi(credentials);
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    setUser(data.user || data);
    return data;
  };

  // دالة تسجيل الخروج
  const logoutUser = async () => {
    try {
      await logoutApi();
    } catch {
      // المضي قدماً في مسح التوكن محلياً حتى لو فشل السيرفر
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // دالة تسجيل حساب جديد
  const registerUser = async (userData) => {
    const data = await registerApi(userData);
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    setUser(data.user || data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, registerUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}; // <--- هنا الإغلاق الصحيح لـ AuthProvider

// Custom Hook لسهولة الاستخدام في أي مكان
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};