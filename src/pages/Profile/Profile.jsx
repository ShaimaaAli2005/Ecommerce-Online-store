import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import md5 from 'crypto-js/md5';

const getGravatarUrl = (email) => {
  if (!email) return '';
  const cleanEmail = email.trim().toLowerCase();
  const hash = md5(cleanEmail).toString();
  // d=identicon تعيد شكلاً هندسياً فريداً للمستخدم إذا لم تكن هناك صورة، أو d=mp لأيقونة رمادية
  return `https://www.gravatar.com/avatar/${hash}?d=mp&s=150`;
};

// تشفير البريد الإلكتروني للمحافظة على الخصوصية
const maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (name.length <= 3) return `${name[0]}***@${domain}`;
  const first = name.slice(0, 2);
  const last = name.slice(-2);
  return `${first}${'•'.repeat(Math.max(name.length - 4, 4))}${last}@${domain}`;
};

export default function Profile() {
  const { user, setUser, refreshUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [showFullEmail, setShowFullEmail] = useState(false);

  // قراءة الحقول بحسب مسميات السيرفر (username & phone)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // مزامنة البيانات مع كائن المستخدم من الـ Context فور توفره
  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // تحديث البيانات الأساسية (PATCH /users/{id} باستخدام username و phone)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error('تعذر تحديد هوية المستخدم');
      return;
    }

    try {
      setLoading(true);

      // الـ Payload الدقيق المطابق لـ Swagger
      const payload = {
        username: userData.username,
        phone: userData.phone,
      };

      const res = await userService.updateUserProfile(userId, payload);

      // استخراج المستخدم المحدث من استجابة السيرفر (res.data.user)
      const updatedUser = res?.user || res?.data?.user || {
        ...user,
        username: userData.username,
        name: userData.username,
        phone: userData.phone,
      };

      // 1. تحديث الـ Context
      if (setUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
      }

      // 2. تحديث الـ LocalStorage لمنع اختفائه بعد الـ Refresh
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // 3. تحديث الـ State الداخلي
      setUserData((prev) => ({
        ...prev,
        username: updatedUser.username,
        phone: updatedUser.phone,
      }));

      // 4. استدعاء refreshUser لتحديث الجلسة
      if (refreshUser) {
        await refreshUser();
      }

      toast.success('تم تحديث البيانات بنجاح');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تحديث البيانات');
    } finally {
      setLoading(false);
    }
  };

  // إرسال رمز التحقق
  const handleSendOtp = async () => {
    if (!userData.email) {
      toast.error('البريد الإلكتروني غير متوفر');
      return;
    }

    try {
      setLoading(true);
      await userService.sendResetOtp(userData.email);
      toast.success('تم إرسال رمز التحقق بنجاح');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل إرسال كود التحقق');
    } finally {
      setLoading(false);
    }
  };

  // تأكيد كلمة المرور
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('يرجى إدخال كود التحقق');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('كلمة المرور يجب ألا تقل عن 6 أحرف');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }

    try {
      setLoading(true);
      await userService.verifyResetOtp(userData.email, otp, newPassword);
      toast.success('تم تغيير كلمة المرور بنجاح');
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'رمز التحقق غير صحيح أو منتهي');
    } finally {
      setLoading(false);
    }
  };

  const displayName = userData.username || user?.username || user?.name || '';
  const userInitial = displayName ? displayName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-[82vh] bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* الكارت العلوي */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex-shrink-0">
                <img
                    src={user?.avatar && user.avatar !== 'string' ? user.avatar : getGravatarUrl(userData.email)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                    // بديل احتياطي لو فشل التحميل
                    e.target.src = 'https://www.gravatar.com/avatar/?d=mp';
                    }}
                />
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {displayName || 'حساب المستخدم'}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  نشط
                </span>
              </div>

              {/* البريد الإلكتروني المشفر */}
              <div className="flex items-center gap-2 mt-1" dir="ltr">
                <span className="text-sm font-mono text-slate-500">
                  {showFullEmail ? userData.email : maskEmail(userData.email)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullEmail(!showFullEmail)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded transition"
                  title={showFullEmail ? 'إخفاء البريد' : 'إظهار البريد'}
                >
                  {showFullEmail ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="z-10 flex items-center gap-3">
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              حساب موثق
            </div>
          </div>

          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* شريط التبويبات */}
        <div className="flex justify-start">
          <div className="inline-flex p-1.5 bg-slate-200/60 rounded-xl border border-slate-200 backdrop-blur-sm gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'info'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              البيانات الشخصية
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'password'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              الأمان وكلمة المرور
            </button>
          </div>
        </div>

        {/* تبويب 1: البيانات الشخصية */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 sm:px-8 border-b border-slate-100 bg-slate-50/40">
              <h2 className="text-base font-semibold text-slate-900">تعديل معلومات الحساب</h2>
              <p className="text-xs text-slate-500 mt-0.5">يمكنك تعديل اسم المستخدم أو رقم الهاتف الخاص بالتوصيل.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition font-medium"
                    placeholder="اسم المستخدم"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition font-medium text-left"
                    dir="ltr"
                    placeholder="+20 100 000 0000"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* تبويب 2: الأمان وكلمة المرور */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 sm:px-8 border-b border-slate-100 bg-slate-50/40">
              <h2 className="text-base font-semibold text-slate-900">تحديث كلمة المرور</h2>
              <p className="text-xs text-slate-500 mt-0.5">يتم التحقق عبر إرسال رمز تأكيد مؤقت (OTP) إلى بريدك المسجل.</p>
            </div>

            <div className="p-6 sm:p-8 max-w-xl">
              {!otpSent ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    لحماية حسابك، سنقوم بإرسال رمز تحقق صالح للاستخدام مرة واحدة للتأكد من هويتك قبل تعيين كلمة المرور الجديدة.
                  </p>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {loading ? 'جاري إرسال الرمز...' : 'إرسال رمز التحقق الآن'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmReset} className="space-y-5">
                  <div className="p-3 bg-blue-50 border border-blue-100 text-blue-900 text-xs rounded-xl flex items-center justify-between">
                    <span>تم إرسال رمز التحقق إلى بريدك</span>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-blue-700 hover:text-blue-900 font-semibold underline"
                    >
                      إعادة الإرسال
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                      رمز التحقق (OTP)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.trim())}
                      placeholder="• • • • • •"
                      className="w-full text-center font-mono tracking-[0.5em] text-xl font-bold py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                      كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition"
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {loading ? 'جاري التحقق...' : 'تأكيد وحفظ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="py-2.5 px-4 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}