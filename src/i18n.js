import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// استيراد ملفات الترجمة الخاصة بالمصادقة
import enAuth from './locales/en/auth.json';
import arAuth from './locales/ar/auth.json';

// ملفات نصوص قائمة الرغبات
import enWishlist from './locales/en/wishlist.json';
import arWishlist from './locales/ar/wishlist.json';

const savedLanguage = localStorage.getItem('luma_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        wishlist: enWishlist,
        // هنا يستطيع باقي الزملاء إضافة ملفاتهم مستقبلاً:
        // cart: enCart,
      },
      ar: {
        auth: arAuth,
        wishlist: arWishlist,
        // cart: arCart,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    // هنا يستطيع باقي الزملاء إضافة اسم الملف الجديد الذي تم اضافته مستقبلاً:
    ns: ['auth', 'wishlist'],
    defaultNS: 'auth',
    interpolation: {
      escapeValue: false,
    },
  });

// ضبط اتجاه المستند ولغته فور بدء التطبيق
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

export default i18n;