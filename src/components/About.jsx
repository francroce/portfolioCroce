import './About.css';

const STAT_ICONS = [
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/></svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
];

export default function About({ data }) {
  return (
    <section className="section" id="about" data-section>
      <div className="section-label">// 01. Sobre mí</div>
      <h2 className="section-title">{data.about.heading}</h2>
      <div className="about-grid">
        <div className="about-left">
          <p className="about-text">{data.about.text}</p>
          <div className="about-code">
            <span className="code-keyword">const</span>{' '}
            <span className="code-var">focus</span>{' '}
            <span className="code-op">=</span> [
            <br />
            {'  '}<span className="code-string">'UI/UX'</span>,
            <br />
            {'  '}<span className="code-string">'Performance'</span>,
            <br />
            {'  '}<span className="code-string">'Clean Code'</span>
            <br />
            ];
          </div>
        </div>
        <div className="about-stats-grid">
          {data.about.stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">
                {STAT_ICONS[i % STAT_ICONS.length]}
              </div>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
