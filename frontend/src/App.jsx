import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Media from './pages/Media';
import Contact from './pages/Contact';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Loading screen component
function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 600);
          }, 200);
          return 100;
        }
        return p + Math.random() * 12 + 3;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`loading-screen transition-opacity duration-600 ${done ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ zIndex: 9999 }}
    >
      {/* Animated X logo */}
      <div className="relative flex items-center justify-center mb-8">
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
          <line x1="10" y1="10" x2="70" y2="70" stroke="#E53935" strokeWidth="6" strokeLinecap="round"
            strokeDasharray="90" strokeDashoffset="90"
            style={{ animation: 'drawLine 0.8s ease-out 0.2s forwards' }} />
          <line x1="70" y1="10" x2="10" y2="70" stroke="#00BFFF" strokeWidth="6" strokeLinecap="round"
            strokeDasharray="90" strokeDashoffset="90"
            style={{ animation: 'drawLine 0.8s ease-out 0.5s forwards' }} />
        </svg>
        <div
          className="font-bebas text-5xl text-white opacity-0"
          style={{ animation: 'fadeInUp 0.6s ease-out 1s forwards' }}
        >
          BIIGGG<span className="text-crimson">X</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-crimson to-neon transition-all duration-100"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="font-montserrat text-xs text-urban/50 tracking-[0.3em] uppercase mt-4">
        Loading the drop
      </p>

      <style>{`
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Router>
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/media" element={<Media />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <Cart />
        </Router>
      </div>
    </>
  );
}

export default function App() {
  return <AppContent />;
}
