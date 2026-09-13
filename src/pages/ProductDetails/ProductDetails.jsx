import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation('shop');
  const isRtl = i18n.language === 'ar';

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // المراجعات والتقييمات
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // جلب بيانات المنتج
  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getProductById(id);
      const data = res?.product || res?.data?.product || res?.data || res;
      setProduct(data);
    } catch {
      toast.error(t('productNotFound', 'Product not found or failed to load'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  // جلب مراجعات المنتج
  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await productService.getProductReviews(id);
      const items = res?.reviews || res?.data?.reviews || (Array.isArray(res) ? res : []);
      setReviews(items);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProductData();
      fetchReviews();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, fetchProductData, fetchReviews]);

  // إضافة مراجعة
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('loginToReview', 'Please login first to leave a review'));
      return;
    }
    if (!newComment.trim()) {
      toast.error(t('commentRequired', 'Please write your comment'));
      return;
    }

    try {
      setSubmittingReview(true);
      await productService.addProductReview(id, {
        rating: Number(newRating),
        comment: newComment.trim(),
      });
      toast.success(t('reviewAddedSuccess', 'Review added successfully!'));
      setNewComment('');
      setNewRating(5);
      fetchReviews();
      fetchProductData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (err.response?.status === 400 && msg?.toLowerCase().includes('already')) {
        toast.error(t('alreadyReviewed', 'You have already reviewed this product'));
      } else {
        toast.error(msg || t('reviewFailed', 'Failed to add review'));
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  // استخراج روابط الصور
  const images = (product?.images && product.images.length > 0)
    ? product.images.map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean)
    : [product?.image || product?.imageUrl || 'https://placehold.co/800x800?text=No+Image'];

  const prodId = product?._id || product?.id;
  const productName = product?.title || product?.name || t('productDefault', 'Product');
  const isWish = isInWishlist(prodId);
  const stockCount = product?.stock ?? 10;
  const isOutOfStock = stockCount <= 0;

  // استخراج وترجمة اسم القسم
  const rawCategory = typeof product?.category === 'object' ? product?.category?.name : product?.category;
  const sanitizedCat = rawCategory
    ? String(rawCategory).toLowerCase().trim().replace(/[\s-_]+/g, '')
    : '';
  const displayCategory = rawCategory
    ? t(`cat_${sanitizedCat}`, {
        defaultValue: t(`cat_${String(rawCategory).toLowerCase().trim()}`, {
          defaultValue: rawCategory,
        }),
      })
    : '';

  // احتساب الأسعار
  const regularPrice = Number(product?.price) || 0;
  const discountPrice = Number(product?.discountPrice) || 0;
  const hasDiscount = discountPrice > 0 && discountPrice < regularPrice;
  const finalPrice = hasDiscount ? discountPrice : regularPrice;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('linkCopied', 'Product link copied to clipboard!'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] py-16 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#E89A5B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">
            {t('loadingProduct', 'Loading product details...')}
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <i className="fa-solid fa-triangle-exclamation text-4xl text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('productNotFound', 'Product not found')}
          </h2>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] text-white rounded-xl text-xs font-semibold transition"
          >
            {t('backToShop', 'Back to Store')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] text-slate-900 dark:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-['Inter'] transition-colors duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto space-y-10">

        {/* مسار التنقل (Breadcrumb) */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link to="/" className="hover:text-slate-700 dark:hover:text-gray-200">
            {t('home', 'Home')}
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-slate-700 dark:hover:text-gray-200">
            {t('shop', 'Shop')}
          </Link>
          <span>/</span>
          {displayCategory && (
            <>
              <Link
                to={`/shop?category=${rawCategory}`}
                className="hover:text-[#E89A5B] dark:hover:text-[#E89A5B] transition-colors"
              >
                {displayCategory}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-800 dark:text-gray-200 font-semibold truncate max-w-[200px]">
            {productName}
          </span>
        </nav>

        {/* القسم العلوي: المعرض والتفاصيل */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* 1. معرض الصور (Image Gallery) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 shadow-xs flex items-center justify-center group">
              <img
                src={images[activeImageIdx]}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {hasDiscount && (
                <span className="absolute top-4 start-4 px-3 py-1 bg-[#E89A5B] text-white text-xs font-bold rounded-full shadow-xs">
                  {Math.round(((regularPrice - discountPrice) / regularPrice) * 100)}% {t('discountOff', 'OFF')}
                </span>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 flex items-center justify-center hover:bg-[#17233C] hover:text-white dark:hover:bg-[#E89A5B] transition shadow-xs cursor-pointer"
                title={t('share', 'Share Product')}
              >
                <i className="fa-solid fa-arrow-up-from-bracket text-xs" />
              </button>
            </div>

            {/* مصغرات الصور (Thumbnails) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-18 h-18 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeImageIdx === idx
                        ? 'border-[#E89A5B] shadow-xs'
                        : 'border-transparent bg-white dark:bg-gray-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. بطاقة معلومات المنتج والإجراءات */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {product.brand && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E89A5B]">
                    {product.brand}
                  </span>
                )}
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                    isOutOfStock
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}
                >
                  {isOutOfStock ? t('outOfStock', 'Out of Stock') : t('inStock', 'In Stock')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-slate-900 dark:text-white leading-tight">
                {productName}
              </h1>

              {/* التقييم */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-[#E89A5B] text-xs">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={
                        i < Math.round(product.averageRating || 5)
                          ? 'fa-solid fa-star'
                          : 'fa-regular fa-star'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                  {Number(product.averageRating || 5).toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({product.numReviews || reviews.length} {t('reviews', 'reviews')})
                </span>
              </div>
            </div>

            {/* السعر */}
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {finalPrice} <span className="text-sm font-semibold">{t('currency', 'EGP')}</span>
              </span>
              {hasDiscount && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {regularPrice} {t('currency', 'EGP')}
                </span>
              )}
            </div>

            {/* الوصف القصير */}
            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* شريط الإجراءات والكمية */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                {/* محدد الكمية */}
                <div className="flex items-center rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 disabled:opacity-40 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs sm:text-sm font-mono text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= stockCount || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 disabled:opacity-40 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* زر الإضافة للسلة */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 py-3.5 px-6 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white text-xs sm:text-sm font-bold rounded-2xl transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <i className="fa-solid fa-cart-shopping text-sm" />
                  <span>{isOutOfStock ? t('soldOut', 'Sold Out') : t('addToCart', 'Add to Cart')}</span>
                </button>

                {/* زر المفضلة */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition cursor-pointer shrink-0 ${
                    isWish
                      ? 'border-rose-300 bg-rose-50 text-rose-500 dark:bg-rose-950/40'
                      : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:text-rose-500'
                  }`}
                  title={isWish ? t('removeFromWishlist', 'Remove from wishlist') : t('addToWishlist', 'Add to wishlist')}
                >
                  <i className={isWish ? 'fa-solid fa-heart text-base text-rose-500' : 'fa-regular fa-heart text-base'} />
                </button>
              </div>
            </div>

            {/* المزايا والضمان */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/80 dark:border-gray-700 text-[11px] text-slate-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-shield-check text-[#E89A5B] text-sm" />
                <span>{t('authenticGuarantee', '100% Authentic Products')}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-truck-fast text-[#E89A5B] text-sm" />
                <span>{t('fastShipping', 'Fast Doorstep Delivery')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* القسم السفلي: الوصف التفصيلي والتقييمات */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-200/80 dark:border-gray-700 p-6 sm:p-10 shadow-xs space-y-10">

          {/* الوصف الشامل */}
          {product.description && (
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
                {t('fullDescription', 'Product Overview & Specifications')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* قسم المراجعات والتقييمات */}
          <div className="border-t border-slate-100 dark:border-gray-700 pt-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
                  {t('customerReviews', 'Customer Reviews')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  {t('reviewsSub', 'Read genuine customer reviews or share your own experience')}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-gray-700">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {Number(product.averageRating || 5).toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
            </div>

            {/* نموذج إضافة تقييم جديد */}
            <form
              onSubmit={handleAddReview}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-700 space-y-4"
            >
              <h4 className="text-xs font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider">
                {t('leaveReview', 'Write a Review')}
              </h4>

              {/* اختيار النجوم */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-gray-400">{t('yourRating', 'Rating:')}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="text-base text-[#E89A5B] transition-transform hover:scale-110 cursor-pointer"
                    >
                      <i className={star <= newRating ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('writeReviewPlaceholder', 'Write your honest review about this product...')}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#E89A5B] transition dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2.5 bg-[#17233C] hover:bg-[#E89A5B] dark:bg-[#E89A5B] dark:hover:bg-[#d4894d] text-white text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                {submittingReview && (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>{submittingReview ? t('postingReview', 'Submitting...') : t('submitReview', 'Submit Review')}</span>
              </button>
            </form>

            {/* قائمة المراجعات */}
            {reviewsLoading ? (
              <div className="py-6 text-center text-xs text-slate-400">
                {t('loadingReviews', 'Loading reviews...')}
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <i className="fa-regular fa-comments text-2xl text-slate-300 dark:text-gray-600" />
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {t('noReviewsYet', 'No reviews yet. Be the first to review this product!')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-gray-700 space-y-4">
                {reviews.map((rev, idx) => (
                  <div key={rev._id || idx} className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">
                          {rev.username || rev.user?.username || t('customerDefault', 'Customer')}
                        </span>
                        <div className="flex text-[#E89A5B] text-[10px]">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={i < rev.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}