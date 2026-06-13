import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Pastel wall color per house (daytime theme)
const HOUSE_COLORS = {
  about:      0xfdba74,  // peach
  projects:   0xc4b5fd,  // lavender
  skills:     0x93c5fd,  // sky blue
  experience: 0x86efac,  // mint
  certs:      0xfda4af,  // rose pink
  contact:    0xfde68a,  // soft yellow
};

// ── House data — one per portfolio section ───────────────────────────────────
const HOUSES = [
  {
    id: 'about',
    label: 'ABOUT',
    pos: [0, 0, -17],
    panel: {
      title: 'Bryanna Reid',
      subtitle: 'SWE → AppSec Engineer',
      items: [
        { k: 'Education', v: 'B.S. CS — University of Chicago' },
        { k: 'Currently',  v: 'Software Engineer @ Pacific Life' },
        { k: 'Focus',      v: 'AppSec · DevSecOps · Cloud Security' },
        { k: 'Certs',      v: 'CompTIA Security+ · Google Data Analytics' },
      ],
    },
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    pos: [17, 0, 0],
    panel: {
      title: 'Security Projects',
      subtitle: 'Real tools, not tutorials',
      items: [
        { k: 'CloudSentinel', v: '30-check AWS misconfiguration scanner (Python, boto3)' },
        { k: 'SecurePipe',    v: 'DevSecOps GitHub Actions pipeline (Semgrep, Trivy)' },
        { k: 'VulnAPI',       v: 'OWASP API Top 10 lab + automated scanner (FastAPI)' },
        { k: 'IAMSight',      v: 'AWS IAM over-privilege analyzer (Python, CloudTrail)' },
      ],
    },
  },
  {
    id: 'skills',
    label: 'SKILLS',
    pos: [-17, 0, 0],
    panel: {
      title: 'Skills & Tools',
      subtitle: 'Only what I can defend in an interview',
      items: [
        { k: 'Security',  v: 'OWASP Top 10, SAST/DAST, Burp Suite, Semgrep, CIS Benchmarks' },
        { k: 'Cloud',     v: 'AWS (IAM · S3 · EC2 · RDS), GCP, Terraform' },
        { k: 'Dev',       v: 'Python, Go, React, FastAPI, Docker, CI/CD' },
        { k: 'Practice',  v: 'TryHackMe, CTFs, offensive security techniques' },
      ],
    },
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    pos: [0, 0, 17],
    panel: {
      title: 'Experience',
      subtitle: 'The path here',
      items: [
        { k: '2026 – now',   v: 'Software Engineer @ Pacific Life' },
        { k: '2025 – 2026',  v: 'AI Instructor @ High School (90+ students, 85% cert pass rate)' },
        { k: '2024 – 2025',  v: 'Data Analytics Intern' },
        { k: '2020 – 2024',  v: 'B.S. Computer Science @ University of Chicago' },
      ],
    },
  },
  {
    id: 'certs',
    label: 'CERTS',
    pos: [12, 0, 12],
    panel: {
      title: 'Certifications',
      subtitle: 'Active & planned',
      items: [
        { k: '✅ Active',  v: 'CompTIA Security+ (2026)' },
        { k: '✅ Active',  v: 'Google Data Analytics (2024)' },
        { k: '🎯 In Progress', v: 'eJPT (eLearnSecurity / INE)' },
        { k: '🎯 Planned', v: 'AWS Security Specialty' },
      ],
    },
  },
  {
    id: 'contact',
    label: 'CONTACT',
    pos: [-12, 0, 12],
    panel: {
      title: 'Get In Touch',
      subtitle: 'Open to AppSec & Cloud Security roles',
      items: [
        { k: 'GitHub',   v: 'github.com/bryreid026' },
        { k: 'LinkedIn', v: 'linkedin.com/in/bryanna-reid' },
        { k: 'Status',   v: '🟢 Open to opportunities' },
        { k: 'Focus',    v: 'AppSec · Cloud Security · DevSecOps' },
      ],
    },
  },
];

