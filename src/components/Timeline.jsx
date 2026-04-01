import './Timeline.css';

export default function Timeline({ data }) {
  const items = [
    ...data.experience.map((e) => ({ ...e, typeLabel: 'Experiencia' })),
    ...data.education.map((e) => ({ ...e, typeLabel: 'Educación' })),
    ...data.certifications.map((e) => ({ ...e, typeLabel: 'Certificación' })),
  ];

  return (
    <section className="section" id="experience" data-section>
      <div className="section-label">// 03. Experiencia</div>
      <h2 className="section-title">
        Trayectoria<br />
        <span className="accent-text">profesional</span>
      </h2>
      <div className="tl-zigzag">
        <div className="tl-line" aria-hidden="true" />
        {items.map((item, i) => (
          <div
            className={`tl-row ${i % 2 === 0 ? 'tl-left' : 'tl-right'}`}
            key={item.id || i}
          >
            <div className="tl-card">
              <div className="tl-period">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{item.period}</span>
              </div>
              <h3 className="tl-title">{item.title}</h3>
              <div className="tl-org">{item.org}</div>
              <p className="tl-desc">{item.description}</p>
              {item.typeLabel !== 'Experiencia' && (
                <span className="tl-badge">{item.typeLabel}</span>
              )}
            </div>
            <div className="tl-dot" />
          </div>
        ))}
      </div>
    </section>
  );
}
