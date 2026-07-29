import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { SectionTitle } from '../components/SectionTitle';
import { FeatureBlock } from '../components/FeatureBlock';
import { PageSection } from '../components/PageSection';
import SkeletonCard from '../components/SkeletonCard';
import { useInView } from '../hooks/useInView';
import { useFeaturedMerch } from '../hooks/useConvex';
import { HOME_FEATURES } from '../constants/homeContent';
import { PRODUCTS_PER_PAGE } from '../constants/pagination';
import { ANIMATION_CONFIG } from '../constants/animations';

export default function Home() {
  const [featuredRef, featuredInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  // Live Convex data — undefined while loading
  const featuredProducts = useFeaturedMerch();
  const isLoading = featuredProducts === undefined;

  return (
    <div className="bg-midnight">
      <Hero />

      {/* Featured Drops */}
      <PageSection ref={featuredRef} withDecoration decorationGradient="crimson">
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
            ? Array(PRODUCTS_PER_PAGE.FEATURED_HOME).fill(null).map((_, i) => <SkeletonCard key={i} />)
            : featuredProducts.map((product, i) => (
                <div
                  key={product._id}
                  style={{
                    opacity: featuredInView ? 1 : 0,
                    transform: featuredInView ? 'translateY(0)' : 'translateY(50px)',
                    transition: `all ${ANIMATION_CONFIG.DURATION.NORMAL} ${ANIMATION_CONFIG.EASING} ${ANIMATION_CONFIG.STAGGER.FEATURED(i)}ms`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))
          }
        </div>
      </PageSection>

      {/* Brand Features */}
      <PageSection ref={featuresRef} bgClass="bg-surface">
        <div className="text-center mb-16">
          <SectionTitle
            title="Why"
            highlight="Biiggg X"
            subtitle="More than merch — it's a movement"
            inView={featuresInView}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOME_FEATURES.map((f, i) => (
            <FeatureBlock key={f.id} {...f} inView={featuresInView} delay={i * 100 + 200} />
          ))}
        </div>
      </PageSection>

      {/* Big CTA */}
      <PageSection ref={ctaRef} className="overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0000, #000000, #00001A)' }}>
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(229,57,53,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="font-bebas leading-none select-none" style={{ fontSize: 'clamp(20rem, 60vw, 60rem)', color: 'rgba(229,57,53,0.03)' }} aria-hidden="true">
            X
          </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div
            style={{
              opacity: ctaInView ? 1 : 0,
              transform: ctaInView ? 'translateY(0)' : 'translateY(40px)',
              transition: `all ${ANIMATION_CONFIG.DURATION.SLOW} ${ANIMATION_CONFIG.EASING}`,
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
      </PageSection>
    </div>
  );
}
