"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const CONN = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
const TIPS = [4,8,12,16,20];
const TIP_COLORS = ["#f472b6","#38bdf8","#34d399","#fb923c","#a78bfa"];
const MODES = [
  { id:"neon",    label:"Neon",    emoji:"🟣" },
  { id:"dots",    label:"Titik",   emoji:"⚪" },
  { id:"fire",    label:"Api",     emoji:"🔥" },
  { id:"rainbow", label:"Rainbow", emoji:"🌈" },
  { id:"holo",    label:"Holo",    emoji:"💠" },
];
const GESTURE_META = {
  fist:     { label:"Kepalan ✊",   color:"#f472b6", desc:"Tutup menu"       },
  three:    { label:"Tiga Jari 🤟", color:"#38bdf8", desc:"Buka menu"        },
  point:    { label:"Tunjuk ☝️",   color:"#34d399", desc:"Pilih item"        },
  open:     { label:"Tangan 🖐️",   color:"#fb923c", desc:"Reset efek"        },
  thumbsup: { label:"Jempol 👍",   color:"#a78bfa", desc:"Mode berikutnya"   },
  peace:    { label:"Peace ✌️",    color:"#22d3ee", desc:"Kontrol nilai holo" },
};

const BASE_PEAKS = [
  [0,      0,    2.25, 0.52],
  [-0.55,  0.3,  1.45, 0.52],
  [0.62,   0.22, 1.25, 0.52],
  [-0.32, -0.52, 0.92, 0.52],
  [0.42,  -0.46, 0.72, 0.52],
];

function genSurface(peaks, scale = 1) {
  const N = 48;
  const x = Array.from({ length: N }, (_, i) => -2.5 + (5 * i) / (N - 1));
  const y = Array.from({ length: N }, (_, i) => -2.5 + (5 * i) / (N - 1));
  const Z = y.map(yv =>
    x.map(xv => {
      let h = 0;
      peaks.forEach(([px, pz, ph, sp]) => {
        h += ph * scale * Math.exp(-((xv - px) ** 2 + (yv - pz) ** 2) / sp);
      });
      return Math.min(h * scale, 2.8 * scale);
    })
  );
  return { x, y, Z };
}

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
  if (idx && mid && !rng && !pnk)   return "peace";   // ✌️ — kontrol value holo
  if (idx && mid && rng && !pnk)    return "three";   // 🤟 tiga jari — buka menu
  if (idx && !mid && !rng && !pnk)  return "point";
  if (idx && mid && rng && pnk && lms[4].y < lms[3].y - 0.01) return "open";
  const thumbUp = lms[4].y < lms[3].y - 0.04 && lms[4].y < lms[2].y - 0.02;
  const folded = !idx && !mid && !rng && !pnk
    && lms[8].y > lms[5].y && lms[12].y > lms[9].y
    && lms[16].y > lms[13].y && lms[20].y > lms[17].y;
  if (thumbUp && folded) return "thumbsup";
  return null;
}

