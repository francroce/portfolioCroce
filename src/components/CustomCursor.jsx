import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const trailsRef = useRef([]);
  const pos = useRef({ x: -100, y: -100 });
  const glow = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const isTouch = useRef(false);

  useEffect(() => {
    // Detect touch device
    const onTouch = () => { isTouch.current = true; };
    window.addEventListener('touchstart', onTouch, { once: true });

    const onMove = (e) => {
      if (isTouch.current) return;
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (glowRef.current) glowRef.current.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };

    // Hover detection for interactive elements
    const onOver = (e) => {
      const target = e.target.closest('a, button, [data-hover]');
      if (target) {
        dotRef.current?.classList.add('cursor-hover');
        glowRef.current?.classList.add('cursor-hover');
      }
    };
    const onOut = (e) => {
      const target = e.target.closest('a, button, [data-hover]');
      if (target) {
        dotRef.current?.classList.remove('cursor-hover');
        glowRef.current?.classList.remove('cursor-hover');
      }
    };

    // Click ripple
    const onClick = (e) => {
      if (isTouch.current) return;
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('click', onClick);

    // Animation loop — dot follows instantly, glow has lag
    let raf;
    const animate = () => {
      const dx = pos.current.x - glow.current.x;
      const dy = pos.current.y - glow.current.y;
      glow.current.x += dx * 0.12;
      glow.current.y += dy * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glow.current.x}px, ${glow.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={glowRef} className="cursor-glow" />
    </>
  );
}
