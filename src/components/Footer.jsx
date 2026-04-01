import './Footer.css';

export default function Footer({ name }) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform?.includes('Mac');
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>&copy; {new Date().getFullYear()} {name}. Construido con pasión.</p>
        <p className="footer-hint">
          Presioná <kbd>{isMac ? '⌘' : 'Ctrl'}+K</kbd> para navegación rápida
        </p>
      </div>
    </footer>
  );
}
