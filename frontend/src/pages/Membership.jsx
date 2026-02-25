import React, { useState } from 'react';
import { useAction } from 'convex/react';
import { useClerk } from '@clerk/clerk-react';
// eslint-disable-next-line import/no-unresolved
import { api } from '@convex/api';
import { useInView } from '../hooks/useInView';
import { useSubscription } from '../hooks/useSubscription';

// Replace these with your actual Stripe Price IDs from the Stripe Dashboard
const PRICE_IDS = {
  monthly: 'price_1T4jy1GMq28AnENLWKsL82l1',
  annual:  'price_1T4jy1GMq28AnENLGUm8M5wq',
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PERKS = [
  {
    icon: <IconBolt />,
    tag: 'DROP ACCESS',
    title: '48-Hour Head Start',
    desc: 'Every drop hits your dashboard two days before the public sees it. First in. Best dressed. No exceptions.',
    color: '#E53935',
  },
  {
    icon: <IconLock />,
    tag: 'MEMBERS ONLY',
    title: 'Exclusive Drops',
    desc: "Pieces designed solely for pass holders — never listed publicly. If you're not in, you'll never even know what you missed.",
    color: '#00BFFF',
  },
  {
    icon: <IconTag />,
    tag: 'DISCOUNT',
    title: '10% Off Everything',
    desc: 'Applied automatically at checkout when you\'re signed in. Every drop, every time. No codes. No friction.',
    color: '#E53935',
  },
  {
    icon: <IconBell />,
    tag: 'ALERTS',
    title: 'Drop Alerts',
    desc: 'Get hit the second something new lands. Email + push notification. Never miss a window again.',
    color: '#00BFFF',
  },
];

const FEATURES = [
  '48-hour early drop access',
  'Members-only exclusive pieces',
  '10% off all purchases',
  'Instant drop alert notifications',
  'Priority customer support',
  'Cancel anytime, no questions',
];

const FAQ_ITEMS = [
  {
    q: 'Can I cancel anytime?',
    a: "Yes. Cancel from your account portal whenever you want. You keep full access until the end of your current billing period — then it's done. No questions, no drama.",
  },
  {
    q: 'How does the 10% discount work?',
    a: "It's applied automatically at checkout when you're signed in with an active BiigggX Pass. No codes to enter, no hoops to jump through — just a lower price.",
  },
  {
    q: 'What are exclusive drops?',
    a: "Pieces we design specifically for pass holders. They never appear in the public store. Only members can see and buy them. When they sell out, they're gone permanently.",
  },
  {
    q: 'How early is "early access"?',
    a: 'Members see drops 48 hours before they go live to the public — at full price, no waitlists, no lottery. You get first pick while everyone else waits.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PerkCard({ perk, inView, delay }) {
  return (
    <div
      className="group relative p-6 border border-white/5 transition-all duration-500 hover:border-opacity-50 bg-surface-2"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        borderColor: 'rgba(255,255,255,0.05)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, border-color 0.3s`,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = perk.color + '50'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(225deg, ${perk.color}40 0%, transparent 60%)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(45deg, ${perk.color}20 0%, transparent 60%)` }}
      />

      {/* Tag */}
      <div className="mb-5">
        <span
          className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 inline-block"
          style={{
            color: perk.color,
            background: perk.color + '15',
            border: `1px solid ${perk.color}40`,
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
          }}
        >
          {perk.tag}
        </span>
      </div>

      {/* Icon */}
      <div
        className="mb-4 transition-transform duration-300 group-hover:scale-110 inline-block"
        style={{ color: perk.color, filter: `drop-shadow(0 0 8px ${perk.color}80)` }}
      >
        {perk.icon}
      </div>

      <h3 className="font-bebas text-2xl text-white tracking-wider mb-2">{perk.title}</h3>
      <p className="font-montserrat text-xs text-urban/50 leading-relaxed">{perk.desc}</p>
    </div>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      className="border-b border-white/5 transition-colors duration-200"
      style={{ borderColor: isOpen ? 'rgba(229,57,53,0.2)' : 'rgba(255,255,255,0.05)' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-montserrat font-semibold text-sm text-white/80 group-hover:text-white transition-colors duration-200 uppercase tracking-widest">
          {item.q}
        </span>
        <span style={{ color: isOpen ? '#E53935' : '#B0B0B0' }}>
          <IconChevron open={isOpen} />
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-400"
        style={{ maxHeight: isOpen ? '200px' : '0px' }}
      >
        <p className="font-montserrat text-sm text-urban/50 leading-relaxed pb-5">
          {item.a}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Membership() {
  const [billing, setBilling] = useState('annual');
  const [openFaq, setOpenFaq] = useState(0);

  // Scroll animation refs
  const [heroRef, heroInView]       = useInView(0.1);
  const [statsRef, statsInView]     = useInView(0.2);
  const [perksRef, perksInView]     = useInView(0.1);
  const [pricingRef, pricingInView] = useInView(0.15);
  const [faqRef, faqInView]         = useInView(0.1);
  const [ctaRef, ctaInView]         = useInView(0.2);

  // ── Auth + subscription state ──────────────────────────────────────────
  const { isSubscribed, isLoading: authLoading, isSignedIn } = useSubscription();
  const { openSignIn } = useClerk();
  const createCheckout = useAction(api.stripe.createSubscriptionCheckout);
  const getPortalUrl   = useAction(api.stripe.getCustomerPortalUrl);

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleSubscribe = async () => {
    if (authLoading || checkoutLoading) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setCheckoutLoading(true);
    try {
      if (isSubscribed) {
        const result = await getPortalUrl();
        if (result?.url) window.location.href = result.url;
      } else {
        const priceId = PRICE_IDS[billing];
        const result  = await createCheckout({ priceId });
        if (result?.url) window.location.href = result.url;
      }
    } catch (err) {
      console.error('Subscription error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const price = billing === 'annual' ? '79' : '9.99';
  const period = billing === 'annual' ? 'year' : 'month';

  return (
    <div className="bg-midnight min-h-screen pt-20">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(229,57,53,1) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Giant X */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="font-bebas select-none"
            style={{ fontSize: 'clamp(20rem, 70vw, 80rem)', color: 'rgba(229,57,53,0.025)', lineHeight: 1 }}
          >
            X
          </span>
        </div>
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(229,57,53,0.06) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            style={{
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0ms',
            }}
          >
            <span className="tag-badge font-marker text-base mb-8 inline-block">Members Only</span>
          </div>

          {/* Headline */}
          <div
            style={{
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 100ms',
            }}
          >
            <h1
              className="font-bebas leading-none mb-6"
              style={{ fontSize: 'clamp(4.5rem, 16vw, 14rem)', letterSpacing: '0.02em' }}
            >
              BIIGGGX{' '}
              <span
                className="text-crimson"
                style={{ textShadow: '0 0 30px #E53935, 0 0 80px rgba(229,57,53,0.4)' }}
              >
                PASS
              </span>
            </h1>
          </div>

          {/* Sub */}
          <div
            style={{
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 250ms',
            }}
          >
            <p className="font-montserrat text-base sm:text-lg text-urban/60 max-w-xl mx-auto leading-relaxed mb-10">
              Stop missing drops. Members get in first — every time.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 380ms',
            }}
          >
            <button onClick={handleSubscribe} disabled={checkoutLoading} className="btn-crimson">
              {checkoutLoading ? 'Redirecting...' : isSubscribed ? 'Manage Your Pass' : 'Get the Pass — $79/yr'}
            </button>
            <a
              href="#pricing"
              className="btn-neon"
            >
              See All Perks
            </a>
          </div>

          {/* Fine print */}
          <p
            className="font-montserrat text-[11px] text-urban/25 mt-6 uppercase tracking-widest"
            style={{
              opacity: heroInView ? 1 : 0,
              transition: 'opacity 0.8s ease 600ms',
            }}
          >
            Cancel anytime · No contracts · Instant access
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: heroInView ? 0.4 : 0, transition: 'opacity 1s ease 800ms' }}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-crimson to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="relative border-y border-white/5 bg-surface overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #E53935, transparent)' }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-4 divide-x divide-white/5">
            {[
              { value: '400+', label: 'Members' },
              { value: '2×',   label: 'Drops / Month' },
              { value: '48hr', label: 'Early Access' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center text-center px-4"
                style={{
                  opacity: statsInView ? 1 : 0,
                  transform: statsInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
                }}
              >
                <span
                  className="font-bebas text-4xl sm:text-5xl text-crimson leading-none"
                  style={{ textShadow: '0 0 20px rgba(229,57,53,0.4)' }}
                >
                  {stat.value}
                </span>
                <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-urban/40 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERKS ────────────────────────────────────────────────────────── */}
      <section
        ref={perksRef}
        className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div
          className="absolute right-0 top-0 w-64 h-64 opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00BFFF 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="max-w-6xl mx-auto">
          <div
            className="mb-16"
            style={{
              opacity: perksInView ? 1 : 0,
              transform: perksInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <span className="tag-badge font-marker mb-6 inline-block">What you get</span>
            <h2
              className="font-bebas leading-none"
              style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
            >
              PASS{' '}
              <span className="text-crimson">PERKS</span>
            </h2>
            <p className="font-montserrat text-sm text-urban/40 mt-2 max-w-md leading-relaxed">
              Four reasons every serious BiigggX fan locks in the pass.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERKS.map((perk, i) => (
              <PerkCard key={perk.title} perk={perk} inView={perksInView} delay={i * 120 + 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        ref={pricingRef}
        className="relative py-28 px-4 sm:px-6 lg:px-8 bg-surface overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(229,57,53,0.5), transparent)' }}
        />
        <div
          className="absolute -left-20 top-1/2 w-80 h-80 opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E53935 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div
            className="text-center mb-12"
            style={{
              opacity: pricingInView ? 1 : 0,
              transform: pricingInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <span className="tag-badge font-marker mb-6 inline-block">Simple pricing</span>
            <h2
              className="font-bebas leading-none"
              style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
            >
              ONE <span className="text-crimson">PASS</span>
            </h2>
            <p className="font-montserrat text-sm text-urban/40 mt-2">
              Everything included. No tiers, no upsells.
            </p>
          </div>

          {/* Billing toggle */}
          <div
            className="flex items-center justify-center mb-10"
            style={{
              opacity: pricingInView ? 1 : 0,
              transition: 'opacity 0.7s ease 150ms',
            }}
          >
            <div
              className="inline-flex p-1 gap-1"
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.07)',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}
            >
              {['monthly', 'annual'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className="relative font-montserrat text-xs uppercase tracking-widest px-6 py-2 transition-all duration-300"
                  style={{
                    color: billing === b ? '#fff' : '#B0B0B0',
                    background: billing === b ? '#E53935' : 'transparent',
                    clipPath: billing === b
                      ? 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                      : 'none',
                  }}
                >
                  {b === 'annual' ? (
                    <span className="flex items-center gap-2">
                      Annual
                      <span
                        className="font-montserrat text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
                        style={{ background: '#00BFFF20', color: '#00BFFF', border: '1px solid #00BFFF40' }}
                      >
                        SAVE $41
                      </span>
                    </span>
                  ) : 'Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing card */}
          <div
            className="relative p-8 sm:p-10"
            style={{
              background: '#0A0A0A',
              border: '1px solid rgba(229,57,53,0.25)',
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
              boxShadow: '0 0 60px rgba(229,57,53,0.08), 0 40px 80px rgba(0,0,0,0.4)',
              opacity: pricingInView ? 1 : 0,
              transform: pricingInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 200ms',
            }}
          >
            {/* Corner decoration */}
            <div
              className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
              style={{ background: 'linear-gradient(225deg, rgba(229,57,53,0.15) 0%, transparent 60%)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none"
              style={{ background: 'linear-gradient(45deg, rgba(229,57,53,0.08) 0%, transparent 60%)' }}
            />

            {/* Price */}
            <div className="flex items-end gap-2 mb-1">
              <span
                className="font-bebas text-7xl sm:text-8xl leading-none text-white"
                style={{ textShadow: '0 0 30px rgba(229,57,53,0.2)' }}
              >
                ${price}
              </span>
              <span className="font-montserrat text-sm text-urban/40 mb-3 uppercase tracking-widest">
                / {period}
              </span>
            </div>
            <p className="font-montserrat text-xs text-urban/30 mb-8 uppercase tracking-widest">
              {billing === 'annual' ? 'Billed once per year · ~$6.58/month' : 'Billed monthly · Cancel anytime'}
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-10">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="text-crimson"><IconCheck /></span>
                  <span className="font-montserrat text-sm text-urban/70">{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={handleSubscribe}
              disabled={checkoutLoading}
              className={`w-full btn-crimson justify-center text-sm ${checkoutLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {checkoutLoading
                ? 'Redirecting...'
                : !isSignedIn
                  ? 'Sign In to Get the Pass'
                  : isSubscribed
                    ? 'Manage Your Pass'
                    : 'Get the BiigggX Pass'}
            </button>

            <p className="font-montserrat text-[10px] text-urban/25 text-center mt-4 uppercase tracking-widest">
              Secure payment via Stripe · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        ref={faqRef}
        className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="mb-14"
            style={{
              opacity: faqInView ? 1 : 0,
              transform: faqInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <span className="tag-badge font-marker mb-6 inline-block">Got questions?</span>
            <h2
              className="font-bebas leading-none"
              style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
            >
              QUICK <span className="text-crimson">ANSWERS</span>
            </h2>
          </div>

          <div
            style={{
              opacity: faqInView ? 1 : 0,
              transform: faqInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 150ms',
            }}
          >
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className="relative py-36 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0A0000, #000000, #00001A)' }} />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(229,57,53,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="font-bebas select-none"
            style={{ fontSize: 'clamp(22rem, 65vw, 70rem)', color: 'rgba(229,57,53,0.03)', lineHeight: 1 }}
          >
            X
          </span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div
            style={{
              opacity: ctaInView ? 1 : 0,
              transform: ctaInView ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <span className="tag-badge font-marker text-base mb-8 inline-block">
              Don't wait. Drops don't.
            </span>
            <h2
              className="font-bebas leading-tight mb-6 text-white"
              style={{
                fontSize: 'clamp(3.5rem, 12vw, 9rem)',
                textShadow: '0 0 60px rgba(229,57,53,0.1)',
              }}
            >
              LOCK IN YOUR{' '}
              <span
                className="text-crimson"
                style={{ textShadow: '0 0 20px #E53935, 0 0 60px rgba(229,57,53,0.3)' }}
              >
                PASS
              </span>
            </h2>
            <p className="font-montserrat text-base text-urban/50 mb-10 max-w-md mx-auto leading-relaxed">
              The next drop is coming. The question is whether you'll be first — or watching from the outside again.
            </p>
            <button
              onClick={handleSubscribe}
              disabled={checkoutLoading}
              className={`btn-crimson text-base px-12 py-4 ${checkoutLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {checkoutLoading ? 'Redirecting...' : isSubscribed ? 'Manage Your Pass' : 'Get the BiigggX Pass'}
            </button>
            <p className="font-montserrat text-xs text-urban/25 mt-5 uppercase tracking-widest">
              From $9.99/month · Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
