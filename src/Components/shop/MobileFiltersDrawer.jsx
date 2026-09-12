import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProductFilters from './ProductFilters';

export default function MobileFiltersDrawer({ isOpen, onClose, filters, onFilterChange, onReset, totalProducts }) {
  const { t, i18n } = useTranslation('shop');
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" role="dialog" aria-modal="true" dir={isRtl ? 'rtl' : 'ltr'}>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} max-w-full flex`}>
        <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col justify-between">
          
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {t('filterProducts', 'Filter Products')}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-5 py-6 overflow-y-auto flex-1">
            <ProductFilters
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={onReset}
            />
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow transition"
            >
              {t('viewResults', 'Show Results')} {totalProducts !== undefined ? `(${totalProducts})` : ''}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}