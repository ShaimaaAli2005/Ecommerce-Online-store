import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] py-16 text-center">
        <p className="text-[#7B8190]">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] py-16 text-center">
        <p className="text-red-500">
          {error || "Product not found"}
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

  const reviews = Array.isArray(product.reviews)
    ? product.reviews
    : [];

  const mainImage =
    images[selectedImage]?.url ||
    images[0]?.url ||
    "/placeholder-product.png";

  return (
    <div className="min-h-screen bg-[#F7F5F0] py-10">
      <div className="container mx-auto px-4">

        {/* Product Details */}
        <div className="grid grid-cols-1 gap-10 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2">

          {/* ================= Images ================= */}
          <div>
            {/* Main Image */}
            <div className="mb-4 overflow-hidden rounded-2xl bg-[#F7F5F0]">
              <img
                src={mainImage}
                alt={product.name}
                className="h-[450px] w-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.public_id || image._id || index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                      selectedImage === index
                        ? "border-[#E89A5B]"
                        : "border-[#E5E7EB]"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= Product Information ================= */}
          <div className="flex flex-col justify-center">

            {/* Category */}
            {product.category && (
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[#7B8190]">
                {typeof product.category === "object"
                  ? product.category.name
                  : product.category}
              </p>
            )}

            {/* Product Name */}
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
                ({product.numReviews || reviews.length} reviews)
              </span>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="mb-5 text-[#7B8190]">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="mb-5 flex items-center gap-3">
              <span className="text-2xl font-bold text-[#17233C]">
                {finalPrice} EGP
              </span>

              {product.discountPrice > 0 && (
                <span className="text-lg text-[#7B8190] line-through">
                  {product.price} EGP
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mb-6 leading-7 text-[#555B66]">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <p className="mb-6 font-medium text-[#17233C]">
              Stock:{" "}
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

            {/* Add To Cart */}
            <button
              type="button"
              disabled={!product.stock || product.stock <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17233C] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#E89A5B] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <i className="fa-solid fa-cart-shopping"></i>

              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* ================= Reviews ================= */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-['Poppins'] text-2xl font-bold text-[#17233C]">
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-[#7B8190]">
              No reviews yet.
            </p>
          ) : (
            <div className="space-y-5">
              {reviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="border-b border-[#E5E7EB] pb-5 last:border-b-0"
                >
                  {/* Reviewer + Rating */}
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-[#17233C]">
                      {review.user?.name ||
                        review.user?.username ||
                        "Customer"}
                    </h3>

                    <div className="flex items-center gap-1">
                      <i className="fa-solid fa-star text-[#E89A5B]"></i>

                      <span className="text-sm text-[#7B8190]">
                        {review.rating || 0}
                      </span>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-sm leading-6 text-[#7B8190]">
                    {review.comment ||
                      review.review ||
                      "No comment"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;