import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'الاسم بالكامل مطلوب';
    }

    if (!formData.email) {
      errs.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }

    if (!formData.password) {
      errs.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      errs.password = 'يجب ألا تقل كلمة المرور عن 6 أحرف';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'يجب الموافقة على الشروط والأحكام للمتابعة';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    // محاكاة تسجيل الحساب وتخزين التوكن
    setTimeout(() => {
      localStorage.setItem('token', 'sample-registered-token-999');
      setIsLoading(false);
      navigate('/wishlist', { replace: true });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 sm:py-10">
      <div dir="rtl" className="w-full max-w-lg bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] shadow-sm p-6 sm:p-8">
        
        {/* رأس النموذج */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17233C] tracking-wide font-['Poppins']">
            LUMA
          </h1>
          <p className="text-sm text-[#7B8190] mt-1 font-['Inter']">
            أنشئ حسابك الجديد للبدء في التسوق وحفظ طلباتك
          </p>
        </div>

        {/* نموذج التسجيل */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* الاسم بالكامل */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1 font-['Inter']">
              الاسم بالكامل
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="مثال: أحمد إبراهيم"
              className={`w-full px-3.5 py-2.5 rounded-[10px] border text-sm font-['Inter'] outline-none transition-colors duration-200 ${
                errors.fullName ? 'border-[#C95C5C]' : 'border-[#E5E7EB] focus:border-[#17233C]'
              }`}
            />
            {errors.fullName && (
              <span className="text-xs text-[#C95C5C] mt-1 block">{errors.fullName}</span>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1 font-['Inter']">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@luma.com"
              className={`w-full px-3.5 py-2.5 rounded-[10px] border text-sm font-['Inter'] outline-none transition-colors duration-200 ${
                errors.email ? 'border-[#C95C5C]' : 'border-[#E5E7EB] focus:border-[#17233C]'
              }`}
            />
            {errors.email && (
              <span className="text-xs text-[#C95C5C] mt-1 block">{errors.email}</span>
            )}
          </div>

          {/* كلمتا المرور جنباً إلى جنب على الشاشات المتوسطة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1 font-['Inter']">
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 rounded-[10px] border text-sm font-['Inter'] outline-none transition-colors duration-200 ${
                  errors.password ? 'border-[#C95C5C]' : 'border-[#E5E7EB] focus:border-[#17233C]'
                }`}
              />
              {errors.password && (
                <span className="text-xs text-[#C95C5C] mt-1 block">{errors.password}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1 font-['Inter']">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 rounded-[10px] border text-sm font-['Inter'] outline-none transition-colors duration-200 ${
                  errors.confirmPassword ? 'border-[#C95C5C]' : 'border-[#E5E7EB] focus:border-[#17233C]'
                }`}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-[#C95C5C] mt-1 block">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* الموافقة على الشروط */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-[#7B8190] cursor-pointer font-['Inter']">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#17233C] focus:ring-0 cursor-pointer"
              />
              <span>
                أوافق على <span className="text-[#17233C] font-semibold underline">شروط الاستخدام</span> و <span className="text-[#17233C] font-semibold underline">سياسة الخصوصية</span>
              </span>
            </label>
            {errors.agreeTerms && (
              <span className="text-xs text-[#C95C5C] mt-1 block">{errors.agreeTerms}</span>
            )}
          </div>

          {/* زر التسجيل */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-2.5 px-4 rounded-[10px] font-medium text-sm transition-all duration-200 font-['Inter'] flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
          </button>
        </form>

        {/* رابط تسجيل الدخول */}
        <div className="mt-6 text-center text-xs sm:text-sm text-[#7B8190] font-['Inter']">
          لديك حساب بالفعل؟{' '}
          <Link
            to="/login"
            className="text-[#17233C] font-semibold hover:text-[#E89A5B] transition-colors duration-150"
          >
            تسجيل الدخول
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;