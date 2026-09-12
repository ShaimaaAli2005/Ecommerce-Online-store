import api from '../api/axios';

export const userService = {
  // جلب بيانات المستخدم المسجل حالياً
  getUserProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // تحديث بيانات المستخدم (PATCH /users/{id})
  updateUserProfile: async (userId, userData) => {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // 1. طلب إرسال كود OTP
  sendResetOtp: async (email) => {
    const response = await api.post('/auth/forgot-password/send-otp', { email });
    return response.data;
  },

  // 2. التحقق من الكود وتعيين كلمة المرور الجديدة
  verifyResetOtp: async (email, otp, newPassword) => {
    const response = await api.post('/auth/forgot-password/verify-otp', {
      email,
      otp,
      password: newPassword,
    });
    return response.data;
  },
};

export default userService;