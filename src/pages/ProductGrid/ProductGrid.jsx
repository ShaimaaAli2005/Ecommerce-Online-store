import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts } from "../../services/productService";

const ProductGrid = () => {
  const { t } = useTranslation("products");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        setProducts(data.products || data);
      } catch (err) {
        setError(t("grid.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#7B8190]">
          {t("grid.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#C95C5C]">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section className="bg-[#F7F5F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-['Poppins'] text-3xl font-bold text-[#17233C]">
            {t("grid.title")}
          </h1>

          <p className="mt-2 text-sm text-[#7B8190]">
            {t("grid.subtitle")}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#7B8190]">
              {t("grid.empty")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;