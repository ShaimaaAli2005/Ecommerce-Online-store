import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist_items', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id) === productId);
  };

  const toggleWishlist = (product) => {
    const pId = product?._id || product?.id;
    if (!pId) return;

    toast.dismiss();

    const exists = wishlistItems.some((item) => (item._id || item.id) === pId);
    const prodName = product.name || product.title;

    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== pId));
      toast.success(
        prodName ? `${prodName} removed from wishlist` : 'Removed from wishlist',
        { id: 'wishlist-toast' }
      );
    } else {
      setWishlistItems((prev) => [...prev, product]);
      toast.success(
        prodName ? `${prodName} added to wishlist!` : 'Added to wishlist!',
        { id: 'wishlist-toast' }
      );
    }
  };

  const removeFromWishlist = (productId) => {
    toast.dismiss();
    setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
    toast.success('Removed from wishlist', { id: 'wishlist-toast' });
  };

  const clearWishlist = () => {
    toast.dismiss();
    setWishlistItems([]);
    localStorage.removeItem('wishlist_items');
    toast.success('Wishlist cleared', { id: 'wishlist-toast' });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};