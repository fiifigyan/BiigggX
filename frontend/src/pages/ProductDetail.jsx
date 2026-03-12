import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../backend/convex/_generated/api';
import useCartStore from '../store/cartStore';
import { useSubscription } from '../hooks/useSubscription';


const CATEGORIES = {
    hoodie: { label: 'Hoodie', color: '#E53935' },
    cap: { label: 'Cap', color: '#00BFFF' },
    sticker: { label: 'Sticker', color: '#B0B0B0' },
    limited: { label: 'Limited Drop', color: '#E53935' },
  };

  function LockIcon() {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }

export default function ProductDetail() {
  const { productId } = useParams();
  const { addItem } = useCartStore();
  const { isSubscribed } = useSubscription();

  const product = useQuery(api.merch.getMerchById, { id: productId });

  if (product === undefined) {
    return <div>Loading...</div>;
  }

  if (product === null) {
    return <div>Product not found</div>;
  }

  const category = CATEGORIES[product.category] || CATEGORIES.hoodie;
  const hasInventory = product.inventory > 0;
  const isLimited = product.category === 'limited';
  const isExclusive = product.isExclusive === true;
  const isLocked = isExclusive && !isSubscribed;

  const handleAddToCart = () => {
    if (!hasInventory || isLocked) return;
    addItem({ ...product, selectedSize: 'One Size' });
  };

  return (
    <div className="bg-midnight text-white min-h-screen">
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                    <img src={product.imageURL} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    {isLocked && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 z-10 rounded-lg">
                            <div style={{ color: '#00BFFF', filter: 'drop-shadow(0 0 8px #00BFFF)' }}>
                                <LockIcon />
                            </div>
                            <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest" style={{ color: '#00BFFF' }}>
                                Pass Holders Only
                            </span>
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-bebas tracking-wider">{product.name}</h1>
                    <div className="mt-2">
                        <span
                            className="font-marker text-lg"
                            style={{
                                color: isExclusive ? '#00BFFF' : category.color,
                                textShadow: isLocked ? 'none' : `0 0 10px ${isExclusive ? '#00BFFF60' : category.color + '60'}`,
                            }}
                        >
                            ${product.price}
                        </span>
                        {isExclusive && (
                             <span
                             className="font-montserrat text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 inline-block ml-4"
                             style={{
                               clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                               background: 'rgba(0,191,255,0.15)',
                               border: '1px solid rgba(0,191,255,0.5)',
                               color: '#00BFFF',
                             }}
                           >
                             {isSubscribed ? 'Exclusive' : 'Members Only'}
                           </span>
                        )}
                         {isLimited && !isExclusive && (
                            <span
                                className="font-montserrat text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 bg-crimson text-white ml-4"
                                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                            >
                                Limited
                            </span>
                        )}
                    </div>
                    <p className="mt-4 text-urban/70 font-montserrat">{product.description || 'No description available.'}</p>
                    <div className="mt-6">
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
                        {isLocked ? (
                             <a
                             href="/membership"
                             className="w-full font-montserrat font-bold text-xs uppercase tracking-widest py-2.5 flex items-center justify-center gap-2 transition-all duration-300"
                             style={{
                               background: 'rgba(0,191,255,0.1)',
                               border: '1px solid rgba(0,191,255,0.35)',
                               color: '#00BFFF',
                               clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                             }}
                           >
                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                               <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                               <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                             </svg>
                             Get the Pass to Unlock
                           </a>
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
                            }}
                        >
                            {hasInventory ? 'Add to Cart' : 'Sold Out'}
                        </button>
                        )}
                       
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
