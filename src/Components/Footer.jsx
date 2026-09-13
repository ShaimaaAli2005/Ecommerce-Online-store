import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation('auth');

  return (
    <footer className="bg-[#17233C] text-white font-['Inter'] pt-12 pb-6 border-t border-[#E5E7EB]/10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 mb-10 text-start">
        
        {/* Brand Logo & Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-2xl tracking-wider font-['Poppins'] text-white">
              LUMA
            </h2>
          </div>
          <p className="text-[#7B8190] text-sm leading-relaxed max-w-sm">
            {t('footer.desc', 'Shop the future, delivered today. Premium products at the best prices with fast delivery across Egypt.')}
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base font-['Poppins'] text-white">
            {t('footer.quickLinks', 'Quick Links')}
          </h3>
          <ul className="space-y-2 text-sm text-[#7B8190]">
            <li><Link to="/shop" className="hover:text-[#E89A5B] transition-colors">{t('navbar.shop', 'Shop')}</Link></li>
            <li><Link to="/my-orders" className="hover:text-[#E89A5B] transition-colors">{t('navbar.myOrders', 'My Orders')}</Link></li>
            <li><Link to="/wishlist" className="hover:text-[#E89A5B] transition-colors">{t('navbar.wishlist', 'Wishlist')}</Link></li>
            <li><Link to="/profile" className="hover:text-[#E89A5B] transition-colors">{t('navbar.admin', 'Profile')}</Link></li>
          </ul>
        </div>

        {/* Follow Us & Social Icons */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base font-['Poppins'] text-white">
            {t('footer.followUs', 'Follow Us')}
          </h3>
          <div className="flex items-center gap-3 text-sm">
            <a 
              href="#" 
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#7B8190] hover:bg-[#E89A5B] hover:text-white transition-all"
              title="Website"
            >
              <i className="fa-solid fa-globe"></i>
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#7B8190] hover:bg-[#E89A5B] hover:text-white transition-all"
              title="Community"
            >
              <i className="fa-regular fa-comment-dots"></i>
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#7B8190] hover:bg-[#E89A5B] hover:text-white transition-all"
              title="Wishlist">
              <i className="fa-regular fa-heart"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 pt-6 border-t border-white/10 text-center text-xs text-[#7B8190]">
        © {new Date().getFullYear()} {t('footer.rights', 'LUMA Store. All rights reserved.')}
      </div>
    </footer>
  );
};

export default Footer;