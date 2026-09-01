import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const wishlistCount = 0;
  const cartCount = 0;

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Shop', href: '#' },
    { name: 'My Orders', href: '#' },
    { name: 'Wishlist', href: '#' },
  ];

  return (
    <nav className="bg-[#FFFFFF] text-[#1F2937] px-6 py-3.5 font-['Inter'] sticky top-0 z-50 border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl tracking-wider font-['Poppins'] text-[#17233C]">
            LUMA
          </span>
        </div>

        {/*Navigation Pills*/}
        <div className="hidden md:flex items-center bg-[#F7F5F0] p-1 rounded-full border border-[#E5E7EB] space-x-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === link.name
                  ? 'bg-[#17233C] text-[#FFFFFF] shadow-sm'
                  : 'text-[#7B8190] hover:text-[#1F2937] hover:bg-[#E5E7EB]/50'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/*Icons & Admin Button */}
        <div className="hidden md:flex items-center gap-5 text-[#7B8190]">
          
          {/* Search Icon */}
          <button className="hover:text-[#E89A5B] transition-colors" title="Search">
            <i className="fa-solid fa-magnifying-glass text-base"></i>
          </button>

          {/* Theme Toggle Icon */}
          <button className="hover:text-[#E89A5B] transition-colors" title="Toggle Theme">
            <i className="fa-regular fa-sun text-base"></i>
          </button>

          {/* Wishlist Icon */}
          <div className="relative cursor-pointer hover:text-[#E89A5B] transition-colors" title="Wishlist">
            <i className="fa-regular fa-heart text-base"></i>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E89A5B] text-[#FFFFFF] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-['Poppins']">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Cart Icon */}
          <div className="relative cursor-pointer hover:text-[#E89A5B] transition-colors" title="Cart">
            <i className="fa-solid fa-cart-shopping text-base"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E89A5B] text-[#FFFFFF] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-['Poppins']">
                {cartCount}
              </span>
            )}
          </div>

          {/* Admin Button */}
          <button className="flex items-center gap-2 border border-[#17233C] text-[#17233C] hover:bg-[#17233C] hover:text-[#FFFFFF] transition-all px-3.5 py-1.5 rounded-[10px] text-xs font-semibold tracking-wider ml-2">
            <i className="fa-regular fa-user text-sm"></i>
            <span>ADMIN</span>
          </button>

        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#17233C] focus:outline-none text-xl"
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-t border-[#E5E7EB] mt-3 pt-3 pb-3 space-y-2 text-sm text-[#7B8190]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-4 py-2 rounded-lg hover:bg-[#F7F5F0] hover:text-[#17233C] transition-colors">
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-[#E5E7EB] px-4">
            <button className="w-full flex items-center justify-center gap-2 border border-[#17233C] text-[#17233C] py-2 rounded-[10px] text-xs font-semibold hover:bg-[#17233C] hover:text-[#FFFFFF] transition-all">
              <i className="fa-regular fa-user text-sm"></i>
              <span>ADMIN</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;