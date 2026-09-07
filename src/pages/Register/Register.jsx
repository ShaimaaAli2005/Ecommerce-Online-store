import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t, i18n } = useTranslation('auth');
  const navigate = useNavigate();

  const currentLang = i18n.language || 'en';
  const isRtl = currentLang === 'ar';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('errors.fullNameRequired');
    }

    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('errors.passwordMin');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordMismatch');
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t('errors.termsRequired');
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

    setTimeout(() => {
      localStorage.setItem('token', 'sample-registered-token-999');
      setIsLoading(false);
      navigate('/wishlist', { replace: true });
    }, 1000);
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      localStorage.setItem('token', 'sample-google-oauth-token-999');
      setIsGoogleLoading(false);
      navigate('/wishlist', { replace: true });
    }, 800);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-[#F7F5F0] flex flex-col justify-center items-center p-0 md:p-6 lg:p-10 font-['Inter'] relative select-none"
    >
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

      <div className="w-full max-w-5xl bg-white md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(23,35,60,0.08)] border border-[#EBE8E1] overflow-hidden flex flex-col md:flex-row min-h-[680px]">
        
        {/* الجانب الأيسر البصري */}
        <div className="relative md:w-5/12 bg-[#17233C] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="LUMA Living Aesthetics"
              className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17233C] via-[#17233C]/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-widest font-['Poppins'] text-white">
                {t('brand')}
              </span>
            </Link>
            <div className="h-0.5 w-8 bg-[#E89A5B] mt-2 rounded-full"></div>
          </div>

          <div className="relative z-10 my-8">
            <span className="text-[11px] font-semibold tracking-widest text-[#E89A5B] uppercase block mb-2">
              {t('register.showcase.tagline')}
            </span>
            <p className="text-xl sm:text-2xl font-light leading-snug font-['Poppins'] text-[#F7F5F0]">
              {t('register.showcase.quote')}
            </p>
          </div>

          <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/15 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E89A5B]/20 text-[#E89A5B] flex items-center justify-center font-bold text-sm">
              ✦
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                {t('register.showcase.badgeTitle')}
              </p>
              <p className="text-[10px] text-gray-300">
                {t('register.showcase.badgeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* الجانب الأيمن: النموذج مع زر Google */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17233C] tracking-tight font-['Poppins']">
                {t('register.title')}
              </h2>
              <p className="text-sm text-[#7B8190] mt-1 leading-relaxed">
                {t('register.subtitle')}
              </p>
            </div>

            {/* زر Google */}
            <button
              type="button"
              onClick={handleGoogleSignup}
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
              <span>{t('register.googleBtn')}</span>
            </button>

            {/* خط فاصل */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EBE8E1]"></div>
              </div>
              <span className="relative bg-white px-3 text-xs text-[#9CA3AF]">
                {t('register.showcase.orDivider')}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* الاسم الكامل */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                  {t('register.fullNameLabel')}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t('register.fullNamePlaceholder')}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-[#FAFAFA] focus:bg-white ${
                    errors.fullName
                      ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                      : 'border-[#E5E7EB] focus:border-[#17233C] focus:ring-4 focus:ring-[#17233C]/5'
                  }`}
                />
                {errors.fullName && (
                  <span className="text-xs text-[#C95C5C] mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.fullName}
                  </span>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                  {t('register.emailLabel')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('register.emailPlaceholder')}
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

              {/* كلمات المرور */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                    {t('register.passwordLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all bg-[#FAFAFA] focus:bg-white ${
                        isRtl ? 'pl-9' : 'pr-9'
                      } ${
                        errors.password
                          ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                          : 'border-[#E5E7EB] focus:border-[#17233C]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRtl ? 'left-2.5' : 'right-2.5'
                      } text-xs text-[#7B8190] hover:text-[#17233C] cursor-pointer`}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-xs text-[#C95C5C] mt-1 block">{errors.password}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                    {t('register.confirmPasswordLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
              </div>

              {/* الشروط والأحكام */}
              <div className="pt-0.5">
                <label className="flex items-center gap-2.5 text-xs text-[#7B8190] cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-[#17233C] border-gray-300 focus:ring-0 cursor-pointer accent-[#17233C]"
                  />
                  <span className="group-hover:text-[#17233C] transition-colors">
                    {t('register.termsAgree')}
                  </span>
                </label>
                {errors.agreeTerms && (
                  <span className="text-xs text-[#C95C5C] mt-1 block">{errors.agreeTerms}</span>
                )}
              </div>

              {/* زر الإرسال الرئيسي */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 group mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t('register.submitting')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('register.submitBtn')}</span>
                    <span className={`transition-transform duration-200 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                      {isRtl ? '←' : '→'}
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-[#7B8190]">
              {t('register.hasAccountPrompt')}{' '}
              <Link
                to="/login"
                className="text-[#17233C] font-bold hover:text-[#E89A5B] transition-colors underline decoration-1 underline-offset-4"
              >
                {t('register.loginAction')}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;