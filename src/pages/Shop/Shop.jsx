import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import productService from '../../services/productService';
import SearchBar from '../../components/shop/SearchBar';
import ProductFilters from '../../components/shop/ProductFilters';
import MobileFiltersDrawer from '../../components/shop/MobileFiltersDrawer';
import ProductCard from '../../components/ProductCard/ProductCard';
import QuickViewModal from '../../components/shop/QuickViewModal';
import ProductComparison from '../../components/shop/ProductComparison';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import FlashSaleBanner from '../../components/shop/FlashSaleBanner';
import RecentlyViewed from '../../components/shop/RecentlyViewed';
import ScrollToTop from '../../components/shop/ScrollToTop';

export default function Shop() {
  const { t, i18n } = useTranslation('shop');
  const isRtl = i18n.language === 'ar';
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('shop_view_mode') || 'grid';
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('shop_view_mode', mode);
  };

  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const recordRecentlyViewed = (product) => {
    if (!product) return;
    setRecentlyViewed((prev) => {
      const pId = product._id || product.id;
      const filtered = prev.filter((p) => (p._id || p.id) !== pId);
      const updated = [product, ...filtered].slice(0, 8);
      localStorage.setItem('recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const [filters, setFilters] = useState({
    search: initialSearch,
    category: initialCategory,
    brand: initialBrand,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    sort: initialSort,
    page: initialPage,
    limit: 12,
  });

  const syncParamsToUrl = useCallback((updatedFilters) => {
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined && key !== 'limit') {
        if (key === 'page' && val === 1) return;
        params.set(key, String(val));
      }
    });
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setFilters((prev) => {
          const updated = { ...prev, search: searchTerm, page: 1 };
          syncParamsToUrl(updated);
          return updated;
        });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, filters.search, syncParamsToUrl]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts(filters);

      let items = [];
      let total = 0;

      if (Array.isArray(res)) {
        items = res;
        total = res.length;
      } else if (res && typeof res === 'object') {
        items = res.products || res.data?.products || res.data || [];
        total = res.totalProducts || res.total || res.results || (Array.isArray(items) ? items.length : 0);
      }

      setProducts(Array.isArray(items) ? items : []);
      setTotalProducts(Number(total) || 0);
    } catch {
      toast.error(t('fetchError', 'Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value, page: 1 };
      syncParamsToUrl(updated);
      return updated;
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    const defaultFilters = {
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
      page: 1,
      limit: 12,
    };
    setFilters(defaultFilters);
    syncParamsToUrl(defaultFilters);
  };

  // إدارة قائمة المقارنة بدون استدعاء toast داخل setState
  const handleToggleCompare = (product) => {
    const pId = product?._id || product?.id;
    if (!pId) return;

    const exists = compareList.some((p) => (p._id || p.id) === pId);

    if (exists) {
      setCompareList((prev) => prev.filter((p) => (p._id || p.id) !== pId));
      toast.success(t('removedFromCompare', 'Removed from comparison'), { id: 'compare-toast' });
      return;
    }

    if (compareList.length >= 4) {
      toast.error(t('compareLimit', 'You can compare up to 4 products at a time'), { id: 'compare-toast' });
      return;
    }

    setCompareList((prev) => [...prev, product]);
    toast.success(t('addedToCompare', 'Added to comparison'), { id: 'compare-toast' });
  };

  // معالجة الإضافة للسلة مع فحص المخزون
  const handleAddToCartWithStockCheck = async (product) => {
    if (product.stock !== undefined && product.stock <= 0) {
      toast.error(t('outOfStock', 'Out of Stock'), { id: 'cart-toast' });
      return;
    }
    await addToCart(product, 1);
  };

  const activeChips = useMemo(() => {
    const chips = [];
    const curr = t('currency', 'EGP');
    if (filters.category) {
      const translatedCat = t(`cat_${filters.category}`, filters.category);
      chips.push({ key: 'category', label: `${t('categories', 'Category')}: ${translatedCat}` });
    }
    if (filters.brand) chips.push({ key: 'brand', label: `${t('brands', 'Brand')}: ${filters.brand}` });
    if (filters.search) chips.push({ key: 'search', label: `"${filters.search}"` });
    if (filters.minPrice) chips.push({ key: 'minPrice', label: `${t('minPrice', 'Min')}: ${filters.minPrice} ${curr}` });
    if (filters.maxPrice) chips.push({ key: 'maxPrice', label: `${t('maxPrice', 'Max')}: ${filters.maxPrice} ${curr}` });
    return chips;
  }, [filters, t]);

  const totalPages = Math.ceil(totalProducts / filters.limit) || 1;

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] text-slate-900 dark:text-white py-8 px-4 sm:px-6 lg:px-8 font-['Inter'] transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* البانر الترويجي */}
        <FlashSaleBanner />

        {/* شريط البحث وزر الفلاتر للموبايل */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <SearchBar
              value={searchTerm}
              onChange={(term) => setSearchTerm(term)}
              products={products}
              placeholder={t('searchPlaceholder', 'Search for products, brands, or categories...')}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-[#17233C] dark:text-white shadow-xs hover:bg-slate-50 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <i className="fa-solid fa-sliders text-slate-500 dark:text-gray-300"></i>
            <span>{t('filters', 'Filters')}</span>
          </button>
        </div>

        {/* كبسولات الفلاتر النشطة */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
              {t('activeFilters', 'Active Filters:')}
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 py-1 px-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-full text-xs font-semibold text-[#17233C] dark:text-gray-200 shadow-2xs"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={() => {
                    if (chip.key === 'search') setSearchTerm('');
                    handleFilterChange(chip.key, '');
                  }}
                  className="hover:text-rose-500 transition-colors mx-1 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer mx-1"
            >
              {t('resetAll', 'Reset all')}
            </button>
          </div>
        )}

        <div className="flex gap-8 items-start">
          {/* الشريط الجانبي */}
          <aside className="hidden lg:block w-72 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm sticky top-24">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* شبكة المنتجات */}
          <main className="flex-1 w-full space-y-4">
            
            <div className="bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 rounded-2xl px-4 py-3 flex items-center justify-between shadow-xs">
              <div className="text-xs text-slate-500 dark:text-gray-400 font-semibold flex items-center gap-2">
                <span>{t('totalResults', { count: totalProducts, defaultValue: `${totalProducts} Products Found` })}</span>
                {loading && <span className="text-[#E89A5B] animate-pulse">●</span>}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl bg-slate-100 dark:bg-gray-700/60 p-1">
                  <button
                    type="button"
                    onClick={() => handleViewModeChange('grid')}
                    className={`h-7 w-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-800 text-[#17233C] dark:text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-gray-200'
                    }`}
                    title="Grid View"
                  >
                    <i className="fa-solid fa-grip text-xs"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewModeChange('list')}
                    className={`h-7 w-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-800 text-[#17233C] dark:text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-gray-200'
                    }`}
                    title="List View"
                  >
                    <i className="fa-solid fa-bars text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-4 animate-pulse flex ${
                      viewMode === 'list' ? 'flex-row gap-4 h-48' : 'flex-col justify-between h-96'
                    }`}
                  >
                    <div
                      className={
                        viewMode === 'list'
                          ? 'w-48 h-full bg-slate-200 dark:bg-gray-700 rounded-xl'
                          : 'w-full aspect-square bg-slate-200 dark:bg-gray-700 rounded-xl'
                      }
                    />
                    <div className="flex-1 space-y-2 py-2">
                      <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded-xl mt-6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-12 text-center shadow-xs">
                <i className="fa-solid fa-box-open text-4xl text-slate-300 dark:text-gray-600 mb-3"></i>
                <p className="text-base font-semibold text-slate-700 dark:text-gray-200">
                  {t('noProducts', 'No products match your search or filter criteria')}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-5 py-2.5 bg-[#17233C] hover:bg-[#E89A5B] text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  {t('clearAll', 'Clear All Filters')}
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((prod) => {
                  const prodId = prod._id || prod.id;
                  return (
                    <ProductCard
                      key={prodId}
                      product={prod}
                      viewMode={viewMode}
                      isWishlisted={isInWishlist(prodId)}
                      isCompared={compareList.some((p) => (p._id || p.id) === prodId)}
                      onAddToCart={() => handleAddToCartWithStockCheck(prod)}
                      onAddToWishlist={() => toggleWishlist(prod)}
                      onToggleCompare={() => handleToggleCompare(prod)}
                      onQuickView={(p) => {
                        setQuickViewProduct(p);
                        recordRecentlyViewed(p);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* أدوات الترقيم */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-2" dir="ltr">
                <button
                  type="button"
                  disabled={filters.page <= 1}
                  onClick={() => {
                    const newPage = filters.page - 1;
                    setFilters((prev) => ({ ...prev, page: newPage }));
                    syncParamsToUrl({ ...filters, page: newPage });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-gray-700 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 text-[#17233C] dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  {t('previous', 'Previous')}
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, page: pageNum }));
                          syncParamsToUrl({ ...filters, page: pageNum });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                          filters.page === pageNum
                            ? 'bg-[#17233C] dark:bg-[#E89A5B] text-white shadow-xs'
                            : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={filters.page >= totalPages}
                  onClick={() => {
                    const newPage = filters.page + 1;
                    setFilters((prev) => ({ ...prev, page: newPage }));
                    syncParamsToUrl({ ...filters, page: newPage });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-gray-700 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 text-[#17233C] dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  {t('next', 'Next')}
                </button>
              </div>
            )}
          </main>
        </div>

        <RecentlyViewed items={recentlyViewed} onAddToCart={handleAddToCartWithStockCheck} />

      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCartWithStockCheck}
        onToggleWishlist={toggleWishlist}
        isWishlisted={isInWishlist(quickViewProduct?._id || quickViewProduct?.id)}
      />

      <ProductComparison
        compareList={compareList}
        isOpenModal={isCompareModalOpen}
        setIsOpenModal={setIsCompareModalOpen}
        onRemove={(id) => setCompareList((prev) => prev.filter((p) => (p._id || p.id) !== id))}
        onClear={() => setCompareList([])}
        onAddToCart={handleAddToCartWithStockCheck}
      />

      <MobileFiltersDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalProducts={totalProducts}
      />

      <ScrollToTop />
    </div>
  );
}