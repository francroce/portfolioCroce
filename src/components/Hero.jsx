import { useEffect, useRef } from 'react';
import { Icons } from './Icons';
import HeroParticles from './HeroParticles';
import './Hero.css';

import Hero3D from './Hero3D';

export default function Hero({ data }) {
  const heroRef = useRef(null);

  // Parallax grid on mouse move
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const grid = hero.querySelector('.hero-grid-bg');
    const glow = hero.querySelector('.hero-glow');

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (grid) grid.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      if (glow) glow.style.transform = `translate(${x * 40}px, ${y * 30}px)`;
    };

    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <HeroParticles />
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-layout">
        <div className="hero-content">
          <div className="hero-greeting">{data.hero.greeting}</div>
          <h1 className="hero-name" data-text={data.hero.name}>
            {data.hero.name}
          </h1>
          <p className="hero-title">{data.hero.title}</p>
          <p className="hero-tagline">{data.hero.tagline}</p>
          <div className="hero-ctas">
            <a href="#projects" className="btn-primary">
              {data.hero.cta} {Icons.arrow}
            </a>
            <a href="#contact" className="btn-secondary">
              {data.hero.ctaSecondary}
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <>
            <Hero3D />
          </>
        </div>
      </div>
      <div className="hero-scroll-indicator" aria-hidden="true">
        <div className="hero-scroll-line" />
        <span className="hero-scroll-text">scroll</span>
      </div>
    </section>
  );
}
