import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { useConvexAuth, useMutation } from 'convex/react';
// eslint-disable-next-line import/no-unresolved
import { api } from '@convex/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Membership from './pages/Membership';
import Admin from './pages/Admin';
import Orders from './pages/Orders';

// ─── Error Boundary ──────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="font-bebas text-8xl text-crimson mb-4" style={{ textShadow: '0 0 40px rgba(229,57,53,0.4)' }}>X</div>
            <h1 className="font-bebas text-3xl text-white mb-2">Something broke</h1>
            <p className="font-montserrat text-sm text-urban/50 mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              className="btn-crimson"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Order Success Banner ─────────────────────────────────────────────────────
function OrderSuccessBanner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setVisible(true);
      // Remove the query param so it doesn't persist on refresh
      setSearchParams((p) => { p.delete('success'); return p; }, { replace: true });
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] w-full max-w-sm px-4"
      style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          background: '#0A0A0A',
          border: '1px solid rgba(0,191,255,0.4)',
          boxShadow: '0 0 30px rgba(0,191,255,0.1)',
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        }}
      >
        <svg className="w-5 h-5 flex-shrink-0 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <div className="flex-1">
          <p className="font-montserrat font-bold text-sm text-white">Order received!</p>
          <p className="font-montserrat text-xs text-urban/50 mt-0.5">We'll confirm your order shortly.</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-urban/40 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Syncs the Clerk user into the Convex users table on first sign-in ────────
function UserSync() {
  const { isAuthenticated } = useConvexAuth();
  const createOrUpdateUser = useMutation(api.functions.users.createOrUpdateUser);

  useEffect(() => {
    if (isAuthenticated) {
      createOrUpdateUser();
    }
  }, [isAuthenticated, createOrUpdateUser]);

  return null;
}

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
          <UserSync />
          <ScrollToTop />
          <OrderSuccessBanner />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/media" element={<Media />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/orders" element={<Orders />} />
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
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
