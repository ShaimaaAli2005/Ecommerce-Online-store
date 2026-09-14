import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { sendForgotPasswordOtp, verifyForgotPasswordOtp } from '../../api/auth.api';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation('auth');
  const navigate = useNavigate();

  const currentLang = i18n.language || 'en';
  const isRtl = currentLang === 'ar';

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

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

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (step === 'reset' && !isSuccess) {
      setResendTimer(60);
      setCanResend(false);

      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [step, isSuccess]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('luma_lang', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  const validateEmail = () => {
    if (!email.trim()) {
      return t('errors.emailRequired');
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      return t('errors.emailInvalid');
    }
    return '';
  };

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

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
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

  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;

    setIsLoading(true);
    try {
      const res = await sendForgotPasswordOtp({ email: email.trim() });
      toast.success(res?.message || (isRtl ? 'تمت إعادة إرسال كود التحقق' : 'OTP resent successfully'));
      
      setResendTimer(60);
      setCanResend(false);

      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (isRtl ? 'تعذر إعادة إرسال الكود حالياً' : 'Failed to resend OTP');
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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
      className="min-h-screen w-full bg-[#F7F5F0] dark:bg-[#0F172A] flex flex-col justify-center items-center p-0 md:p-6 lg:p-10 font-['Inter'] relative select-none transition-colors duration-300"
    >
      {/* شريط التحكم العلوي: زر الثيم وزر اللغة */}
      <div className="fixed top-5 right-6 z-50 flex items-center gap-2" dir="ltr">
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-2 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#17233C] dark:hover:border-[#E89A5B] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#17233C] dark:text-gray-200 shadow-sm transition cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#E89A5B]"></span>
          <span>{t('switchLang')}</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-full backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-[#E5E7EB] dark:border-gray-700 text-[#17233C] dark:text-[#E89A5B] flex items-center justify-center shadow-sm hover:scale-105 transition cursor-pointer"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(23,35,60,0.08)] border border-[#EBE8E1] dark:border-gray-700 overflow-hidden flex flex-col md:flex-row min-h-[580px] transition-colors duration-300">
        
        {/* الجانب البصري */}
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

          <div className="relative z-10 my-8 backdrop-blur-[2px] bg-black/25 p-4 rounded-2xl border border-white/10">
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

        {/* الجانب الأيمن */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17233C] dark:text-white tracking-tight font-['Poppins']">
                {step === 'email' && !isSuccess
                  ? t('forgotPassword.title')
                  : isSuccess
                  ? (isRtl ? 'تم التعيين بنجاح' : 'Success')
                  : (isRtl ? 'إعادة تعيين كلمة المرور' : 'Set New Password')}
              </h2>
              <p className="text-sm text-[#7B8190] dark:text-gray-400 mt-1.5 leading-relaxed">
                {step === 'email' && !isSuccess
                  ? t('forgotPassword.subtitle')
                  : isSuccess
                  ? (isRtl ? 'تم تحديث كلمة المرور الخاصة بك. يمكنك تسجيل الدخول الآن.' : 'Your password has been updated successfully.')
                  : (isRtl ? `أدخل كود التحقق المرسل إلى ${email} وكلمة المرور الجديدة` : `Enter the OTP sent to ${email} and your new password`)}
              </p>
            </div>

            {isSuccess ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-[#EBF8F2] dark:bg-emerald-950/40 border border-[#A7E3C8] dark:border-emerald-800 text-[#13613F] dark:text-emerald-300 text-sm leading-relaxed flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5">✓</span>
                  <span>{isRtl ? 'تم تحديث كلمة المرور الخاصة بك بنجاح!' : 'Password has been updated successfully!'}</span>
                </div>

                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group"
                >
                  <span className={`transition-transform duration-200 ${isRtl ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>
                    {isRtl ? '→' : '←'}
                  </span>
                  <span>{t('forgotPassword.backToLogin')}</span>
                </Link>
              </div>
            ) : step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1.5">
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-[#FAFAFA] dark:bg-gray-900 dark:text-white ${
                      errors.email
                        ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                        : 'border-[#E5E7EB] dark:border-gray-700 focus:border-[#17233C] dark:focus:border-[#E89A5B]'
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
                  className="w-full bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 group mt-2"
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
                    className="text-xs text-[#7B8190] dark:text-gray-400 hover:text-[#17233C] dark:hover:text-white transition-colors underline decoration-1 underline-offset-4"
                  >
                    {t('forgotPassword.backToLogin')}
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-center font-bold tracking-widest text-lg outline-none transition-all duration-200 bg-[#FAFAFA] dark:bg-gray-900 dark:text-white ${
                      errors.otp
                        ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                        : 'border-[#E5E7EB] dark:border-gray-700 focus:border-[#17233C] dark:focus:border-[#E89A5B]'
                    }`}
                  />
                  {errors.otp && (
                    <span className="text-xs text-[#C95C5C] mt-1 block text-center">
                      {errors.otp}
                    </span>
                  )}
                </div>

                <div className="text-center py-1">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-xs font-semibold text-[#E89A5B] hover:underline cursor-pointer transition-colors"
                    >
                      {isRtl ? 'إعادة إرسال رمز التحقق' : 'Resend OTP Code'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-gray-500 font-mono">
                      {isRtl ? `إعادة الإرسال متاحة بعد (${resendTimer}) ثانية` : `Resend available in (${resendTimer})s`}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">
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
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-gray-900 dark:text-white ${
                        isRtl ? 'pl-9' : 'pr-9'
                      } ${
                        errors.newPassword
                          ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                          : 'border-[#E5E7EB] dark:border-gray-700 focus:border-[#17233C] dark:focus:border-[#E89A5B]'
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRtl ? 'left-2.5' : 'right-2.5'
                      } text-xs text-[#7B8190] dark:text-gray-400 hover:text-[#17233C] dark:hover:text-white cursor-pointer`}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>

                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength <= 1
                              ? 'w-1/4 bg-rose-500'
                              : passwordStrength === 2
                              ? 'w-2/4 bg-amber-500'
                              : passwordStrength === 3
                              ? 'w-3/4 bg-blue-500'
                              : 'w-full bg-emerald-500'
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-gray-500">
                        {passwordStrength <= 1 && (isRtl ? 'كلمة مرور ضعيفة' : 'Weak password')}
                        {passwordStrength === 2 && (isRtl ? 'كلمة مرور مقبولة' : 'Fair password')}
                        {passwordStrength === 3 && (isRtl ? 'كلمة مرور جيدة' : 'Good password')}
                        {passwordStrength === 4 && (isRtl ? 'كلمة مرور قوية ✓' : 'Strong password ✓')}
                      </p>
                    </div>
                  )}

                  {errors.newPassword && (
                    <span className="text-xs text-[#C95C5C] mt-1 block">{errors.newPassword}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">
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
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-gray-900 dark:text-white ${
                        isRtl ? 'pl-9' : 'pr-9'
                      } ${
                        errors.confirmPassword
                          ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                          : 'border-[#E5E7EB] dark:border-gray-700 focus:border-[#17233C] dark:focus:border-[#E89A5B]'
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle confirm password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRtl ? 'left-2.5' : 'right-2.5'
                      } text-xs text-[#7B8190] dark:text-gray-400 hover:text-[#17233C] dark:hover:text-white cursor-pointer`}
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
                  className="w-full bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
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
                  className="w-full text-center text-xs text-[#7B8190] dark:text-gray-400 hover:text-[#17233C] dark:hover:text-white transition-colors py-1 cursor-pointer"
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