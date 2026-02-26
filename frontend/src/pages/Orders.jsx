import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { SignInButton, useAuth } from '@clerk/clerk-react';
// eslint-disable-next-line import/no-unresolved
import { api } from '@convex/api';
import { useInView } from '../hooks/useInView';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#B0B0B0', bg: 'rgba(176,176,176,0.08)', border: 'rgba(176,176,176,0.2)' },
  paid:       { label: 'Paid',       color: '#00BFFF', bg: 'rgba(0,191,255,0.08)',   border: 'rgba(0,191,255,0.25)' },
  processing: { label: 'Processing', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  shipped:    { label: 'Shipped',    color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
  delivered:  { label: 'Delivered',  color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
  cancelled:  { label: 'Cancelled',  color: '#E53935', bg: 'rgba(229,57,53,0.08)',  border: 'rgba(229,57,53,0.2)'  },
  refunded:   { label: 'Refunded',   color: '#E53935', bg: 'rgba(229,57,53,0.08)',  border: 'rgba(229,57,53,0.2)'  },
};

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatCurrency(amount, currency = 'USD') {
  const symbol = currency === 'GHS' ? '₵' : currency === 'NGN' ? '₦' : '$';
  return `${symbol}${amount.toFixed(2)}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className="font-montserrat text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 inline-block"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
      }}
    >
      {cfg.label}
    </span>
  );
}

function ProviderBadge({ provider }) {
  const label = provider === 'paystack' ? 'Paystack' : 'Stripe';
  const color = provider === 'paystack' ? '#00BFFF' : '#635BFF';
  return (
    <span
      className="font-montserrat text-[9px] uppercase tracking-widest px-2 py-0.5 inline-block"
      style={{
        color,
        background: color + '12',
        border: `1px solid ${color}30`,
        clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))',
      }}
    >
      {label}
    </span>
  );
}

function OrderCard({ order, index }) {
  const [expanded, setExpanded] = useState(false);
  const shortId = order._id.slice(-8).toUpperCase();
  const provider = order.paymentInfo?.provider ?? order.paystackReference ? 'paystack' : 'stripe';

  return (
    <div
      className="transition-all duration-300"
      style={{
        background: '#0A0A0A',
        border: '1px solid rgba(255,255,255,0.06)',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        opacity: 1,
        animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms both`,
      }}
    >
      {/* Order header */}
      <div
        className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Left: ID + date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <span className="font-bebas text-lg text-white tracking-wider">#{shortId}</span>
            <StatusBadge status={order.status} />
            <ProviderBadge provider={provider} />
          </div>
          <div className="font-montserrat text-[11px] text-urban/40 uppercase tracking-widest">
            {formatDate(order.createdAt)} &nbsp;&middot;&nbsp;
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            {order.trackingNumber && (
              <span className="ml-2 text-neon/60">
                &middot; Tracking: {order.trackingNumber}
              </span>
            )}
          </div>
        </div>

        {/* Right: total + expand */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="font-bebas text-2xl text-white">
            {formatCurrency(order.totalAmount, order.currency)}
          </span>
          <svg
            className="w-4 h-4 text-urban/40 transition-transform duration-300 flex-shrink-0"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-white/5 px-5 py-4">
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                {/* Thumbnail */}
                <div
                  className="flex-shrink-0 w-12 h-12 bg-surface-2 overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                  }}
                >
                  {item.imageURL ? (
                    <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-bebas text-lg text-crimson/30">{item.name[0]}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-montserrat font-semibold text-sm text-white truncate">{item.name}</p>
                  <p className="font-montserrat text-[10px] text-urban/40 uppercase tracking-widest">
                    Qty: {item.quantity}
                    {item.size && item.size !== 'One Size' && ` · Size: ${item.size}`}
                  </p>
                </div>

                {/* Price */}
                <span className="font-bebas text-lg text-crimson flex-shrink-0">
                  {formatCurrency(item.price * item.quantity, order.currency)}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping address if available */}
          {order.shippingAddress && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="font-montserrat text-[10px] text-urban/30 uppercase tracking-widest mb-1">
                Ships to
              </p>
              <p className="font-montserrat text-xs text-urban/50">
                {order.shippingAddress.name} &middot; {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''},&nbsp;
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>
          )}

          {/* Total row */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <span className="font-montserrat text-xs text-urban/40 uppercase tracking-widest">Order Total</span>
            <span className="font-bebas text-2xl text-white">
              {formatCurrency(order.totalAmount, order.currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: '#0A0A0A',
        border: '1px solid rgba(255,255,255,0.04)',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        height: 80,
      }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Orders() {
  const { isSignedIn, isLoaded } = useAuth();
  const [headerRef, headerInView] = useInView(0.1);

  const orders = useQuery(
    api.functions.orders.getMyOrders,
    isSignedIn ? {} : 'skip'
  );

  const isLoading = !isLoaded || (isSignedIn && orders === undefined);

  // ── Not signed in ──────────────────────────────────────────────────────────
  if (isLoaded && !isSignedIn) {
    return (
      <div className="bg-midnight min-h-screen pt-20 flex items-center justify-center px-4">
        <div
          className="w-full max-w-sm p-10 text-center"
          style={{
            background: '#0A0A0A',
            border: '1px solid rgba(255,255,255,0.06)',
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
        >
          <div className="font-bebas text-6xl text-crimson mb-2" style={{ textShadow: '0 0 20px rgba(229,57,53,0.4)' }}>
            X
          </div>
          <h2 className="font-bebas text-2xl text-white mb-2">Sign In to View Orders</h2>
          <p className="font-montserrat text-xs text-urban/40 mb-8 leading-relaxed">
            Your order history lives here. Sign in to see every drop you've copped.
          </p>
          <SignInButton mode="modal">
            <button className="btn-crimson w-full justify-center">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-midnight min-h-screen pt-20">
      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(229,57,53,1) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div
          ref={headerRef}
          className="mb-10"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <span className="tag-badge font-marker mb-4 inline-block">Your History</span>
          <h1 className="font-bebas leading-none" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
            ORDER <span className="text-crimson" style={{ textShadow: '0 0 20px rgba(229,57,53,0.4)' }}>HISTORY</span>
          </h1>
          <p className="font-montserrat text-sm text-urban/40 mt-2">
            Every drop you've locked in. Click an order to see the details.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <OrderCard key={order._id} order={order} index={i} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-28 text-center"
            style={{
              border: '1px solid rgba(255,255,255,0.04)',
              background: '#0A0A0A',
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
            }}
          >
            <div
              className="font-bebas text-[8rem] text-white/[0.04] leading-none select-none mb-4"
              style={{ lineHeight: 1 }}
            >
              0
            </div>
            <h3 className="font-bebas text-2xl text-white/40 tracking-wider mb-2">No Orders Yet</h3>
            <p className="font-montserrat text-xs text-urban/25 mb-8 max-w-xs leading-relaxed">
              You haven't copped anything yet. The drop is waiting — don't sleep on it.
            </p>
            <a href="/shop" className="btn-crimson">
              Shop the Drop
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
