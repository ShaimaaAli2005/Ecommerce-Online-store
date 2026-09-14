import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import arAuth from './locales/ar/auth.json';

import enWishlist from './locales/en/wishlist.json';
import arWishlist from './locales/ar/wishlist.json';

import enProducts from './locales/en/products.json';
import arProducts from './locales/ar/products.json';

import enProfile from './locales/en/profile.json';
import arProfile from './locales/ar/profile.json';
// استيراد ال navbar
import Navbar from './Components/Navbar';

import enOrders from './locales/en/orders.json';
import arOrders from './locales/ar/orders.json';

const savedLanguage = localStorage.getItem('luma_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        wishlist: enWishlist,
        products: enProducts,
        profile: enProfile,
        orders: enOrders,
      },

      ar: {
        auth: arAuth,
        wishlist: arWishlist,
        shop: arShop,
        profile: arProfile,
        
        // cart: arCart,
      },
    },

    lng: savedLanguage,
    fallbackLng: 'en',

    ns: ['auth', 'wishlist', 'products', 'profile', 'orders'],

    defaultNS: 'auth',

    interpolation: {
      escapeValue: false,
    },
  });

document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

export default i18n;