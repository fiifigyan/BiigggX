import React from 'react';
import ContactForm from '../components/ContactForm';
import { useInView } from '../hooks/useInView';
import { useSubmitCollab } from '../hooks/useConvex';

const COLLAB_TYPES = [
  { icon: '🎨', title: 'Artist Collab', desc: 'Bring your art to the streets. We print, you create.' },
  { icon: '🎵', title: 'Music Collab', desc: 'Merch drops, music videos, event tie-ins.' },
  { icon: '📸', title: 'Content / Media', desc: 'Press features, photography, editorial lookbooks.' },
  { icon: '🏪', title: 'Retail / Stock', desc: 'Want to carry Biiggg X in your store?' },
];

export default function Contact() {
  const [headerRef, headerInView] = useInView(0.1);
  const [typesRef, typesInView] = useInView(0.1);
  const [formRef, formInView] = useInView(0.05);

  const submitCollab = useSubmitCollab();

  const handleFormSubmit = async (data) => {
    await submitCollab({
      name: data.name,
      email: data.email,
      type: data.type,
      message: data.message,
      socialHandle: data.socialHandle || undefined,
    });
  };

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
            backgroundImage: 'linear-gradient(rgba(229,57,53,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div
          className="absolute right-0 top-0 font-bebas text-[20rem] text-white/[0.02] leading-none pointer-events-none select-none"
          style={{ lineHeight: 0.9 }}
        >
          X
        </div>

        <div className="max-w-7xl mx-auto">
          <div
            style={{
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="tag-badge font-marker mb-6 inline-block">Collab & Contact</span>
            <h1
              className="font-bebas leading-none mb-4"
              style={{ fontSize: 'clamp(3rem, 11vw, 9rem)' }}
            >
              TAG THE{' '}
              <span
                className="text-crimson"
                style={{ textShadow: '0 0 30px rgba(229,57,53,0.4)' }}
              >
                WALL
              </span>
            </h1>
            <p className="font-montserrat text-sm text-urban/50 max-w-xl leading-relaxed">
              Want to collab or feature Biiggg X? Artists, musicians, retailers, media — all welcome. Tell us your vision. Let's build.
            </p>
          </div>
        </div>
      </section>

      {/* Collab types */}
      <section ref={typesRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-surface border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-montserrat text-xs text-urban/30 uppercase tracking-[0.3em] mb-8"
            style={{
              opacity: typesInView ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            Types of Collaboration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLLAB_TYPES.map((ct, i) => (
              <div
                key={ct.title}
                className="group p-6 border border-white/5 hover:border-crimson/25 transition-all duration-400 cursor-pointer"
                style={{
                  background: '#0A0A0A',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                  opacity: typesInView ? 1 : 0,
                  transform: typesInView ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
                }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {ct.icon}
                </div>
                <h3 className="font-bebas text-lg text-white tracking-wider mb-2 group-hover:text-crimson transition-colors duration-300">
                  {ct.title}
                </h3>
                <p className="font-montserrat text-xs text-urban/40 leading-relaxed">{ct.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main form section */}
      <section ref={formRef} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left info */}
            <div
              className="lg:col-span-2"
              style={{
                opacity: formInView ? 1 : 0,
                transform: formInView ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <h2 className="section-title mb-6">
                Let's <span>Build</span>
              </h2>

              <p className="font-montserrat text-sm text-urban/60 leading-relaxed mb-8">
                Every wall starts blank. Every movement starts with one conversation. Drop us a message and let's see what we can create together.
              </p>

              {/* Contact info */}
              <div className="space-y-4">
                {[
                  { label: 'Email', value: 'collabs@biigggx.com', color: '#E53935' },
                  { label: 'DMs', value: '@biigggx (all platforms)', color: '#00BFFF' },
                  { label: 'Response time', value: '24–48 hrs', color: '#B0B0B0' },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div
                      className="w-1 h-full min-h-[3rem] flex-shrink-0 mt-1"
                      style={{ background: info.color, opacity: 0.6 }}
                    />
                    <div>
                      <span className="font-montserrat text-xs text-urban/30 uppercase tracking-widest block mb-0.5">
                        {info.label}
                      </span>
                      <span className="font-montserrat text-sm text-white/80">{info.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tagline */}
              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="font-marker text-xl text-urban/40 leading-relaxed">
                  "Tag the wall.{' '}
                  <span className="text-crimson">Let's build.</span>"
                </p>
              </div>
            </div>

            {/* Form */}
            <div
              className="lg:col-span-3"
              style={{
                opacity: formInView ? 1 : 0,
                transform: formInView ? 'translateX(0)' : 'translateX(30px)',
                transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            >
              <div
                className="p-8 border border-white/5"
                style={{
                  background: '#0A0A0A',
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                }}
              >
                {/* Form header */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                  <div
                    className="w-2 h-2 rounded-full bg-crimson"
                    style={{ boxShadow: '0 0 8px #E53935' }}
                  />
                  <span className="font-montserrat text-xs text-urban/40 uppercase tracking-widest">
                    Collab Request Form
                  </span>
                </div>

                <ContactForm onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom map-style decoration */}
      <div className="py-16 border-t border-white/5 bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-marker text-2xl text-urban/20 mb-4">
            We're everywhere. X marks every city.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['NYC', 'LA', 'ATL', 'CHI', 'LDN', 'PAR', 'TKY', 'JHB', 'ACC', 'LAG'].map((city, i) => (
              <span
                key={city}
                className="font-bebas text-base tracking-widest"
                style={{
                  color: i % 2 === 0 ? 'rgba(229,57,53,0.4)' : 'rgba(0,191,255,0.4)',
                }}
              >
                {city}
              </span>
            ))}
            <span className="font-bebas text-base text-white/10 tracking-widest">+ MORE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
