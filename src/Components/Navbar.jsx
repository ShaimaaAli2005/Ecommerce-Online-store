import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ wishlistCount = 0 }) => {
  const { t, i18n } = useTranslation(['common', 'auth']);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user } = useAuth();

  const isLoggedIn = !!user || !!localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (
      savedTheme === 'dark' ||
      document.documentElement.classList.contains('dark')
    ) {
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
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleToggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    {
      name: 'Home',
      label: t('common:home', 'Home'),
      href: '/',
    },
    {
      name: 'Shop',
      label: t('common:shop', 'Shop'),
      href: '/shop',
    },
    {
      name: 'My Orders',
      label: t('common:myOrders', 'My Orders'),
      href: '/my-orders',
    },
    {
      name: 'Wishlist',
      label: t('common:wishlist', 'Wishlist'),
      href: '/wishlist',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/shop?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="bg-[#FFFFFF] dark:bg-[#0F172A] text-[#1F2937] dark:text-white px-6 py-3.5 font-['Inter'] sticky top-0 z-50 border-b border-[#E5E7EB] dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/">
            <span className="font-bold text-2xl tracking-wider font-['Poppins'] text-[#17233C] dark:text-white">
              LUMA
            </span>
          </Link>
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
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === link.name
                  ? 'bg-[#17233C] text-white'
                  : 'text-[#7B8190] dark:text-gray-300 hover:text-[#17233C] dark:hover:text-white'
              }`}
            >
              {link.label}

              {link.name === 'Wishlist' && wishlistCount > 0 && (
                <span className="ml-1">
                  ({wishlistCount})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder={t(
                    'common:search',
                    'Search...'
                  )}
                  autoFocus
                  className="w-32 md:w-44 px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#17233C] dark:text-white outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="ml-2 text-[#7B8190] hover:text-[#E89A5B]"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-[#17233C] dark:text-white hover:text-[#E89A5B] transition-colors"
                title={t('common:search', 'Search')}
              >
                <i className="fa-solid fa-magnifying-glass text-base"></i>
              </button>
            )}
          </div>

          {/* Language */}
          <button
            onClick={handleToggleLanguage}
            className="text-[#17233C] dark:text-white hover:text-[#E89A5B] transition-colors"
            title="Change Language"
          >
            <i className="fa-solid fa-globe text-base"></i>
          </button>

          {/* Dark Mode */}
          <button
            onClick={handleToggleDarkMode}
            className="text-[#17233C] dark:text-white hover:text-[#E89A5B] transition-colors"
            title="Toggle Dark Mode"
          >
            <i
              className={`fa-solid ${
                isDarkMode ? 'fa-sun' : 'fa-moon'
              } text-base`}
            ></i>
          </button>

          {/* Wishlist */}
          <div
            onClick={() => navigate('/wishlist')}
            className="relative cursor-pointer text-[#17233C] dark:text-white hover:text-[#E89A5B] transition-colors"
            title="Wishlist"
          >
            <i className="fa-regular fa-heart text-base"></i>

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E89A5B] text-[#FFFFFF] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-['Poppins']">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Cart */}
          <div
            onClick={() => navigate('/cart')}
            className="relative cursor-pointer text-[#17233C] dark:text-white hover:text-[#E89A5B] transition-colors"
            title="Cart"
          >
            <i className="fa-solid fa-cart-shopping text-base"></i>

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E89A5B] text-[#FFFFFF] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-['Poppins']">
                {cartCount}
              </span>
            )}
          </div>

          {/* Profile / Admin / Login */}
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all px-3.5 py-1.5 rounded-[10px] text-xs font-semibold tracking-wider ml-2"
            >
              <i className="fa-regular fa-user text-sm"></i>

              <span>
                {isAdmin ? 'Admin' : 'Profile'}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all px-3.5 py-1.5 rounded-[10px] text-xs font-semibold tracking-wider ml-2"
            >
              <i className="fa-regular fa-user text-sm"></i>
              <span>
                {t('auth:login', 'Login')}
              </span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#17233C] dark:text-white focus:outline-none text-xl"
        >
          <i
            className={`fa-solid ${
              isOpen ? 'fa-xmark' : 'fa-bars'
            }`}
          ></i>
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
              {link.label}

              {link.name === 'Wishlist' &&
                wishlistCount > 0 && (
                  <span className="ml-1">
                    ({wishlistCount})
                  </span>
                )}
            </button>
          ))}

          {/* Mobile Language */}
          <button
            onClick={() => {
              handleToggleLanguage();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-[#F7F5F0] dark:hover:bg-gray-800 hover:text-[#17233C] dark:hover:text-white transition-colors"
          >
            <i className="fa-solid fa-globe mr-2"></i>
            {i18n.language === 'ar'
              ? 'English'
              : 'العربية'}
          </button>

          <div className="pt-2 border-t border-[#E5E7EB] dark:border-gray-800 px-4">

            {isLoggedIn ? (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white py-2 rounded-[10px] text-xs font-semibold hover:bg-[#17233C] dark:hover:bg-white hover:text-[#FFFFFF] dark:hover:text-[#17233C] transition-all"
              >
                <i className="fa-regular fa-user text-sm"></i>

                <span>
                  {isAdmin ? 'Admin' : 'Profile'}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-[#17233C] dark:border-white text-[#17233C] dark:text-white py-2 rounded-[10px] text-xs font-semibold hover:bg-[#17233C] dark:hover:bg-white hover:text-[#17233C] transition-all"
              >
                <i className="fa-regular fa-user text-sm"></i>

                <span>
                  {t('auth:login', 'Login')}
                </span>
              </Link>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;