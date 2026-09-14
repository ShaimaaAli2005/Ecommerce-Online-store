import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart, onToggleWishlist, isWishlisted }) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  // تجميع الصور
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((img) => (typeof img === 'string' ? img : img?.url))
    : [product.image || product.imageUrl || 'https://placehold.co/600x600?text=No+Image'];

  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* الخلفية المظلمة */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* نافذة المودال */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-2xl z-10 transition-all">
        
        {/* زر الإغلاق */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          
          {/* معرض الصور المصغر */}
          <div className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-700">
              <img
                src={images[selectedImgIndex]}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x600?text=No+Image';
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition cursor-pointer ${
                      selectedImgIndex === idx
                        ? 'border-[#E89A5B]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* تفاصيل المنتج وخيارات الشراء */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {product.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-[#E89A5B]">
                  {product.category}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {product.name}
              </h2>

              {/* التقييم */}
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                <div className="flex text-[#E89A5B]">
                  <i className="fa-solid fa-star"></i>
                </div>
                <span className="font-semibold text-slate-800 dark:text-gray-200">
                  {product.rating || '4.8'}
                </span>
                <span>({product.reviewsCount || 24} reviews)</span>
              </div>

              {/* السعر */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {finalPrice} EGP
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {price} EGP
                  </span>
                )}
              </div>

              {/* الوصف */}
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-300 leading-relaxed line-clamp-4">
                {product.description || product.shortDescription || 'Experience the premium quality and exceptional design crafted for modern lifestyles.'}
              </p>
            </div>

            {/* أزرار التحكم والكمية */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleWishlist?.(product)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-gray-700 transition cursor-pointer ${
                    isWishlisted ? 'bg-rose-50 text-rose-500' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className={isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-sm font-semibold transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#17233C] hover:bg-[#E89A5B] text-white active:scale-95'
                  }`}
                >
                  <i className={isAdded ? 'fa-solid fa-check' : 'fa-solid fa-cart-shopping'}></i>
                  <span>{isAdded ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </button>

                <Link
                  to={`/products/${product._id || product.id}`}
                  className="flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition"
                >
                  Full Details
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}