import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const extractImages = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean);
  }
  if (product?.image) return [product.image];
  if (product?.imageUrl) return [product.imageUrl];
  return ["https://placehold.co/600x600?text=No+Image"];
};

const ProductCard = ({
  product = {},
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onToggleCompare,
  isCompared = false,
  isWishlisted = false,
  viewMode = "grid",
}) => {
  const { t, i18n } = useTranslation('shop');
  const isRtl = i18n.language === 'ar';

  const [isAdded, setIsAdded] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const images = extractImages(product);
  const productId = product._id || product.id || "";
  const productName = product.name || product.title || t('productDefault', 'Product');
  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;
  const discount = Number(product.discount) || 0;

  // استخراج وترجمة اسم القسم سواء كان نصاً أو كائناً من السيرفر
  const rawCategory = typeof product.category === 'object' ? product.category?.name : product.category;
  const displayCategory = rawCategory 
    ? t(`cat_${String(rawCategory).toLowerCase().trim()}`, { defaultValue: rawCategory }) 
    : '';

  let finalPrice = price;
  let hasDiscount = false;

  if (discountPrice > 0 && discountPrice < price) {
    finalPrice = discountPrice;
    hasDiscount = true;
  } else if (discount > 0) {
    finalPrice = price - (price * discount) / 100;
    hasDiscount = true;
  }

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1200);
    }
  };

  const handleNextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const isList = viewMode === "list";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex ${
        isList ? "flex-col sm:flex-row items-stretch gap-2" : "flex-col justify-between"
      }`}
    >
      {/* المعرض المصغر للصور */}
      <div
        className={`relative overflow-hidden bg-slate-50 dark:bg-gray-900 shrink-0 ${
          isList ? "w-full sm:w-64 aspect-video sm:aspect-square" : "w-full aspect-square"
        }`}
      >
        <Link to={`/products/${productId}`} className="block w-full h-full">
          <img
            src={images[activeImgIdx]}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x600?text=No+Image";
            }}
          />
        </Link>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImg}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/80 dark:bg-gray-800/80 text-slate-700 dark:text-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs hover:bg-white dark:hover:bg-gray-700 cursor-pointer z-10"
            >
              <i className={`fa-solid ${isRtl ? 'fa-chevron-right' : 'fa-chevron-left'} text-[10px]`}></i>
            </button>
            <button
              type="button"
              onClick={handleNextImg}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/80 dark:bg-gray-800/80 text-slate-700 dark:text-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs hover:bg-white dark:hover:bg-gray-700 cursor-pointer z-10"
            >
              <i className={`fa-solid ${isRtl ? 'fa-chevron-left' : 'fa-chevron-right'} text-[10px]`}></i>
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeImgIdx === idx ? "w-4 bg-[#E89A5B]" : "w-1.5 bg-white/60 dark:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {hasDiscount && (
          <span className="absolute start-3 top-3 rounded-full bg-[#E89A5B] px-3 py-1 text-xs font-bold text-white shadow-xs z-10">
            {discount > 0 ? `-${discount}%` : "SALE"}
          </span>
        )}

        <div className="absolute end-3 top-3 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToWishlist?.(product);
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-xs transition-all duration-200 cursor-pointer ${
              isWishlisted
                ? "bg-rose-50 text-rose-500 dark:bg-rose-950/50"
                : "bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
            }`}
            aria-label="Wishlist"
          >
            <i className={isWishlisted ? "fa-solid fa-heart text-rose-500" : "fa-regular fa-heart"}></i>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleCompare?.(product);
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-xs transition-all duration-200 cursor-pointer ${
              isCompared
                ? "bg-[#17233C] text-[#E89A5B] dark:bg-gray-700"
                : "bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700"
            }`}
            title={t('compareProducts', 'Compare')}
            aria-label={t('compareProducts', 'Compare')}
          >
            <i className="fa-solid fa-code-compare text-xs"></i>
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView?.(product);
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 px-4 py-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xs text-xs font-bold text-slate-800 dark:text-white rounded-xl shadow-md hover:bg-[#E89A5B] hover:text-white flex items-center gap-1.5 cursor-pointer z-10 whitespace-nowrap"
        >
          <i className="fa-regular fa-eye"></i>
          <span>{t('quickView', 'Quick View')}</span>
        </button>
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center justify-between">
            {displayCategory && (
              <p className="text-[11px] font-bold tracking-wider uppercase text-[#E89A5B]">
                {displayCategory}
              </p>
            )}

            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400">
              <i className="fa-solid fa-star text-[#E89A5B] text-[10px]"></i>
              <span className="font-semibold text-slate-700 dark:text-gray-200">
                {product.rating ? Number(product.rating).toFixed(1) : "4.8"}
              </span>
              <span className="text-[10px]">({product.reviewsCount || 14})</span>
            </div>
          </div>

          <Link
            to={`/products/${productId}`}
            className="mt-1 block font-['Poppins'] text-base font-semibold text-slate-900 dark:text-white hover:text-[#E89A5B] dark:hover:text-[#E89A5B] transition-colors leading-snug line-clamp-2"
          >
            {productName}
          </Link>

          {isList && (
            <p className="mt-2 text-xs text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {product.description || product.shortDescription || ""}
            </p>
          )}
        </div>

        <div className={`pt-2 ${isList ? "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" : ""}`}>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {finalPrice} <span className="text-xs font-semibold">{t('currency', 'EGP')}</span>
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 dark:text-gray-500 line-through">
                {price} {t('currency', 'EGP')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdded}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold transition-all duration-300 shadow-xs cursor-pointer ${
              isList ? "w-full sm:w-44" : "w-full mt-3"
            } ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white active:scale-95"
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
    </article>
  );
};

export default ProductCard;