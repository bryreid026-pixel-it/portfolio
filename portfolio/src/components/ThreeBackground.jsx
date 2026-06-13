import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
  Network-topology 3D scene using the site's green accent (#00ff9f).
  Renders into a fullscreen canvas behind the hero content.
*/
export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.set(0, 0, 30);

    // ── Colors ──────────────────────────────────────────────────────
    const GREEN      = new THREE.Color(0x00ff9f);
    const GREEN_DIM  = new THREE.Color(0x00994f);
    const GREEN_DARK = new THREE.Color(0x003320);

    // ── Nodes ───────────────────────────────────────────────────────
    const NODE_COUNT   = 60;
    const CONNECT_DIST = 9;
    const positions    = [];
    const meshes       = [];
    const group        = new THREE.Group();
    scene.add(group);

    for (let i = 0; i < NODE_COUNT; i++) {
      const r     = 10 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const x     = r * Math.sin(phi) * Math.cos(theta);
      const y     = r * Math.sin(phi) * Math.sin(theta);
      const z     = r * Math.cos(phi);
      positions.push(new THREE.Vector3(x, y, z));

      // Key nodes are larger and brighter
      const isKey  = Math.random() < 0.15;
      const isMid  = !isKey && Math.random() < 0.35;
      const size   = isKey ? 0.22 : isMid ? 0.13 : 0.07;
      const color  = isKey ? GREEN : isMid ? GREEN_DIM : GREEN_DARK;
      const opacity = isKey ? 1 : isMid ? 0.65 : 0.35;

      const geo  = new THREE.SphereGeometry(size, 10, 10);
      const mat  = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { baseOpacity: opacity, phase: Math.random() * Math.PI * 2, isKey };
      group.add(mesh);
      meshes.push(mesh);
    }

    // ── Edges ───────────────────────────────────────────────────────
    const edgePts = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < CONNECT_DIST) {
          edgePts.push(positions[i].x, positions[i].y, positions[i].z);
          edgePts.push(positions[j].x, positions[j].y, positions[j].z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePts, 3));
    group.add(new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0x00ff9f, transparent: true, opacity: 0.06 })
    ));

    // ── Ambient particles ────────────────────────────────────────────
    const PC   = 150;
    const pPos = new Float32Array(PC * 3);
    for (let i = 0; i < PC; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 55;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 55;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 55;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x00ff9f, size: 0.07, transparent: true, opacity: 0.2 })
    ));

    // ── Resize ──────────────────────────────────────────────────────
    function resize() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Mouse parallax ───────────────────────────────────────────────
    let mx = 0, my = 0;
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    // ── Animation ───────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      group.rotation.y = t * 0.035 + mx * 0.07;
      group.rotation.x = -my * 0.05;

      // Pulse key nodes
      meshes.forEach(m => {
        if (m.userData.isKey) {
          m.material.opacity = 0.6 + 0.4 * Math.sin(t * 1.4 + m.userData.phase);
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    // ── Cleanup ──────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
