import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Authentication translations
import enAuth from './locales/en/auth.json';
import arAuth from './locales/ar/auth.json';

// Wishlist translations
import enWishlist from './locales/en/wishlist.json';
import arWishlist from './locales/ar/wishlist.json';

// Shop translations
import enShop from './locales/en/shop.json';
import arShop from './locales/ar/shop.json';

// Profile translations
import enProfile from './locales/en/profile.json';
import arProfile from './locales/ar/profile.json';

// Common translations
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

// Home translations
import enHome from './locales/en/home.json';
import arHome from './locales/ar/home.json';

// Footer translations
import enFooter from './locales/en/footer.json';
import arFooter from './locales/ar/footer.json';

// Orders translations
import enOrders from './locales/en/orders.json';
import arOrders from './locales/ar/orders.json';

const savedLanguage =
  localStorage.getItem('luma_lang') || 'en';

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
        orders: enOrders,
      },

      ar: {
        auth: arAuth,
        wishlist: arWishlist,
        shop: arShop,
        profile: arProfile,
        common: arCommon,
        home: arHome,
        footer: arFooter,
        orders: arOrders,
      },
    },

    lng: savedLanguage,

    fallbackLng: 'en',

    ns: [
      'auth',
      'wishlist',
      'shop',
      'profile',
      'common',
      'home',
      'footer',
      'orders',
    ],

    defaultNS: 'auth',

    interpolation: {
      escapeValue: false,
    },
  });

// Set page direction and language on startup
document.documentElement.dir =
  savedLanguage === 'ar' ? 'rtl' : 'ltr';

document.documentElement.lang = savedLanguage;

// Update direction and save language when it changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir =
    lng === 'ar' ? 'rtl' : 'ltr';

  document.documentElement.lang = lng;

  localStorage.setItem('luma_lang', lng);
});

export default i18n;