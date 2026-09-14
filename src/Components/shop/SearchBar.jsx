import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SearchBar({ value, onChange, placeholder, products = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // تصفية النتائج المقترحة لحظياً أثناء الكتابة
  const suggestions = value.trim().length > 1
    ? products.filter((p) => (p.name || p.title || '').toLowerCase().includes(value.toLowerCase())).slice(0, 4)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <i className="fa-solid fa-magnifying-glass absolute left-4 text-slate-400 dark:text-gray-400 text-sm"></i>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E89A5B]/20 focus:border-[#E89A5B] transition shadow-2xs font-medium"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* قائمة الاقتراحات السريعة Instant Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-gray-700 text-[11px] font-bold uppercase text-slate-400">
            Suggested Products
          </div>
          <div className="divide-y divide-slate-100 dark:divide-gray-700/60">
            {suggestions.map((item) => (
              <Link
                key={item._id || item.id}
                to={`/products/${item._id || item.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-gray-700 transition"
              >
                <img
                  src={item.images?.[0]?.url || item.image || 'https://placehold.co/50x50?text=P'}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-gray-900 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-[#E89A5B] font-semibold font-mono">
                    {item.discountPrice || item.price} EGP
                  </p>
                </div>
                <i className="fa-solid fa-arrow-right text-slate-300 text-xs"></i>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}