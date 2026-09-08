import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext'; // استدعاء الـ AuthContext الجديد

const Navbar = ({ wishlistCount = 0, cartCount = 0 }) => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  
  // استدعاء الحالة والدالة بالأسماء الصحيحة من الـ AuthContext
  const { user, logoutUser } = useAuth();
  
  // التحقق هل المستخدم مسجل دخول أم لا بناءً على الـ user والـ token
  const isLoggedIn = !!user || !!localStorage.getItem('token');

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // قراءة الدارك مود من localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // دالة الـ Logout باستخدام الـ AuthContext
  const handleLogout = async () => {
    await logoutUser(); // بتنفذ الخروج من الباك اند وتمسح التوكن محلياً
    navigate('/Wishlist', { replace: true }); // توجيه مباشر لصفحة اللوجن
  };

  // تطبيق كلاس الدارك مود
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'My Orders', href: '/my-orders' },
    { name: 'Wishlist', href: '/wishlist' },
  ];

  return (
    <nav className="bg-[#FFFFFF] dark:bg-[#0F172A] text-[#1F2937] dark:text-white px-6 py-3.5 font-['Inter'] sticky top-0 z-50 border-b border-[#E5E7EB] dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-2xl tracking-wider font-['Poppins'] text-[#17233C] dark:text-white">
            LUMA
          </span>
        </div>

        {/* Navigation Pills */}
        <div className="hidden md:flex items-center bg-[#F7F5F0] dark:bg-gray-800 p-1 rounded-full border border-[#E5E7EB] dark:border-gray-700 space-x-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                setActiveTab(link.name);
                navigate(link.href);
              }}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === link.name
                  ? 'bg-[#17233C] text-[#FFFFFF] shadow-sm'
                  : 'text-[#7B8190] dark:text-gray-300 hover:text-[#1F2937] dark:hover:text-white hover:bg-[#E5E7EB]/50'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Icons & Dynamic Login/Logout Button */}
        <div className="hidden md:flex items-center gap-5 text-[#7B8190] dark:text-gray-300">
          
          {/* Search Box */}
          {isSearchOpen ? (
            <div className="flex items-center bg-[#F7F5F0] dark:bg-gray-800 rounded-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 transition-all shadow-inner">
              <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs mr-1.5"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
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
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="hover:text-[#E89A5B] transition-colors" 
            title="Toggle Theme"
          >
            <i className={`fa-regular ${isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon'} text-base`}></i>
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
            onClick={() => navigate('/checkout')}
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

          {/* Login / Logout Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all px-3.5 py-1.5 rounded-[10px] text-xs font-semibold tracking-wider ml-2 cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket text-sm"></i>
              <span>{t('logout')}</span>
            </button>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all px-3.5 py-1.5 rounded-[10px] text-xs font-semibold tracking-wider ml-2"
            >
              <i className="fa-regular fa-user text-sm"></i>
              <span>Login</span>
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
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                setActiveTab(link.name);
                navigate(link.href);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-lg hover:bg-[#F7F5F0] dark:hover:bg-gray-800 hover:text-[#17233C] dark:hover:text-white transition-colors"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E5E7EB] dark:border-gray-800 px-4">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 py-2 rounded-[10px] text-xs font-semibold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket text-sm"></i>
                <span>{t('logout')}</span>
              </button>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white py-2 rounded-[10px] text-xs font-semibold hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all"
              >
                <i className="fa-regular fa-user text-sm"></i>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;