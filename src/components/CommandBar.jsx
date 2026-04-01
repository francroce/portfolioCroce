import { useState, useEffect, useRef, useMemo } from 'react';
import './CommandBar.css';

const COMMANDS = [
  { id: 'about', label: 'Ir a Sobre mí', section: '#about', icon: '👤', keywords: 'about sobre mi perfil' },
  { id: 'skills', label: 'Ir a Skills', section: '#skills', icon: '⚡', keywords: 'skills habilidades tech' },
  { id: 'experience', label: 'Ir a Trayectoria', section: '#experience', icon: '📍', keywords: 'experience trayectoria educacion trabajo' },
  { id: 'projects', label: 'Ir a Proyectos', section: '#projects', icon: '🚀', keywords: 'projects proyectos portfolio' },
  { id: 'contact', label: 'Ir a Contacto', section: '#contact', icon: '✉️', keywords: 'contact contacto email mail' },
  { id: 'top', label: 'Volver arriba', section: '#hero', icon: '⬆️', keywords: 'top arriba inicio home hero' },
  { id: 'github', label: 'Abrir GitHub', action: 'github', icon: '🐙', keywords: 'github codigo source' },
  { id: 'linkedin', label: 'Abrir LinkedIn', action: 'linkedin', icon: '💼', keywords: 'linkedin red social' },
  { id: 'theme', label: 'Toggle efecto grain', action: 'grain', icon: '🎨', keywords: 'theme grain efecto visual' },
];

export default function CommandBar({ data }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const execute = (cmd) => {
    setOpen(false);
    if (cmd.section) {
      const el = document.querySelector(cmd.section);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd.action === 'github' && data?.contact?.github) {
      window.open(data.contact.github, '_blank');
    } else if (cmd.action === 'linkedin' && data?.contact?.linkedin) {
      window.open(data.contact.linkedin, '_blank');
    } else if (cmd.action === 'grain') {
      document.querySelector('.grain')?.classList.toggle('grain-off');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => (s + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => (s - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && filtered[selected]) {
      execute(filtered[selected]);
    }
  };

  if (!open) return null;

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk-container" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-wrapper">
          <svg className="cmdk-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="cmdk-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar o navegar..."
          />
          <kbd className="cmdk-kbd">ESC</kbd>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && (
            <div className="cmdk-empty">Sin resultados</div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`cmdk-item ${i === selected ? 'selected' : ''}`}
              onClick={() => execute(cmd)}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="cmdk-item-icon">{cmd.icon}</span>
              <span className="cmdk-item-label">{cmd.label}</span>
            </button>
          ))}
        </div>
        <div className="cmdk-footer">
          <span><kbd>↑↓</kbd> navegar</span>
          <span><kbd>↵</kbd> seleccionar</span>
          <span><kbd>esc</kbd> cerrar</span>
        </div>
      </div>
    </div>
  );
}