// ── Floating text label (canvas texture sprite) ──────────────────────────────
function makeLabel(text, wallColor) {
  const c = document.createElement('canvas');
  c.width = 320; c.height = 72;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 320, 72);
  // white pill with colored border
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.roundRect(6, 6, 308, 60, 12);
  ctx.fill();
  // border in house color
  const r = (wallColor >> 16) & 0xff;
  const g = (wallColor >> 8) & 0xff;
  const b = wallColor & 0xff;
  ctx.strokeStyle = `rgba(${r},${g},${b},0.8)`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(6, 6, 308, 60, 12);
  ctx.stroke();
  // dark text
  ctx.font = 'bold 26px monospace';
  ctx.fillStyle = '#1c1917';
  ctx.textAlign = 'center';
  ctx.fillText(text, 160, 43);
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
  );
  sp.scale.set(5.5, 1.2, 1);
  return sp;
}

// ── Blocky character (coral / peach tones) ────────────────────────────────────
function makeCharacter() {
  const g = new THREE.Group();
  const m = c => new THREE.MeshBasicMaterial({ color: c });

  // Head — peach skin
  // Head center = 1.52, head spans y 1.23–1.81
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.58, 0.58), m(0xc68642));
  head.position.y = 1.52;
  g.add(head);

  // Eyes — two separate circles in the upper half of the face
  // y=1.665 = halfway between head center (1.52) and top (1.81) → proper eye level
  [[-0.12], [0.12]].forEach(([ex]) => {
    const eye = new THREE.Mesh(new THREE.CircleGeometry(0.075, 8), m(0x1c1917));
    eye.position.set(ex, 1.665, 0.3);
    g.add(eye);
    // Eye shine — small white dot for a lively look
    const shine = new THREE.Mesh(new THREE.CircleGeometry(0.026, 6), m(0xffffff));
    shine.position.set(ex + 0.022, 1.682, 0.301);
    g.add(shine);
  });

  // Eyelashes — tiny strokes above each eye
  [[-0.12], [0.12]].forEach(([ex]) => {
    [-0.05, 0, 0.05].forEach(offset => {
      const lash = new THREE.Mesh(new THREE.PlaneGeometry(0.022, 0.055), m(0x1c1917));
      lash.position.set(ex + offset, 1.738, 0.3);
      g.add(lash);
    });
  });

  // Blush marks — cheeks sit just below the eyes
  [[-0.21, 1.55], [0.21, 1.55]].forEach(([bx, by]) => {
    const blush = new THREE.Mesh(new THREE.CircleGeometry(0.07, 8), m(0xfca5a5));
    blush.position.set(bx, by, 0.3);
    g.add(blush);
  });

  // Curly hair — long, flowing cluster of spheres
  const hairMat = m(0x2c1810); // dark chocolate brown
  const curls = [
    // [x,     y,     z,     radius]
    // ── Crown & top volume ──────────────────────────────────────────
    [ 0,     2.02,  0,     0.24],
    [-0.18,  1.97,  0.07,  0.20],
    [ 0.18,  1.97,  0.07,  0.20],
    [-0.24,  1.90, -0.02,  0.17],
    [ 0.24,  1.90, -0.02,  0.17],
    [ 0,     1.94, -0.15,  0.18],
    [ 0,     1.91,  0.17,  0.17],
    [-0.12,  2.12,  0.04,  0.14],  // top wisps
    [ 0.12,  2.12,  0.04,  0.14],
    [ 0.02,  2.18, -0.02,  0.12],
    // ── Upper sides ─────────────────────────────────────────────────
    [-0.33,  1.84,  0.04,  0.16],
    [ 0.33,  1.84,  0.04,  0.16],
    [-0.34,  1.76, -0.08,  0.15],
    [ 0.34,  1.76, -0.08,  0.15],
    [-0.30,  1.78,  0.12,  0.14],
    [ 0.30,  1.78,  0.12,  0.14],
    // ── Mid-length — falls to jaw level ─────────────────────────────
    [-0.34,  1.62,  0.02,  0.15],
    [ 0.34,  1.62,  0.02,  0.15],
    [-0.32,  1.52, -0.05,  0.14],
    [ 0.32,  1.52, -0.05,  0.14],
    [-0.30,  1.43,  0.08,  0.13],
    [ 0.30,  1.43,  0.08,  0.13],
    // ── Back curtain — dense coverage so head box never peeks through ──
    // Upper back
    [ 0,     1.80, -0.18,  0.17],
    [-0.18,  1.78, -0.15,  0.15],
    [ 0.18,  1.78, -0.15,  0.15],
    [-0.10,  1.74, -0.24,  0.15],
    [ 0.10,  1.74, -0.24,  0.15],
    // Upper-back corners — dense patch left & right
    [-0.30,  1.84, -0.06,  0.18],
    [ 0.30,  1.84, -0.06,  0.18],
    [-0.32,  1.79, -0.10,  0.18],
    [ 0.32,  1.79, -0.10,  0.18],
    [-0.32,  1.73, -0.14,  0.17],
    [ 0.32,  1.73, -0.14,  0.17],
    [-0.30,  1.67, -0.18,  0.17],
    [ 0.30,  1.67, -0.18,  0.17],
    [-0.28,  1.80, -0.18,  0.15],
    [ 0.28,  1.80, -0.18,  0.15],
    [-0.26,  1.74, -0.22,  0.15],
    [ 0.26,  1.74, -0.22,  0.15],
    // Mid-upper back
    [ 0,     1.68, -0.28,  0.16],
    [-0.20,  1.66, -0.20,  0.15],
    [ 0.20,  1.66, -0.20,  0.15],
    [-0.14,  1.70, -0.28,  0.14],
    [ 0.14,  1.70, -0.28,  0.14],
    // Mid back
    [ 0,     1.60, -0.30,  0.16],
    [-0.22,  1.58, -0.18,  0.14],
    [ 0.22,  1.58, -0.18,  0.14],
    [-0.16,  1.50, -0.26,  0.14],
    [ 0.16,  1.50, -0.26,  0.14],
    // Lower back
    [ 0,     1.40, -0.27,  0.14],
    [-0.18,  1.42, -0.20,  0.13],
    [ 0.18,  1.42, -0.20,  0.13],
    // ── Long ends — shoulder length ──────────────────────────────────
    [-0.28,  1.30,  0.04,  0.13],
    [ 0.28,  1.30,  0.04,  0.13],
    [-0.22,  1.22, -0.10,  0.12],
    [ 0.22,  1.22, -0.10,  0.12],
    [ 0,     1.28, -0.22,  0.13],
    [-0.14,  1.14,  0.02,  0.11],
    [ 0.14,  1.14,  0.02,  0.11],
    [ 0,     1.16, -0.18,  0.11],
  ];
  curls.forEach(([cx, cy, cz, r]) => {
    const curl = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 7), hairMat);
    curl.position.set(cx, cy, cz);
    g.add(curl);
  });

  // Shirt — coral top (bottom edge at y≈0.69)
  const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.60, 0.42), m(0xfb923c));
  shirt.position.y = 0.99;
  g.add(shirt);

  // Belt — thin dark strip at waist
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.07, 0.44), m(0x78350f));
  belt.position.y = 0.685;
  g.add(belt);

  // Jeans — two separate legs in blue denim (top at y≈0.67, bottom at y≈-0.18)
  [[-0.16, 0], [0.16, Math.PI]].forEach(([x, phase]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.86, 0.28), m(0x3b82f6));
    leg.position.set(x, 0.245, 0);
    leg.userData = { isLimb: true, phase };
    g.add(leg);
  });

  // Shoes — white sneakers with a darker sole strip
  [[-0.16, 0], [0.16, Math.PI]].forEach(([x]) => {
    // Sole
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.32), m(0x9ca3af));
    sole.position.set(x, -0.245, 0.02);
    g.add(sole);
    // Upper
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.30), m(0xf8fafc));
    upper.position.set(x, -0.185, 0.02);
    g.add(upper);
  });

  // Arms — peach skin
  [[-0.46, Math.PI], [0.46, 0]].forEach(([x, phase]) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.52, 0.19), m(0xc68642));
    arm.position.set(x, 0.95, 0);
    arm.userData = { isLimb: true, phase };
    g.add(arm);
  });

  return g;
}

