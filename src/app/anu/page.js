"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const CONN = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
const TIPS = [4,8,12,16,20];
const TIP_COLORS = ["#f472b6","#38bdf8","#34d399","#fb923c","#a78bfa"];
const TIP_COLORS_HEX = [0xf472b6, 0x38bdf8, 0x34d399, 0xfb923c, 0xa78bfa];
const MODES = [
  { id:"neon",    label:"Neon",    emoji:"🟣" },
  { id:"dots",    label:"Titik",   emoji:"⚪" },
  { id:"fire",    label:"Api",     emoji:"🔥" },
  { id:"rainbow", label:"Rainbow", emoji:"🌈" },
  { id:"holo",    label:"Holo",    emoji:"💠" },
];
const GESTURE_META = {
  fist:     { label:"Kepalan ✊", color:"#f472b6", desc:"Tutup menu"      },
  peace:    { label:"Peace ✌️",   color:"#38bdf8", desc:"Buka menu"       },
  point:    { label:"Tunjuk ☝️",  color:"#34d399", desc:"Pilih item"      },
  open:     { label:"Tangan 🖐️",  color:"#fb923c", desc:"Reset efek"      },
  thumbsup: { label:"Jempol 👍",  color:"#a78bfa", desc:"Mode berikutnya" },
};

// ── 3D Hologram peaks (XZ plane, Y = height) ─────────────────────────────────
const HOLO_PEAKS = [
  [0,    0,   2.25],
  [-0.55, 0.3, 1.45],
  [0.62, 0.22, 1.25],
  [-0.32, -0.52, 0.92],
  [0.42, -0.46, 0.72],
];

function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
    const s = document.createElement("script");
    s.src = src; s.crossOrigin = "anonymous"; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

function detectGesture(lms) {
  if (!lms) return null;
  const ext = (tip, mcp) => lms[tip].y < lms[mcp].y - 0.02;
  const [idx, mid, rng, pnk] = [ext(8,5), ext(12,9), ext(16,13), ext(20,17)];
  if (!idx && !mid && !rng && !pnk && lms[4].y >= lms[3].y - 0.01) return "fist";
  if (idx && mid && !rng && !pnk)  return "peace";
  if (idx && !mid && !rng && !pnk) return "point";
  if (idx && mid && rng && pnk && lms[4].y < lms[3].y - 0.01) return "open";
  const thumbUp = lms[4].y < lms[3].y - 0.04 && lms[4].y < lms[2].y - 0.02;
  const folded = !idx && !mid && !rng && !pnk
    && lms[8].y > lms[5].y && lms[12].y > lms[9].y
    && lms[16].y > lms[13].y && lms[20].y > lms[17].y;
  if (thumbUp && folded) return "thumbsup";
  return null;
}

