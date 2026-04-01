/**
 * Generates a unique procedural SVG visual based on a seed string.
 * Each project gets a distinct abstract pattern.
 */

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateProjectSVG(id, tags = []) {
  const seed = hashCode(id || 'default');
  const rand = seededRandom(seed);

  const w = 400;
  const h = 240;
  const accentR = 0, accentG = 240, accentB = 255;

  // Decide pattern type based on seed
  const patterns = ['circuits', 'orbits', 'mesh', 'waves', 'nodes'];
  const pattern = patterns[seed % patterns.length];

  let elements = '';

  if (pattern === 'circuits') {
    // Circuit board pattern
    for (let i = 0; i < 12; i++) {
      const x1 = rand() * w;
      const y1 = rand() * h;
      const x2 = x1 + (rand() - 0.5) * 160;
      const y2 = y1 + (rand() - 0.5) * 100;
      const opacity = rand() * 0.2 + 0.05;
      elements += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgb(${accentR},${accentG},${accentB})" stroke-width="${rand() * 1.5 + 0.5}" opacity="${opacity}"/>`;
      // Nodes at joints
      elements += `<circle cx="${x1}" cy="${y1}" r="${rand() * 3 + 1}" fill="rgb(${accentR},${accentG},${accentB})" opacity="${opacity + 0.1}"/>`;
    }
    // Right angles
    for (let i = 0; i < 6; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const len = rand() * 60 + 20;
      const opacity = rand() * 0.15 + 0.05;
      elements += `<path d="M${x},${y} L${x + len},${y} L${x + len},${y + len * 0.6}" fill="none" stroke="rgb(${accentR},${accentG},${accentB})" stroke-width="0.8" opacity="${opacity}"/>`;
    }
  } else if (pattern === 'orbits') {
    // Concentric orbital rings
    const cx = w * 0.5 + (rand() - 0.5) * 80;
    const cy = h * 0.5 + (rand() - 0.5) * 40;
    for (let i = 0; i < 5; i++) {
      const rx = 30 + i * 35 + rand() * 15;
      const ry = 20 + i * 22 + rand() * 10;
      const rot = rand() * 30 - 15;
      const opacity = 0.08 + rand() * 0.1;
      elements += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="rgb(${accentR},${accentG},${accentB})" stroke-width="0.7" opacity="${opacity}" transform="rotate(${rot},${cx},${cy})"/>`;
    }
    // Orbital dots
    for (let i = 0; i < 8; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = 30 + rand() * 130;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist * 0.6;
      const r = rand() * 3 + 1;
      elements += `<circle cx="${x}" cy="${y}" r="${r}" fill="rgb(${accentR},${accentG},${accentB})" opacity="${rand() * 0.3 + 0.1}"/>`;
    }
  } else if (pattern === 'mesh') {
    // Triangulated mesh
    const points = [];
    for (let i = 0; i < 20; i++) {
      points.push({ x: rand() * w, y: rand() * h });
    }
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          elements += `<line x1="${points[i].x}" y1="${points[i].y}" x2="${points[j].x}" y2="${points[j].y}" stroke="rgb(${accentR},${accentG},${accentB})" stroke-width="0.6" opacity="${opacity}"/>`;
        }
      }
    }
    for (const p of points) {
      elements += `<circle cx="${p.x}" cy="${p.y}" r="${rand() * 2 + 0.8}" fill="rgb(${accentR},${accentG},${accentB})" opacity="${rand() * 0.25 + 0.08}"/>`;
    }
  } else if (pattern === 'waves') {
    // Sine waves
    for (let w_i = 0; w_i < 6; w_i++) {
      const amplitude = 15 + rand() * 30;
      const freq = 0.01 + rand() * 0.02;
      const phase = rand() * Math.PI * 2;
      const yBase = 30 + w_i * 35;
      const opacity = 0.06 + rand() * 0.12;
      let d = '';
      for (let x = 0; x <= w; x += 4) {
        const y = yBase + Math.sin(x * freq + phase) * amplitude;
        d += x === 0 ? `M${x},${y}` : ` L${x},${y}`;
      }
      elements += `<path d="${d}" fill="none" stroke="rgb(${accentR},${accentG},${accentB})" stroke-width="0.8" opacity="${opacity}"/>`;
    }
  } else {
    // Nodes — connected graph
    const nodes = [];
    for (let i = 0; i < 15; i++) {
      nodes.push({ x: rand() * w, y: rand() * h, r: rand() * 4 + 1.5 });
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          elements += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="rgb(${accentR},${accentG},${accentB})" stroke-width="0.5" opacity="${(1 - dist / 130) * 0.2}"/>`;
        }
      }
    }
    for (const n of nodes) {
      elements += `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="rgb(${accentR},${accentG},${accentB})" opacity="${rand() * 0.2 + 0.08}"/>`;
      // Pulsing ring on some
      if (rand() > 0.6) {
        elements += `<circle cx="${n.x}" cy="${n.y}" r="${n.r + 6}" fill="none" stroke="rgb(${accentR},${accentG},${accentB})" stroke-width="0.4" opacity="0.08"/>`;
      }
    }
  }

  // Tag labels as faint overlay text
  const tagStr = tags.slice(0, 3).join(' · ');
  if (tagStr) {
    elements += `<text x="${w - 12}" y="${h - 12}" text-anchor="end" font-family="monospace" font-size="9" fill="rgb(${accentR},${accentG},${accentB})" opacity="0.15">${tagStr}</text>`;
  }

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <rect width="${w}" height="${h}" fill="#111113"/>
    ${elements}
  </svg>`;
}
