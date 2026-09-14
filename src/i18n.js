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

import enShop from './locales/en/shop.json';
import arShop from './locales/ar/shop.json';

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
        shop: enShop,
        orders: enOrders,
      },

      ar: {
        auth: arAuth,
        wishlist: arWishlist,
        products: arProducts,
        profile: arProfile,
        shop: arShop,
        orders: arOrders,
      },
    },

    lng: savedLanguage,
    fallbackLng: 'en',

    ns: ['auth', 'wishlist', 'products', 'profile', 'shop', 'orders'],

    defaultNS: 'auth',

    interpolation: {
      escapeValue: false,
    },
  });

document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

export default i18n;