import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_DATA } from './data/defaultData';
import { storage } from './utils/storage';
import { useScrollReveal } from './hooks/useScrollReveal';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import CustomCursor from './components/CustomCursor';
import CommandBar from './components/CommandBar';

const ADMIN_PASSWORD = 'franco2024';

function AdminGate({ onAuth }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('portfolio-admin', '1');
      onAuth();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--sans)',
    }}>
      <form onSubmit={submit} style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '48px 40px',
        width: 'min(400px, 90vw)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--accent-dim)',
          border: '1px solid rgba(0,240,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: '1.5rem',
        }}>
          🔐
        </div>
        <h2 style={{
          fontFamily: 'Sora, sans-serif', fontWeight: 700,
          fontSize: '1.6rem', marginBottom: 8, color: 'var(--text)',
        }}>
          Panel Admin
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 28 }}>
          Ingresá la contraseña para acceder
        </p>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <input
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: '8px',
              padding: '12px 44px 12px 16px',
              color: 'var(--text)',
              fontFamily: 'var(--sans)',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color 0.3s ease',
            }}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: '0.8rem', padding: '4px',
            }}
          >
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.82rem', marginBottom: 12 }}>
            Contraseña incorrecta
          </p>
        )}
        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          background: 'var(--accent)',
          color: 'var(--bg)',
          border: 'none',
          borderRadius: '8px',
          fontFamily: 'var(--sans)',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}>
          Ingresar
        </button>
        <a href="/" style={{
          display: 'inline-block', marginTop: 20,
          color: 'var(--text-muted)', fontSize: '0.82rem',
          textDecoration: 'none',
        }}>
          ← Volver al portfolio
        </a>
      </form>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Route detection
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const isAdmin = path === '/admin' || path === '/admin/';
      setIsAdminRoute(isAdmin);
      if (isAdmin && sessionStorage.getItem('portfolio-admin') === '1') {
        setAdminAuthed(true);
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // When admin auth succeeds, open panel
  useEffect(() => {
    if (isAdminRoute && adminAuthed) {
      setAdminOpen(true);
    }
  }, [isAdminRoute, adminAuthed]);

  // Load data
  useEffect(() => {
    (async () => {
      const stored = await storage.get();
      if (stored) {
        setData({ ...DEFAULT_DATA, ...stored });
      }
      setLoaded(true);
    })();
  }, []);

  useScrollReveal([loaded, data]);

  useEffect(() => {
    document.body.style.overflow = adminOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [adminOpen]);

  const handleAdminClose = useCallback(() => {
    setAdminOpen(false);
    // Navigate back to / when closing admin
    if (isAdminRoute) {
      window.history.pushState({}, '', '/');
      setIsAdminRoute(false);
    }
  }, [isAdminRoute]);

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="loading-pulse" />
      </div>
    );
  }

  // Show password gate if on /admin and not authed
  if (isAdminRoute && !adminAuthed) {
    return <AdminGate onAuth={() => setAdminAuthed(true)} />;
  }

  return (
    <div className="grain">
      <CustomCursor />
      <CommandBar data={data} />
      <Nav data={data} />
      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Timeline data={data} />
      <Projects data={data} />
      <Contact data={data} />
      <Footer name={data.hero.name} />
      <AdminPanel
        data={data}
        setData={setData}
        open={adminOpen}
        onClose={handleAdminClose}
      />
    </div>
  );
}
