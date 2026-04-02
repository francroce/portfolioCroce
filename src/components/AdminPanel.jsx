import { useState, useEffect, useCallback } from 'react';
import { Icons } from './Icons';
import { uid } from '../utils/uid';
import { storage } from '../utils/storage';
import './AdminPanel.css';

// Helper to read a nested value by dot path
function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => o[isNaN(k) ? k : parseInt(k)], obj);
}

// Field component defined OUTSIDE to avoid remounting on every render
function Field({ label, path, textarea, placeholder, draft, update }) {
  const value = getByPath(draft, path);
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {textarea ? (
        <textarea
          className="admin-textarea"
          value={value}
          onChange={(e) => update(path, e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="admin-input"
          value={value}
          onChange={(e) => update(path, e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export default function AdminPanel({ data, setData, open, onClose }) {
  const [tab, setTab] = useState('hero');
  const [draft, setDraft] = useState(structuredClone(data));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setDraft(structuredClone(data));
  }, [data, open]);

  const update = useCallback((path, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
        obj = obj[k];
      }
      const lastKey = isNaN(keys.at(-1)) ? keys.at(-1) : parseInt(keys.at(-1));
      obj[lastKey] = value;
      return next;
    });
  }, []);

  const addItem = (arrayPath, template) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      const keys = arrayPath.split('.');
      let arr = next;
      for (const k of keys) arr = arr[isNaN(k) ? k : parseInt(k)];
      arr.push({ ...template, id: uid() });
      return next;
    });
  };

  const removeItem = (arrayPath, index) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      const keys = arrayPath.split('.');
      let arr = next;
      for (const k of keys) arr = arr[isNaN(k) ? k : parseInt(k)];
      arr.splice(index, 1);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setData(draft);
    await storage.set(draft);
    setTimeout(() => { setSaving(false); onClose(); }, 300);
  };

  const reset = async () => {
    if (confirm('¿Resetear todo a los datos por defecto? Esto borrará todos tus cambios.')) {
      const { DEFAULT_DATA } = await import('../data/defaultData.js');
      setData(structuredClone(DEFAULT_DATA));
      setDraft(structuredClone(DEFAULT_DATA));
      await storage.remove();
      onClose();
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'Sobre mí' },
    { id: 'skills', label: 'Skills' },
    { id: 'timeline', label: 'Trayectoria' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <>
      {open && <div className="admin-overlay" onClick={onClose} />}
      <div className={`admin-panel ${open ? 'open' : ''}`}>
        <div className="admin-header">
          <h2>Panel Admin</h2>
          <button className="admin-close" onClick={onClose} aria-label="Cerrar">
            {Icons.close}
          </button>
        </div>

        <div className="admin-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="admin-body">
          {/* ── Hero ── */}
          {tab === 'hero' && (
            <div className="admin-section">
              <div className="admin-section-title">Hero Section</div>
              <Field draft={draft} update={update} label="Saludo" path="hero.greeting" placeholder="Hola, soy" />
              <Field draft={draft} update={update} label="Nombre" path="hero.name" placeholder="Tu nombre" />
              <Field draft={draft} update={update} label="Título profesional" path="hero.title" />
              <Field draft={draft} update={update} label="Tagline" path="hero.tagline" textarea />
              <div className="admin-row">
                <Field draft={draft} update={update} label="CTA Principal" path="hero.cta" />
                <Field draft={draft} update={update} label="CTA Secundario" path="hero.ctaSecondary" />
              </div>
            </div>
          )}

          {/* ── About ── */}
          {tab === 'about' && (
            <div className="admin-section">
              <div className="admin-section-title">Sobre Mí</div>
              <Field draft={draft} update={update} label="Heading" path="about.heading" />
              <Field draft={draft} update={update} label="Descripción" path="about.text" textarea />
              <div className="admin-section-title" style={{ marginTop: 20 }}>
                Estadísticas
              </div>
              {draft.about.stats.map((_, i) => (
                <div className="admin-item-card" key={i}>
                  <button
                    className="admin-delete-btn"
                    onClick={() => removeItem('about.stats', i)}
                    aria-label="Eliminar"
                  >
                    {Icons.trash}
                  </button>
                  <div className="admin-row">
                    <Field draft={draft} update={update} label="Valor" path={`about.stats.${i}.value`} placeholder="10+" />
                    <Field draft={draft} update={update} label="Label" path={`about.stats.${i}.label`} placeholder="Proyectos" />
                  </div>
                </div>
              ))}
              <button
                className="admin-add-btn"
                onClick={() => addItem('about.stats', { value: '0', label: 'Nuevo' })}
              >
                {Icons.plus} Agregar stat
              </button>
            </div>
          )}

          {/* ── Skills ── */}
          {tab === 'skills' && (
            <div className="admin-section">
              <div className="admin-section-title">Skills</div>
              {draft.skills.map((s, i) => (
                <div className="admin-item-card" key={i}>
                  <button
                    className="admin-delete-btn"
                    onClick={() => removeItem('skills', i)}
                    aria-label="Eliminar"
                  >
                    {Icons.trash}
                  </button>
                  <div className="admin-row">
                    <Field draft={draft} update={update} label="Nombre" path={`skills.${i}.name`} />
                    <Field draft={draft} update={update} label="Categoría" path={`skills.${i}.category`} placeholder="Frontend" />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">
                      Nivel: {draft.skills[i].level}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={draft.skills[i].level}
                      onChange={(e) => update(`skills.${i}.level`, parseInt(e.target.value))}
                      className="admin-range"
                    />
                  </div>
                </div>
              ))}
              <button
                className="admin-add-btn"
                onClick={() => addItem('skills', { name: 'Nueva skill', level: 50, category: 'General' })}
              >
                {Icons.plus} Agregar skill
              </button>
            </div>
          )}

          {/* ── Timeline ── */}
          {tab === 'timeline' && (
            <div className="admin-section">
              {/* Experience */}
              <div className="admin-section-title">Experiencia</div>
              {draft.experience.map((e, i) => (
                <div className="admin-item-card" key={e.id}>
                  <button
                    className="admin-delete-btn"
                    onClick={() => removeItem('experience', i)}
                    aria-label="Eliminar"
                  >
                    {Icons.trash}
                  </button>
                  <Field draft={draft} update={update} label="Título" path={`experience.${i}.title`} />
                  <div className="admin-row">
                    <Field draft={draft} update={update} label="Organización" path={`experience.${i}.org`} />
                    <Field draft={draft} update={update} label="Período" path={`experience.${i}.period`} placeholder="2023 — Presente" />
                  </div>
                  <Field draft={draft} update={update} label="Descripción" path={`experience.${i}.description`} textarea />
                </div>
              ))}
              <button
                className="admin-add-btn"
                onClick={() =>
                  addItem('experience', {
                    type: 'experience', title: '', org: '', period: '', description: '',
                  })
                }
              >
                {Icons.plus} Agregar experiencia
              </button>

              {/* Education */}
              <div className="admin-section-title" style={{ marginTop: 24 }}>
                Educación
              </div>
              {draft.education.map((e, i) => (
                <div className="admin-item-card" key={e.id}>
                  <button
                    className="admin-delete-btn"
                    onClick={() => removeItem('education', i)}
                    aria-label="Eliminar"
                  >
                    {Icons.trash}
                  </button>
                  <Field draft={draft} update={update} label="Título" path={`education.${i}.title`} />
                  <div className="admin-row">
                    <Field draft={draft} update={update} label="Institución" path={`education.${i}.org`} />
                    <Field draft={draft} update={update} label="Período" path={`education.${i}.period`} />
                  </div>
                  <Field draft={draft} update={update} label="Descripción" path={`education.${i}.description`} textarea />
                </div>
              ))}
              <button
                className="admin-add-btn"
                onClick={() =>
                  addItem('education', {
                    type: 'education', title: '', org: '', period: '', description: '',
                  })
                }
              >
                {Icons.plus} Agregar educación
              </button>

              {/* Certifications */}
              <div className="admin-section-title" style={{ marginTop: 24 }}>
                Certificaciones
              </div>
              {draft.certifications.map((e, i) => (
                <div className="admin-item-card" key={e.id}>
                  <button
                    className="admin-delete-btn"
                    onClick={() => removeItem('certifications', i)}
                    aria-label="Eliminar"
                  >
                    {Icons.trash}
                  </button>
                  <Field draft={draft} update={update} label="Título" path={`certifications.${i}.title`} />
                  <div className="admin-row">
                    <Field draft={draft} update={update} label="Organización" path={`certifications.${i}.org`} />
                    <Field draft={draft} update={update} label="Período" path={`certifications.${i}.period`} />
                  </div>
                  <Field draft={draft} update={update} label="Descripción" path={`certifications.${i}.description`} textarea />
                </div>
              ))}
              <button
                className="admin-add-btn"
                onClick={() =>
                  addItem('certifications', {
                    type: 'certification', title: '', org: '', period: '', description: '',
                  })
                }
              >
                {Icons.plus} Agregar certificación
              </button>
            </div>
          )}

          {/* ── Projects ── */}
          {tab === 'projects' && (
            <div className="admin-section">
              <div className="admin-section-title">Proyectos</div>
              {draft.projects.map((p, i) => (
                <div className="admin-item-card" key={p.id}>
                  <button
                    className="admin-delete-btn"
                    onClick={() => removeItem('projects', i)}
                    aria-label="Eliminar"
                  >
                    {Icons.trash}
                  </button>
                  <Field draft={draft} update={update} label="Título" path={`projects.${i}.title`} />
                  <Field draft={draft} update={update} label="Descripción" path={`projects.${i}.description`} textarea />
                  <div className="admin-field">
                    <label className="admin-label">Tags (separados por coma)</label>
                    <input
                      className="admin-input"
                      value={draft.projects[i].tags.join(', ')}
                      onChange={(e) =>
                        update(
                          `projects.${i}.tags`,
                          e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                        )
                      }
                      placeholder="React, Python, AI"
                    />
                  </div>
                  <Field draft={draft} update={update} label="URL imagen" path={`projects.${i}.image`} placeholder="https://..." />
                  <div className="admin-row">
                    <Field draft={draft} update={update} label="Link Demo" path={`projects.${i}.link`} placeholder="https://..." />
                    <Field draft={draft} update={update} label="GitHub" path={`projects.${i}.github`} placeholder="https://github.com/..." />
                  </div>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={draft.projects[i].featured}
                      onChange={(e) => update(`projects.${i}.featured`, e.target.checked)}
                    />
                    Proyecto destacado
                  </label>
                </div>
              ))}
              <button
                className="admin-add-btn"
                onClick={() =>
                  addItem('projects', {
                    title: 'Nuevo Proyecto',
                    description: '',
                    tags: [],
                    image: '',
                    link: '',
                    github: '',
                    featured: false,
                  })
                }
              >
                {Icons.plus} Agregar proyecto
              </button>
            </div>
          )}

          {/* ── Contact ── */}
          {tab === 'contact' && (
            <div className="admin-section">
              <div className="admin-section-title">Contacto</div>
              <Field draft={draft} update={update} label="Heading" path="contact.heading" />
              <Field draft={draft} update={update} label="Texto" path="contact.text" textarea />
              <Field draft={draft} update={update} label="Email" path="contact.email" placeholder="tu@email.com" />
              <Field draft={draft} update={update} label="GitHub URL" path="contact.github" placeholder="https://github.com/..." />
              <Field draft={draft} update={update} label="LinkedIn URL" path="contact.linkedin" placeholder="https://linkedin.com/in/..." />
              <Field draft={draft} update={update} label="Twitter/X URL" path="contact.twitter" placeholder="https://x.com/..." />
            </div>
          )}
        </div>

        <div className="admin-save-bar">
          <button className="admin-save-btn" onClick={save} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button className="admin-reset-btn" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