// ── House mesh (pastel daytime) ────────────────────────────────────────────────
function makeHouse(h) {
  const g = new THREE.Group();
  const wallColor = HOUSE_COLORS[h.id] || 0xfdba74;

  // Walls — pastel color per house
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 3.2, 4.6),
    new THREE.MeshBasicMaterial({ color: wallColor })
  );
  walls.position.y = 1.6;
  g.add(walls);

  // Roof — warm terracotta / darker shade
  const roofColor = Math.floor(wallColor * 0.75);
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.6, 2.1, 4),
    new THREE.MeshBasicMaterial({ color: roofColor })
  );
  roof.position.y = 4.25;
  roof.rotation.y = Math.PI / 4;
  g.add(roof);

  // Door — warm brown
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 1.5, 0.08),
    new THREE.MeshBasicMaterial({ color: 0xc2813f })
  );
  door.position.set(0, 0.75, 2.34);
  g.add(door);

  // Door knob
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  knob.position.set(0.32, 0.72, 2.39);
  g.add(knob);

  // Windows — warm white/cream, will be animated
  const winMat = () => new THREE.MeshBasicMaterial({ color: 0xfef9c3, transparent: true, opacity: 0.9 });
  const w1 = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.75), winMat());
  w1.position.set(-1.15, 1.9, 2.31);
  const w2 = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.75), winMat());
  w2.position.set(1.15, 1.9, 2.31);
  g.add(w1, w2);

  // Window frames
  [[w1, -1.15], [w2, 1.15]].forEach(([w, wx]) => {
    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.9, 0.75)),
      new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true })
    );
    frame.position.set(wx, 1.9, 2.32);
    g.add(frame);
  });

  // Ground shadow / glow (soft pastel circle)
  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(5, 32),
    new THREE.MeshBasicMaterial({ color: wallColor, transparent: true, opacity: 0.08 })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.005;
  g.add(glow);

  // Flower pots (decorative cylinders either side of door)
  [-1.2, 1.2].forEach(ox => {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 0.3, 8),
      new THREE.MeshBasicMaterial({ color: 0xf97316 })
    );
    pot.position.set(ox, 0.15, 2.4);
    g.add(pot);
    const plant = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0x4ade80 })
    );
    plant.position.set(ox, 0.45, 2.4);
    g.add(plant);
  });

  // Label sprite
  const label = makeLabel(h.label, wallColor);
  label.position.y = 6.6;
  g.add(label);

  // Rotate so door faces origin
  const [px, , pz] = h.pos;
  g.rotation.y = Math.atan2(-px, -pz);
  g.position.set(...h.pos);
  g.userData = { id: h.id, windows: [w1, w2], glow };
  return g;
}

