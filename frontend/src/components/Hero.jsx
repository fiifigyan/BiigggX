import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

// Spray paint particle system
function SprayCanvas({ active }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const COLORS = ['#E53935', '#00BFFF', '#B0B0B0', '#FF6B6B', '#00E5FF'];
    const SPRAY_POINTS = [
      { x: 0.15, y: 0.2 }, { x: 0.85, y: 0.15 },
      { x: 0.5,  y: 0.5 }, { x: 0.1,  y: 0.7 },
      { x: 0.9,  y: 0.8 }, { x: 0.3,  y: 0.9 },
    ];

    let frame = 0;

    const createParticle = (x, y, color) => ({
      x, y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      r: Math.random() * 3 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      decay: Math.random() * 0.008 + 0.002,
      color,
    });

    const burst = () => {
      SPRAY_POINTS.forEach((pt) => {
        if (Math.random() > 0.7) return;
        const x = pt.x * canvas.width;
        const y = pt.y * canvas.height;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push(createParticle(x, y, color));
        }
      });
    };

    const loop = () => {
      frame++;
      if (frame % 3 === 0) burst();

      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.01);

      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.alpha -= p.decay;
      });

      if (particlesRef.current.length < 2000) {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      id="spray-canvas"
      style={{ opacity: active ? 0.6 : 0, transition: 'opacity 1s ease' }}
    />
  );
}

// Spray reveal text component
function SprayText({ text, className, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) rotate(0deg)' : 'translateY(20px) rotate(-1deg)',
        filter: visible ? 'blur(0px)' : 'blur(4px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'inline-block',
      }}
    >
      {text}
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const [sprayActive, setSprayActive] = useState(false);
  const [phase, setPhase] = useState(0); // 0=loading, 1=spray, 2=text, 3=cta

  useEffect(() => {
    // Phase 1: Start spray canvas
    const t1 = setTimeout(() => { setSprayActive(true); setPhase(1); }, 400);
    // Phase 2: Show logo text
    const t2 = setTimeout(() => setPhase(2), 900);
    // Phase 3: Show CTA and tagline
    const t3 = setTimeout(() => setPhase(3), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // GSAP scroll parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const hero = heroRef.current;
      hero.style.transform = `translateY(${scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-midnight">
      {/* Background layers */}
      <div className="absolute inset-0 bg-graffiti-gradient" />

      {/* Animated grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(229,57,53,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner accent marks */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-crimson opacity-60" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-neon opacity-60" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-neon opacity-60" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-crimson opacity-60" />

      {/* Spray canvas overlay */}
      <SprayCanvas active={sprayActive} />

      {/* Glowing orbs (ambient light) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #E53935 0%, transparent 70%)',
          top: '20%',
          left: '10%',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00BFFF 0%, transparent 70%)',
          bottom: '20%',
          right: '10%',
          filter: 'blur(80px)',
        }}
      />

      {/* Main content */}
      <div ref={heroRef} className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Pre-title tag */}
        <div
          className="mb-6 inline-block"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.5s ease 0.1s',
          }}
        >
          <span className="tag-badge font-marker text-base px-4 py-1.5 rotate-[-1deg]">
            New Drop 2026 🔥
          </span>
        </div>

        {/* Giant Logo */}
        <div className="relative mb-4">
          {/* "BIIGGG" */}
          <div
            className="font-bebas leading-none"
            style={{
              fontSize: 'clamp(4rem, 18vw, 16rem)',
              letterSpacing: '-0.02em',
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? 'translateX(0) skewX(0deg)' : 'translateX(-40px) skewX(-2deg)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              color: '#ffffff',
              textShadow: phase >= 2 ? '0 0 60px rgba(255,255,255,0.1), 4px 4px 0px rgba(229,57,53,0.3)' : 'none',
            }}
          >
            BIIGGG
          </div>

          {/* "X" with neon glow */}
          <div
            className="font-bebas leading-none"
            style={{
              fontSize: 'clamp(5rem, 22vw, 20rem)',
              letterSpacing: '-0.02em',
              color: '#E53935',
              marginTop: '-0.15em',
              lineHeight: '0.85',
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? 'translateX(0) scaleX(1)' : 'translateX(40px) scaleX(0.8)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
              textShadow: phase >= 2
                ? '0 0 20px #E53935, 0 0 60px rgba(229,57,53,0.5), 0 0 120px rgba(229,57,53,0.2), 6px 6px 0 #00BFFF'
                : 'none',
            }}
          >
            X
          </div>

          {/* Decorative slash through X */}
          <div
            className="absolute right-0 top-1/2 w-[2px] h-32 bg-neon opacity-60 rotate-12 pointer-events-none"
            style={{
              opacity: phase >= 2 ? 0.6 : 0,
              transition: 'opacity 0.5s ease 1.2s',
              boxShadow: '0 0 10px #00BFFF, 0 0 30px rgba(0,191,255,0.4)',
            }}
          />
        </div>

        {/* Tagline */}
        <p
          className="font-marker text-xl md:text-3xl text-urban mb-2"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease 0.1s',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}
        >
          "Biiggg moves.{' '}
          <span style={{ color: '#00BFFF', textShadow: '0 0 8px #00BFFF' }}>
            X marks the moment.
          </span>
          "
        </p>

        {/* Divider line */}
        <div
          className="flex items-center justify-center gap-4 my-8"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: 'opacity 0.5s ease 0.3s',
          }}
        >
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-crimson" />
          <span className="font-bebas text-crimson tracking-widest text-sm">EST. 2026</span>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-neon" />
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s ease 0.4s',
          }}
        >
          <Link to="/about" className="btn-neon text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Explore the Brand
          </Link>
          <Link to="/shop" className="btn-crimson text-sm">
            Shop the Drop
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-white/5"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: 'opacity 0.7s ease 0.8s',
          }}
        >
          {[
            { label: 'Limited Pieces', value: '100+' },
            { label: 'Drops This Year', value: '12' },
            { label: 'Cities Tagged', value: '30+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-bebas text-3xl text-crimson">{stat.value}</div>
              <div className="font-montserrat text-xs text-urban/60 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 1s ease 1.2s',
        }}
      >
        <span className="font-montserrat text-[10px] text-urban/40 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-urban/40 to-transparent" />
        <div
          className="w-1.5 h-1.5 bg-crimson rounded-full"
          style={{ animation: 'bounce 2s ease infinite', boxShadow: '0 0 6px #E53935' }}
        />
      </div>

      {/* Marquee strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 py-2 bg-crimson/90 overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {Array(4).fill(null).map((_, idx) => (
            <span key={idx} className="font-bebas text-white text-sm tracking-widest mx-8">
              BIIGGG X &nbsp;•&nbsp; X MARKS THE MOMENT &nbsp;•&nbsp; NEW DROP 2026 &nbsp;•&nbsp;
              LIMITED EDITION &nbsp;•&nbsp; STREETWEAR &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
