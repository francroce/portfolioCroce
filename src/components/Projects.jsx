import { useMemo } from 'react';
import { Icons } from './Icons';
import { generateProjectSVG } from '../utils/generateSVG';
import './Projects.css';

export default function Projects({ data }) {
  return (
    <section className="section" id="projects" data-section>
      <div className="section-label">// 04. Portfolio</div>
      <h2 className="section-title">Proyectos</h2>
      <div className="projects-grid">
        {data.projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project: p }) {
  const svgMarkup = useMemo(
    () => generateProjectSVG(p.id, p.tags),
    [p.id, p.tags]
  );

  return (
    <article className={`project-card ${p.featured ? 'featured' : ''}`}>
      <div className="project-image">
        {p.featured && (
          <div className="project-featured-badge">
            {Icons.star} Destacado
          </div>
        )}
        {p.image ? (
          <img src={p.image} alt={p.title} className="project-img" />
        ) : (
          <div
            className="project-gen-svg"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        )}
      </div>
      <div className="project-body">
        <h3 className="project-title">{p.title}</h3>
        <p className="project-desc">{p.description}</p>
        <div className="project-tags">
          {p.tags.map((t, i) => (
            <span className="project-tag" key={i}>{t}</span>
          ))}
        </div>
        <div className="project-links">
          {p.github && (
            <a
              href={p.github}
              className="project-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {Icons.github} <span>Código</span>
            </a>
          )}
          {p.link && (
            <a
              href={p.link}
              className="project-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {Icons.arrow} <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
