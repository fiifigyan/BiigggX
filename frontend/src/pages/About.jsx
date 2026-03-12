import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { 
        setInView(true); 
        observer.unobserve(entry.target); 
      } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const TIMELINE = [
  {
    year: '2026',
    title: 'The Vision Forms',
    desc: 'A new identity, "Biiggg X," is born from a mindset of thinking bigger and embracing the unknown.',
    color: '#E53935',
  },
  {
    year: '2026',
    title: 'The Foundation is Laid',
    desc: 'The brand is established, and the first creative pieces emerge, marking the beginning of a new movement.',
    color: '#00BFFF',
  },
];

const PHILOSOPHY = [
  {
    title: 'Embrace the Unknown',
    body: 'The X represents the unknown. Growth happens when we step into uncertainty and choose courage over comfort.',
    icon: '✕',
  },
  {
    title: 'Define Your Identity',
    body: 'Biiggg X stands for self-definition. We believe identity is not given — it is created through action and bold decisions.',
    icon: '◎',
  },
  {
    title: 'Make The Biiggg Move',
    body: 'Life is filled with moments that test who we are. Biiggg X exists to remind people to choose the bigger path when those moments arrive.',
    icon: '△',
  },
];

export default function About() {
  const [heroRef, heroInView] = useInView(0.1);
  const [timelineRef, timelineInView] = useInView(0.05);
  const [philoRef, philoInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.2);
  const [momentsRef, momentsInView] = useInView(0.2);


  return (
    <div className="bg-midnight min-h-screen pt-20">
      {/* Hero */}
      <section ref={heroRef} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* BG grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,191,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.8) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div
                style={{
                  opacity: heroInView ? 1 : 0,
                  transform: heroInView ? 'translateX(0)' : 'translateX(-40px)',
                  transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span className="tag-badge font-marker text-base mb-6 inline-block">Our Story</span>
                <h1
                  className="font-bebas leading-none mb-6"
                  style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
                >
                  THE STORY
                  <br />
                  OF THE{' '}
                  <span
                    className="text-crimson"
                    style={{ textShadow: '0 0 20px #E53935, 0 0 60px rgba(229,57,53,0.3)' }}
                  >
                    X
                  </span>
                </h1>
                <p className="font-montserrat text-base text-urban/70 leading-relaxed max-w-lg">
                  Biiggg X is more than a name. It is a symbol of bold identity and limitless potential.
                  The X represents the unknown — the moments in life where decisions define who we become.
                  Biiggg X stands for those who refuse to stay small and choose the bigger path when their moment arrives.
                </p>
              </div>
            </div>

            {/* Visual X */}
            <div
              className="relative flex items-center justify-center"
              style={{
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? 'translateX(0) rotate(0)' : 'translateX(40px) rotate(5deg)',
                transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            >
              {/* Big X composition */}
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Red X */}
                <svg viewBox="0 0 300 300" className="w-full h-full absolute inset-0">
                  <line x1="20" y1="20" x2="280" y2="280"
                    stroke="#E53935" strokeWidth="30" strokeLinecap="round" opacity="0.9"/>
                  <line x1="280" y1="20" x2="20" y2="280"
                    stroke="#00BFFF" strokeWidth="30" strokeLinecap="round" opacity="0.9"/>
                  {/* Glow lines */}
                  <line x1="20" y1="20" x2="280" y2="280"
                    stroke="#E53935" strokeWidth="60" strokeLinecap="round" opacity="0.1"/>
                  <line x1="280" y1="20" x2="20" y2="280"
                    stroke="#00BFFF" strokeWidth="60" strokeLinecap="round" opacity="0.1"/>
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-midnight px-4 py-2 text-center">
                    <span className="font-bebas text-4xl text-white tracking-widest block">EST</span>
                    <span className="font-montserrat text-xs text-urban/50 tracking-[0.3em]">2026</span>
                  </div>
                </div>

                {/* Orbiting dots */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: i % 2 === 0 ? '#E53935' : '#00BFFF',
                      boxShadow: `0 0 10px ${i % 2 === 0 ? '#E53935' : '#00BFFF'}`,
                      top: `${[10, 85, 10, 85][i]}%`,
                      left: `${[10, 10, 85, 85][i]}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*The X Moments */}
      <section ref={momentsRef} className="py-12 px-4 sm:px-6 lg:px-8 bg-surface border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <div>
                <h2 className="section-title">The <span>X Moment</span></h2>
                <p className="font-montserrat text-sm text-urban/40 uppercase tracking-widest mt-2">
                  The moment that defines you
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-montserrat text-base text-urban/70 leading-relaxed">
                Everyone faces moments in life where the future is uncertain. Moments where fear says stay safe, and ambition says move forward. Biiggg X calls these moments X Moments — the moments where you decide whether to remain the same, or become something greater. When that moment comes… make the Biiggg move.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-12 px-4 sm:px-6 lg:px-8 bg-surface border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '30+', label: 'Cities Tagged' },
              { value: '1000+', label: 'Pieces Dropped' },
              { value: '1', label: 'Years Running' },
              { value: '∞', label: 'Walls to Tag' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
                style={{
                  opacity: statsInView ? 1 : 0,
                  transform: statsInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease ${i * 100}ms`,
                }}
              >
                <div
                  className="font-bebas text-5xl mb-1"
                  style={{
                    color: i % 2 === 0 ? '#E53935' : '#00BFFF',
                    textShadow: `0 0 20px ${i % 2 === 0 ? 'rgba(229,57,53,0.4)' : 'rgba(0,191,255,0.4)'}`,
                  }}
                >
                  {stat.value}
                </div>
                <div className="font-montserrat text-xs text-urban/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="mb-16"
            style={{
              opacity: timelineInView ? 1 : 0,
              transform: timelineInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease',
            }}
          >
            <h2 className="section-title">The <span>Timeline</span></h2>
            <p className="font-montserrat text-sm text-urban/40 uppercase tracking-widest mt-2">
              From a nickname to a movement
            </p>
          </div>

          <div className="relative pl-4">
            {/* Vertical line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-[2px]"
              style={{
                background: 'linear-gradient(to bottom, #E53935, #00BFFF, #E53935, #00BFFF, transparent)',
                opacity: timelineInView ? 0.4 : 0,
                transition: 'opacity 1s ease 0.5s',
              }}
            />

            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className="relative pl-10 pb-12 last:pb-0"
                style={{
                  opacity: timelineInView ? 1 : 0,
                  transform: timelineInView ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150 + 300}ms`,
                }}
              >
                {/* Node */}
                <div
                  className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center -translate-x-3"
                  style={{
                    background: item.color + '20',
                    border: `2px solid ${item.color}`,
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    boxShadow: `0 0 15px ${item.color}60`,
                  }}
                />

                {/* Year badge */}
                <span
                  className="font-bebas text-4xl leading-none block mb-2"
                  style={{ color: item.color, textShadow: `0 0 15px ${item.color}50` }}
                >
                  {item.year}
                </span>

                <h3 className="font-montserrat font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="font-montserrat text-sm text-urban/60 leading-relaxed max-w-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section ref={philoRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #E53935, transparent)' }}
        />
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center mb-16"
            style={{
              opacity: philoInView ? 1 : 0,
              transform: philoInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease',
            }}
          >
            <h2 className="section-title">Brand <span>Philosophy</span></h2>
            <p className="font-montserrat text-sm text-urban/40 uppercase tracking-widest mt-2">
              The code we live by
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PHILOSOPHY.map((p, i) => (
              <div
                key={p.title}
                className="relative p-8 border border-white/5 group hover:border-crimson/20 transition-all duration-500"
                style={{
                  background: '#0A0A0A',
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                  opacity: philoInView ? 1 : 0,
                  transform: philoInView ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150 + 200}ms`,
                }}
              >
                <div
                  className="font-bebas text-6xl text-white/5 absolute top-4 right-6 group-hover:text-crimson/10 transition-colors duration-500"
                >
                  {p.icon}
                </div>
                <span className="font-montserrat text-xs uppercase tracking-widest text-urban/30 mb-3 block">
                  0{i + 1}
                </span>
                <h3 className="font-bebas text-2xl text-white tracking-wide mb-4 group-hover:text-crimson transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="font-montserrat text-sm text-urban/50 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="text-center mt-16"
            style={{
              opacity: philoInView ? 1 : 0,
              transition: 'opacity 0.8s ease 0.6s',
            }}
          >
            <Link to="/shop" className="btn-crimson mr-4">Shop the Drop</Link>
            <Link to="/contact" className="btn-neon">Collab With Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
