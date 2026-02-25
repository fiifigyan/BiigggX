import React, { useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import useCartStore from '../store/cartStore';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function Cart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCartStore();
  const drawerRef = useRef(null);

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // Close on escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        alert('Stripe is not configured. Add your VITE_STRIPE_PUBLISHABLE_KEY to .env');
        return;
      }
      // In production, call your Convex/server function to create a checkout session
      // const response = await fetch('/api/create-checkout-session', { ... });
      // const { sessionId } = await response.json();
      // await stripe.redirectToCheckout({ sessionId });
      alert('Checkout flow: Connect your Convex backend to complete Stripe integration.');
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] z-50 flex flex-col cart-drawer ${isOpen ? 'open' : ''}`}
        style={{ background: '#0A0A0A', borderLeft: '1px solid rgba(229,57,53,0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-2xl text-white tracking-wider">Your Drop</h2>
            {totalItems > 0 && (
              <span className="font-montserrat text-xs bg-crimson text-white px-2 py-0.5 font-bold">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center text-urban hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              {/* Empty state */}
              <div className="relative">
                <div
                  className="font-bebas text-8xl text-white/5 select-none"
                  style={{ lineHeight: 1 }}
                >
                  X
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-urban/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-bebas text-xl text-urban/60 tracking-wider">Cart's Empty</p>
                <p className="font-montserrat text-xs text-urban/30 mt-1">Tag the drop and add some gear.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item._id}-${item.selectedSize}`}
                className="flex gap-4 p-4 bg-surface-2 relative group"
                style={{
                  border: '1px solid rgba(255,255,255,0.05)',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
              >
                {/* Image */}
                <div className="w-16 h-16 bg-surface-3 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.imageURL ? (
                    <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="font-bebas text-2xl text-crimson">{item.name[0]}</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-montserrat font-semibold text-sm text-white truncate">{item.name}</h4>
                      {item.selectedSize && item.selectedSize !== 'One Size' && (
                        <span className="font-montserrat text-[10px] text-urban/50 uppercase tracking-widest">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <span className="font-bebas text-lg text-crimson shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)}
                      className="w-6 h-6 border border-white/15 text-urban hover:border-crimson hover:text-crimson flex items-center justify-center text-xs transition-colors"
                    >
                      −
                    </button>
                    <span className="font-montserrat text-sm text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)}
                      className="w-6 h-6 border border-white/15 text-urban hover:border-neon hover:text-neon flex items-center justify-center text-xs transition-colors"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item._id, item.selectedSize)}
                      className="ml-auto text-urban/30 hover:text-crimson transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-montserrat text-sm text-urban/60 uppercase tracking-widest">Subtotal</span>
              <span className="font-bebas text-3xl text-white">${totalPrice.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full btn-crimson justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Checkout
            </button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full font-montserrat text-xs text-urban/30 hover:text-urban/60 transition-colors uppercase tracking-widest"
            >
              Clear cart
            </button>

            {/* Payment icons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="font-montserrat text-[10px] text-urban/30 uppercase tracking-widest">Secured by</span>
              <div className="flex gap-2">
                {['Stripe', 'Visa', 'PayPal'].map((p) => (
                  <span key={p} className="font-montserrat text-[10px] text-urban/40 border border-white/10 px-1.5 py-0.5">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
