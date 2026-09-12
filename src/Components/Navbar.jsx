import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

const Navbar = ({ wishlistCount = 0 }) => {
  const { t, i18n } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  
  const { user } = useAuth();
  const isLoggedIn = !!user || !!localStorage.getItem('token');

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const currentLang = i18n.language || 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('luma_lang', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  // التأكد من وضع الداركات عند فتح الصفحة
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      // تطبيق اللون الأسود الفخم يدوياً على أي عنصر خلفيته بيضاء للتأكيد الفوري
      document.querySelectorAll('.bg-white').forEach(el => {
        el.style.backgroundColor = '#1e293b';
        el.style.color = '#ffffff';
      });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      // رجوع الألوان لطبيعتها
      document.querySelectorAll('.bg-white').forEach(el => {
        el.style.backgroundColor = '';
        el.style.color = '';
      });
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/shop') setActiveTab('Shop');
    else if (path.startsWith('/my-orders')) setActiveTab('My Orders');
    else if (path.startsWith('/wishlist')) setActiveTab('Wishlist');
    else setActiveTab('Home');
  }, [location.pathname]);

  const navLinks = [
    { tabKey: 'Home', name: t('navbar.home', 'Home'), href: '/' },
    { tabKey: 'Shop', name: t('navbar.shop', 'Shop'), href: '/shop' },
    { tabKey: 'My Orders', name: t('navbar.myOrders', 'My Orders'), href: '/my-orders' },
    { tabKey: 'Wishlist', name: t('navbar.wishlist', 'Wishlist'), href: '/wishlist' },
  ];

  return (
    <nav className="bg-[#FFFFFF] dark:bg-[#0F172A] text-[#1F2937] dark:text-white px-6 py-3.5 font-['Inter'] sticky top-0 z-50 border-b border-[#E5E7EB] dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link 
          to="/" 
          onClick={() => setActiveTab('Home')}
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span className="font-bold text-2xl tracking-wider font-['Poppins'] text-[#17233C] dark:text-white">
            LUMA
          </span>
        </Link>

        {/* Navigation Pills */}
        <div className="hidden md:flex items-center bg-[#F7F5F0] dark:bg-gray-800 p-1 rounded-full border border-[#E5E7EB] dark:border-gray-700 gap-1">
          {navLinks.map((link) => {
            const active = activeTab === link.tabKey;
            return (
              <button
                key={link.tabKey}
                onClick={() => {
                  setActiveTab(link.tabKey);
                  navigate(link.href);
                }}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#17233C] text-white dark:bg-white dark:text-[#17233C] shadow-sm font-semibold'
                    : 'text-[#7B8190] dark:text-gray-300 hover:text-[#1F2937] dark:hover:text-white hover:bg-[#E5E7EB]/50'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        {/* Icons & Actions */}
        <div className="hidden md:flex items-center gap-4 text-[#7B8190] dark:text-gray-300">
          
          {/* Search Box */}
          {isSearchOpen ? (
            <div className="flex items-center bg-[#F7F5F0] dark:bg-gray-800 rounded-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 transition-all shadow-inner">
              <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs mr-1.5"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('navbar.searchPlaceholder', 'Search...')}
                autoFocus
                className="w-36 lg:w-44 bg-transparent border-none outline-none text-xs text-gray-800 dark:text-white px-1 placeholder-gray-400"
              />
              <button 
                onClick={() => setIsSearchOpen(false)} 
                className="text-gray-400 hover:text-red-500 text-xs ml-1 font-bold transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-[#E89A5B] transition-colors p-1.5" 
              title="Search"
            >
              <i className="fa-solid fa-magnifying-glass text-base"></i>
            </button>
          )}

          {/* Theme Toggle Icon */}
          <button 
            onClick={handleToggleDarkMode}
            className="hover:text-[#E89A5B] transition-colors p-1.5 cursor-pointer text-base text-[#7B8190] dark:text-gray-300"
            title="Toggle Theme"
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-moon text-[#E89A5B]' : 'fa-sun'}`}></i>
          </button>

          {/* Wishlist Icon */}
          <div 
            onClick={() => navigate('/wishlist')}
            className="relative cursor-pointer hover:text-[#E89A5B] dark:text-gray-200 transition-colors" 
            title="Wishlist"
          >
            <i className="fa-regular fa-heart text-base"></i>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E89A5B] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-['Poppins']">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Cart Icon */}
          <div 
            onClick={() => navigate('/cart')}
            className="relative cursor-pointer hover:text-[#E89A5B] transition-colors" 
            title="Cart"
          >
            <i className="fa-solid fa-cart-shopping text-base"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E89A5B] text-[#FFFFFF] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-['Poppins']">
                {cartCount}
              </span>
            )}
          </div>

          {/* Language Toggle Button */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F7F5F0] dark:bg-gray-800 text-[#17233C] dark:text-white hover:bg-[#E89A5B] hover:text-white dark:hover:bg-[#E89A5B] dark:hover:text-white border border-[#E5E7EB] dark:border-gray-700 transition-all duration-300 shadow-sm cursor-pointer group"
            title="Toggle Language"
          >
            <i className="fa-solid fa-globe text-sm text-[#E89A5B] group-hover:text-white transition-colors"></i>
            <span>{currentLang.startsWith('ar') ? 'EN' : 'عربي'}</span>
          </button>

          {/* Admin Profile Link OR Login Button */}
          {isLoggedIn ? (
            <Link 
              to="/profile"
              className="flex items-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all px-3.5 py-1.5 rounded-[10px] text-xs font-semibold tracking-wider"
            >
              <i className="fa-regular fa-user text-sm"></i>
              <span>{t('navbar.admin', 'Admin')}</span>
            </Link>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all px-3.5 py-1.5 rounded-[10px] text-xs font-semibold tracking-wider"
            >
              <i className="fa-regular fa-user text-sm"></i>
              <span>{t('navbar.login', 'Login')}</span>
            </Link>
          )}

        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#17233C] dark:text-white focus:outline-none text-xl"
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FFFFFF] dark:bg-gray-900 border-t border-[#E5E7EB] dark:border-gray-800 mt-3 pt-3 pb-3 space-y-2 text-sm text-[#7B8190] dark:text-gray-300">
          {navLinks.map((link) => {
            const active = activeTab === link.tabKey;
            return (
              <button
                key={link.tabKey}
                onClick={() => {
                  setActiveTab(link.tabKey);
                  navigate(link.href);
                  setIsOpen(false);
                }}
                className={`block w-full text-start px-4 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-[#17233C] text-white dark:bg-white dark:text-[#17233C] font-semibold'
                    : 'hover:bg-[#F7F5F0] dark:hover:bg-gray-800 hover:text-[#17233C] dark:hover:text-white'
                }`}
              >
                {link.name}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#E5E7EB] dark:border-gray-800 px-4 space-y-3">
            {/* Language & Theme Toggle in Mobile */}
            <div className="flex items-center justify-between py-1 px-1">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-xs font-semibold text-[#17233C] dark:text-white hover:text-[#E89A5B] transition-colors p-1.5"
              >
                <i className="fa-solid fa-globe text-sm"></i>
                <span>{currentLang.startsWith('ar') ? 'English' : 'عربي'}</span>
              </button>

              <button
                onClick={handleToggleDarkMode}
                className="flex items-center gap-2 text-xs font-bold text-[#17233C] dark:text-white hover:text-[#E89A5B] transition-colors p-1.5"
              >
                <i className={`fa-solid ${isDarkMode ? 'fa-moon text-[#E89A5B]' : 'fa-sun'} text-sm`}></i>
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>

            {isLoggedIn ? (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white py-2 rounded-[10px] text-xs font-semibold hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all"
              >
                <i className="fa-regular fa-user text-sm"></i>
                <span>{t('navbar.admin', 'Admin')}</span>
              </Link>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white py-2 rounded-[10px] text-xs font-semibold hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all"
              >
                <i className="fa-regular fa-user text-sm"></i>
                <span>{t('navbar.login', 'Login')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;