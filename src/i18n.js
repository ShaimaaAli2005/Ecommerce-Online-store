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

// ملفات النصوص المشتركة (الناف بار...إلخ)
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

// ملفات صفحة الهوم
import enHome from './locales/en/home.json';
import arHome from './locales/ar/home.json';

// ملفات الفوتر
import enFooter from './locales/en/footer.json';
import arFooter from './locales/ar/footer.json';

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
        common: enCommon,
        home: enHome,
        footer: enFooter,
      },
      ar: {
        auth: arAuth,
        wishlist: arWishlist,
        shop: arShop,
        profile: arProfile,
        common: arCommon,
        home: arHome,
        footer: arFooter,
        // cart: arCart,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    ns: ['auth', 'wishlist', 'shop', 'profile', 'common', 'home', 'footer'],
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