import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// بيانات تجريبية لمحاكاة المنتجات داخل قائمة الرغبات
const initialWishlistItems = [
  {
    id: 1,
    name: 'Minimalist Ceramic Vase',
    nameAr: 'فازة خزفية بتصميم بسيط',
    category: 'Home Decor',
    categoryAr: 'ديكور منزلي',
    price: 48.00,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Textured Linen Throw Pillow',
    nameAr: 'وسادة كتان منسوجة',
    category: 'Living Room',
    categoryAr: 'غرفة المعيشة',
    price: 32.50,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Nordic Oak Table Lamp',
    nameAr: 'مصباح طاولة من خشب البلوط',
    category: 'Lighting',
    categoryAr: 'إضاءة',
    price: 85.00,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
  },
];

const Wishlist = () => {
  const { t, i18n } = useTranslation(['wishlist', 'auth']);
  const currentLang = i18n.language || 'en';
  const isRtl = currentLang === 'ar';

  const [items, setItems] = useState(initialWishlistItems);
  const [addedIds, setAddedIds] = useState([]);

  // حذف منتج من القائمة
  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // مسح كامل القائمة
  const handleClearAll = () => {
    setItems([]);
  };

  // محاكاة إضافة منتج إلى السلة
  const handleAddToCart = (id) => {
    setAddedIds((prev) => [...prev, id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((itemId) => itemId !== id));
    }, 2000);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F5F0] py-8 sm:py-12 font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس الصفحة والمؤشرات */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E5E7EB] mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17233C] font-['Poppins']">
              {t('wishlist:pageTitle')}
            </h1>
            <p className="text-sm text-[#7B8190] mt-1">
              {t('wishlist:itemsCount', { count: items.length })}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="self-start sm:self-auto text-xs font-semibold text-[#7B8190] hover:text-[#C95C5C] transition-colors cursor-pointer py-1.5 px-3 border border-[#E5E7EB] rounded-lg bg-white shadow-xs"
            >
              {t('wishlist:clearAll')}
            </button>
          )}
        </div>

        {/* حالة القائمة الفارغة */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 sm:p-16 text-center shadow-xs max-w-xl mx-auto my-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F7F5F0] rounded-full flex items-center justify-center text-2xl text-[#7B8190]">
              ♡
            </div>
            <h2 className="text-xl font-bold text-[#17233C] mb-2 font-['Poppins']">
              {t('wishlist:emptyTitle')}
            </h2>
            <p className="text-sm text-[#7B8190] mb-6 leading-relaxed">
              {t('wishlist:emptySubtitle')}
            </p>
            <Link
              to="/"
              className="inline-block bg-[#17233C] hover:bg-[#E89A5B] text-white px-6 py-2.5 rounded-[10px] text-sm font-medium transition-colors shadow-sm"
            >
              {t('wishlist:startShopping')}
            </Link>
          </div>
        ) : (
          /* شبكة عرض المنتجات */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => {
              const isAdded = addedIds.includes(product.id);
              const displayName = isRtl ? product.nameAr : product.name;
              const displayCategory = isRtl ? product.categoryAr : product.category;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col group relative"
                >
                  {/* زر الحذف السريع */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    title={t('wishlist:removeTooltip')}
                    className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-[#FEE2E2] text-[#7B8190] hover:text-[#C95C5C] flex items-center justify-center transition-colors shadow-xs cursor-pointer border border-[#E5E7EB]`}
                  >
                    ✕
                  </button>

                  {/* صورة المنتج */}
                  <div className="h-56 w-full bg-[#E5E7EB] overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* وسم حالة التوفر */}
                    <span
                      className={`absolute bottom-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        product.inStock
                          ? 'bg-white/95 text-[#15803D]'
                          : 'bg-[#FEE2E2]/95 text-[#B91C1C]'
                      }`}
                    >
                      {product.inStock ? t('wishlist:inStock') : t('wishlist:outOfStock')}
                    </span>
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7B8190]">
                        {displayCategory}
                      </span>
                      <h3 className="text-base font-bold text-[#17233C] mt-1 line-clamp-1">
                        {displayName}
                      </h3>
                      <p className="text-base font-semibold text-[#17233C] mt-2 font-['Poppins']">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* زر الإضافة للسلة */}
                    <div className="pt-4 mt-4 border-t border-[#F3F4F6]">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={!product.inStock || isAdded}
                        className={`w-full py-2.5 px-4 rounded-[10px] text-xs font-semibold transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                          !product.inStock
                            ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                            : isAdded
                            ? 'bg-[#15803D] text-white'
                            : 'bg-[#17233C] hover:bg-[#E89A5B] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span>✓</span>
                            <span>{t('wishlist:addedToCart')}</span>
                          </>
                        ) : (
                          t('wishlist:addToCart')
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;