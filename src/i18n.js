import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// استيراد ملفات الترجمة الخاصة بالمصادقة
import enAuth from './locales/en/auth.json';
import arAuth from './locales/ar/auth.json';

// ملفات نصوص قائمة الرغبات
import enWishlist from './locales/en/wishlist.json';
import arWishlist from './locales/ar/wishlist.json';

// استيراد ملفات المتجر الجديدة
import enShop from './locales/en/shop.json';
import arShop from './locales/ar/shop.json';

// استيراد ملفات البروفايل الجديدة
import enProfile from './locales/en/profile.json';
import arProfile from './locales/ar/profile.json';

const savedLanguage = localStorage.getItem('luma_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        wishlist: enWishlist,
        shop: enShop,
        profile: enProfile,
        // هنا يستطيع باقي الزملاء إضافة ملفاتهم مستقبلاً:
        // cart: enCart,
      },
      ar: {
        auth: arAuth,
        wishlist: arWishlist,
 feature/navbar-and-routes

        shop: arShop,
        profile: arProfile,
 develop
        // cart: arCart,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    // هنا يستطيع باقي الزملاء إضافة اسم الملف الجديد الذي تم اضافته مستقبلاً:
    ns: ['auth', 'wishlist', 'shop', 'profile'],
    defaultNS: 'auth',
    interpolation: {
      escapeValue: false,
    },
  });

// ضبط اتجاه المستند ولغته فور بدء التطبيق
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

// الاستماع لأي تغيير في اللغة لتحديث الـ dir والـ lang وتخزين القيمة
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  localStorage.setItem('luma_lang', lng);
});



export default i18n;