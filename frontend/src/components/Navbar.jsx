import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Shop', path: '/shop' },
  { label: 'Media', path: '/media' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, openCart } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-midnight/95 backdrop-blur-md border-b border-white/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 group">
              <span
                className="font-bebas text-3xl text-white tracking-wider transition-all duration-300 group-hover:text-crimson"
                style={{ textShadow: scrolled ? 'none' : '0 0 30px rgba(229,57,53,0.3)' }}
              >
                BIIGGG
              </span>
              <span
                className="font-bebas text-3xl text-crimson tracking-wider animate-flicker"
                style={{ textShadow: '0 0 8px #E53935, 0 0 20px rgba(229,57,53,0.4)' }}
              >
                X
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative group flex items-center justify-center w-10 h-10 transition-all duration-200"
                aria-label="Open cart"
              >
                <svg
                  className="w-5 h-5 text-urban group-hover:text-white transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm6.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-crimson text-white text-[10px] font-montserrat font-bold flex items-center justify-center rounded-full animate-spray-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Shop CTA */}
              <Link to="/shop" className="hidden md:block btn-crimson text-xs py-2 px-5">
                Shop Drop
              </Link>

              {/* Mobile Hamburger */}
              <button
                className="md:hidden relative w-8 h-6 flex flex-col justify-between"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`block w-full h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[11px]' : ''}`} />
                <span className={`block w-3/4 h-[2px] bg-crimson transition-all duration-300 ${menuOpen ? 'opacity-0 translate-x-4' : ''}`} />
                <span className={`block w-full h-[2px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[11px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.97)' }}
        ref={menuRef}
      >
        {/* Decorative X */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="font-bebas text-[40vw] text-white/[0.02] select-none"
            style={{ lineHeight: 1 }}
          >
            X
          </span>
        </div>

        <div className="flex flex-col items-center justify-center h-full gap-2">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-bebas text-6xl tracking-wider transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-crimson text-neon-glow'
                  : 'text-white/80 hover:text-crimson'
              }`}
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                transform: menuOpen ? 'translateX(0)' : 'translateX(-30px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="mt-8"
            style={{
              transitionDelay: menuOpen ? '320ms' : '0ms',
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: menuOpen ? 1 : 0,
              transition: 'all 0.4s ease',
            }}
          >
            <Link to="/shop" className="btn-crimson">
              Shop the Drop
            </Link>
          </div>

          <p className="absolute bottom-8 font-montserrat text-xs text-urban/30 tracking-widest uppercase">
            Biiggg moves. X marks the moment.
          </p>
        </div>
      </div>
    </>
  );
}
