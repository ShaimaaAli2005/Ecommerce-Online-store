import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RecentlyViewed({ items = [], onAddToCart }) {
  const { t } = useTranslation('shop');

  if (!items || items.length === 0) return null;

  return (
    <section className="pt-10 border-t border-slate-200/80 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t('recentlyViewed', 'Recently Viewed')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            {t('recentlyViewedSub', 'Products you checked out during this visit')}
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
        {items.map((prod) => {
          const pId = prod._id || prod.id;
          const img = prod.images?.[0]?.url || prod.image || 'https://placehold.co/150x150?text=Product';
          const finalPrice = prod.discountPrice || prod.price;

          return (
            <div
              key={pId}
              className="w-48 sm:w-52 shrink-0 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-3 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <Link to={`/products/${pId}`} className="block">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-gray-900 mb-2">
                  <img src={img} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-gray-200 line-clamp-1">
                  {prod.name}
                </h4>
                <p className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-1">
                  {finalPrice} {t('currency', 'EGP')}
                </p>
              </Link>

              <button
                type="button"
                onClick={() => onAddToCart?.(prod, 1)}
                className="mt-3 w-full py-1.5 bg-slate-100 hover:bg-[#17233C] hover:text-white dark:bg-gray-700 dark:hover:bg-[#E89A5B] text-slate-700 dark:text-gray-200 rounded-xl text-[11px] font-bold transition cursor-pointer"
              >
                {t('addToCart', 'Add to Cart')}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}