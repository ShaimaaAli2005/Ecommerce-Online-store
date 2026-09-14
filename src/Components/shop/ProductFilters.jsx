import React from 'react';
import { useTranslation } from 'react-i18next';

const CATEGORIES_DEF = [
  { id: '', key: 'allCategories', defaultLabel: 'All Categories' },
  { id: 'phones', key: 'cat_phones', defaultLabel: 'Smartphones' },
  { id: 'electronics', key: 'cat_electronics', defaultLabel: 'Electronics' },
  { id: 'audio', key: 'cat_audio', defaultLabel: 'Audio & Headphones' },
  { id: 'accessories', key: 'cat_accessories', defaultLabel: 'Accessories' },
  { id: 'wearables', key: 'cat_wearables', defaultLabel: 'Smart Devices' },
];

const BRANDS = ['Sony', 'Apple', 'Samsung', 'Anker', 'Bose', 'JBL'];

export default function ProductFilters({ filters, onFilterChange, onReset }) {
  const { t, i18n } = useTranslation('shop');
  const isRtl = i18n.language === 'ar';

  const SORT_OPTIONS = [
    { value: '', label: t('sortDefault', 'Default Sorting') },
    { value: 'price_asc', label: t('sortPriceAsc', 'Price: Low to High') },
    { value: 'price_desc', label: t('sortPriceDesc', 'Price: High to Low') },
    { value: 'rating', label: t('sortRating', 'Highest Rated') },
    { value: 'popular', label: t('sortPopular', 'Most Popular') },
    { value: 'oldest', label: t('sortOldest', 'Oldest') },
  ];

  const handleBrandToggle = (brand) => {
    if (filters.brand === brand) {
      onFilterChange('brand', '');
    } else {
      onFilterChange('brand', brand);
    }
  };

  return (
    <div className={`space-y-6 select-none ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. الترتيب المتوافق مع الـ API */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {t('sortBy', 'Sort By')}
        </label>
        <select
          value={filters.sort || ''}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:border-[#E89A5B] outline-none transition cursor-pointer font-medium text-slate-700 dark:text-gray-200"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value || 'default-sort'} value={opt.value} className="dark:bg-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <hr className="border-slate-100 dark:border-gray-700" />

      {/* 2. التصنيفات مع إضافة key لكل عنصر */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-3">
          {t('categories', 'Categories')}
        </h3>
        <div className="space-y-1.5">
          {CATEGORIES_DEF.map((cat) => {
            const isSelected = (filters.category || '') === cat.id;
            return (
              <button
                key={cat.id || 'all-cat'}
                type="button"
                onClick={() => onFilterChange('category', cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#17233C] text-white dark:bg-[#E89A5B] font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{t(cat.key, cat.defaultLabel)}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-gray-700" />

      {/* 3. نطاق السعر */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
            {t('priceRange', 'Price Range (EGP)')}
          </h3>
          <span className="text-[11px] font-bold text-[#E89A5B] font-mono">
            {filters.minPrice || 0} - {filters.maxPrice || '5000+'}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="10000"
          step="250"
          value={filters.maxPrice || 10000}
          onChange={(e) => onFilterChange('maxPrice', e.target.value === '10000' ? '' : e.target.value)}
          className="w-full h-1.5 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#E89A5B] mb-3"
        />

        <div className="grid grid-cols-2 gap-3" dir="ltr">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 dark:text-gray-400 mb-1">
              {t('minPrice', 'Min')}
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:border-[#E89A5B] outline-none transition font-medium text-slate-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 dark:text-gray-400 mb-1">
              {t('maxPrice', 'Max')}
            </label>
            <input
              type="number"
              min="0"
              placeholder="5000"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:border-[#E89A5B] outline-none transition font-medium text-slate-800 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-gray-700" />

      {/* 4. الماركات */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-3">
          {t('brands', 'Brands')}
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pl-1">
          {BRANDS.map((brand) => {
            const isChecked = filters.brand === brand;
            return (
              <div
                key={brand}
                onClick={() => handleBrandToggle(brand)}
                className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="w-4 h-4 text-[#E89A5B] accent-[#E89A5B] border-slate-300 dark:border-gray-600 rounded cursor-pointer pointer-events-none"
                />
                <span className={isChecked ? 'font-semibold text-[#E89A5B]' : ''}>{brand}</span>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-gray-700" />

      <button
        type="button"
        onClick={onReset}
        className="w-full py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl transition cursor-pointer"
      >
        {t('resetFilters', 'Reset Filters')}
      </button>

    </div>
  );
}