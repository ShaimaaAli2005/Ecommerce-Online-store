import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi, logoutApi, register as registerApi } from '../api/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // نبدأ بالتحقق الفوري من الـ localStorage عشان نحدد حالة المستخدم والـ loading صح من أول ثانية
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // لو التوكن موجود، الـ loading يبدأ بـ false مباشرة عشان الـ ProtectedRoute مايستعجلش ويطرد اليوزر
  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem('token');
  });

  // استخراج كائن المستخدم بشكل آمن مهما كانت هيكلة الباك إند
  const extractUser = (res) => {
    if (!res) return null;
    return res.data?.user || res.data || res.user || res;
  };

  // استعادة الجلسة والتحقق من المستخدم عند فتح الموقع في الخلفية
  const fetchSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMe();
      const currentUser = extractUser(data);
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
    } else {
      fetchSession();
    }
  }, []);

  // دالة تسجيل الدخول
  const loginUser = async (credentials) => {
    const data = await loginApi(credentials);
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    const currentUser = extractUser(data);
    setUser(currentUser);
    localStorage.setItem('user', JSON.stringify(currentUser));
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
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  // دالة تسجيل حساب جديد
  const registerUser = async (userData) => {
    const data = await registerApi(userData);
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    const currentUser = extractUser(data);
    setUser(currentUser);
    localStorage.setItem('user', JSON.stringify(currentUser));
    return data;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        loginUser, 
        logoutUser, 
        registerUser, 
        setUser,
        refreshUser: fetchSession // تصدير الدالة لتحديث بيانات المستخدم عند الطلب
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};