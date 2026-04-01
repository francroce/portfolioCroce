import { useState, useEffect, useRef } from 'react';
import './Skills.css';

export default function Skills({ data }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section className="section" id="skills" data-section ref={ref}>
      <div className="section-label">// 02. Habilidades</div>
      <h2 className="section-title">Lo que manejo</h2>
      <div className="skills-categories">
        {categories.map((cat) => (
          <div className="skills-category" key={cat}>
            <h3 className="skills-category-label">{cat}</h3>
            <div className="skills-list">
              {data.skills
                .filter((s) => s.category === cat)
                .map((s, i) => (
                  <div
                    className="skill-item"
                    key={i}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="skill-header">
                      <span className="skill-name">{s.name}</span>
                      <span className="skill-level">{s.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-bar-fill"
                        style={{ width: visible ? `${s.level}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
