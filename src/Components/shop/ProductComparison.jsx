import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ProductComparison({
  compareList = [],
  onRemove,
  onClear,
  isOpenModal,
  setIsOpenModal,
  onAddToCart,
}) {
  const { t } = useTranslation('shop');

  if (compareList.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#17233C] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700 animate-slide-up">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E89A5B] text-xs font-bold">
            {compareList.length}
          </span>
          <span className="text-xs sm:text-sm font-semibold">{t('compareProducts', 'Compare Products')}</span>
        </div>

        <div className="flex items-center gap-2">
          {compareList.map((prod) => (
            <div key={prod._id || prod.id} className="relative group">
              <img
                src={prod.images?.[0]?.url || prod.image || 'https://placehold.co/100x100?text=P'}
                alt=""
                className="w-9 h-9 rounded-lg object-cover border border-slate-600"
              />
              <button
                type="button"
                onClick={() => onRemove(prod._id || prod.id)}
                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] flex items-center justify-center hover:scale-110 transition cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
          <button
            type="button"
            disabled={compareList.length < 2}
            onClick={() => setIsOpenModal(true)}
            className="px-3 py-1.5 bg-[#E89A5B] hover:bg-[#d68a4d] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {t('compareNow', 'Compare Now')}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            {t('clear', 'Clear')}
          </button>
        </div>
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsOpenModal(false)}
          />

          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('productComparison', 'Product Comparison')}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-500 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {compareList.map((item) => (
                <div
                  key={item._id || item.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <img
                      src={item.images?.[0]?.url || item.image || 'https://placehold.co/300x300?text=Product'}
                      alt=""
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <span className="text-[10px] font-bold text-[#E89A5B] uppercase tracking-wider block">
                      {item.category || 'General'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {item.price} {t('currency', 'EGP')}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400">
                      {t('brands', 'Brand')}: <span className="font-semibold text-slate-700 dark:text-gray-300">{item.brand || 'Generic'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart?.(item, 1)}
                    className="mt-4 w-full py-2 bg-[#17233C] hover:bg-[#E89A5B] text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    {t('addToCart', 'Add to Cart')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}