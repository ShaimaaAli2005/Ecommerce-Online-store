import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'LUMA2026') {
      setDiscount(0.1);
      setCouponMessage('Coupon applied successfully!');
    } else {
      setDiscount(0);
      setCouponMessage('Invalid coupon code.');
    }
  };

  const shipping = cartTotal > 1000 || cartTotal === 0 ? 0 : 50;
  const subtotalAfterDiscount = cartTotal * (1 - discount);
  const tax = subtotalAfterDiscount * 0.14;
  const finalTotal = subtotalAfterDiscount + (cartTotal > 0 ? shipping : 0) + tax;

  return (
    <div className="min-h-screen w-full bg-[#F7F5F0] dark:bg-[#0F172A] py-10 font-['Inter'] text-[#1F2937] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-['Poppins'] mb-8 text-[#17233C] dark:text-white">Shopping Cart</h2>

      {!items || items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xl text-gray-500 dark:text-gray-400">Your cart is empty.</p>
          <Link to="/shop" className="inline-block mt-5 px-6 py-2.5 bg-[#17233C] text-white font-medium rounded-xl hover:bg-opacity-90 transition-all no-underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Products List & Coupon Section */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              // دعم الـ id أو _id بناءً على ما يرجع من الـ Backend
              const itemId = item.id || item._id;
              const itemImage = item.image || item.imageUrl;
              const itemName = item.name || item.title;

              return (
                <div 
                  key={itemId} 
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img 
                      src={itemImage} 
                      alt={itemName} 
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100 dark:border-gray-700 shrink-0" 
                    />
                    <div>
                      <h3 className="font-semibold text-base text-[#17233C] dark:text-white mb-1">{itemName}</h3>
                      <span className="text-[#E89A5B] font-bold">EGP {item.price}</span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 text-gray-700 dark:text-gray-200 cursor-pointer"
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span className="font-medium text-sm text-gray-800 dark:text-white">{item.quantity}</span>
                        <button 
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700">
                    <button 
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      onClick={() => removeFromCart(itemId)}
                      title="Remove"
                    >
                      <i className="fa-regular fa-trash-can text-sm"></i>
                    </button>
                    <div className="font-bold text-[#17233C] dark:text-white mt-auto">
                      EGP {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Separate Coupon Box */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-[#17233C] dark:text-white">
                <i className="fa-solid fa-tag text-[#E89A5B]"></i>
                <span>Coupon Code</span>
              </div>
              <form onSubmit={handleApplyCoupon} className="flex gap-3">
                <input 
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-white outline-none focus:border-[#E89A5B] transition-colors"
                />
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#E89A5B] hover:bg-[#d4874b] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {couponMessage && (
                <p className={`text-xs mt-2 ${discount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            <div>
              <Link to="/shop" className="text-sm font-medium text-[#E89A5B] no-underline hover:no-underline inline-flex items-center gap-2">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-bold font-['Poppins'] text-[#17233C] dark:text-white mb-6">Order Summary</h3>
              
              <div className="flex justify-between mb-3 text-gray-600 dark:text-gray-300 text-sm">
                <span>Subtotal</span>
                <span className="font-semibold text-[#17233C] dark:text-white">EGP {cartTotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between mb-3 text-green-500 text-sm">
                  <span>Discount (10%)</span>
                  <span>- EGP {(cartTotal * discount).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between mb-1 text-gray-600 dark:text-gray-300 text-sm">
                <span>Shipping</span>
                <span className="font-semibold text-[#17233C] dark:text-white">EGP {cartTotal === 0 ? 0 : shipping}</span>
              </div>
              <span className="text-xs text-gray-400 block mb-4">Free shipping on orders over EGP 1,000</span>

              <div className="flex justify-between mb-6 text-gray-600 dark:text-gray-300 text-sm">
                <span>Tax (14%)</span>
                <span className="font-semibold text-[#17233C] dark:text-white">EGP {tax.toFixed(2)}</span>
              </div>

              <hr className="border-gray-200 dark:border-gray-700 mb-6" />

              <div className="flex justify-between mb-6 text-lg font-bold text-[#17233C] dark:text-white">
                <span>Total</span>
                <span className="text-[#E89A5B]">EGP {finalTotal.toFixed(2)}</span>
              </div>

              {/* Proceed to Checkout Button */}
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-[#E89A5B] hover:bg-[#d4874b] text-white font-bold rounded-xl transition-all shadow-md mb-4 cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <div className="text-center">
                <Link to="/shop" className="text-xs text-[#E89A5B] no-underline hover:no-underline font-medium">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      )}
      </div>
    </div>
  );
};

export default Cart;