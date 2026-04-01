import { useEffect, useRef } from 'react';

/**
 * Interactive 3D wireframe icosahedron rendered with canvas 2D.
 * No external dependencies — pure math + canvas.
 * Reacts to mouse movement & click.
 */
export default function Hero3D() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let mouse = { x: 0, y: 0 };
    let isHovered = false;
    let clickPulse = 0;
    let clickWave = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Generate icosahedron vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVerts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];
    // Normalize
    const vertices = rawVerts.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len, y / len, z / len];
    });

    // Icosahedron faces (triangles)
    const faces = [
      [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
      [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
      [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
      [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
    ];

    // Extract unique edges from faces
    const edgeSet = new Set();
    faces.forEach(([a, b, c]) => {
      [[a,b],[b,c],[a,c]].forEach(([i, j]) => {
        const key = Math.min(i, j) + '-' + Math.max(i, j);
        edgeSet.add(key);
      });
    });
    const edges = Array.from(edgeSet).map(k => k.split('-').map(Number));

    // Subdivide edges to get more detail points for particles
    const particleVerts = [];
    edges.forEach(([a, b]) => {
      for (let t = 0.2; t <= 0.8; t += 0.3) {
        const x = vertices[a][0] * (1 - t) + vertices[b][0] * t;
        const y = vertices[a][1] * (1 - t) + vertices[b][1] * t;
        const z = vertices[a][2] * (1 - t) + vertices[b][2] * t;
        const len = Math.sqrt(x * x + y * y + z * z);
        particleVerts.push([x / len * 1.15, y / len * 1.15, z / len * 1.15]);
      }
    });

    // Outer floating particles
    const outerParticles = [];
    for (let i = 0; i < 60; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phiA = Math.acos(2 * Math.random() - 1);
      const r = 1.3 + Math.random() * 0.5;
      outerParticles.push([
        r * Math.sin(phiA) * Math.cos(theta),
        r * Math.sin(phiA) * Math.sin(theta),
        r * Math.cos(phiA),
        Math.random() * Math.PI * 2, // phase for float animation
      ]);
    }

    function rotateY(v, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [v[0] * cos + v[2] * sin, v[1], -v[0] * sin + v[2] * cos];
    }

    function rotateX(v, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [v[0], v[1] * cos - v[2] * sin, v[1] * sin + v[2] * cos];
    }

    function project(v, w, h, scale) {
      const fov = 3.5;
      const z = v[2] + fov;
      const factor = fov / z;
      return [w / 2 + v[0] * scale * factor, h / 2 - v[1] * scale * factor, z];
    }

    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const time = performance.now() * 0.001;
      const baseScale = Math.min(w, h) * 0.28;

      // Mouse influence on rotation
      const rotY = time * 0.25 + mouse.x * 0.4;
      const rotX = time * 0.12 + mouse.y * 0.3;

      // Click pulse
      clickPulse *= 0.92;
      clickWave *= 0.95;
      const scale = baseScale * (1 + clickPulse * 0.15 + (isHovered ? 0.04 : 0));

      // Transform all vertices
      const transformed = vertices.map(v => {
        let r = rotateY(v, rotY);
        r = rotateX(r, rotX);
        return project(r, w, h, scale);
      });

      // Draw edges
      edges.forEach(([a, b]) => {
        const pa = transformed[a];
        const pb = transformed[b];
        const avgZ = (pa[2] + pb[2]) / 2;
        const depthAlpha = Math.max(0.08, Math.min(0.5, (avgZ - 1.5) / 3));
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.strokeStyle = `rgba(0, 240, 255, ${depthAlpha + clickWave * 0.3})`;
        ctx.lineWidth = 0.8 + clickWave * 0.5;
        ctx.stroke();
      });

      // Draw vertex dots
      transformed.forEach(p => {
        const depthAlpha = Math.max(0.15, Math.min(0.7, (p[2] - 1.5) / 3));
        const r = 2 + depthAlpha * 2 + clickWave * 2;
        ctx.beginPath();
        ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${depthAlpha + clickWave * 0.4})`;
        ctx.fill();
      });

      // Draw inner particle shell
      particleVerts.forEach(v => {
        let r = rotateY(v, rotY);
        r = rotateX(r, rotX);
        const p = project(r, w, h, scale);
        const alpha = Math.max(0.05, Math.min(0.3, (p[2] - 1.5) / 4));
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw outer floating particles
      outerParticles.forEach(([ox, oy, oz, phase]) => {
        const floatY = Math.sin(time * 0.8 + phase) * 0.08;
        const floatX = Math.cos(time * 0.6 + phase) * 0.05;
        let v = [ox + floatX, oy + floatY, oz];
        let r = rotateY(v, rotY * 0.4);
        r = rotateX(r, rotX * 0.4);
        const p = project(r, w, h, scale);
        const alpha = Math.max(0.05, Math.min(0.25, (p[2] - 1) / 4));
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.2 + Math.sin(time + phase) * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.fill();
      });

      // Center glow on click
      if (clickWave > 0.01) {
        const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, scale * clickWave * 3);
        gradient.addColorStop(0, `rgba(0, 240, 255, ${clickWave * 0.15})`);
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; mouse.x = 0; mouse.y = 0; };
    const onClick = () => { clickPulse = 1; clickWave = 1; };

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);
    wrap.addEventListener('click', onClick);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
      wrap.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={wrapRef}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
