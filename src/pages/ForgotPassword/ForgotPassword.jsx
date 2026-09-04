import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('صيغة البريد الإلكتروني غير صحيحة');
      return;
    }

    setIsLoading(true);

    // محاكاة إرسال رابط الاستعادة إلى البريد
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] shadow-sm p-6 sm:p-8">
        
        {/* رأس النموذج */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17233C] tracking-wide font-['Poppins']">
            LUMA
          </h1>
          <h2 className="text-lg font-semibold text-[#1F2937] mt-3 font-['Inter']">
            استعادة كلمة المرور
          </h2>
          <p className="text-sm text-[#7B8190] mt-1 font-['Inter']">
            أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
          </p>
        </div>

        {isSubmitted ? (
          /* شاشة تأكيد الإرسال بنجاح */
          <div className="text-center space-y-4 font-['Inter']">
            <div className="w-12 h-12 bg-[#4F8A70]/10 text-[#4F8A70] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <p className="text-sm text-[#1F2937] font-medium">
              تم إرسال تعليمات استعادة كلمة المرور إلى:
            </p>
            <p className="text-sm text-[#17233C] font-semibold dir-ltr">
              {email}
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-2.5 px-4 rounded-[10px] font-medium text-sm transition-all duration-200"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          /* نموذج الإدخال */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1 font-['Inter']">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="example@luma.com"
                className={`w-full px-4 py-2.5 rounded-[10px] border font-['Inter'] text-sm outline-none transition-colors duration-200 ${
                  error ? 'border-[#C95C5C]' : 'border-[#E5E7EB] focus:border-[#17233C]'
                }`}
              />
              {error && (
                <span className="text-xs text-[#C95C5C] mt-1 block">{error}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#17233C] hover:bg-[#E89A5B] text-white py-2.5 px-4 rounded-[10px] font-medium text-sm transition-all duration-200 font-['Inter'] flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm text-[#60708F] hover:text-[#E89A5B] transition-colors duration-150 font-['Inter'] font-medium"
              >
                تذكرت كلمة المرور؟ العودة لتسجيل الدخول
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;