import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import productService from "../../services/productService";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

const Home = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [email, setEmail] = useState("");

  /* Same categories as the shop filters — labels come from translation keys */
  const CATEGORIES = [
    { id: "phones", label: t("categories.phones"), icon: "fa-solid fa-mobile-screen" },
    { id: "electronics", label: t("categories.electronics"), icon: "fa-solid fa-microchip" },
    { id: "audio", label: t("categories.audio"), icon: "fa-solid fa-headphones" },
    { id: "accessories", label: t("categories.accessories"), icon: "fa-solid fa-plug" },
    { id: "wearables", label: t("categories.wearables"), icon: "fa-solid fa-watch" },
  ];

  const HOW_IT_WORKS = [
    {
      icon: "fa-solid fa-bag-shopping",
      title: t("howItWorks.step1Title"),
      desc: t("howItWorks.step1Desc"),
    },
    {
      icon: "fa-solid fa-cart-plus",
      title: t("howItWorks.step2Title"),
      desc: t("howItWorks.step2Desc"),
    },
    {
      icon: "fa-solid fa-truck-fast",
      title: t("howItWorks.step3Title"),
      desc: t("howItWorks.step3Desc"),
    },
  ];

  /* ─── Fetch featured products (first 4) ─── */
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingProducts(true);
        const res = await productService.getProducts({ limit: 6, page: 1 });
        let items = [];
        if (Array.isArray(res)) {
          items = res;
        } else if (res && typeof res === "object") {
          items = res.products || res.data?.products || res.data || [];
        }
        setFeaturedProducts(Array.isArray(items) ? items.slice(0, 6) : []);
      } catch {
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(t("toast.addedToCart"));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success(t("toast.subscribed"));
      setEmail("");
    }
  };

  return (
    <div className="bg-[#F7F5F0] dark:bg-[#0F172A] min-h-screen font-['Inter'] transition-colors duration-300">

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-[#17233C] dark:bg-[#0a1526]">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#E89A5B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#E89A5B]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[#E89A5B] text-sm font-semibold tracking-widest uppercase mb-4">
              <i className="fa-solid fa-bolt" />
              {t("hero.badge")}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 font-['Poppins']">
              {t("hero.titleLine1")}{" "}
              <span className="text-[#E89A5B]">{t("hero.titleLine2")}</span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/shop")}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E89A5B] hover:bg-[#d4854a] text-white font-semibold rounded-xl shadow-lg shadow-[#E89A5B]/30 transition-all duration-300 hover:scale-105 active:scale-95 text-base"
              >
                <i className="fa-solid fa-bag-shopping" />
                {t("hero.shopNow")}
              </button>
              <button
                onClick={() => {
                  document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 hover:border-[#E89A5B] text-white hover:text-[#E89A5B] font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 text-base"
              >
                <i className="fa-solid fa-grid-2" />
                {t("hero.viewCategories")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Shop by Category ─── */}
      <section id="categories-section" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#17233C] dark:text-white font-['Poppins'] mb-2">
            {t("categories.title")}
          </h2>
          <p className="text-[#7B8190] dark:text-gray-400 text-base">
            {t("categories.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/shop?category=${cat.id}`)}
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm hover:shadow-md border border-[#E5E7EB] dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:border-[#E89A5B] group"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#17233C]/5 dark:bg-white/5 group-hover:bg-[#E89A5B]/10 transition-colors duration-300">
                <i className={`${cat.icon} text-2xl text-[#17233C] dark:text-gray-300 group-hover:text-[#E89A5B] transition-colors`} />
              </div>
              <span className="text-[#17233C] dark:text-gray-200 text-sm font-semibold capitalize">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#17233C] dark:text-white font-['Poppins']">
              {t("featured.title")}
            </h2>
            <p className="text-[#7B8190] dark:text-gray-400 text-base mt-1">
              {t("featured.subtitle")}
            </p>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-1 text-[#17233C] dark:text-[#E89A5B] font-semibold text-sm hover:text-[#E89A5B] dark:hover:text-white transition-colors"
          >
            {t("featured.viewAll")}
            <i className="fa-solid fa-arrow-right text-xs rtl:rotate-180" />
          </button>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-white dark:bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center text-[#7B8190] py-8">{t("featured.noProducts")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const pId = product._id || product.id;
              return (
                <ProductCard
                  key={pId}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={() => toggleWishlist(product)}
                  isWishlisted={isInWishlist(pId)}
                  viewMode="grid"
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-white dark:bg-[#1E293B] border-y border-[#E5E7EB] dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-[#17233C] dark:text-white font-['Poppins'] text-center mb-12">
            {t("howItWorks.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-4 group relative">
                <div className="w-20 h-20 rounded-2xl bg-[#17233C]/5 dark:bg-[#E89A5B]/10 flex items-center justify-center group-hover:bg-[#E89A5B]/10 dark:group-hover:bg-[#E89A5B]/20 transition-colors duration-300">
                  <i className={`${step.icon} text-3xl text-[#17233C] dark:text-[#E89A5B]`} />
                </div>
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+50px)] w-[calc(100%-100px)] border-t-2 border-dashed border-[#E5E7EB] dark:border-gray-600" />
                )}
                <div>
                  <h3 className="text-[#17233C] dark:text-white font-bold text-lg mb-2 font-['Poppins']">
                    {step.title}
                  </h3>
                  <p className="text-[#7B8190] dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stay Updated / Newsletter ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative overflow-hidden bg-[#17233C] rounded-3xl p-10 md:p-16 text-center shadow-2xl">
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-[#E89A5B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#E89A5B]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#E89A5B]/20 flex items-center justify-center mx-auto mb-5">
              <i className="fa-regular fa-envelope text-[#E89A5B] text-2xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 font-['Poppins']">
              {t("newsletter.title")}
            </h2>
            <p className="text-gray-300 text-base mb-8 max-w-md mx-auto">
              {t("newsletter.subtitle")}
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter.placeholder")}
                required
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#E89A5B] transition-colors text-sm"
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#E89A5B] hover:bg-[#d4854a] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 text-sm whitespace-nowrap"
              >
                {t("newsletter.subscribe")}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;