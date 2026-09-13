import api from './axios';

// تسجيل الدخول
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// جلب بيانات المستخدم المسجل عبر التوكن
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// تسجيل الخروج
export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// --- نظام التسجيل (OTP) ---

// إرسال كود OTP للتسجيل
export const sendRegisterOtp = async (payload) => {
  const response = await api.post('/auth/register/send-otp', payload);
  return response.data;
};

// توافق مع AuthContext القديم
export const register = sendRegisterOtp;

// تأكيد كود OTP وإنشاء الحساب
export const verifyRegisterOtp = async (payload) => {
  const response = await api.post('/auth/register/verify-otp', payload);
  return response.data;
};

// --- نظام استعادة كلمة المرور (OTP) ---

// إرسال كود استعادة كلمة المرور
export const sendForgotPasswordOtp = async (payload) => {
  const email = typeof payload === 'string' ? payload : payload?.email;
  const response = await api.post('/auth/forgot-password/send-otp', {
    email: String(email || '').trim().toLowerCase(),
  });
  return response.data;
};

// توافق مع ForgotPassword.jsx
export const forgotPasswordApi = sendForgotPasswordOtp;

// تأكيد كود استعادة كلمة المرور وتعيين الجديدة
export const verifyForgotPasswordOtp = async (payload) => {
  // استخراج القيم وتنظيفها
  const email = String(payload?.email || '').trim().toLowerCase();
  const rawOtp = payload?.otp || payload?.resetCode || '';
  const otp = String(rawOtp).trim().replace(/\s+/g, '');
  const newPassword = payload?.newPassword || payload?.password;

  // إرسال الحقول التي يشترطها الباك إند بالضبط وحجب "password" منعاً لرفض السيرفر
  const cleanPayload = {
    email,
    otp,
    newPassword,
  };

  const response = await api.post('/auth/forgot-password/verify-otp', cleanPayload);
  return response.data;
};