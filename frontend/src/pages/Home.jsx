import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useInView } from '../hooks/useInView';
import { useFeaturedMerch } from '../hooks/useConvex';
import { useSubscription } from '../hooks/useSubscription';

function SectionTitle({ title, highlight, subtitle, inView, delay = 0 }) {
  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <h2 className="section-title">
        {title} {highlight && <span className="text-crimson">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="font-montserrat text-sm text-urban/60 mt-2 uppercase tracking-widest">{subtitle}</p>
      )}
    </div>
  );
}

function FeatureBlock({ icon, title, desc, color, inView, delay }) {
  return (
    <div
      className="group relative p-6 border border-white/5 transition-all duration-500 hover:border-crimson/30"
      style={{
        background: '#0A0A0A',
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div
        className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 inline-block"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      >
        {icon}
      </div>
      <h3 className="font-bebas text-xl text-white tracking-wider mb-2">{title}</h3>
      <p className="font-montserrat text-xs text-urban/50 leading-relaxed">{desc}</p>
      <div
        className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, transparent 50%, ${color}30 50%)` }}
      />
    </div>
  );
}

// Skeleton card for loading state
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

export default function Home() {
  const [featuredRef, featuredInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  // Live Convex data — undefined while loading
  const featuredProducts = useFeaturedMerch();
  const isLoading = featuredProducts === undefined;

  const { isSubscribed } = useSubscription();

  return (
    <div className="bg-midnight">
      <Hero />

      {/* Featured Drops */}
      <section ref={featuredRef} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #E53935, transparent)' }}
        />
        <div
          className="absolute -left-32 top-1/2 w-64 h-64 opacity-5 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E53935 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <SectionTitle
              title="Featured"
              highlight="Drops"
              subtitle="Limited pieces — tag them fast"
              inView={featuredInView}
            />
            <Link
              to="/shop"
              className="font-montserrat text-sm text-urban/60 hover:text-crimson transition-colors uppercase tracking-widest flex items-center gap-2 group"
              style={{ opacity: featuredInView ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array(4).fill(null).map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map((product, i) => (
                  <div
                    key={product._id}
                    style={{
                      opacity: featuredInView ? 1 : 0,
                      transform: featuredInView ? 'translateY(0)' : 'translateY(50px)',
                      transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120 + 200}ms`,
                    }}
                  >
                    <ProductCard product={product} isSubscribed={isSubscribed} />
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* Brand Features */}
      <section ref={featuresRef} className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #00BFFF40, transparent)' }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionTitle
              title="Why"
              highlight="Biiggg X"
              subtitle="More than merch — it's a movement"
              inView={featuresInView}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🎨', title: 'Art-First Design',  desc: 'Every piece is conceived as wearable street art. No templates, no compromises.',          color: '#E53935' },
              { icon: '⚡', title: 'Limited Drops',     desc: "Scarcity is the point. When it's gone, it's gone. Be first or be last.",                  color: '#00BFFF' },
              { icon: '🔒', title: 'Authentic Only',    desc: 'QR-verified authenticity on every limited piece. No fakes in our world.',                  color: '#E53935' },
              { icon: '🌍', title: 'Global Streets',    desc: 'Shipped worldwide. The X has no borders. Tag your city.',                                   color: '#00BFFF' },
            ].map((f, i) => (
              <FeatureBlock key={f.title} {...f} inView={featuresInView} delay={i * 100 + 200} />
            ))}
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section ref={ctaRef} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0A0000, #000000, #00001A)' }} />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(229,57,53,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="font-bebas leading-none select-none" style={{ fontSize: 'clamp(20rem, 60vw, 60rem)', color: 'rgba(229,57,53,0.03)' }}>X</span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div
            style={{
              opacity: ctaInView ? 1 : 0,
              transform: ctaInView ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="tag-badge font-marker text-base mb-6 inline-block">Don't sleep on this</span>
            <h2
              className="font-bebas leading-tight mb-6"
              style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', color: '#fff', textShadow: '0 0 60px rgba(229,57,53,0.2)' }}
            >
              X MARKS<br />
              <span className="text-crimson" style={{ textShadow: '0 0 20px #E53935, 0 0 60px rgba(229,57,53,0.3)' }}>
                THE MOMENT
              </span>
            </h2>
            <p className="font-montserrat text-base text-urban/60 mb-10 max-w-lg mx-auto leading-relaxed">
              Limited drops. Graffiti-born. Street-approved. Every piece is a statement — wear it or regret it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="btn-crimson">Shop the Drop</Link>
              <Link to="/contact" className="btn-neon">Collab With Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
