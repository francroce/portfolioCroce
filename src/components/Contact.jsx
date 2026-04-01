import { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import './Contact.css';

const STEPS = [
  { key: 'name', prompt: 'ingresa tu nombre', type: 'text' },
  { key: 'email', prompt: 'ingresa tu email', type: 'email' },
  { key: 'message', prompt: 'escribí tu mensaje', type: 'text' },
];

export default function Contact({ data }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [lines, setLines] = useState([
    { type: 'system', text: 'Bienvenido al terminal de contacto.' },
    { type: 'system', text: 'Escribe tu mensaje para conectar.' },
  ]);
  const [input, setInput] = useState('');
  const [sent, setSent] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || sent) return;

    const currentStep = STEPS[step];
    const val = input.trim();

    // Add user input line
    const newLines = [
      ...lines,
      { type: 'input', prompt: currentStep.prompt, text: val },
    ];

    const newValues = { ...values, [currentStep.key]: val };
    setValues(newValues);
    setInput('');

    if (step < STEPS.length - 1) {
      setLines(newLines);
      setStep(step + 1);
    } else {
      // Show sending state
      setLines([
        ...newLines,
        { type: 'system', text: '' },
        { type: 'system', text: '→ Enviando mensaje...' },
      ]);
      setSent(true);

      // Send via Web3Forms (free email API, no backend needed)
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '8f45c158-f259-47c5-adbd-4684784f252d',
            from_name: newValues.name,
            email: newValues.email,
            subject: `Contacto desde portfolio — ${newValues.name}`,
            message: newValues.message,
            to: data.contact.email,
          }),
        });
        const result = await res.json();

        if (result.success) {
          setLines((prev) => [
            ...prev.slice(0, -1),
            { type: 'success', text: '→ Mensaje enviado correctamente.' },
            { type: 'system', text: `  De: ${newValues.name} <${newValues.email}>` },
            { type: 'system', text: `  Mensaje: "${newValues.message}"` },
            { type: 'system', text: '' },
            { type: 'accent', text: 'Gracias por escribir. Te respondo pronto.' },
          ]);
        } else {
          throw new Error('send failed');
        }
      } catch {
        // Fallback to mailto if API fails
        setLines((prev) => [
          ...prev.slice(0, -1),
          { type: 'system', text: '→ Abriendo cliente de correo como respaldo...' },
          { type: 'accent', text: 'Gracias por escribir. Te respondo pronto.' },
        ]);
        const subject = encodeURIComponent(`Contacto desde portfolio — ${newValues.name}`);
        const body = encodeURIComponent(`Nombre: ${newValues.name}\nEmail: ${newValues.email}\n\n${newValues.message}`);
        setTimeout(() => {
          window.open(`mailto:${data.contact.email}?subject=${subject}&body=${body}`, '_blank');
        }, 800);
      }
    }
  };

  const handleReset = () => {
    setStep(0);
    setValues({ name: '', email: '', message: '' });
    setInput('');
    setSent(false);
    setLines([
      { type: 'system', text: 'Terminal reiniciado.' },
      { type: 'system', text: 'Escribe tu mensaje para conectar.' },
    ]);
  };

  const currentPrompt = sent
    ? 'mensaje enviado ✓'
    : STEPS[step]?.prompt || '';

  return (
    <section className="contact-section" id="contact" data-section>
      <div className="contact-inner">
        <div className="section-label">// 05. Contacto</div>
        <h2 className="section-title">
          Hablemos de tu<br />
          <span className="accent-text">próximo proyecto</span>
        </h2>

        <div className="contact-layout">
          {/* Terminal */}
          <div className="terminal">
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="terminal-title">contact-terminal</span>
              {sent && (
                <button className="terminal-reset" onClick={handleReset}>
                  reiniciar
                </button>
              )}
            </div>
            <div className="terminal-body" ref={terminalRef} onClick={() => inputRef.current?.focus()}>
              {lines.map((line, i) => (
                <div key={i} className={`terminal-line ${line.type}`}>
                  {line.type === 'input' && (
                    <span className="terminal-prompt">
                      guest@portfolio:~$ {line.prompt} {'>'}{' '}
                    </span>
                  )}
                  {line.type === 'system' && (
                    <span className="terminal-system">{line.text}</span>
                  )}
                  {line.type === 'success' && (
                    <span className="terminal-success">{line.text}</span>
                  )}
                  {line.type === 'accent' && (
                    <span className="terminal-accent">{line.text}</span>
                  )}
                  {line.type === 'input' && (
                    <span className="terminal-user-input">{line.text}</span>
                  )}
                </div>
              ))}

              {/* Active input line */}
              {!sent && (
                <div className="terminal-line active">
                  <span className="terminal-prompt">
                    guest@portfolio:~$ {currentPrompt} {'>'}{' '}
                  </span>
                  <span className="terminal-input-wrapper">
                    <span className="terminal-input-text">{input}</span>
                    <span className="terminal-cursor" />
                  </span>
                </div>
              )}

              {/* Hidden real input */}
              <form onSubmit={handleSubmit} className="terminal-form">
                <input
                  ref={inputRef}
                  type={STEPS[step]?.type || 'text'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sent}
                  autoFocus
                  className="terminal-hidden-input"
                />
              </form>
            </div>
          </div>

          {/* Social sidebar */}
          <div className="contact-socials-col">
            {data.contact.github && (
              <a href={data.contact.github} className="contact-social-btn" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                {Icons.github}
              </a>
            )}
            {data.contact.linkedin && (
              <a href={data.contact.linkedin} className="contact-social-btn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                {Icons.linkedin}
              </a>
            )}
            {data.contact.twitter && (
              <a href={data.contact.twitter} className="contact-social-btn" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            <a href={`mailto:${data.contact.email}`} className="contact-social-btn" aria-label="Email">
              {Icons.mail}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
