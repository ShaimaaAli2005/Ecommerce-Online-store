import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation('auth');

  const currentLang = i18n.language || 'en';
  const isRtl = currentLang === 'ar';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // مرجع للاحتفاظ بالـ Timers ومنع تسريب الذاكرة (Memory Leak)
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

  const validate = () => {
    if (!email.trim()) {
      return t('errors.emailRequired');
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      return t('errors.emailInvalid');
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
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
        
        {/* الجانب البصري الفاخر - Forgot Password */}
        <div className="relative md:w-5/12 bg-[#0B132B] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
          {/* صورة معمارية فاخرة بدقة عالية وظاهرة بوضوح */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
              alt="LUMA Minimal Architecture"
              className="w-full h-full object-cover opacity-75 contrast-[1.08] brightness-[0.85] scale-100 hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* تدرج لوني سينمائي ناعم */}
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

          {/* النص التسويقي الترويجي */}
          <div className="relative z-10 my-8 backdrop-blur-[2px] bg-black/15 p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold tracking-widest text-[#E89A5B] uppercase block mb-2 drop-shadow-sm">
              {t('forgotPassword.showcase.tagline')}
            </span>
            <p className="text-xl sm:text-2xl font-normal leading-snug font-['Poppins'] text-white drop-shadow-md">
              {t('forgotPassword.showcase.quote')}
            </p>
          </div>

          {/* البطاقة الزجاجية السفلية */}
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

        {/* الجانب الأيمن: نموذج استعادة كلمة المرور */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17233C] tracking-tight font-['Poppins']">
                {t('forgotPassword.title')}
              </h2>
              <p className="text-sm text-[#7B8190] mt-1.5 leading-relaxed">
                {t('forgotPassword.subtitle')}
              </p>
            </div>

            {isSubmitted ? (
              <div className="space-y-6">
                {/* رسالة النجاح بتصميم هادئ وراقي */}
                <div className="p-4 rounded-2xl bg-[#EBF8F2] border border-[#A7E3C8] text-[#13613F] text-sm leading-relaxed flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5">✓</span>
                  <span>{t('forgotPassword.successMsg')}</span>
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
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      if (error) setError('');
                    }}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-[#FAFAFA] focus:bg-white ${
                      error
                        ? 'border-[#C95C5C] focus:ring-2 focus:ring-[#C95C5C]/20'
                        : 'border-[#E5E7EB] focus:border-[#17233C] focus:ring-4 focus:ring-[#17233C]/5'
                    }`}
                  />
                  {error && (
                    <span className="text-xs text-[#C95C5C] mt-1.5 flex items-center gap-1">
                      <span>⚠</span> {error}
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
                      <span>{t('forgotPassword.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('forgotPassword.submitBtn')}</span>
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
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;