import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getCartApi,
  addToCartApi,
  updateCartQuantityApi,
  removeFromCartApi,
  clearCartApi,
} from '../api/cart.api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // دالة مساعدة لحساب الإجماليات محلياً
  const recalculateCart = (currentItems) => {
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
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCartApi();
      const cartItems = data.items || data.cart?.items || [];
      const total = data.total !== undefined ? data.total : (data.subtotal || data.cart?.total || 0);
      const count = data.itemCount !== undefined 
        ? data.itemCount 
        : cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

      setItems(cartItems);
      setCartTotal(total);
      setCartCount(count);
    } catch (error) {
      console.warn('Backend fetch cart failed, using local cart state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    const productId = typeof product === 'object' ? (product.id || product._id) : product;
    const productName = typeof product === 'object' ? (product.name || product.title || 'Product') : 'Product';
    const productPrice = typeof product === 'object' ? (product.price || 0) : 0;
    const productImage = typeof product === 'object' ? (product.image || product.imageUrl || '') : '';

    if (!productId) {
      toast.error('Product ID missing');
      return;
    }

    try {
      // المحاولة الأولى: عبر انبوينت الباك إند
      await addToCartApi(productId, quantity);
      await fetchCart();
      toast.success(`${productName} added to cart!`);
    } catch (error) {
      console.warn('Backend API addToCart failed. Falling back to local cart state:', error);
      
      // المحاولة الثانية الاحتياطية (Local State Fallback)
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => (item.id || item._id) === productId
        );
        let updatedItems;
        if (existingIndex > -1) {
          updatedItems = prevItems.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: (item.quantity || 1) + quantity }
              : item
          );
        } else {
          const newItem = typeof product === 'object'
            ? { ...product, id: productId, quantity }
            : { id: productId, name: productName, price: productPrice, image: productImage, quantity };
          updatedItems = [...prevItems, newItem];
        }
        recalculateCart(updatedItems);
        return updatedItems;
      });

      toast.success(`${productName} added to cart!`);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeFromCartApi(productId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.warn('Backend API removeFromCart failed, removing locally:', error);
      setItems((prevItems) => {
        const updatedItems = prevItems.filter(
          (item) => (item.id || item._id) !== productId
        );
        recalculateCart(updatedItems);
        return updatedItems;
      });
      toast.success('Item removed from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      await updateCartQuantityApi(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.warn('Backend API updateQuantity failed, updating locally:', error);
      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          (item.id || item._id) === productId ? { ...item, quantity } : item
        );
        recalculateCart(updatedItems);
        return updatedItems;
      });
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();
    } catch (error) {
      console.warn('Backend API clearCart failed, clearing locally:', error);
    } finally {
      setItems([]);
      setCartTotal(0);
      setCartCount(0);
      toast.success('Cart cleared');
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