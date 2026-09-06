import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialItems = [
  {
    id: 1,
    name: 'ساعة يد كلاسيكية أنيقة',
    category: 'إكسسوارات',
    price: 320,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
  },
  {
    id: 2,
    name: 'حقيبة يد جلدية فاخرة',
    category: 'حقائب',
    price: 450,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    inStock: true,
  },
  {
    id: 3,
    name: 'نظارة شمسية عصرية',
    category: 'نظارات',
    price: 180,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    inStock: false,
  },
];

const Wishlist = () => {
  const [items, setItems] = useState(initialItems);

  // إزالة منتج من المفضلة
  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // محاكاة الإضافة إلى السلة
  const handleAddToCart = (id) => {
    // سيتم ربطها بـ Cart Context لاحقاً
    alert('تمت إضافة المنتج إلى السلة بنجاح!');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F5F0] py-10 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <div className="max-w-6xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-5 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17233C]">
              قائمة الرغبات
            </h1>
            <p className="text-sm text-[#7B8190] mt-1">
              {items.length > 0 ? `لديك ${items.length} منتجات في قائمتك` : 'قائمتك فارغة حالياً'}
            </p>
          </div>
          <Link
            to="/login"
            className="text-sm text-[#60708F] hover:text-[#17233C] transition-colors"
          >
          </Link>
        </div>

        {/* شبكة المنتجات */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] overflow-hidden shadow-sm flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
              >
                {/* صورة المنتج وزر الحذف */}
                <div className="relative h-60 w-full bg-[#F3F4F6] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemove(product.id)}
                    title="حذف من المفضلة"
                    className="absolute top-3 left-3 w-8 h-8 bg-white/90 hover:bg-white text-[#C95C5C] rounded-full flex items-center justify-center shadow transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-3 right-3 bg-[#17233C]/80 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                {/* بيانات المنتج */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-[#1F2937] line-clamp-1">
                      {product.name}
                    </h2>
                    <p className="text-lg font-bold text-[#17233C] mt-2">
                      {product.price} <span className="text-xs font-normal text-[#7B8190]">ر.س</span>
                    </p>
                  </div>

                  {/* حالة التوفر وزر النقل للسلة */}
                  <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.inStock}
                      className={`w-full py-2.5 px-4 rounded-[10px] text-sm font-medium transition-all duration-200 cursor-pointer ${
                        product.inStock
                          ? 'bg-[#17233C] hover:bg-[#E89A5B] text-white shadow-sm'
                          : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                      }`}
                    >
                      {product.inStock ? 'نقل إلى السلة' : 'غير متوفر حالياً'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* حالة القائمة الفارغة */
          <div className="text-center py-20 bg-white rounded-[16px] border border-[#E5E7EB] p-8">
            <div className="w-16 h-16 bg-[#F7F5F0] text-[#7B8190] rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
              ♡
            </div>
            <h2 className="text-lg font-semibold text-[#1F2937]">قائمة الرغبات فارغة</h2>
            <p className="text-sm text-[#7B8190] mt-1 max-w-sm mx-auto">
              لم تقم بإضافة أي منتجات لقائمتك بعد، استكشف المنتجات وأضف ما يعجبك.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;