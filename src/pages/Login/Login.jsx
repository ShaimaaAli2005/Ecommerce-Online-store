import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t, i18n } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = i18n.language || 'en';
  const isRtl = currentLang === 'ar';
  const destination = location.state?.from?.pathname || '/wishlist';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // مرجع للاحتفاظ بالـ Timers ومنع الـ Memory Leaks
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
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('errors.passwordMin');
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    timerRef.current = setTimeout(() => {
      localStorage.setItem('token', 'sample-auth-token-12345');
      setIsLoading(false);
      navigate(destination, { replace: true });
    }, 1000);
  };

  // محاكاة تسجيل الدخول السريع عبر Google
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    timerRef.current = setTimeout(() => {
      localStorage.setItem('token', 'sample-google-oauth-token-999');
      setIsGoogleLoading(false);
      navigate(destination, { replace: true });
    }, 800);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-[#F7F5F0] flex flex-col justify-center items-center p-0 md:p-6 lg:p-10 font-['Inter'] relative select-none"
    >
      {/* زر تبديل اللغة في أعلى اليمين */}
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

      <div className="w-full max-w-5xl bg-white md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(23,35,60,0.08)] border border-[#EBE8E1] overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        
        {/* الجانب البصري الفاخر - Login */}
        <div className="relative md:w-5/12 bg-[#0B132B] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
          {/* خلفية الصورة مع معالجة سينمائية راقية */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"
              alt="LUMA Luxury Interior"
              className="w-full h-full object-cover opacity-75 contrast-[1.08] brightness-[0.85] scale-100 hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* تدرج لوني لحماية وضوح النصوص */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-black/30" />
          </div>

          {/* الشعار */}
          <div className="relative z-10">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-widest font-['Poppins'] text-white drop-shadow-md">
                {t('brand')}
              </span>
            </Link>
            <div className="h-1 w-10 bg-[#E89A5B] mt-2 rounded-full shadow-sm"></div>
          </div>

          {/* الاقتباس الترويجي */}
          <div className="relative z-10 my-8 backdrop-blur-[2px] bg-black/15 p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold tracking-widest text-[#E89A5B] uppercase block mb-2 drop-shadow-sm">
              {t('login.showcase.tagline')}
            </span>
            <p className="text-xl sm:text-2xl font-normal leading-snug font-['Poppins'] text-white drop-shadow-md">
              {t('login.showcase.quote')}
            </p>
          </div>

          {/* البطاقة الزجاجية السفلية */}
          <div className="relative z-10 backdrop-blur-md bg-white/15 border border-white/25 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#E89A5B] text-white flex items-center justify-center font-bold text-base shadow-sm">
              ★
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">
                {t('login.showcase.badgeTitle')}
              </p>
              <p className="text-[11px] text-slate-100 font-light">
                {t('login.showcase.badgeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* الجانب الأيمن: النموذج مع زر Google */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17233C] tracking-tight font-['Poppins']">
                {t('login.title')}
              </h2>
              <p className="text-sm text-[#7B8190] mt-1.5 leading-relaxed">
                {t('login.subtitle')}
              </p>
            </div>

            {/* زر تسجيل الدخول بواسطة Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#1F2937] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <svg className="animate-spin h-4 w-4 text-[#17233C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              )}
              <span>{t('login.googleBtn')}</span>
            </button>

            {/* خط فاصل أنيق */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EBE8E1]"></div>
              </div>
              <span className="relative bg-white px-3 text-xs text-[#9CA3AF]">
                {t('login.showcase.orDivider')}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* حقل البريد الإلكتروني */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1.5">
                  {t('login.emailLabel')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('login.emailPlaceholder')}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-[#FAFAFA] focus:bg-white ${
                    errors.email
                      ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                      : 'border-[#E5E7EB] focus:border-[#17233C] focus:ring-4 focus:ring-[#17233C]/5'
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-[#C95C5C] mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </span>
                )}
              </div>

              {/* حقل كلمة المرور */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937]">
                    {t('login.passwordLabel')}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-[#7B8190] hover:text-[#E89A5B] transition-colors"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('login.passwordPlaceholder')}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-[#FAFAFA] focus:bg-white ${
                      isRtl ? 'pl-11' : 'pr-11'
                    } ${
                      errors.password
                        ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                        : 'border-[#E5E7EB] focus:border-[#17233C] focus:ring-4 focus:ring-[#17233C]/5'
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      isRtl ? 'left-3' : 'right-3'
                    } text-xs text-[#7B8190] hover:text-[#17233C] p-1 cursor-pointer transition-colors`}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-[#C95C5C] mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </span>
                )}
              </div>

              {/* خيار تذكرني */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 text-xs text-[#7B8190] cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-[#17233C] border-gray-300 focus:ring-0 cursor-pointer accent-[#17233C]"
                  />
                  <span className="group-hover:text-[#17233C] transition-colors">
                    {t('login.rememberMe')}
                  </span>
                </label>
              </div>

              {/* زر الدخول الرئيسي */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t('login.submitting')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('login.submitBtn')}</span>
                    <span className={`transition-transform duration-200 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                      {isRtl ? '←' : '→'}
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[#7B8190]">
              {t('login.noAccountPrompt')}{' '}
              <Link
                to="/register"
                className="text-[#17233C] font-bold hover:text-[#E89A5B] transition-colors underline decoration-1 underline-offset-4"
              >
                {t('login.registerAction')}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;