// ── Build Three.js Hologram Scene ─────────────────────────────────────────────
function buildThreeScene(THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 2.9, 4.4);
  camera.lookAt(0, 0.55, 0);

  const group = new THREE.Group();
  scene.add(group);

  // ── Terrain geometry ──────────────────────────────────────────────────────
  const RES = 44;
  const geo = new THREE.PlaneGeometry(3.8, 3.8, RES, RES);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;

  const peakActualH = HOLO_PEAKS.map(() => 0);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    let h = 0;
    for (let pi = 0; pi < HOLO_PEAKS.length; pi++) {
      const [px, pz, ph] = HOLO_PEAKS[pi];
      h += ph * Math.exp(-((x - px) ** 2 + (z - pz) ** 2) / 0.52);
    }
    h = Math.min(h, 2.5);
    pos.setY(i, h);
    // Track max height near each peak center
    for (let pi = 0; pi < HOLO_PEAKS.length; pi++) {
      const [px, pz] = HOLO_PEAKS[pi];
      if ((x - px) ** 2 + (z - pz) ** 2 < 0.06) {
        peakActualH[pi] = Math.max(peakActualH[pi], h);
      }
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  // Subtle fill mesh (dark navy, mostly transparent)
  const fillMat = new THREE.MeshBasicMaterial({
    color: 0x001a35, transparent: true, opacity: 0.30, side: THREE.FrontSide,
  });
  group.add(new THREE.Mesh(geo, fillMat));

  // Main wireframe
  const wireGeo = new THREE.WireframeGeometry(geo);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x00e5ff, transparent: true, opacity: 0.68,
    blending: THREE.AdditiveBlending,
  });
  const wire = new THREE.LineSegments(wireGeo, wireMat);
  group.add(wire);

  // Soft glow layer (slightly larger, dimmer)
  const glowMat = new THREE.LineBasicMaterial({
    color: 0x00aaee, transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending,
  });
  const glowWire = new THREE.LineSegments(wireGeo, glowMat);
  glowWire.scale.setScalar(1.009);
  group.add(glowWire);

  // ── Platform rings ────────────────────────────────────────────────────────
  const ringMats = [];
  [[1.55, 0.36], [1.0, 0.50], [0.52, 0.42]].forEach(([r, opa], ri) => {
    const rGeo = new THREE.TorusGeometry(r, 0.013, 5, 96);
    const rMat = new THREE.MeshBasicMaterial({
      color: 0x00c8ff, transparent: true, opacity: opa,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.06;
    group.add(ring);
    ringMats.push(rMat);
  });

  // ── Peak markers ──────────────────────────────────────────────────────────
  const peakObjects = [];
  HOLO_PEAKS.forEach(([px, pz, ph], pi) => {
    const py = peakActualH[pi] > 0 ? peakActualH[pi] : ph * 0.88;
    const color = TIP_COLORS_HEX[pi];

    // Outer glow sphere (large, dim)
    const outerGeo = new THREE.SphereGeometry(0.16, 10, 10);
    const outerMat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    outer.position.set(px, py, pz);
    group.add(outer);

    // Main sphere
    const sGeo = new THREE.SphereGeometry(0.072, 12, 12);
    const sMat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending,
    });
    const sphere = new THREE.Mesh(sGeo, sMat);
    sphere.position.set(px, py, pz);
    group.add(sphere);

    // White center dot
    const cGeo = new THREE.SphereGeometry(0.026, 8, 8);
    const cMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const center = new THREE.Mesh(cGeo, cMat);
    center.position.set(px, py, pz);
    group.add(center);

    // Pulsing ring (torus) around peak
    const prGeo = new THREE.TorusGeometry(0.14, 0.011, 5, 28);
    const prMat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending,
    });
    const pring = new THREE.Mesh(prGeo, prMat);
    pring.position.set(px, py, pz);
    group.add(pring);

    // Vertical spike / pillar of light from peak
    const spikeGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.4, 4);
    const spikeMat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending,
    });
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.set(px, py + 0.2, pz);
    group.add(spike);

    peakObjects.push({ sphere, outer, pring, prMat, sMat, outerMat, spikeMat, pi });
  });

  // ── Scan line ─────────────────────────────────────────────────────────────
  const scanGeo = new THREE.PlaneGeometry(3.8, 0.045);
  const scanMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff, transparent: true, opacity: 0.26,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const scanLine = new THREE.Mesh(scanGeo, scanMat);
  scanLine.rotation.x = -Math.PI / 2;
  group.add(scanLine);

  // ── Ambient light particles (floating dots) ───────────────────────────────
  const particleGeo = new THREE.BufferGeometry();
  const pCount = 60;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 3.6;
    pPos[i * 3 + 1] = Math.random() * 2.8;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 3.6;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00e5ff, size: 0.025, transparent: true, opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  return {
    scene, camera, group,
    ringMats, peakObjects, scanLine, scanMat,
    wireMat, glowMat, fillMat, particleMat, particles,
    peakActualH,
  };
}