function drawHUD(ctx, W, H, tick, lms, fps, peakScale) {
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
  ctx.fillText(`HOLO 3D  |  MOVE=ROTATE  ✌️=VALUE ${peakScale.toFixed(2)}x`, 14, 52);
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
  ctx.fillText("🤟MENU  ✊CLOSE  👍NEXT  ☝️SELECT  🖐️RESET  |  MOVE=ROTATE  ✌️=VALUE", 14, H - 10);
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

export default function HandTrackingAR() {
  const videoRef         = useRef(null);
  const canvasRef        = useRef(null);
  const plotlyDivRef     = useRef(null);
  const plotlyInitRef    = useRef(false);
  const peaksRef         = useRef(BASE_PEAKS.map(p => [...p]));
  const peakScaleRef     = useRef(1.5);
  const particlesRef     = useRef([]);
  const resultsRef       = useRef(null);
  const modeRef          = useRef("neon");
  const hueRef           = useRef(185);
  const rafRef           = useRef(null);
  const fpsRef           = useRef({ count: 0, last: Date.now() });
  const streamRef        = useRef(null);
  const gestureRef       = useRef(null);
  const gestureTsRef     = useRef(0);
  const lastActRef       = useRef(0);
  const prevGRef         = useRef(null);
  const tickRef          = useRef(0);
  const fpsValRef        = useRef(0);
  const rotXRef          = useRef(0);
  const rotYRef          = useRef(0.4);
  const prevRightPalmRef = useRef(null);
  const prevLeftPalmRef  = useRef(null);
  const camThrottleRef   = useRef(0);
  const plotThrottleRef  = useRef(0);

  const [mode, setMode]               = useState("neon");
  const [status, setStatus]           = useState("idle");
  const [errorMsg, setErrorMsg]       = useState("");
  const [handVisible, setHandVisible] = useState(false);
  const [fps, setFps]                 = useState(0);
  const [gesture, setGesture]         = useState(null);
  const [toast, setToast]             = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [menuIdx, setMenuIdx]         = useState(0);
  const [peakScale, setPeakScale]     = useState(1.5);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  const showToast = useCallback((msg, color = "#a78bfa") => {
    setToast({ msg, color }); setTimeout(() => setToast(null), 1800);
  }, []);

  const dispatchGesture = useCallback((g) => {
    const now = Date.now();
    if (now - lastActRef.current < 1200) return;
    lastActRef.current = now;
    // 🤟 tiga jari = buka/tutup menu (peace tidak di-dispatch, langsung dipakai buat value holo)
    if (g === "three")    setMenuOpen(p => { showToast(p ? "Menu ditutup" : "Menu dibuka 🤟", "#38bdf8"); return !p; });
    if (g === "fist")    { setMenuOpen(false); showToast("Menu ditutup ✊", "#f472b6"); }
    if (g === "thumbsup") setMenuIdx(p => { const n = (p + 1) % MODES.length; setMode(MODES[n].id); modeRef.current = MODES[n].id; particlesRef.current = []; showToast(`${MODES[n].label} ${MODES[n].emoji}`, "#a78bfa"); return n; });
    if (g === "point")    setMenuOpen(p => { if (p) { setMenuIdx(i => { const s = MODES[i]; setMode(s.id); modeRef.current = s.id; particlesRef.current = []; showToast(`✅ ${s.label}`, "#34d399"); return i; }); return false; } return p; });
    if (g === "open")    { particlesRef.current = []; showToast("Efek direset 🖐️", "#fb923c"); }
  }, [showToast]);

  const initPlotlyHolo = useCallback(async () => {
    if (!window.Plotly || !plotlyDivRef.current) return;
    const Plotly = window.Plotly;
    peaksRef.current = BASE_PEAKS.map(p => [...p]);
    peakScaleRef.current = 1.5;
    const { x, y, Z } = genSurface(peaksRef.current, 1.5);
    const data = [{
      type: "surface", x, y, z: Z,
      colorscale: [
        [0,    "rgba(0,30,80,0.0)"],
        [0.15, "rgba(0,60,120,0.55)"],
        [0.4,  "rgba(0,120,180,0.80)"],
        [0.65, "rgba(0,190,230,0.92)"],
        [0.85, "rgba(0,225,255,0.97)"],
        [1.0,  "rgba(220,248,255,1.0)"],
      ],
      opacity: 0.90, showscale: false,
      contours: { z: { show: true, usecolormap: true, highlightcolor: "#00e5ff", project: { z: true } } },
    }];
    const layout = {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      scene: {
        bgcolor: "rgba(0,0,0,0)",
        xaxis: { showgrid: true, gridcolor: "rgba(0,229,255,0.10)", showticklabels: false, title: { text: "" }, showspikes: false, backgroundcolor: "rgba(0,0,0,0)", showline: false, zeroline: false, showbackground: false },
        yaxis: { showgrid: true, gridcolor: "rgba(0,229,255,0.10)", showticklabels: false, title: { text: "" }, showspikes: false, backgroundcolor: "rgba(0,0,0,0)", showline: false, zeroline: false, showbackground: false },
        zaxis: { showgrid: true, gridcolor: "rgba(0,229,255,0.12)", showticklabels: false, title: { text: "" }, showspikes: false, backgroundcolor: "rgba(0,0,0,0)", showline: false, zeroline: false, showbackground: false },
       camera: { eye: { x: 1.2, y: 1.0, z: 0.8 } },
        aspectratio: { x: 1.2, y: 1.2, z: 1.5 }
      },
      margin: { l: 0, r: 0, t: 0, b: 0 }, autosize: true,
    };
    await Plotly.newPlot(plotlyDivRef.current, data, layout, { responsive: true, displayModeBar: false, staticPlot: false });
    plotlyInitRef.current = true;
  }, []);

  useEffect(() => {
    if (mode !== "holo" || status !== "running") {
      plotlyInitRef.current = false;
      if (plotlyDivRef.current && window.Plotly) { try { window.Plotly.purge(plotlyDivRef.current); } catch {} }
      return;
    }
    const t = setTimeout(initPlotlyHolo, 120);
    return () => {
      clearTimeout(t);
      plotlyInitRef.current = false;
      if (plotlyDivRef.current && window.Plotly) { try { window.Plotly.purge(plotlyDivRef.current); } catch {} }
    };
  }, [mode, status, initPlotlyHolo]);

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

    if (lms) {
      const g = detectGesture(lms);
      if (g !== prevGRef.current) { prevGRef.current = g; gestureTsRef.current = now; }
      else if (g && now - gestureTsRef.current > 600 && gestureRef.current !== g) {
        gestureRef.current = g; setGesture(g); dispatchGesture(g);
      }
      if (!g) { gestureRef.current = null; setGesture(null); }
    } else { prevGRef.current = null; gestureRef.current = null; setGesture(null); }

    if (m === "holo") {
      const activeLms = lmsList[0] ?? null;
      if (activeLms) {
        const ext2 = (tip, mcp) => activeLms[tip].y < activeLms[mcp].y - 0.02;
        const isPeace = ext2(8,5) && ext2(12,9) && !ext2(16,13) && !ext2(20,17);
        if (isPeace) {
          const avgTipY = (activeLms[8].y + activeLms[12].y) / 2;
          if (typeof prevRightPalmRef.current === "number") {
            const dy = avgTipY - prevRightPalmRef.current;
            if (Math.abs(dy) > 0.001) {
              const newScale = Math.max(0.1, Math.min(4.0, peakScaleRef.current - dy * 9.0));
              peakScaleRef.current = newScale;
              setPeakScale(parseFloat(newScale.toFixed(2)));
              plotThrottleRef.current++;
              if (plotThrottleRef.current % 3 === 0 && plotlyDivRef.current && window.Plotly && plotlyInitRef.current) {
                const { Z } = genSurface(peaksRef.current, peakScaleRef.current);
                window.Plotly.restyle(plotlyDivRef.current, { z: [Z] }, [0]);
              }
            }
          }
          prevRightPalmRef.current = avgTipY;
        } else {
          const palmX = activeLms[9].x, palmY = activeLms[9].y;
          if (prevRightPalmRef.current && typeof prevRightPalmRef.current === "object") {
            const dx = palmX - prevRightPalmRef.current.x;
            const dy = palmY - prevRightPalmRef.current.y;
            rotYRef.current += dx * 4.5;
            rotXRef.current = Math.max(-1.0, Math.min(0.8, rotXRef.current + dy * 3.0));
          }
          prevRightPalmRef.current = { x: palmX, y: palmY };
          camThrottleRef.current++;
          if (camThrottleRef.current % 8 === 0 && plotlyDivRef.current && window.Plotly && plotlyInitRef.current) {
            const r = 3.8;
            const phi = Math.max(0.15, Math.PI / 2 - rotXRef.current);
            const eye = {
              x: parseFloat((r * Math.sin(phi) * Math.sin(rotYRef.current)).toFixed(3)),
              y: parseFloat((r * Math.cos(phi) + 0.8).toFixed(3)),
              z: parseFloat((r * Math.sin(phi) * Math.cos(rotYRef.current)).toFixed(3)),
            };
            window.Plotly.relayout(plotlyDivRef.current, { "scene.camera.eye": eye });
          }
        }
      } else {
        prevRightPalmRef.current = null;
        prevLeftPalmRef.current = null;
      }
      drawHUD(ctx, W, H, tick, lms, fpsValRef.current, peakScaleRef.current);
      if (activeLms) {
        CONN.forEach(([a, b]) => {
          const pa = pt(activeLms, a, W, H), pb = pt(activeLms, b, W, H);
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = `hsla(${h},70%,65%,0.25)`; ctx.lineWidth = 1;
          ctx.shadowBlur = 3; ctx.shadowColor = `hsla(${h},100%,70%,0.3)`;
          ctx.stroke(); ctx.shadowBlur = 0;
        });
        activeLms.forEach((_, i) => {
          const p = pt(activeLms, i, W, H), it = TIPS.includes(i), ti = TIPS.indexOf(i);
          ctx.beginPath(); ctx.arc(p.x, p.y, it ? 4 : 2, 0, Math.PI * 2);
          ctx.fillStyle = it ? TIP_COLORS[ti] + "99" : `hsla(${h},70%,75%,0.3)`;
          ctx.fill();
        });
      }
      rafRef.current = requestAnimationFrame(drawFrame); return;
    }

    if (!lms) { rafRef.current = requestAnimationFrame(drawFrame); return; }
    prevRightPalmRef.current = null; prevLeftPalmRef.current = null;

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
  }, [dispatchGesture]);

  const startCamera = async () => {
    setStatus("loading"); setErrorMsg("");
    try {
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
      await loadScript("https://cdn.jsdelivr.net/npm/plotly.js-dist@2.27.0/plotly.min.js");
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
    if (plotlyDivRef.current && window.Plotly) { try { window.Plotly.purge(plotlyDivRef.current); } catch {} }
  }, []);

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
              {mode === "holo" && (
                <>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <span style={{ color: "#fb923c" }}>Z×{peakScale.toFixed(2)}</span>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-5">
        <div className="relative w-full max-w-4xl" style={{ aspectRatio: "16/9" }}>
          <video ref={videoRef} playsInline muted autoPlay
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", background: "#000", borderRadius: "1rem", display: "block" }} />

          {/* Plotly holo — tanpa background/border, murni transparan */}
          <div style={{
            position: "absolute", top: "5%", left: "4%",
            width: "44%", height: "62%",
            zIndex: 6,
            pointerEvents: mode === "holo" ? "auto" : "none",
            opacity: mode === "holo" && status === "running" ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}>
            <div ref={plotlyDivRef} style={{ width: "100%", height: "100%" }} />
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
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: 360, padding: "0 24px", textAlign: "center" }}>
                <span style={{ fontSize: 46 }}>✋</span>
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.12em", fontFamily: "monospace", color: "#67e8f9", margin: 0 }}>HAND<span style={{ color: "#fff" }}>AR</span></h1>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
                  {Object.entries(GESTURE_META).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(0,255,200,0.04)", border: "1px solid rgba(0,255,200,0.1)" }}>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: v.color, margin: 0, fontFamily: "monospace" }}>{v.label}</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", margin: 0 }}>{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(0,255,200,0.05)", border: "1px solid rgba(0,255,200,0.18)", color: "#67e8f9", fontSize: 11, fontFamily: "monospace" }}>
                  💠 HOLO — Gerak tangan = putar · ✌️ Peace = naik/turun nilai
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
              <p style={{ color: "#67e8f9", fontSize: 13, fontFamily: "monospace" }}>LOADING AI + PLOTLY...</p>
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