// ── Path strip between two XZ points ─────────────────────────────────────────
function makePath(x1, z1, x2, z2) {
  const dx = x2 - x1, dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dz * dz);
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, len),
    new THREE.MeshBasicMaterial({ color: 0xfef9c3, transparent: true, opacity: 0.75 })
  );
  path.rotation.x = -Math.PI / 2;
  path.rotation.z = -Math.atan2(dx, dz);
  path.position.set((x1 + x2) / 2, 0.004, (z1 + z2) / 2);
  return path;
}

// ══════════════════════════════════════════════════════════════════════════════
export default function WorldHero() {
  const canvasRef  = useRef(null);
  const activeRef  = useRef(null);
  const [panel, setPanel]   = useState(null);  // current house panel data
  const [hint, setHint]     = useState('');    // house name chip

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xbae6fd); // sky blue

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xbae6fd, 40, 90); // soft blue horizon fog

    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);

    // ── Ground — soft green grass ─────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(130, 130),
      new THREE.MeshBasicMaterial({ color: 0x86efac })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Grass texture (subtle grid)
    const grid = new THREE.GridHelper(90, 45, 0x4ade80, 0x4ade80);
    grid.material.transparent = true;
    grid.material.opacity = 0.15;
    scene.add(grid);

    // Town-square — warm cream circle
    const square = new THREE.Mesh(
      new THREE.CircleGeometry(2.5, 32),
      new THREE.MeshBasicMaterial({ color: 0xfef9c3, transparent: true, opacity: 0.7 })
    );
    square.rotation.x = -Math.PI / 2;
    square.position.y = 0.01;
    scene.add(square);

    // Paths from center to each house
    HOUSES.forEach(h => scene.add(makePath(0, 0, h.pos[0], h.pos[2])));

    // ── Sun ───────────────────────────────────────────────────────────────────
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(3, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfde68a })
    );
    sun.position.set(30, 35, -40);
    scene.add(sun);

    // Sun glow halo
    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(4.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.25 })
    );
    sunGlow.position.copy(sun.position);
    scene.add(sunGlow);

    // ── Trees (cone + trunk) around the scene ─────────────────────────────────
    const treeSpots = [
      [9,9],[-9,9],[9,-9],[-9,-9],
      [13,5],[-13,5],[13,-5],[-13,-5],
      [5,13],[-5,13],[5,-13],[-5,-13],
    ];
    treeSpots.forEach(([x, z]) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.25, 1.8, 6),
        new THREE.MeshBasicMaterial({ color: 0xa16207 })
      );
      trunk.position.set(x, 0.9, z);
      scene.add(trunk);

      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(1.4, 3, 7),
        new THREE.MeshBasicMaterial({ color: 0x4ade80 })
      );
      foliage.position.set(x, 3.4, z);
      scene.add(foliage);

      // second tier
      const foliage2 = new THREE.Mesh(
        new THREE.ConeGeometry(1.0, 2, 7),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
      );
      foliage2.position.set(x, 4.6, z);
      scene.add(foliage2);
    });

    // ── Houses ────────────────────────────────────────────────────────────────
    const houseMeshes = HOUSES.map(h => { const m = makeHouse(h); scene.add(m); return m; });

    // ── Character ─────────────────────────────────────────────────────────────
    const character = makeCharacter();
    scene.add(character);

    // ── Player physics ────────────────────────────────────────────────────────
    const pPos   = new THREE.Vector3(0, 0, 0);
    const pVel   = new THREE.Vector3();
    const camCur = new THREE.Vector3(0, 11, 15);
    const CAM_OFFSET = new THREE.Vector3(0, 11, 15);
    const SPEED = 7;

    // ── Keyboard ──────────────────────────────────────────────────────────────
    const keys = {};
    const onKD = e => { keys[e.key.toLowerCase()] = true; };
    const onKU = e => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onKD);
    window.addEventListener('keyup',   onKU);

    // ── Resize ────────────────────────────────────────────────────────────────
    function resize() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Animation loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf;

    function tick() {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t  = clock.elapsedTime;

      // Movement input
      pVel.set(0, 0, 0);
      if (keys['w'] || keys['arrowup'])    pVel.z -= 1;
      if (keys['s'] || keys['arrowdown'])  pVel.z += 1;
      if (keys['a'] || keys['arrowleft'])  pVel.x -= 1;
      if (keys['d'] || keys['arrowright']) pVel.x += 1;
      const moving = pVel.lengthSq() > 0;

      if (moving) {
        pVel.normalize().multiplyScalar(SPEED * dt);
        character.rotation.y = Math.atan2(pVel.x, pVel.z);

        const next = pPos.clone().add(pVel);
        next.x = Math.max(-40, Math.min(40, next.x));
        next.z = Math.max(-40, Math.min(40, next.z));

        // Simple house collision — keep player outside a radius
        let blocked = false;
        for (const h of HOUSES) {
          if (next.distanceTo(new THREE.Vector3(...h.pos)) < 4) { blocked = true; break; }
        }
        if (!blocked) pPos.copy(next);
      }

      // Character position + walk bob
      character.position.set(
        pPos.x,
        moving ? Math.abs(Math.sin(t * 10)) * 0.12 : 0,
        pPos.z
      );

      // Limb swing
      character.children.forEach(c => {
        if (c.userData.isLimb) {
          c.rotation.x = moving ? Math.sin(t * 10 + c.userData.phase) * 0.42 : 0;
        }
      });

      // Camera smooth follow
      const tCam = pPos.clone().add(CAM_OFFSET);
      camCur.lerp(tCam, 0.075);
      camera.position.copy(camCur);
      camera.lookAt(pPos.x, 0.9, pPos.z);

      // ── Proximity ────────────────────────────────────────────────────────────
      let nearest = null, nearestDist = Infinity;
      HOUSES.forEach(h => {
        const d = pPos.distanceTo(new THREE.Vector3(...h.pos));
        if (d < 6.5 && d < nearestDist) { nearest = h; nearestDist = d; }
      });

      const newId = nearest?.id ?? null;
      if (newId !== activeRef.current) {
        activeRef.current = newId;
        setPanel(nearest ? nearest.panel : null);
        setHint(nearest ? nearest.label : '');
      }

      // ── House animations — windows brighten on approach ───────────────────
      houseMeshes.forEach((hm, i) => {
        const active = HOUSES[i].id === activeRef.current;
        const p = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.3);
        hm.userData.windows.forEach(w => {
          w.material.opacity = active ? 0.8 + 0.2 * p : 0.55 + 0.1 * p;
        });
        hm.userData.glow.material.opacity = active ? 0.15 + 0.08 * p : 0.06;
      });

      renderer.render(scene, camera);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKD);
      window.removeEventListener('keyup',   onKU);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative" style={{ height: '100vh', minHeight: '580px' }}>

      {/* ── 3D Canvas ──────────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* ── Title (top-center) ─────────────────────────────────────────────── */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-3 border border-orange-100 shadow-sm">
          <p className="font-mono text-orange-400 text-[10px] tracking-[0.2em] uppercase mb-0.5">
            🎮 Interactive Portfolio
          </p>
          <h1 className="text-stone-800 font-bold text-xl md:text-2xl tracking-tight">
            Bryanna Reid
          </h1>
        </div>
      </div>

      {/* ── Info panel (right side, slides in when near a house) ───────────── */}
      <div
        className="absolute top-1/2 right-5 z-10 pointer-events-none"
        style={{
          width: '18rem',
          transform: `translateY(-50%) translateX(${panel ? '0px' : '24px'})`,
          opacity: panel ? 1 : 0,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {panel && (
          <div className="bg-white/90 backdrop-blur-md border-2 border-orange-200 rounded-2xl p-5 shadow-xl">
            <p className="font-mono text-orange-400 text-[10px] tracking-[0.18em] uppercase mb-1">
              {panel.subtitle}
            </p>
            <h3 className="text-stone-800 font-bold text-base mb-4 leading-snug">
              {panel.title}
            </h3>
            <div className="space-y-2.5">
              {panel.items.map((item, i) => (
                <div key={i} className="border-b border-stone-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="font-mono text-orange-400 text-[10px] tracking-wide mb-0.5">
                    {item.k}
                  </div>
                  <div className="text-stone-500 text-xs leading-relaxed">
                    {item.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Controls hint (bottom-center) ──────────────────────────────────── */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/75 backdrop-blur-sm border border-orange-100 rounded-xl px-4 py-2 shadow-sm">
          <kbd className="font-mono text-orange-500 text-[10px] bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">
            W A S D
          </kbd>
          <span className="text-stone-400 text-[10px]">or</span>
          <kbd className="font-mono text-orange-500 text-[10px] bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">
            ↑ ↓ ← →
          </kbd>
          <span className="text-stone-500 text-[10px]">to explore</span>
        </div>

        {/* House proximity chip */}
        <div
          className="flex items-center gap-1.5 bg-white/75 backdrop-blur-sm border-2 border-orange-300 rounded-xl px-3 py-2 shadow-sm"
          style={{
            opacity: hint ? 1 : 0,
            transform: hint ? 'scale(1)' : 'scale(0.92)',
            transition: 'opacity 0.25s, transform 0.25s',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="font-mono text-orange-500 text-[10px] tracking-widest font-semibold">{hint}</span>
        </div>
      </div>

      {/* ── Scroll cue (bottom-right) ───────────────────────────────────────── */}
      <a
        href="#about"
        className="absolute bottom-7 right-5 z-10 flex flex-col items-center gap-1 group"
      >
        <div className="bg-white/75 backdrop-blur-sm border border-orange-100 rounded-xl px-3 py-2 shadow-sm flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] text-stone-400 group-hover:text-orange-400 transition-colors">
            more below
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="w-4 h-4 text-orange-400 animate-bounce">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </a>
    </section>
  );
}