// ── 2D HUD ────────────────────────────────────────────────────────────────────
function drawHUD(ctx, W, H, tick, lms, fps) {
  const c = `rgba(0,220,255`;
  const cm = `rgba(100,240,255`;
  ctx.save();
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = y % 8 === 0 ? "rgba(0,255,200,0.016)" : "rgba(0,0,0,0.012)";
    ctx.fillRect(0, y, W, 1);
  }
  [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(([x,y,sx,sy]) => {
    ctx.strokeStyle = `${c},0.6)`; ctx.lineWidth = 2;
    ctx.shadowBlur = 8; ctx.shadowColor = `${cm},0.7)`;
    ctx.beginPath(); ctx.moveTo(x + sx * 56, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * 38); ctx.stroke();
  });
  ctx.shadowBlur = 0;
  ctx.save();
  ctx.translate(W, 0); ctx.scale(-1, 1);
  ctx.fillStyle = `${c},0.65)`; ctx.font = "bold 11px monospace";
  ctx.fillText("JARVIS AR v2.4", 14, 22);
  ctx.fillStyle = `${c},0.4)`; ctx.font = "10px monospace";
  ctx.fillText(`FPS: ${fps}  HAND: ${lms ? "LOCKED" : "SCANNING"}`, 14, 38);
  ctx.fillText(`HOLO 3D: ACTIVE  |  MOVE HAND = ROTATE`, 14, 52);
  ctx.textAlign = "right";
  ctx.fillStyle = `${c},0.5)`;
  ctx.fillText(new Date().toLocaleTimeString(), W - 14, 22);
  ctx.fillText(`LANDMARKS: ${lms ? 21 : 0}/21`, W - 14, 36);
  ctx.textAlign = "left";
  ctx.restore();
  ctx.fillStyle = "rgba(0,8,20,0.7)"; ctx.fillRect(0, H - 30, W, 30);
  ctx.strokeStyle = `${c},0.2)`; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, H - 30); ctx.lineTo(W, H - 30); ctx.stroke();
  ctx.save();
  ctx.translate(W, 0); ctx.scale(-1, 1);
  ctx.fillStyle = `${c},0.38)`; ctx.font = "9px monospace";
  ctx.fillText("✌️MENU  ✊CLOSE  👍NEXT  ☝️SELECT  🖐️RESET  |  MOVE HAND TO ROTATE HOLO 3D", 14, H - 10);
  ctx.restore();
  const rx = W - 52, ry = H - 52, rr = 30;
  [10, 20, 28].forEach(r => {
    ctx.beginPath(); ctx.arc(rx, ry, r, 0, Math.PI * 2);
    ctx.strokeStyle = `${c},0.1)`; ctx.lineWidth = 0.5; ctx.stroke();
  });
  const ra = (tick * 0.035) % (Math.PI * 2);
  ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + Math.cos(ra) * rr, ry + Math.sin(ra) * rr);
  ctx.strokeStyle = `${c},0.7)`; ctx.lineWidth = 1.5;
  ctx.shadowBlur = 5; ctx.shadowColor = `${cm},0.8)`; ctx.stroke(); ctx.shadowBlur = 0;
  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HandTrackingAR() {
  const videoRef      = useRef(null);
  const canvasRef     = useRef(null);
  const threeCanvasRef = useRef(null);
  const threeRef      = useRef(null);   // Three.js objects
  const particlesRef  = useRef([]);
  const resultsRef    = useRef(null);
  const modeRef       = useRef("neon");
  const hueRef        = useRef(185);
  const rafRef        = useRef(null);
  const fpsRef        = useRef({ count: 0, last: Date.now() });
  const streamRef     = useRef(null);
  const gestureRef    = useRef(null);
  const gestureTsRef  = useRef(0);
  const lastActRef    = useRef(0);
  const prevGRef      = useRef(null);
  const tickRef       = useRef(0);
  const fpsValRef     = useRef(0);
  const rotXRef       = useRef(0);
  const rotYRef       = useRef(0.4);
  const prevPalmRef   = useRef(null);

  const [mode, setMode]               = useState("neon");
  const [status, setStatus]           = useState("idle");
  const [errorMsg, setErrorMsg]       = useState("");
  const [handVisible, setHandVisible] = useState(false);
  const [fps, setFps]                 = useState(0);
  const [gesture, setGesture]         = useState(null);
  const [toast, setToast]             = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [menuIdx, setMenuIdx]         = useState(0);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  const showToast = useCallback((msg, color = "#a78bfa") => {
    setToast({ msg, color }); setTimeout(() => setToast(null), 1800);
  }, []);

  const dispatchGesture = useCallback((g) => {
    const now = Date.now();
    if (now - lastActRef.current < 1200) return;
    lastActRef.current = now;
    if (g === "peace")    setMenuOpen(p => { showToast(p ? "Menu ditutup" : "Menu dibuka ✌️", "#38bdf8"); return !p; });
    if (g === "fist")    { setMenuOpen(false); showToast("Menu ditutup ✊", "#f472b6"); }
    if (g === "thumbsup") setMenuIdx(p => { const n = (p + 1) % MODES.length; setMode(MODES[n].id); modeRef.current = MODES[n].id; particlesRef.current = []; showToast(`${MODES[n].label} ${MODES[n].emoji}`, "#a78bfa"); return n; });
    if (g === "point")    setMenuOpen(p => { if (p) { setMenuIdx(i => { const s = MODES[i]; setMode(s.id); modeRef.current = s.id; particlesRef.current = []; showToast(`✅ ${s.label}`, "#34d399"); return i; }); return false; } return p; });
    if (g === "open")    { particlesRef.current = []; showToast("Efek direset 🖐️", "#fb923c"); }
  }, [showToast]);

  // ── Three.js init ────────────────────────────────────────────────────────
  const initThreeHolo = useCallback(() => {
    if (!window.THREE || !threeCanvasRef.current || threeRef.current) return;
    const THREE = window.THREE;
    const canvas = threeCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const W = Math.max(rect.width, 200);
    const H = Math.max(rect.height, 150);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H, false);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const threeScene = buildThreeScene(THREE);
    threeScene.camera.aspect = W / H;
    threeScene.camera.updateProjectionMatrix();

    threeRef.current = { renderer, ...threeScene };
  }, []);

  const cleanupThreeHolo = useCallback(() => {
    if (threeRef.current) {
      try { threeRef.current.renderer.dispose(); } catch {}
      threeRef.current = null;
    }
  }, []);

  // Re-init Three.js when switching to holo mode
  useEffect(() => {
    if (mode === "holo" && status === "running") {
      const t = setTimeout(initThreeHolo, 80);
      return () => clearTimeout(t);
    } else {
      cleanupThreeHolo();
    }
  }, [mode, status, initThreeHolo, cleanupThreeHolo]);

  const pt = (lms, i, W, H) => ({ x: (1 - lms[i].x) * W, y: lms[i].y * H });

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(drawFrame); return; }
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    tickRef.current++;

    fpsRef.current.count++;
    const now = Date.now();
    if (now - fpsRef.current.last >= 1000) {
      fpsValRef.current = fpsRef.current.count;
      setFps(fpsRef.current.count);
      fpsRef.current.count = 0; fpsRef.current.last = now;
    }

    ctx.clearRect(0, 0, W, H);
    hueRef.current = (hueRef.current + 0.5) % 360;
    const lmsList = resultsRef.current?.multiHandLandmarks ?? [];
    setHandVisible(lmsList.length > 0);
    const lms = lmsList[0] ?? null;
    const m = modeRef.current, h = hueRef.current, tick = tickRef.current;

    // Gesture detection
    if (lms) {
      const g = detectGesture(lms);
      if (g !== prevGRef.current) { prevGRef.current = g; gestureTsRef.current = now; }
      else if (g && now - gestureTsRef.current > 600 && gestureRef.current !== g) {
        gestureRef.current = g; setGesture(g); dispatchGesture(g);
      }
      if (!g) { gestureRef.current = null; setGesture(null); }
    } else { prevGRef.current = null; gestureRef.current = null; setGesture(null); }

    // ── HOLO mode: Three.js renders the 3D terrain ──────────────────────
    if (m === "holo") {
      // Hand-driven rotation
      if (lms) {
        const palmX = lms[9].x, palmY = lms[9].y;
        if (prevPalmRef.current) {
          const dx = palmX - prevPalmRef.current.x;
          const dy = palmY - prevPalmRef.current.y;
          rotYRef.current += dx * 4.5;
          rotXRef.current = Math.max(-1.2, Math.min(0.8, rotXRef.current + dy * 3.0));
        }
        prevPalmRef.current = { x: palmX, y: palmY };
      } else {
        prevPalmRef.current = null;
      }

      // Try init if not done yet
      if (!threeRef.current && window.THREE) initThreeHolo();

      // Update & render Three.js scene
      if (threeRef.current) {
        const { renderer, scene, camera, group, ringMats, peakObjects, scanLine, scanMat, particleMat } = threeRef.current;

        // Apply rotation driven by hand (or default view)
        group.rotation.y = rotYRef.current;
        group.rotation.x = rotXRef.current;

        // Animate platform rings
        ringMats.forEach((mat, i) => {
          mat.opacity = (0.28 + 0.24 * Math.abs(Math.sin(tick * 0.038 + i * 0.9)));
        });

        // Animate peak markers
        peakObjects.forEach(({ sphere, outer, pring, prMat, sMat, outerMat, spikeMat, pi }) => {
          const pulse = Math.sin(tick * 0.075 + pi * 1.35);
          const s = 1 + 0.22 * pulse;
          pring.scale.set(s, s, s);
          prMat.opacity = 0.42 + 0.35 * (pulse * 0.5 + 0.5);
          sMat.opacity = 0.72 + 0.22 * Math.sin(tick * 0.09 + pi * 1.1);
          outerMat.opacity = 0.08 + 0.12 * Math.abs(pulse);
          spikeMat.opacity = 0.28 + 0.28 * (pulse * 0.5 + 0.5);
        });

        // Animate scan line
        const sp = (Math.sin(tick * 0.022) + 1) / 2;
        scanLine.position.z = (sp - 0.5) * 3.6;
        scanMat.opacity = 0.15 + 0.14 * Math.abs(Math.sin(tick * 0.04));

        // Slowly rotate floating particles
        particleMat.opacity = 0.28 + 0.12 * Math.sin(tick * 0.03);

        renderer.render(scene, camera);
      }

      // Draw HUD overlay on 2D canvas
      drawHUD(ctx, W, H, tick, lms, fpsValRef.current);

      // Ghost skeleton (translucent, over camera feed)
      if (lms) {
        CONN.forEach(([a, b]) => {
          const pa = pt(lms, a, W, H), pb = pt(lms, b, W, H);
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = `hsla(${h},70%,65%,0.25)`; ctx.lineWidth = 1;
          ctx.shadowBlur = 3; ctx.shadowColor = `hsla(${h},100%,70%,0.3)`;
          ctx.stroke(); ctx.shadowBlur = 0;
        });
        lms.forEach((_, i) => {
          const p = pt(lms, i, W, H), it = TIPS.includes(i), ti = TIPS.indexOf(i);
          ctx.beginPath(); ctx.arc(p.x, p.y, it ? 4 : 2, 0, Math.PI * 2);
          ctx.fillStyle = it ? TIP_COLORS[ti] + "99" : `hsla(${h},70%,75%,0.3)`;
          ctx.fill();
        });
      }
      rafRef.current = requestAnimationFrame(drawFrame); return;
    }

    if (!lms) { rafRef.current = requestAnimationFrame(drawFrame); return; }
    prevPalmRef.current = null;

    if (m === "neon") {
      CONN.forEach(([a, b]) => {
        const pa = pt(lms, a, W, H), pb = pt(lms, b, W, H);
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = "#7f77dd"; ctx.lineWidth = 2.5;
        ctx.shadowBlur = 16; ctx.shadowColor = "#a78bfa"; ctx.stroke(); ctx.shadowBlur = 0;
      });
      lms.forEach((_, i) => {
        const p = pt(lms, i, W, H), it = TIPS.includes(i), ti = TIPS.indexOf(i);
        if (it) {
          const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 24);
          gr.addColorStop(0, TIP_COLORS[ti] + "cc"); gr.addColorStop(1, TIP_COLORS[ti] + "00");
          ctx.beginPath(); ctx.arc(p.x, p.y, 24, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, it ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = it ? TIP_COLORS[ti] : "rgba(255,255,255,0.9)"; ctx.fill();
      });
    }

    if (m === "dots") {
      CONN.forEach(([a, b]) => {
        const pa = pt(lms, a, W, H), pb = pt(lms, b, W, H);
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1; ctx.stroke();
      });
      lms.forEach((_, i) => {
        const p = pt(lms, i, W, H), it = TIPS.includes(i), ti = TIPS.indexOf(i);
        ctx.beginPath(); ctx.arc(p.x, p.y, it ? 10 : 5, 0, Math.PI * 2);
        ctx.fillStyle = it ? TIP_COLORS[ti] : "rgba(255,255,255,0.7)"; ctx.fill();
        if (it) { ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, Math.PI * 2); ctx.strokeStyle = TIP_COLORS[ti] + "55"; ctx.lineWidth = 1.5; ctx.stroke(); }
      });
    }

    if (m === "fire" && particlesRef.current.length < 300) {
      TIPS.forEach(fi => {
        const p = pt(lms, fi, W, H);
        for (let k = 0; k < 3; k++) particlesRef.current.push({ x: p.x + (Math.random() - .5) * 10, y: p.y, vx: (Math.random() - .5) * 1.8, vy: -(2.5 + Math.random() * 3.5), life: 1 });
      });
    }

    if (m === "rainbow") {
      CONN.forEach(([a, b], idx) => {
        const pa = pt(lms, a, W, H), pb = pt(lms, b, W, H), rh = (h + idx * 15) % 360;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = `hsl(${rh},100%,65%)`; ctx.lineWidth = 3;
        ctx.shadowBlur = 10; ctx.shadowColor = `hsl(${rh},100%,75%)`; ctx.stroke(); ctx.shadowBlur = 0;
      });
      lms.forEach((_, i) => {
        const p = pt(lms, i, W, H), rh = (h + i * 20) % 360;
        ctx.beginPath(); ctx.arc(p.x, p.y, TIPS.includes(i) ? 10 : 5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${rh},100%,70%)`; ctx.fill();
      });
    }

    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy -= 0.05; p.life -= 0.025;
      const r = Math.max(0, 5 * p.life); if (r <= 0) return;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,${Math.floor(p.life * 165)},0,${p.life * .9})`; ctx.fill();
    });

    rafRef.current = requestAnimationFrame(drawFrame);
  }, [dispatchGesture, initThreeHolo]);

  const startCamera = async () => {
    setStatus("loading"); setErrorMsg("");
    try {
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
    } catch { setStatus("error"); setErrorMsg("Gagal load library."); return; }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }); }
    catch (e) { setStatus("error"); setErrorMsg(`Kamera: ${e.message}`); return; }
    streamRef.current = stream;
    const video = videoRef.current;
    video.srcObject = stream; try { await video.play(); } catch {}
    await new Promise(r => {
      if (video.videoWidth > 0) { r(); return; }
      video.addEventListener("loadeddata", () => { if (video.videoWidth > 0) r(); }, { once: true });
      setTimeout(r, 3000);
    });
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280; canvas.height = video.videoHeight || 720;
    try {
      const { Hands, Camera } = window;
      if (!Hands || !Camera) throw new Error("MediaPipe tidak tersedia");
      const hands = new Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.75, minTrackingConfidence: 0.65 });
      hands.onResults(r => { resultsRef.current = r; });
      new Camera(video, { onFrame: async () => { await hands.send({ image: video }); }, width: video.videoWidth, height: video.videoHeight }).start();
      setStatus("running"); rafRef.current = requestAnimationFrame(drawFrame);
    } catch (e) { setStatus("error"); setErrorMsg(`Error: ${e.message}`); }
  };

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    cleanupThreeHolo();
  }, [cleanupThreeHolo]);

  const gInfo = gesture ? GESTURE_META[gesture] : null;

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b bg-[#07070f]/90 backdrop-blur sticky top-0 z-20" style={{ borderColor: "rgba(0,255,200,0.15)" }}>
        <div className="flex items-center gap-2 text-lg font-bold tracking-widest font-mono">
          <span style={{ color: "#22d3ee" }}>◈</span>
          <span>HAND<span style={{ color: "#22d3ee" }}>AR</span></span>
        </div>
        <div className="flex items-center gap-4">
          {status === "running" && gInfo && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold font-mono"
              style={{ background: gInfo.color + "22", border: `1px solid ${gInfo.color}55`, color: gInfo.color }}>
              {gInfo.label}<span className="opacity-50"> — {gInfo.desc}</span>
            </div>
          )}
          {status === "running" && (
            <div className="flex items-center gap-3 text-xs font-mono" style={{ color: "rgba(0,255,200,0.45)" }}>
              <span className="flex items-center gap-1.5">
                <span style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", background: handVisible ? "#22d3ee" : "#ef4444" }} />
                {handVisible ? "LOCKED" : "SCANNING"}
              </span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span>{fps} FPS</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-5">
        <div className="relative w-full max-w-4xl" style={{ aspectRatio: "16/9" }}>
          <video ref={videoRef} playsInline muted autoPlay
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", background: "#000", borderRadius: "1rem", display: "block" }} />

          {/* Three.js hologram canvas — real 3D, no mirroring needed */}
          <div style={{
            position: "absolute", top: "5%", left: "4%",
            width: "40%", height: "60%",
            zIndex: 6, pointerEvents: "none",
            opacity: mode === "holo" && status === "running" ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}>
            <canvas ref={threeCanvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
          </div>

          <canvas ref={canvasRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "scaleX(-1)", borderRadius: "1rem", pointerEvents: "none", zIndex: 7 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "1rem", border: "1px solid rgba(0,255,200,0.15)", pointerEvents: "none", zIndex: 8 }} />

          {menuOpen && status === "running" && (
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 15,
              display: "flex", flexDirection: "column", gap: 8, background: "rgba(0,6,18,0.96)",
              backdropFilter: "blur(20px)", border: "1px solid rgba(0,255,200,0.25)", borderRadius: "1rem",
              padding: "1rem 1.25rem", minWidth: 200,
            }}>
              <p style={{ fontSize: 10, color: "rgba(0,255,200,0.5)", textAlign: "center", fontFamily: "monospace", marginBottom: 4 }}>☝️ POINT TO SELECT</p>
              {MODES.map((mo, i) => (
                <button key={mo.id} onClick={() => { setMode(mo.id); modeRef.current = mo.id; setMenuIdx(i); setMenuOpen(false); particlesRef.current = []; showToast(`${mo.label} ${mo.emoji}`, "#22d3ee"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 8,
                    border: `1px solid ${i === menuIdx ? "#22d3ee" : "rgba(0,255,200,0.1)"}`,
                    background: i === menuIdx ? "rgba(0,255,200,0.08)" : "transparent",
                    color: i === menuIdx ? "#67e8f9" : "rgba(255,255,255,0.5)",
                    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "monospace",
                  }}>
                  <span>{mo.emoji}</span><span>{mo.label}</span>
                  {mode === mo.id && <span style={{ marginLeft: "auto", fontSize: 9, color: "#34d399" }}>ACTIVE</span>}
                </button>
              ))}
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textAlign: "center", fontFamily: "monospace", marginTop: 4 }}>✊ FIST TO CLOSE</p>
            </div>
          )}

          {toast && (
            <div style={{
              position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 20,
              padding: "7px 18px", borderRadius: 999, background: toast.color + "22",
              border: `1px solid ${toast.color}55`, color: toast.color, fontSize: 12, fontWeight: 600,
              backdropFilter: "blur(8px)", whiteSpace: "nowrap", animation: "fadeIn 0.2s ease", fontFamily: "monospace",
            }}>
              {toast.msg}
            </div>
          )}

          {status === "idle" && (
            <div style={{ position: "absolute", inset: 0, borderRadius: "1rem", background: "rgba(0,4,14,0.92)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: 340, padding: "0 24px", textAlign: "center" }}>
                <span style={{ fontSize: 46 }}>✋</span>
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.12em", fontFamily: "monospace", color: "#67e8f9", margin: 0 }}>HAND<span style={{ color: "#fff" }}>AR</span></h1>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
                  {Object.entries(GESTURE_META).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(0,255,200,0.04)", border: "1px solid rgba(0,255,200,0.1)" }}>
                      <span style={{ fontSize: 14 }}>{v.label.split(" ")[1] || ""}</span>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: v.color, margin: 0, fontFamily: "monospace" }}>{v.label.split(" ")[0]}</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", margin: 0 }}>{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(0,255,200,0.05)", border: "1px solid rgba(0,255,200,0.18)", color: "#67e8f9", fontSize: 11, fontFamily: "monospace" }}>
                  💠 HOLO — WebGL 3D terrain, gerak tangan = putar real-time
                </div>
                <button onClick={startCamera} style={{ width: "100%", padding: "12px", background: "#22d3ee", color: "#000", fontWeight: 700, borderRadius: 8, fontSize: 13, fontFamily: "monospace", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}>
                  INITIALIZE SYSTEM
                </button>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div style={{ position: "absolute", inset: 0, borderRadius: "1rem", background: "rgba(0,4,14,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, zIndex: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(0,255,200,0.2)", borderTopColor: "#22d3ee", animation: "spin 0.8s linear infinite" }} />
              <p style={{ color: "#67e8f9", fontSize: 13, fontFamily: "monospace" }}>LOADING AI + THREE.JS...</p>
            </div>
          )}

          {status === "error" && (
            <div style={{ position: "absolute", inset: 0, borderRadius: "1rem", background: "rgba(0,4,14,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, zIndex: 10, padding: "0 2rem", textAlign: "center" }}>
              <span style={{ fontSize: 36 }}>❌</span>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "monospace" }}>{errorMsg}</p>
              <button onClick={() => { setStatus("idle"); setErrorMsg(""); }} style={{ padding: "7px 16px", border: "1px solid rgba(0,255,200,0.3)", borderRadius: 8, color: "#67e8f9", background: "rgba(0,255,200,0.06)", fontSize: 12, fontFamily: "monospace", cursor: "pointer" }}>
                RETRY
              </button>
            </div>
          )}

          {status === "running" && !handVisible && !menuOpen && (
            <div style={{
              position: "absolute", bottom: 38, left: "50%", transform: "translateX(-50%)", zIndex: 10,
              padding: "6px 16px", borderRadius: 999, background: "rgba(0,6,18,0.75)",
              border: "1px solid rgba(0,255,200,0.18)", color: "rgba(0,255,200,0.55)",
              fontSize: 11, fontFamily: "monospace", whiteSpace: "nowrap", animation: "pulse 2s ease-in-out infinite",
            }}>
              SCANNING FOR HAND...
            </div>
          )}
        </div>
      </main>

      {status === "running" && (
        <footer style={{ borderTop: "1px solid rgba(0,255,200,0.15)", background: "rgba(0,4,14,0.92)", padding: "10px 24px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {MODES.map((mo, i) => (
              <button key={mo.id} onClick={() => { setMode(mo.id); modeRef.current = mo.id; setMenuIdx(i); particlesRef.current = []; }}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: "monospace", cursor: "pointer",
                  border: `1px solid ${mode === mo.id ? "#22d3ee" : "rgba(0,255,200,0.12)"}`,
                  background: mode === mo.id ? "rgba(0,255,200,0.1)" : "transparent",
                  color: mode === mo.id ? "#67e8f9" : "rgba(255,255,255,0.3)",
                }}>
                <span>{mo.emoji}</span><span>{mo.label}</span>
              </button>
            ))}
          </div>
        </footer>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateX(-50%) translateY(-6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div> 
  );
}