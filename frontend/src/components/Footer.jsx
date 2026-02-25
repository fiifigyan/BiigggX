import React from 'react';
import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/biigggX/',
    color: '#E53935',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'www.tiktok.com/@biigggX',
    color: '#00BFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.77a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1.01-.13z"/>
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/biigggX',
    color: '#B0B0B0',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 5.252zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    color: '#E53935',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

const FOOTER_LINKS = [
  { group: 'Navigate', links: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Shop', path: '/shop' },
    { label: 'Media', path: '/media' },
    { label: 'Contact', path: '/contact' },
  ]},
  { group: 'Shop', links: [
    { label: 'Hoodies', path: '/shop?cat=hoodie' },
    { label: 'Caps', path: '/shop?cat=cap' },
    { label: 'Stickers', path: '/shop?cat=sticker' },
    { label: 'Limited Drops', path: '/shop?cat=limited' },
  ]},
  { group: 'Legal', links: [
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
    { label: 'Returns', path: '#' },
    { label: 'Shipping', path: '#' },
  ]},
];

const HASHTAGS = ['#BiigggX', '#XMarksTheMoment', '#StreetDrop', '#UrbanCulture', '#NewDrop2026', '#TagTheWall'];

export default function Footer() {
  return (
    <footer className="relative bg-midnight border-t border-white/5 overflow-hidden">
      {/* Background X watermark */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none overflow-hidden">
        <span
          className="font-bebas text-[30vw] text-white/[0.018] select-none leading-none"
          style={{ marginRight: '-5vw' }}
        >
          X
        </span>
      </div>

      {/* Hashtag marquee strip */}
      <div className="relative border-b border-white/5 py-3 overflow-hidden bg-surface/50">
        <div className="marquee-track whitespace-nowrap">
          {Array(3).fill(null).map((_, idx) => (
            <span key={idx} className="inline-flex items-center gap-6">
              {HASHTAGS.map((tag) => (
                <React.Fragment key={tag + idx}>
                  <span className="font-marker text-sm text-crimson hover:text-neon transition-colors cursor-pointer">
                    {tag}
                  </span>
                  <span className="text-white/10">|</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="inline-block mb-6 group">
              <div className="font-bebas leading-none">
                <span className="text-5xl text-white group-hover:text-urban transition-colors duration-300">
                  BIIGGG
                </span>
                <span
                  className="text-5xl text-crimson ml-1 animate-flicker"
                  style={{ textShadow: '0 0 10px #E53935, 0 0 30px rgba(229,57,53,0.3)' }}
                >
                  X
                </span>
              </div>
            </Link>

            <p className="font-marker text-lg text-urban/80 mb-6 leading-relaxed">
              "Biiggg moves.<br />
              <span className="text-neon" style={{ textShadow: '0 0 8px #00BFFF' }}>
                X marks the moment.
              </span>"
            </p>

            <p className="font-montserrat text-sm text-urban/40 leading-relaxed mb-8 max-w-xs">
              Bold streetwear born from the walls. Every piece tells a story. Every drop marks a moment.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-urban/50 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = social.color;
                    e.currentTarget.style.borderColor = social.color + '80';
                    e.currentTarget.style.boxShadow = `0 0 12px ${social.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.group}>
              <h4 className="font-montserrat font-bold text-xs uppercase tracking-[0.2em] text-urban/40 mb-5">
                {group.group}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="font-montserrat text-sm text-urban/60 hover:text-white transition-colors duration-200 flex items-center gap-2 group/link"
                    >
                      <span className="w-0 h-[1px] bg-crimson group-hover/link:w-3 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-marker text-sm text-urban/30 text-center sm:text-left">
            © 2026 Biiggg X. All rights tagged.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {/* Stripe badge */}
              <div className="flex items-center gap-1.5 border border-white/8 px-2 py-1">
                <svg className="w-3 h-3 text-urban/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.086-8.593l-.663-3.276-1.148 1.148L7.5 9.676l1.5-1.5 3.5 3.5-1.086 1.731zm4.172-2.441l-1.5 1.5-3.5-3.5 1.086-1.731.663 3.276 1.148-1.148 1.603 1.603z"/>
                </svg>
                <span className="font-montserrat text-[10px] text-urban/30 uppercase tracking-widest">Secured</span>
              </div>
            </div>

            <div className="h-3 w-[1px] bg-white/10" />

            <p className="font-montserrat text-[10px] text-urban/25 uppercase tracking-widest">
              Made with ✕ in the streets
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
