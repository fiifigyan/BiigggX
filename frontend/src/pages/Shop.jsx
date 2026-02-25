import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useInView } from '../hooks/useInView';
import { useMerch } from '../hooks/useConvex';
import { useSubscription } from '../hooks/useSubscription';

const CATEGORY_LABELS = {
  all:     'All Drops',
  hoodie:  'Hoodies',
  cap:     'Caps',
  sticker: 'Stickers',
  limited: 'Limited Drops',
};

const SORT_OPTIONS = [
  { id: 'featured',   label: 'Featured' },
  { id: 'price-asc',  label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'limited',    label: 'Limited First' },
  { id: 'available',  label: 'In Stock Only' },
];

// Skeleton card shown while Convex loads
function SkeletonCard() {
  return (
    <div
      className="bg-surface-2 animate-pulse"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
    >
      <div className="aspect-square bg-surface-3" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-surface-3 rounded w-3/4" />
        <div className="h-2 bg-surface-3 rounded w-1/2" />
        <div className="h-8 bg-surface-3 rounded mt-4" />
      </div>
    </div>
  );
}

export default function Shop() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [headerRef, headerInView] = useInView(0.1);
  const [gridRef, gridInView] = useInView(0.05);

  // Live Convex data — undefined while loading, array when ready
  const allProducts = useMerch();
  const isLoading = allProducts === undefined;

  const { isSubscribed } = useSubscription();

  // Compute category counts from live data
  const categories = ['all', 'hoodie', 'cap', 'sticker', 'limited'].map((id) => ({
    id,
    label: CATEGORY_LABELS[id],
    count: id === 'all'
      ? (allProducts?.length ?? 0)
      : (allProducts?.filter((p) => p.category === id).length ?? 0),
  }));

  // Filter & sort on the frontend (fast enough for merch catalog sizes)
  const filtered = (allProducts ?? [])
    .filter((p) => category === 'all' || p.category === category)
    .filter((p) => sort !== 'available' || p.inventory > 0)
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'limited')
        return (b.category === 'limited' ? 1 : 0) - (a.category === 'limited' ? 1 : 0);
      return 0;
    });

  return (
    <div className="bg-midnight min-h-screen pt-20">
      {/* Header */}
      <section
        ref={headerRef}
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(229,57,53,1) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div
          className="absolute right-0 bottom-0 font-bebas text-[20rem] text-white/[0.02] leading-none pointer-events-none select-none"
          style={{ lineHeight: 1 }}
        >
          SHOP
        </div>

        <div className="max-w-7xl mx-auto">
          <div
            style={{
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="tag-badge font-marker mb-6 inline-block">The Store</span>
            <h1
              className="font-bebas leading-none mb-4"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
            >
              SHOP THE{' '}
              <span className="text-crimson" style={{ textShadow: '0 0 30px rgba(229,57,53,0.4)' }}>
                DROP
              </span>
            </h1>
            <p className="font-montserrat text-sm text-urban/50 max-w-xl leading-relaxed">
              Every piece is a limited moment in time. When the inventory hits zero — it's gone. No restocks, no regrets.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-midnight/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category tabs — counts update live */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`font-montserrat text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-200 flex items-center gap-2 ${
                    category === cat.id
                      ? 'bg-crimson border-crimson text-white'
                      : 'border-white/10 text-urban/50 hover:border-white/25 hover:text-white'
                  }`}
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}
                >
                  {cat.label}
                  <span className={`text-[10px] ${category === cat.id ? 'text-white/70' : 'text-urban/30'}`}>
                    {isLoading ? '—' : cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="font-montserrat text-xs text-urban/30 uppercase tracking-widest whitespace-nowrap">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-surface-2 border border-white/10 text-urban/60 text-xs font-montserrat px-3 py-2 outline-none hover:border-white/25 transition-colors cursor-pointer"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          // Skeleton grid while Convex loads
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="font-bebas text-6xl text-white/10">EMPTY</div>
            <p className="font-montserrat text-sm text-urban/30">No drops in this category right now.</p>
          </div>
        ) : (
          <>
            <p
              className="font-montserrat text-xs text-urban/30 uppercase tracking-widest mb-8"
              style={{ opacity: gridInView ? 1 : 0, transition: 'opacity 0.6s ease' }}
            >
              {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} available
            </p>

            {/* Upsell banner — shown when exclusive items are in the current view and user isn't subscribed */}
            {!isSubscribed && filtered.some((p) => p.isExclusive) && (
              <div
                className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4"
                style={{
                  background: 'rgba(0,191,255,0.05)',
                  border: '1px solid rgba(0,191,255,0.2)',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                }}
              >
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <p className="font-montserrat text-xs text-urban/70">
                    <span style={{ color: '#00BFFF' }} className="font-bold">Members-only drops</span> are in this collection.
                    Get the BiigggX Pass to unlock them.
                  </p>
                </div>
                <Link
                  to="/membership"
                  className="font-montserrat text-xs font-bold uppercase tracking-widest px-4 py-2 flex-shrink-0 transition-all duration-200"
                  style={{
                    color: '#00BFFF',
                    background: 'rgba(0,191,255,0.1)',
                    border: '1px solid rgba(0,191,255,0.35)',
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,191,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,191,255,0.1)'}
                >
                  Get the Pass →
                </Link>
              </div>
            )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map((product, i) => (
                <div
                  key={product._id}
                  style={{
                    opacity: gridInView ? 1 : 0,
                    transform: gridInView ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i * 80, 600)}ms`,
                  }}
                >
                  <ProductCard product={product} isSubscribed={isSubscribed} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8 text-center bg-surface">
        <p className="font-marker text-xl text-urban/40 mb-2">Didn't find your drop?</p>
        <p className="font-montserrat text-xs text-urban/25 mb-6 uppercase tracking-widest">
          New drops every few weeks. Follow for alerts.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {['#BiigggX', '#XMarksTheMoment', '#NewDrop'].map((tag) => (
            <span key={tag} className="font-marker text-crimson text-lg hover:text-neon transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
