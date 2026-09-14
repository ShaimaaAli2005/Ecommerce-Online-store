import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import QuickViewModal from '../../components/shop/QuickViewModal';

export default function Wishlist() {
  const { t, i18n } = useTranslation('wishlist');
  const isRtl = i18n.language === 'ar';

  const { wishlistItems, removeFromWishlist, clearWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleAddToCart = async (product) => {
    const pId = product._id || product.id;
    if (addToCart) {
      await addToCart(product, 1);
    }
    setAddedIds((prev) => [...prev, pId]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== pId));
    }, 1800);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item, 1);
    });
    clearWishlist();
    toast.success(t('movedAllSuccess', 'All items moved to your cart!'));
  };

  const handleRemoveWithUndo = (product) => {
    const pId = product._id || product.id;
    const prodName = product.name || product.title || t('productDefault', 'Product');
    removeFromWishlist(pId);

    toast(
      (toastItem) => (
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span>{t('itemRemovedToast', { name: prodName, defaultValue: `${prodName} removed` })}</span>
          <button
            type="button"
            onClick={() => {
              toggleWishlist(product);
              toast.dismiss(toastItem.id);
            }}
            className="px-2 py-1 bg-[#E89A5B] text-white rounded-md text-[11px] font-bold hover:opacity-90 transition cursor-pointer"
          >
            {t('undo', 'Undo')}
          </button>
        </div>
      ),
      { duration: 4000 }
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('shareSuccess', 'Wishlist link copied to clipboard!'));
    }
  };

  const extractImage = (prod) => {
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      return typeof prod.images[0] === 'string' ? prod.images[0] : prod.images[0]?.url;
    }
    return prod.image || prod.imageUrl || 'https://placehold.co/400x400?text=No+Image';
  };

  const sortedItems = useMemo(() => {
    const items = [...wishlistItems];
    if (sortBy === 'price-low') {
      return items.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    }
    if (sortBy === 'price-high') {
      return items.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    }
    return items;
  }, [wishlistItems, sortBy]);

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] text-slate-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8 font-['Inter'] transition-colors duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* الترويسة وأدوات التحكم */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-[#17233C] dark:text-white">
              {t('title', 'My Wishlist')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
              {t('itemCount', { count: wishlistItems.length, defaultValue: `${wishlistItems.length} saved items` })}
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-700 dark:text-gray-200 outline-none cursor-pointer"
              >
                <option value="default">{t('sortDefault', 'Sort: Default')}</option>
                <option value="price-low">{t('priceLow', 'Price: Low to High')}</option>
                <option value="price-high">{t('priceHigh', 'Price: High to Low')}</option>
              </select>

              <button
                type="button"
                onClick={handleShare}
                className="px-3.5 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-gray-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-share-nodes text-xs"></i>
                <span>{t('share', 'Share')}</span>
              </button>

              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="px-4 py-2 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-cart-shopping text-xs"></i>
                <span>{t('moveAllToCart', 'Move All to Cart')}</span>
              </button>

              <button
                type="button"
                onClick={clearWishlist}
                className="px-3 py-2 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                {t('clearWishlist', 'Clear All')}
              </button>
            </div>
          )}
        </div>

        {/* عرض العناصر */}
        {sortedItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-200/80 dark:border-gray-700 p-12 text-center max-w-md mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto text-2xl">
              <i className="fa-regular fa-heart"></i>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
              {t('emptyTitle', 'Your wishlist is empty')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
              {t('emptySub', 'Explore our shop catalog and save your favorite electronics and gadgets here.')}
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white text-xs font-semibold rounded-xl transition shadow-xs"
            >
              {t('exploreShop', 'Explore Shop')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedItems.map((prod) => {
              const pId = prod._id || prod.id;
              const prodName = prod.name || prod.title || t('productDefault', 'Product');
              const imgUrl = extractImage(prod);
              const price = Number(prod.price) || 0;
              const discountPrice = Number(prod.discountPrice) || 0;
              const hasDiscount = discountPrice > 0 && discountPrice < price;
              const finalPrice = hasDiscount ? discountPrice : price;
              const savedAmount = hasDiscount ? price - discountPrice : 0;
              const isAdded = addedIds.includes(pId);
              const inStock = prod.stock === undefined || prod.stock > 0;

              const rawCategory = typeof prod.category === 'object' ? prod.category?.name : prod.category;
              const sanitizedCategory = rawCategory
                ? String(rawCategory).toLowerCase().trim().replace(/[\s-_]+/g, '')
                : '';
              const displayCategory = rawCategory
                ? t(`cat_${sanitizedCategory}`, {
                    defaultValue: t(`cat_${String(rawCategory).toLowerCase().trim()}`, {
                      defaultValue: rawCategory,
                    }),
                  })
                : '';

              return (
                <div
                  key={pId}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-200 group relative"
                >
                  {/* زر الإزالة */}
                  <button
                    type="button"
                    onClick={() => handleRemoveWithUndo(prod)}
                    className="absolute top-3 end-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-700/90 text-slate-400 hover:text-rose-500 shadow-xs flex items-center justify-center transition cursor-pointer"
                    title={t('remove', 'Remove')}
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>

                  <div>
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-gray-900 mb-3 relative">
                      <Link to={`/products/${pId}`} className="block w-full h-full">
                        <img
                          src={imgUrl}
                          alt={prodName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {hasDiscount && (
                        <span className="absolute top-2 start-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E89A5B] text-white shadow-xs">
                          {t('saveAmount', { amount: savedAmount, defaultValue: `Save ${savedAmount}` })} {t('currency', 'EGP')}
                        </span>
                      )}

                      <span
                        className={`absolute bottom-2 start-2 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-xs ${
                          inStock
                            ? 'bg-white/95 dark:bg-gray-900/95 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-100/95 dark:bg-rose-950/95 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {inStock ? t('inStock', 'In Stock') : t('outOfStock', 'Out of Stock')}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(prod)}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-200 px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-[10px] font-bold rounded-lg shadow-sm hover:bg-[#E89A5B] hover:text-white cursor-pointer"
                      >
                        {t('quickView', 'Quick View')}
                      </button>
                    </div>

                    {displayCategory && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E89A5B] block mb-1">
                        {displayCategory}
                      </span>
                    )}

                    <Link
                      to={`/products/${pId}`}
                      className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-[#E89A5B] dark:hover:text-[#E89A5B] transition-colors line-clamp-2"
                    >
                      {prodName}
                    </Link>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-700/80">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                        {finalPrice} {t('currency', 'EGP')}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 dark:text-gray-500 line-through">
                          {price} {t('currency', 'EGP')}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!inStock || isAdded}
                      onClick={() => handleAddToCart(prod)}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs ${
                        !inStock
                          ? 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <i className="fa-solid fa-check text-xs"></i>
                          <span>{t('addedToCart', 'Added ✓')}</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-cart-shopping text-xs"></i>
                          <span>{t('addToCart', 'Add to Cart')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isWishlisted={true}
      />
    </div>
  );
}