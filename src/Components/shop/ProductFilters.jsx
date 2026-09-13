import React from 'react';
import { useTranslation } from 'react-i18next';

const CATEGORIES_DEF = [
  { id: '', key: 'allCategories', defaultLabel: 'All Categories' },
  { id: 'electronics', key: 'cat_electronics', defaultLabel: 'Electronics' },
  { id: 'audio', key: 'cat_audio', defaultLabel: 'Audio & Headphones' },
  { id: 'accessories', key: 'cat_accessories', defaultLabel: 'Accessories' },
  { id: 'wearables', key: 'cat_wearables', defaultLabel: 'Smart Devices' },
];

const BRANDS = ['Sony', 'Apple', 'Samsung', 'Anker', 'Bose', 'JBL'];

export default function ProductFilters({ filters, onFilterChange, onReset }) {
  // 1. استدعاء الـ Hook داخل المكون ليتجاوب فوراً مع تغييرات اللغة
  const { t, i18n } = useTranslation('shop');
  const isRtl = i18n.language === 'ar';

  const SORT_OPTIONS = [
    { value: '', label: t('defaultSort', 'Default') },
    { value: 'price_asc', label: t('priceLowHigh', 'Price: Low to High') },
    { value: 'price_desc', label: t('priceHighLow', 'Price: High to Low') },
    { value: 'rating', label: t('topRated', 'Top Rated') },
  ];

  // دالة مخصصة لتبديل الماركة أو إلغائها بنقرة واحدة
  const handleBrandToggle = (brand) => {
    if (filters.brand === brand) {
      onFilterChange('brand', '');
    } else {
      onFilterChange('brand', brand);
    }
  };

  return (
    <div className={`space-y-6 select-none ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. الترتيب (Sort) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {t('sortBy', 'Sort By')}
        </label>
        <select
          value={filters.sort || ''}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition cursor-pointer font-medium text-slate-700"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <hr className="border-slate-100" />

      {/* 2. التصنيفات (Categories) */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          {t('categories', 'Categories')}
        </h3>
        <div className="space-y-1.5">
          {CATEGORIES_DEF.map((cat) => {
            const isSelected = (filters.category || '') === cat.id;
            return (
              <button
                key={cat.id || 'all'}
                type="button"
                onClick={() => onFilterChange('category', cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition ${
                  isSelected
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{t(cat.key, cat.defaultLabel)}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 3. نطاق السعر (Price Range) */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          {t('priceRange', 'Price Range ($)')}
        </h3>
        <div className="grid grid-cols-2 gap-3" dir="ltr">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              {t('minPrice', 'Min Price')}
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition font-medium text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              {t('maxPrice', 'Max Price')}
            </label>
            <input
              type="number"
              min="0"
              placeholder="1000"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition font-medium text-slate-800"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 4. الماركات (Brands) */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          {t('brands', 'Brands')}
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pl-1">
          {BRANDS.map((brand) => {
            const isChecked = filters.brand === brand;
            return (
              <div
                key={brand}
                onClick={() => handleBrandToggle(brand)}
                className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer pointer-events-none"
                />
                <span className={isChecked ? 'font-semibold text-blue-600' : ''}>{brand}</span>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* زر إعادة ضبط الفلاتر */}
      <button
        type="button"
        onClick={onReset}
        className="w-full py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition"
      >
        {t('resetFilters', 'Reset Filters')}
      </button>

    </div>
  );
}