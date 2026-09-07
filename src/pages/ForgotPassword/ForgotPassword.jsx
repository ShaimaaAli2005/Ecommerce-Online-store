import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation('auth');
  const currentLang = i18n.language || 'en';
  const isRtl = currentLang === 'ar';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('luma_lang', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('errors.emailRequired'));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('errors.emailInvalid'));
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
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

      <div className="w-full max-w-4xl bg-white md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(23,35,60,0.08)] border border-[#EBE8E1] overflow-hidden flex flex-col md:flex-row min-h-[520px]">
        
        {/* الجانب الأيسر البصري */}
        <div className="relative md:w-5/12 bg-[#17233C] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
              alt="LUMA Security Architecture"
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

          <div className="relative z-10 my-6">
            <span className="text-[11px] font-semibold tracking-widest text-[#E89A5B] uppercase block mb-2">
              {t('forgotPassword.showcase.tagline')}
            </span>
            <p className="text-xl font-light leading-snug font-['Poppins'] text-[#F7F5F0]">
              {t('forgotPassword.showcase.quote')}
            </p>
          </div>

          <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/15 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E89A5B]/20 text-[#E89A5B] flex items-center justify-center font-bold text-sm">
              🛡️
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                {t('forgotPassword.showcase.badgeTitle')}
              </p>
              <p className="text-[10px] text-gray-300">
                {t('forgotPassword.showcase.badgeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* الجانب الأيمن: النموذج */}
        <div className="md:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17233C] tracking-tight font-['Poppins']">
                {t('forgotPassword.title')}
              </h2>
              <p className="text-sm text-[#7B8190] mt-2 leading-relaxed">
                {t('forgotPassword.subtitle')}
              </p>
            </div>

            {isSubmitted ? (
              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 text-emerald-800 text-sm rounded-2xl border border-emerald-200 flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <p className="leading-relaxed">{t('forgotPassword.successMsg')}</p>
                </div>
                <Link
                  to="/login"
                  className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>{t('forgotPassword.backToLogin')}</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937] mb-1.5">
                    {t('forgotPassword.emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-[#FAFAFA] focus:bg-white ${
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
                  className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-3.5 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 group"
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

                <div className="text-center pt-3">
                  <Link
                    to="/login"
                    className="text-xs text-[#7B8190] hover:text-[#17233C] font-semibold transition-colors underline decoration-1 underline-offset-4"
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