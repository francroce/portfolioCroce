import { useState } from 'react';
import { Icons } from './Icons';
import './Nav.css';

export default function Nav({ data }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLink = () => setMenuOpen(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          {data.hero.name}<span>.</span>
        </a>
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {Icons.menu}
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#about" onClick={handleLink}>Sobre mí</a>
          <a href="#skills" onClick={handleLink}>Skills</a>
          <a href="#experience" onClick={handleLink}>Trayectoria</a>
          <a href="#projects" onClick={handleLink}>Proyectos</a>
          <a href="#contact" onClick={handleLink}>Contacto</a>
        </div>
      </div>
    </nav>
  );
}
