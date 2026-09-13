import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getCartApi,
  addToCartApi,
  updateCartQuantityApi,
  removeFromCartApi,
  clearCartApi,
} from '../api/cart.api';

export const CartContext = createContext();

const getImg = (prod) => {
  if (!prod) return '';
  if (Array.isArray(prod.images) && prod.images.length > 0) {
    return prod.images[0]?.url || prod.images[0];
  }
  return prod.image || prod.imageUrl || '';
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const recalculateCart = useCallback((currentItems) => {
    const total = currentItems.reduce(
      (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const count = currentItems.reduce(
      (acc, item) => acc + (Number(item.quantity) || 1),
      0
    );
    setCartTotal(total);
    setCartCount(count);
    localStorage.setItem('cart_items', JSON.stringify(currentItems));
  }, []);

  useEffect(() => {
    recalculateCart(items);
  }, [items, recalculateCart]);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const data = await getCartApi();
      const cartItems = data.items || data.cart?.items || data.products || (Array.isArray(data) ? data : []);
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        setItems(cartItems);
      }
    } catch {
      console.warn('Backend cart endpoint unavailable, maintaining local cart.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    const productId = typeof product === 'object' ? (product._id || product.id) : product;
    const productName = typeof product === 'object' ? (product.name || product.title || 'Product') : 'Product';
    const productPrice = typeof product === 'object' 
      ? (product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price) 
      : 0;
    const productImage = getImg(product);

    if (!productId) {
      toast.error('Product ID missing', { id: 'cart-toast' });
      return;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item._id || item.id) === productId
      );
      if (existingIndex > -1) {
        return prevItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      }
      const newItem = {
        ...(typeof product === 'object' ? product : {}),
        _id: productId,
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity,
      };
      return [...prevItems, newItem];
    });

    toast.success(`${productName} added to cart!`, { id: 'cart-toast' });

    // إرسال الكائن بالصيغة القياسية المطلوبة في Swagger
    try {
      await addToCartApi({
        productId: String(productId),
        quantity: Number(quantity),
      });
    } catch {
      // الاعتماد على التحديث المحلي الفوري
    }
  };

  const removeFromCart = async (productId) => {
    setItems((prevItems) => prevItems.filter((item) => (item._id || item.id) !== productId));
    toast.success('Item removed from cart', { id: 'cart-toast' });

    try {
      await removeFromCartApi(productId);
    } catch {
      // الاعتماد على التحديث المحلي
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      )
    );

    try {
      await updateCartQuantityApi({
        productId: String(productId),
        quantity: Number(quantity),
      });
    } catch {
      // الاعتماد على التحديث المحلي
    }
  };

  const clearCart = async () => {
    setItems([]);
    setCartTotal(0);
    setCartCount(0);
    localStorage.removeItem('cart_items');
    toast.success('Cart cleared', { id: 'cart-toast' });

    try {
      await clearCartApi();
    } catch {
      // الاعتماد على التحديث المحلي
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};