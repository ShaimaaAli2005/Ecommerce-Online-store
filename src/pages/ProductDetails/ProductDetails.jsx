import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getProductById,
  getProductReviews,
} from "../../services/productService";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { t } = useTranslation("products");
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
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

        const productData = await getProductById(id);
        setProduct(productData);

        try {
          const reviewsData = await getProductReviews(id);

          setReviews(
            reviewsData.reviews ||
              reviewsData.product?.reviews ||
              reviewsData ||
              []
          );
        } catch (reviewError) {
          setReviews(productData.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(t("details.failed"));
      } finally {
        setLoading(false);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

    fetchProduct();
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] py-16 text-center">
        <p className="text-[#7B8190]">
          {t("details.loading")}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] py-16 text-center">
        <p className="text-red-500">
          {error || t("details.notFound")}
        </p>
      </div>
    );
  }

  const images = Array.isArray(product.images)
    ? product.images
    : [];

  const finalPrice =
    product.discountPrice > 0
      ? product.discountPrice
      : product.price;

  const mainImage =
    images[selectedImage]?.url ||
    images[0]?.url ||
    "/placeholder-product.png";

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] text-slate-900 dark:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-['Inter'] transition-colors duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="grid grid-cols-1 gap-10 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2">

          {/* Images */}
          <div>
            <div className="mb-4 overflow-hidden rounded-2xl bg-[#F7F5F0]">
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

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            {product.category && (
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[#7B8190]">
                {typeof product.category === "object"
                  ? product.category.name
                  : product.category}
              </p>
            )}

            <h1 className="mb-4 font-['Poppins'] text-3xl font-bold text-[#17233C]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-5 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <i className="fa-solid fa-star text-[#E89A5B]"></i>

                <span className="font-semibold text-[#17233C]">
                  {product.averageRating || 0}
                </span>
              </div>

              <span className="text-sm text-[#7B8190]">
                ({product.numReviews || reviews.length}{" "}
                {t("card.reviews")})
              </span>
            </div>

            {product.shortDescription && (
              <p className="mb-5 text-[#7B8190]">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="mb-5 flex items-center gap-3">
              <span className="text-2xl font-bold text-[#17233C]">
                {finalPrice} {t("card.egp")}
              </span>

              {product.discountPrice > 0 && (
                <span className="text-lg text-[#7B8190] line-through">
                  {product.price} {t("card.egp")}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mb-6 leading-7 text-[#555B66]">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <p className="mb-6 font-medium text-[#17233C]">
              {t("details.stock")}:{" "}
              <span
                className={
                  product.stock > 0
                    ? "text-[#15803D]"
                    : "text-red-500"
                }
              >
                {product.stock}
              </span>
            </p>

            <button
              type="button"
              onClick={() => addToCart(product)}
              disabled={!product.stock || product.stock <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17233C] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#E89A5B] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <i className="fa-solid fa-cart-shopping"></i>

              {product.stock > 0
                ? t("details.addToCart")
                : t("details.outOfStock")}
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-['Poppins'] text-2xl font-bold text-[#17233C]">
            {t("details.reviewsTitle")}
          </h2>

          {reviews.length === 0 ? (
            <p className="text-[#7B8190]">
              {t("details.noReviews")}
            </p>
          ) : (
            <div className="space-y-5">
              {reviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="border-b border-[#E5E7EB] pb-5 last:border-b-0"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-[#17233C]">
                      {review.user?.name ||
                        review.user?.username ||
                        t("details.customer")}
                    </h3>

                    <div className="flex items-center gap-1">
                      <i className="fa-solid fa-star text-[#E89A5B]"></i>

                      <span className="text-sm text-[#7B8190]">
                        {review.rating || 0}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-[#7B8190]">
                    {review.comment ||
                      review.review ||
                      t("details.noComment")}
                  </p>
                </div>
              ))}
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