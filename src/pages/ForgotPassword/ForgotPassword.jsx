import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { sendForgotPasswordOtp, verifyForgotPasswordOtp } from '../../api/auth.api';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation('auth');
  const navigate = useNavigate();

  const currentLang = i18n.language || 'en';
  const isRtl = currentLang === 'ar';

  // حالة الخطوات: 'email' (إرسال OTP) | 'reset' (كتابة OTP وكلمة السر)
  const [step, setStep] = useState('email');
  const [isSuccess, setIsSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('luma_lang', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = () => {
    if (!email.trim()) {
      return t('errors.emailRequired') || (isRtl ? 'البريد الإلكتروني مطلوب' : 'Email is required');
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      return t('errors.emailInvalid') || (isRtl ? 'صيغة البريد غير صحيحة' : 'Invalid email format');
    }
    return '';
  };

  // التحقق من بيانات إعادة التعيين
  const validateReset = () => {
    const newErrors = {};
    if (!otp.trim() || otp.trim().length !== 6) {
      newErrors.otp = isRtl ? 'يرجى كتابة رمز OTP المكون من 6 أرقام' : '6-digit OTP is required';
    }
    if (!newPassword) {
      newErrors.newPassword = isRtl ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = isRtl ? 'يجب أن لا تقل عن 6 أحرف' : 'Must be at least 6 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = isRtl ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
    }
    return newErrors;
  };

  // المرحلة 1: إرسال كود OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail();
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendForgotPasswordOtp({ email: email.trim() });
      toast.success(res?.message || (isRtl ? 'تم إرسال كود التحقق إلى بريدك!' : 'OTP sent to your email!'));
      setStep('reset');
      setErrors({});
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (isRtl ? 'حدث خطأ، يرجى المحاولة لاحقاً' : 'Failed to send OTP, please try again');
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // المرحلة 2: التحقق وتعيين كلمة المرور الجديدة
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const validationErrors = validateReset();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyForgotPasswordOtp({
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword,
      });
      toast.success(res?.message || (isRtl ? 'تم تغيير كلمة المرور بنجاح!' : 'Password reset successfully!'));
      setIsSuccess(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (isRtl ? 'رمز التحقق غير صحيح أو منتهي الصلاحية' : 'Invalid or expired OTP');
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-[#F7F5F0] flex flex-col justify-center items-center p-0 md:p-6 lg:p-10 font-['Inter'] relative select-none"
    >
      {/* زر تبديل اللغة */}
      <div className="fixed top-5 right-6 z-50">
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-2 backdrop-blur-md bg-white/80 border border-[#E5E7EB] hover:border-[#17233C] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#17233C] shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#E89A5B]"></span>
          <span>{t('switchLang')}</span>
        </button>
      </div>

      <div className="w-full max-w-5xl bg-white md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(23,35,60,0.08)] border border-[#EBE8E1] overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        
        {/* الجانب البصري الفاخر */}
        <div className="relative md:w-5/12 bg-[#0B132B] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
              alt="LUMA Minimal Architecture"
              className="w-full h-full object-cover opacity-75 contrast-[1.08] brightness-[0.85] scale-100 hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-black/30" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-widest font-['Poppins'] text-white drop-shadow-md">
                {t('brand')}
              </span>
            </Link>
            <div className="h-1 w-10 bg-[#E89A5B] mt-2 rounded-full shadow-sm"></div>
          </div>

          <div className="relative z-10 my-8 backdrop-blur-[2px] bg-black/15 p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold tracking-widest text-[#E89A5B] uppercase block mb-2 drop-shadow-sm">
              {t('forgotPassword.showcase.tagline')}
            </span>
            <p className="text-xl sm:text-2xl font-normal leading-snug font-['Poppins'] text-white drop-shadow-md">
              {t('forgotPassword.showcase.quote')}
            </p>
          </div>

          <div className="relative z-10 backdrop-blur-md bg-white/15 border border-white/25 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#E89A5B] text-white flex items-center justify-center font-bold text-base shadow-sm">
              🛡️
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">
                {t('forgotPassword.showcase.badgeTitle')}
              </p>
              <p className="text-[11px] text-slate-100 font-light">
                {t('forgotPassword.showcase.badgeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* الجانب الأيمن: النماذج */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17233C] tracking-tight font-['Poppins']">
                {step === 'email' && !isSuccess
                  ? t('forgotPassword.title')
                  : isSuccess
                  ? (isRtl ? 'تم التعيين بنجاح' : 'Success')
                  : (isRtl ? 'إعادة تعيين كلمة المرور' : 'Set New Password')}
              </h2>
              <p className="text-sm text-[#7B8190] mt-1.5 leading-relaxed">
                {step === 'email' && !isSuccess
                  ? t('forgotPassword.subtitle')
                  : isSuccess
                  ? (isRtl ? 'تم تحديث كلمة المرور الخاصة بك. يمكنك تسجيل الدخول الآن.' : 'Your password has been updated successfully.')
                  : (isRtl ? `أدخل كود التحقق المرسل إلى ${email} وكلمة المرور الجديدة` : `Enter the OTP sent to ${email} and your new password`)}
              </p>
            </div>

            {isSuccess ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-[#EBF8F2] border border-[#A7E3C8] text-[#13613F] text-sm leading-relaxed flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5">✓</span>
                  <span>{isRtl ? 'تم تحديث كلمة المرور الخاصة بك بنجاح!' : 'Password has been updated successfully!'}</span>
                </div>

                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#17233C] hover:bg-[#E89A5B] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group"
                >
                  <span className={`transition-transform duration-200 ${isRtl ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>
                    {isRtl ? '→' : '←'}
                  </span>
                  <span>{t('forgotPassword.backToLogin')}</span>
                </Link>
              </div>
            ) : step === 'email' ? (
              /* خطوة إدخال البريد */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1.5">
                    {t('forgotPassword.emailLabel')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({});
                    }}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-[#FAFAFA] focus:bg-white ${
                      errors.email
                        ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                        : 'border-[#E5E7EB] focus:border-[#17233C] focus:ring-4 focus:ring-[#17233C]/5'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-xs text-[#C95C5C] mt-1.5 flex items-center gap-1">
                      <span>⚠</span> {errors.email}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 group mt-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{isRtl ? 'جاري إرسال الرمز...' : 'Sending OTP...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isRtl ? 'إرسال كود التحقق' : 'Send Reset OTP'}</span>
                      <span className={`transition-transform duration-200 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                        {isRtl ? '←' : '→'}
                      </span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="text-xs text-[#7B8190] hover:text-[#17233C] transition-colors underline decoration-1 underline-offset-4"
                  >
                    {t('forgotPassword.backToLogin')}
                  </Link>
                </div>
              </form>
            ) : (
              /* خطوة إدخال OTP وكلمة السر الجديدة */
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                    {isRtl ? 'كود التحقق (6 أرقام)' : 'OTP Code (6 Digits)'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }));
                    }}
                    placeholder="123456"
                    className={`w-full px-4 py-2.5 rounded-xl border text-center font-bold tracking-widest text-lg outline-none transition-all duration-200 bg-[#FAFAFA] focus:bg-white ${
                      errors.otp
                        ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                        : 'border-[#E5E7EB] focus:border-[#17233C]'
                    }`}
                  />
                  {errors.otp && (
                    <span className="text-xs text-[#C95C5C] mt-1 block text-center">
                      {errors.otp}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                    {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
                      }}
                      placeholder="••••••••"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all bg-[#FAFAFA] focus:bg-white ${
                        isRtl ? 'pl-9' : 'pr-9'
                      } ${
                        errors.newPassword
                          ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                          : 'border-[#E5E7EB] focus:border-[#17233C]'
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRtl ? 'left-2.5' : 'right-2.5'
                      } text-xs text-[#7B8190] hover:text-[#17233C] cursor-pointer`}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <span className="text-xs text-[#C95C5C] mt-1 block">{errors.newPassword}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                    {isRtl ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      placeholder="••••••••"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all bg-[#FAFAFA] focus:bg-white ${
                        isRtl ? 'pl-9' : 'pr-9'
                      } ${
                        errors.confirmPassword
                          ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                          : 'border-[#E5E7EB] focus:border-[#17233C]'
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle confirm password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRtl ? 'left-2.5' : 'right-2.5'
                      } text-xs text-[#7B8190] hover:text-[#17233C] cursor-pointer`}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-xs text-[#C95C5C] mt-1 block">{errors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{isRtl ? 'جاري تعيين كلمة المرور...' : 'Resetting Password...'}</span>
                    </>
                  ) : (
                    <span>{isRtl ? 'تعيين كلمة المرور الجديدة ←' : 'Reset Password →'}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-center text-xs text-[#7B8190] hover:text-[#17233C] transition-colors py-1 cursor-pointer"
                >
                  {isRtl ? '← تعديل البريد الإلكتروني' : '← Change email'}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;