import { Link } from "react-router-dom";

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
}) => {
  const {
    name,
    title,
    image,
    imageUrl,
    category,
    price,
    discount,
    rating,
  } = product;

  const productName = name || title || "Product";
  const productImage = image || imageUrl;

  const finalPrice = discount
    ? price - (price * discount) / 100
    : price;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#F7F5F0]">
        <Link to={`/products/${product._id}`}>
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#E89A5B] px-3 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => onAddToWishlist?.(product)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#17233C] shadow-sm transition-colors hover:bg-[#E89A5B] hover:text-white"
          aria-label="Add to wishlist"
        >
          <i className="fa-regular fa-heart"></i>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {category && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#7B8190]">
            {category}
          </p>
        )}

        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 min-h-[48px] font-['Poppins'] text-base font-semibold text-[#17233C]"
        >
          {productName}
        </Link>

        {/* Rating */}
        {rating !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <i className="fa-solid fa-star text-[#E89A5B]"></i>
            <span className="text-[#7B8190]">{rating}</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-[#17233C]">
            {finalPrice} EGP
          </span>

          {discount > 0 && (
            <span className="text-sm text-[#7B8190] line-through">
              {price} EGP
            </span>
          )}
        </div>

        {/* Add To Cart */}
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17233C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E89A5B]"
        >
          <i className="fa-solid fa-cart-shopping"></i>
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;