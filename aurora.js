/**
 * Cloud AI Architect V2 — Futuristic Cosmic Aurora Live Wallpaper
 * Pure Canvas 2D procedural flowing energy field with electric violet & neon lime ribbons.
 * Ultra-lightweight, 60 FPS, silky smooth and non-intrusive.
 */

(function() {
  function initAuroraWallpaper() {
    const canvas = document.getElementById("aurora-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let t = 0;

  // Reduced motion preference check
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Floating ambient micro-particles
  const PARTICLE_COUNT = 32;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.35 - 0.1,
      color: Math.random() > 0.4 ? "rgba(125, 57, 235, " : "rgba(198, 255, 51, ",
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  // Energy ribbon configurations
  const ribbons = [
    {
      baseY: 0.22,
      amplitude: 140,
      wavelength: 0.0016,
      speed: 0.00045,
      colorStart: "rgba(125, 57, 235, 0.48)",
      colorMid: "rgba(155, 66, 245, 0.28)",
      colorEnd: "rgba(125, 57, 235, 0)",
      thickness: 240,
      phase: 0
    },
    {
      baseY: 0.38,
      amplitude: 180,
      wavelength: 0.0012,
      speed: 0.00035,
      colorStart: "rgba(198, 255, 51, 0.28)",
      colorMid: "rgba(125, 57, 235, 0.35)",
      colorEnd: "rgba(198, 255, 51, 0)",
      thickness: 280,
      phase: Math.PI * 0.6
    },
    {
      baseY: 0.65,
      amplitude: 160,
      wavelength: 0.0014,
      speed: 0.0004,
      colorStart: "rgba(125, 57, 235, 0.42)",
      colorMid: "rgba(198, 255, 51, 0.22)",
      colorEnd: "rgba(125, 57, 235, 0)",
      thickness: 320,
      phase: Math.PI * 1.2
    },
    {
      baseY: 0.85,
      amplitude: 130,
      wavelength: 0.0018,
      speed: 0.0005,
      colorStart: "rgba(198, 255, 51, 0.24)",
      colorMid: "rgba(125, 57, 235, 0.26)",
      colorEnd: "rgba(125, 57, 235, 0)",
      thickness: 260,
      phase: Math.PI * 1.8
    }
  ];

  function drawRibbon(r, time) {
    const points = [];
    const segments = 24;
    const step = width / segments;
    const baseY = r.baseY * height;

    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const wave1 = Math.sin(x * r.wavelength + time * r.speed * 1000 + r.phase);
      const wave2 = Math.cos(x * (r.wavelength * 1.7) - time * r.speed * 600 + r.phase * 0.5);
      const wave3 = Math.sin(time * 0.0006 + x * 0.0005);
      const y = baseY + (wave1 * 0.6 + wave2 * 0.3 + wave3 * 0.1) * r.amplitude;
      points.push({ x, y });
    }

    // Draw main glowing ribbon body
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, baseY - r.amplitude, 0, baseY + r.thickness);
    grad.addColorStop(0, r.colorStart);
    grad.addColorStop(0.4, r.colorMid);
    grad.addColorStop(1, r.colorEnd);
    ctx.fillStyle = grad;
    ctx.globalCompositeOperation = "screen";
    ctx.fill();

    // Draw fine high-intensity filament spine
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(last.x, last.y);
    ctx.strokeStyle = r.colorStart;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
  }

  function render(now) {
    if (!prefersReducedMotion) {
      t = now * 0.001;
    }

    // 1. Deep cosmic near-black canvas background
    ctx.fillStyle = "#020105";
    ctx.fillRect(0, 0, width, height);

    // 2. Large ambient atmospheric cosmic pools
    const p1X = width * (0.2 + Math.sin(t * 0.25) * 0.12);
    const p1Y = height * (0.3 + Math.cos(t * 0.2) * 0.1);
    const grad1 = ctx.createRadialGradient(p1X, p1Y, 10, p1X, p1Y, width * 0.55);
    grad1.addColorStop(0, "rgba(125, 57, 235, 0.25)");
    grad1.addColorStop(0.6, "rgba(125, 57, 235, 0.06)");
    grad1.addColorStop(1, "rgba(2, 1, 5, 0)");
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    const p2X = width * (0.8 + Math.cos(t * 0.3) * 0.15);
    const p2Y = height * (0.4 + Math.sin(t * 0.22) * 0.12);
    const grad2 = ctx.createRadialGradient(p2X, p2Y, 10, p2X, p2Y, width * 0.45);
    grad2.addColorStop(0, "rgba(198, 255, 51, 0.18)");
    grad2.addColorStop(0.5, "rgba(125, 57, 235, 0.08)");
    grad2.addColorStop(1, "rgba(2, 1, 5, 0)");
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);

    // 3. Render flowing energy ribbons
    for (let i = 0; i < ribbons.length; i++) {
      drawRibbon(ribbons[i], t);
    }

    // 4. Render drifting glowing micro-particles
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!prefersReducedMotion) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.03;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      }

      const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + currentAlpha + ")";
      ctx.shadowColor = p.color + "1)";
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    ctx.restore();

    // 5. Central subtle vignette for pristine text contrast
    const centerX = width * 0.5;
    const centerY = height * 0.45;
    const vignette = ctx.createRadialGradient(centerX, centerY, width * 0.2, centerX, centerY, width * 0.85);
    vignette.addColorStop(0, "rgba(2, 1, 5, 0.45)");
    vignette.addColorStop(0.65, "rgba(2, 1, 5, 0.15)");
    vignette.addColorStop(1, "rgba(2, 1, 5, 0.55)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  // Start animation loop
  animationFrameId = requestAnimationFrame(render);
}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuroraWallpaper);
  } else {
    initAuroraWallpaper();
  }
})();
