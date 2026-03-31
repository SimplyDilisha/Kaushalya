import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingHero from './pages/LandingHero';
import ProfileBuilder from './pages/ProfileBuilder';
import JobListings from './pages/JobListings';
import JobDetail from './pages/JobDetail';
import EmployerDashboard from './pages/EmployerDashboard';
import ChatbotPage from './pages/ChatbotPage';
import './App.css';

// Base accessible button component used throughout
export const AccessibleButton = ({ children, onClick, className = '', variant = 'primary', style, ...props }) => {
  const baseStyle = {
    minHeight: '44px',
    borderRadius: '12px',
    fontWeight: '600',
    padding: '0 20px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Inter', sans-serif"
  };

  const variants = {
    primary: {
      background: 'var(--primary-gradient)',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 15px var(--accent-purple-glow)'
    },
    outline: {
      background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(4px)',
      border: '2px solid var(--accent-purple)',
      color: 'var(--accent-purple)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)'
    }
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant], ...style }}
      className={`accessible-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={scrolled ? 'header-glass' : ''} style={{
      height: 'var(--header-height)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: scrolled ? undefined : 'transparent',
      transition: 'all 0.3s ease'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--primary-gradient)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '1.2rem',
          boxShadow: '0 4px 10px var(--accent-purple-glow)'
        }}>
          A
        </div>
        <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
          ApnaRozgaar
        </span>
      </Link>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Chat with Asha button - navigates to full page */}
        <button
          onClick={() => navigate('/chat')}
          aria-label="Chat with Asha - AI Assistant"
          style={{
            background: 'var(--primary-gradient)',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            minWidth: '44px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 10px var(--accent-purple-glow)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={20} color="white" />
        </button>
        <AccessibleButton variant="ghost" className="desktop-only">Sign In</AccessibleButton>
        <AccessibleButton className="desktop-only">Post a Job</AccessibleButton>
        <button
          className="mobile-only"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Open mobile menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          {mobileMenuOpen ? <X size={28} color="var(--text-primary)" /> : <Menu size={28} color="var(--text-primary)" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass"
            style={{
              position: 'absolute',
              top: 'var(--header-height)',
              left: 0,
              right: 0,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              borderBottomRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* <Link onClick={() => setMobileMenuOpen(false)} to="/jobs" style={{ fontSize: '1.2rem' }}>Find Jobs</Link> */}
            <Link onClick={() => setMobileMenuOpen(false)} to="/employer" style={{ fontSize: '1.2rem' }}>For Employers</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/profile/create" style={{ fontSize: '1.2rem' }}>My Profile</Link>
            <hr style={{ borderTop: '1px solid var(--border)', opacity: 0.5 }} />
            <AccessibleButton variant="ghost" style={{ justifyContent: 'flex-start', padding: 0, fontSize: '1.2rem' }}>Sign In</AccessibleButton>
            <AccessibleButton style={{ width: '100%', minHeight: '52px' }}>Post a Job</AccessibleButton>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="glass" style={{
    marginTop: 'auto',
    borderTop: '1px solid var(--border)',
    padding: '60px 24px 40px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '400px' }}>
        <strong style={{ fontSize: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>AbilityConnect</strong>
        <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '1.1rem' }}>We are an inclusive platform dedicated to removing barriers and matching talent to truly accessible roles.</p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(5, 150, 105, 0.1)',
          border: '1px solid rgba(5, 150, 105, 0.2)',
          color: 'var(--success)',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginTop: '16px'
        }}>
          Accessibility: WCAG 2.1 AA Compliant
        </div>
      </div>
      <div>
        <nav aria-label="Footer Links" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <strong style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}>Platform</strong>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/accessibility">Accessibility Statement</Link>
        </nav>
      </div>
      <div>
        <nav aria-label="Connect" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <strong style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}>Connect</strong>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </nav>
      </div>
    </div>
  </footer>
);

// Animated Router Wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <LandingHero />
          </motion.div>
        } />
        <Route path="/profile/create" element={
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <ProfileBuilder />
          </motion.div>
        } />
        <Route path="/jobs" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <JobListings />
          </motion.div>
        } />
        <Route path="/jobs/:id" element={
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <JobDetail />
          </motion.div>
        } />
        <Route path="/employer" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <EmployerDashboard />
          </motion.div>
        } />
        <Route path="/chat" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <ChatbotPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* 1. Skip to main content link must be first in body/app */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main id="main-content" style={{ flex: 1 }}>
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
