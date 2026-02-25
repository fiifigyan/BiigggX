import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const CATEGORIES = {
  hoodie: { label: 'Hoodie', color: '#E53935' },
  cap: { label: 'Cap', color: '#00BFFF' },
  sticker: { label: 'Sticker', color: '#B0B0B0' },
  limited: { label: 'Limited Drop', color: '#E53935' },
};

// Spray sound effect (Web Audio API)
function playSpraySound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // Silently fail if Web Audio not available
  }
}

// Spray splatter animation on card
function SplatterEffect({ active, color }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {Array(12).fill(null).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const dist = 30 + Math.random() * 60;
        const x = 50 + Math.cos(angle) * dist;
        const y = 50 + Math.sin(angle) * dist;
        const size = Math.random() * 8 + 4;
        return (
          <div
            key={i}
            className="absolute rounded-full animate-splatter"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: color,
              opacity: 0.7,
              animationDelay: `${i * 20}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

// Lock icon for exclusive items
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function ProductCard({ product, isSubscribed = false }) {
  const [hovered, setHovered] = useState(false);
  const [addedSplatter, setAddedSplatter] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizes, setShowSizes] = useState(false);
  const { addItem } = useCartStore();
  const cardRef = useRef(null);

  const category = CATEGORIES[product.category] || CATEGORIES.hoodie;
  const hasInventory = product.inventory > 0;
  const isLimited = product.category === 'limited';
  const isExclusive = product.isExclusive === true;
  const isLocked = isExclusive && !isSubscribed;

  // Tilt effect on hover
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 10;
    const tiltY = (x - 0.5) * -10;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  const handleAddToCart = () => {
    if (!hasInventory || isLocked) return;
    const needsSize = ['hoodie'].includes(product.category);
    if (needsSize && !selectedSize) {
      setShowSizes(true);
      return;
    }
    playSpraySound();
    setAddedSplatter(true);
    addItem({ ...product, selectedSize: selectedSize || 'One Size' });
    setTimeout(() => setAddedSplatter(false), 800);
  };

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div
      ref={cardRef}
      className="product-card group relative"
      style={{ transition: 'transform 0.15s ease, box-shadow 0.3s ease' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <SplatterEffect active={addedSplatter} color={category.color} />

      {/* Image container */}
      <div className="relative overflow-hidden aspect-square bg-surface-3">
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, #0A0A0A, #1A1A1A, ${isExclusive ? '#00BFFF' : category.color}15)`,
            filter: isLocked ? 'brightness(0.45)' : 'none',
          }}
        >
          {product.imageURL ? (
            <img
              src={product.imageURL}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-30">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="font-bebas text-2xl tracking-widest" style={{ color: isExclusive ? '#00BFFF' : category.color }}>
                {product.name}
              </span>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        {!isLocked && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 20% 30%, ${category.color}40 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, #00BFFF30 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          {isExclusive ? (
            <span
              className="font-montserrat text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 inline-block"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                background: 'rgba(0,191,255,0.15)',
                border: '1px solid rgba(0,191,255,0.5)',
                color: '#00BFFF',
              }}
            >
              {isSubscribed ? 'Exclusive' : 'Members Only'}
            </span>
          ) : (
            <span
              className="font-marker text-xs px-2 py-0.5 rotate-[-2deg] inline-block"
              style={{
                background: `${category.color}20`,
                border: `1px solid ${category.color}60`,
                color: category.color,
              }}
            >
              {category.label}
            </span>
          )}
        </div>

        {/* Limited badge */}
        {isLimited && !isExclusive && (
          <div className="absolute top-3 right-3">
            <span
              className="font-montserrat text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 bg-crimson text-white"
              style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
            >
              Limited
            </span>
          </div>
        )}

        {/* Lock overlay for exclusive items */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
            <div style={{ color: '#00BFFF', filter: 'drop-shadow(0 0 8px #00BFFF)' }}>
              <LockIcon />
            </div>
            <span
              className="font-montserrat text-[10px] font-bold uppercase tracking-widest"
              style={{ color: '#00BFFF' }}
            >
              Pass Holders Only
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!hasInventory && !isLocked && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="font-bebas text-2xl text-urban/60 tracking-widest rotate-[-15deg] border border-urban/20 px-4 py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-montserrat font-bold text-base leading-tight transition-colors duration-300"
            style={{ color: isLocked ? 'rgba(176,176,176,0.5)' : '#fff' }}
          >
            {product.name}
          </h3>
          <div className="text-right shrink-0 ml-2">
            <span
              className="font-bebas text-xl"
              style={{
                color: isExclusive ? '#00BFFF' : category.color,
                textShadow: isLocked ? 'none' : `0 0 10px ${isExclusive ? '#00BFFF60' : category.color + '60'}`,
                opacity: isLocked ? 0.4 : 1,
              }}
            >
              ${product.price}
            </span>
          </div>
        </div>

        {/* Inventory indicator */}
        {!isLocked && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-[2px] bg-surface-3 overflow-hidden">
              <div
                className="h-full transition-all duration-1000"
                style={{
                  width: `${Math.min((product.inventory / 50) * 100, 100)}%`,
                  background: product.inventory < 10 ? '#E53935' : product.inventory < 25 ? '#FF9800' : '#4CAF50',
                }}
              />
            </div>
            <span className="font-montserrat text-[10px] text-urban/50 shrink-0">
              {product.inventory > 0 ? `${product.inventory} left` : 'Sold Out'}
            </span>
          </div>
        )}

        {/* Size selector */}
        {showSizes && !isLocked && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setShowSizes(false); }}
                  className={`font-montserrat text-xs px-2 py-1 border transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-crimson border-crimson text-white'
                      : 'border-white/20 text-urban hover:border-crimson hover:text-crimson'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart / Members Only / Sold Out button */}
        {isLocked ? (
          <Link
            to="/membership"
            className="w-full font-montserrat font-bold text-xs uppercase tracking-widest py-2.5 flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: 'rgba(0,191,255,0.1)',
              border: '1px solid rgba(0,191,255,0.35)',
              color: '#00BFFF',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,191,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,191,255,0.1)'}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Get the Pass to Unlock
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!hasInventory}
            className={`w-full font-montserrat font-bold text-xs uppercase tracking-widest py-2.5 transition-all duration-300 relative overflow-hidden group/btn ${
              hasInventory
                ? 'text-white hover:text-black'
                : 'opacity-40 cursor-not-allowed text-urban border border-urban/20'
            }`}
            style={{
              background: hasInventory ? (isExclusive ? '#00BFFF' : category.color) : 'transparent',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              boxShadow: hasInventory && hovered ? `0 0 20px ${isExclusive ? '#00BFFF60' : category.color + '60'}` : 'none',
            }}
          >
            {hasInventory ? (
              <>
                <span className="relative z-10">
                  {addedSplatter ? '✓ Added!' : selectedSize ? `Add — Size ${selectedSize}` : 'Add to Cart'}
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
              </>
            ) : (
              'Sold Out'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
