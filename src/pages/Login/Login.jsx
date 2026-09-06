import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // 1. إدارة حالة الحقول والأخطاء وحالة التحميل
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 2. معالجة تغيير البيانات في الحقول
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // إزالة رسالة الخطأ فور بدء المستخدم في التعديل
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 3. التحقق البسيط من صحة المدخلات (Client-side Validation)
  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب ألا تقل عن 6 أحرف';
    }

    return newErrors;
  };

  // 4. معالجة إرسال النموذج (Submit) والتوجيه
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    // محاكاة استجابة السيرفر وتخزين التوكن
    setTimeout(() => {
      console.log('بيانات تسجيل الدخول:', formData);

      // حفظ التوكن في localStorage لتفعيل الـ Protected Routes
      localStorage.setItem('token', 'sample-auth-token-12345');

      setIsLoading(false);

      // التوجيه تلقائياً إلى الصفحة المطلوبة (مثل قائمة الرغبات أو الرئيسية)
      navigate('/wishlist');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4">
      {/* كارت النموذج متوافق مع معايير LUMA */}
      <div dir="rtl" className="w-full max-w-md bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] shadow-sm p-6 sm:p-8">
        
        {/* رأس النموذج */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17233C] tracking-wide font-['Poppins']">
            LUMA
          </h1>
          <p className="text-sm text-[#7B8190] mt-2 font-['Inter']">
            أهلاً بك مجدداً! سجل دخولك لمتابعة التسوق
          </p>
        </div>

        {/* نموذج الإدخال */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* حقل البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1 font-['Inter']">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@luma.com"
              className={`w-full px-4 py-2.5 rounded-[10px] border font-['Inter'] text-sm outline-none transition-colors duration-200 ${
                errors.email ? 'border-[#C95C5C]' : 'border-[#E5E7EB] focus:border-[#17233C]'
              }`}
            />
            {errors.email && (
              <span className="text-xs text-[#C95C5C] mt-1 block">{errors.email}</span>
            )}
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1 font-['Inter']">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-[10px] border font-['Inter'] text-sm outline-none transition-colors duration-200 ${
                errors.password ? 'border-[#C95C5C]' : 'border-[#E5E7EB] focus:border-[#17233C]'
              }`}
            />
            {errors.password && (
              <span className="text-xs text-[#C95C5C] mt-1 block">{errors.password}</span>
            )}
          </div>

          {/* تذكرني واستعادة كلمة المرور */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-['Inter']">
            <label className="flex items-center gap-2 text-[#7B8190] cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#17233C] focus:ring-0 cursor-pointer"
              />
              تذكرني
            </label>
            <Link
              to="/forgot-password"
              className="text-[#60708F] hover:text-[#E89A5B] transition-colors duration-150 font-medium"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          {/* زر تسجيل الدخول الأساسي */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-2.5 px-4 rounded-[10px] font-medium text-sm transition-all duration-200 font-['Inter'] flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* التوجيه لإنشاء حساب جديد */}
        <div className="mt-6 text-center text-xs sm:text-sm text-[#7B8190] font-['Inter']">
          ليس لديك حساب؟{' '}
          <Link
            to="/register"
            className="text-[#17233C] font-semibold hover:text-[#E89A5B] transition-colors duration-150"
          >
            إنشاء حساب جديد
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;