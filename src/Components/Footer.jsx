import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#17233C] text-white font-['Inter'] pt-12 pb-6 border-t border-[#E5E7EB]/10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-30 mb-10 text-left">
        
        {/* Brand Logo & Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            
            <h2 className="font-bold text-2xl tracking-wider font-['Poppins'] text-white">
              LUMA
            </h2>
          </div>
          <p className="text-[#7B8190] text-sm leading-relaxed max-w-sm">
            Shop the future, delivered today. Premium products at the best prices with fast delivery across Egypt.
          </p>
        </div>

        {/*Quick Links */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base font-['Poppins'] text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-[#7B8190]">
            <li><a href="#" className="hover:text-[#E89A5B] transition-colors">Shop</a></li>
            <li><a href="#" className="hover:text-[#E89A5B] transition-colors">My Orders</a></li>
            <li><a href="#" className="hover:text-[#E89A5B] transition-colors">Wishlist</a></li>
            <li><a href="#" className="hover:text-[#E89A5B] transition-colors">Profile</a></li>
          </ul>
        </div>

        {/* Follow Us & Social Icons */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base font-['Poppins'] text-white">
            Follow Us
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
        © {new Date().getFullYear()} LUMA Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;