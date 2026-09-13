import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import productService from '../../services/productService';
import SearchBar from '../../components/shop/SearchBar';
import ProductFilters from '../../components/shop/ProductFilters';
import MobileFiltersDrawer from '../../components/shop/MobileFiltersDrawer';

export default function Shop() {
  // 1. تحديد namespace الخاص بالمتجر
  const { t, i18n } = useTranslation('shop');
  
  // 2. فحص اتجاه اللغة بدقة
  const isRtl = i18n.language === 'ar';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    page: 1,
    limit: 12,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts(filters);
      if (res && res.success) {
        setProducts(res.products || []);
        setTotalProducts(res.totalProducts || 0);
      }
    } catch (err) {
      toast.error(t('fetchError', 'Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // العودة للصفحة الأولى عند تغيير أي فلتر
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
      page: 1,
      limit: 12,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* شريط البحث وزر فلاتر الموبايل */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <SearchBar
              value={filters.search}
              onChange={(term) => handleFilterChange('search', term)}
              placeholder={t('searchPlaceholder', 'Search for products, brands, or categories...')}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>{t('filters', 'Filters')}</span>
          </button>
        </div>

        {/* تخطيط الصفحة الرئيسي */}
        <div className="flex gap-8 items-start">
          
          {/* الشريط الجانبي للشاشات الكبيرة */}
          <aside className="hidden lg:block w-72 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm sticky top-24">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* شبكة المنتجات */}
          <main className="flex-1 w-full">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>{t('totalResults', { count: totalProducts, defaultValue: `Total Results: ${totalProducts} products` })}</span>
              {loading && <span>{t('updating', 'Updating...')}</span>}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-72 bg-slate-200/60 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                <p className="text-base font-semibold text-slate-700">
                  {t('noProducts', 'No products match your search or filter criteria')}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
                >
                  {t('clearAll', 'Clear All Filters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div
                    key={prod._id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden mb-4">
                      <img
                        src={prod.images?.[0]?.url || 'https://via.placeholder.com/300'}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">
                          {prod.brand || prod.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900 font-mono" dir="ltr">
                          ${prod.price}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{prod.shortDescription || prod.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* مودال الموبايل */}
      <MobileFiltersDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalProducts={totalProducts}
      />
    </div>
  );
}