import { useEffect, useRef } from "react";

/**
 * VR-style immersive magical background.
 * - 3D starfield with perspective projection (z-depth → parallax)
 * - Floating glowing orbs that drift through space
 * - Nebula clouds that breathe with scroll
 * - Mouse + device-orientation camera tilt for headset feel
 * - Pointer-attracted sparks (cursor as wand)
 */
export function MagicalBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    // Camera state — mouse + device tilt
    const cam = { x: 0, y: 0, tx: 0, ty: 0, scrollY: 0 };
    const onMouse = (e: MouseEvent) => {
      cam.tx = (e.clientX / W() - 0.5) * 2;
      cam.ty = (e.clientY / H() - 0.5) * 2;
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      cam.tx = (e.touches[0].clientX / W() - 0.5) * 2;
      cam.ty = (e.touches[0].clientY / H() - 0.5) * 2;
    };
    const onScroll = () => {
      cam.scrollY = window.scrollY;
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma != null && e.beta != null) {
        cam.tx = Math.max(-1, Math.min(1, e.gamma / 30));
        cam.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("deviceorientation", onOrient);

    // ---- STARFIELD (3D) ----
    type Star = { x: number; y: number; z: number; pz: number; c: string };
    const STAR_COUNT = Math.min(260, Math.floor((W() * H()) / 7000));
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1000 + 100,
      pz: 0,
      c: Math.random() > 0.7 ? "212,175,55" : Math.random() > 0.5 ? "80,220,130" : "200,220,255",
    }));

    // ---- ORBS (floating glowing spheres) ----
    type Orb = { x: number; y: number; z: number; r: number; vx: number; vy: number; hue: string; phase: number };
    const orbs: Orb[] = Array.from({ length: 9 }, () => ({
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 800,
      z: Math.random() * 600 + 200,
      r: Math.random() * 50 + 30,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      hue: Math.random() > 0.5 ? "212,175,55" : "80,220,130",
      phase: Math.random() * Math.PI * 2,
    }));

    // ---- SPARKS (pointer-attracted) ----
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string };
    const sparks: Spark[] = [];
    let lastMouseX = W() / 2;
    let lastMouseY = H() / 2;
    const trackMouse = (e: MouseEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      // emit spark trail
      if (Math.random() > 0.6) {
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.3,
          life: 0,
          max: 60 + Math.random() * 40,
          c: Math.random() > 0.5 ? "212,175,55" : "80,220,130",
        });
      }
    };
    window.addEventListener("mousemove", trackMouse);

    // ---- LIGHTNING bolts (rare) ----
    let lightning = 0;
    const triggerLightning = () => {
      if (Math.random() > 0.997) lightning = 1;
    };

    const project = (x: number, y: number, z: number) => {
      const fov = 600;
      const sx = (x / z) * fov + W() / 2 + cam.x * 40;
      const sy = (y / z) * fov + H() / 2 + cam.y * 40 - cam.scrollY * 0.05;
      const scale = fov / z;
      return { sx, sy, scale };
    };

    let t = 0;
    const tick = () => {
      t += 1;
      // smooth camera
      cam.x += (cam.tx - cam.x) * 0.05;
      cam.y += (cam.ty - cam.y) * 0.05;

      // motion-blur trail
      ctx.fillStyle = "rgba(10, 18, 14, 0.22)";
      ctx.fillRect(0, 0, W(), H());

      // Nebula radial glow that breathes with scroll
      const breathe = 0.5 + Math.sin(t * 0.005 + cam.scrollY * 0.001) * 0.15;
      const g1 = ctx.createRadialGradient(
        W() * (0.3 + cam.x * 0.1),
        H() * (0.3 + cam.y * 0.1),
        0,
        W() * 0.3,
        H() * 0.3,
        Math.max(W(), H()) * 0.7
      );
      g1.addColorStop(0, `rgba(80, 220, 130, ${0.08 * breathe})`);
      g1.addColorStop(1, "rgba(80, 220, 130, 0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W(), H());

      const g2 = ctx.createRadialGradient(
        W() * (0.75 - cam.x * 0.1),
        H() * (0.75 - cam.y * 0.1),
        0,
        W() * 0.75,
        H() * 0.75,
        Math.max(W(), H()) * 0.7
      );
      g2.addColorStop(0, `rgba(212, 175, 55, ${0.08 * breathe})`);
      g2.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W(), H());

      // ---- 3D WIREFRAME GRID FLOOR (VR horizon) ----
      const horizon = H() * 0.62 + cam.y * 30;
      const vp = W() / 2 + cam.x * 60;
      ctx.strokeStyle = "rgba(80, 220, 130, 0.18)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(80,220,130,0.5)";
      const offset = (t * 0.6) % 40;
      for (let i = -10; i <= 20; i++) {
        const zRow = i * 40 + offset;
        const yRow = horizon + (zRow * zRow) * 0.0018;
        if (yRow > H() + 20) continue;
        ctx.beginPath();
        ctx.moveTo(0, yRow);
        ctx.lineTo(W(), yRow);
        ctx.stroke();
      }
      for (let i = -14; i <= 14; i++) {
        ctx.beginPath();
        ctx.moveTo(vp, horizon);
        ctx.lineTo(vp + i * (W() / 8), H() + 50);
        ctx.stroke();
      }
      // gold counter-floor on top edge for VR ceiling effect
      ctx.strokeStyle = "rgba(212,175,55,0.10)";
      const ceil = H() * 0.18 + cam.y * 30;
      for (let i = -10; i <= 20; i++) {
        const zRow = i * 40 + offset;
        const yRow = ceil - (zRow * zRow) * 0.0014;
        if (yRow < -20) continue;
        ctx.beginPath();
        ctx.moveTo(0, yRow);
        ctx.lineTo(W(), yRow);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // STARS — fly toward camera
      stars.forEach((s) => {
        s.pz = s.z;
        s.z -= 1.2;
        if (s.z < 1) {
          s.x = (Math.random() - 0.5) * 2000;
          s.y = (Math.random() - 0.5) * 2000;
          s.z = 1000;
          s.pz = s.z;
        }
        const p = project(s.x, s.y, s.z);
        const pp = project(s.x, s.y, s.pz);
        if (p.sx < -50 || p.sx > W() + 50 || p.sy < -50 || p.sy > H() + 50) return;
        const a = Math.min(1, (1000 - s.z) / 1000);
        ctx.strokeStyle = `rgba(${s.c}, ${a * 0.9})`;
        ctx.lineWidth = Math.max(0.5, p.scale * 1.2);
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${s.c}, 0.8)`;
        ctx.beginPath();
        ctx.moveTo(pp.sx, pp.sy);
        ctx.lineTo(p.sx, p.sy);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // ORBS — depth-sorted
      orbs
        .slice()
        .sort((a, b) => b.z - a.z)
        .forEach((o) => {
          o.x += o.vx;
          o.y += o.vy;
          o.phase += 0.02;
          if (o.x < -800 || o.x > 800) o.vx *= -1;
          if (o.y < -500 || o.y > 500) o.vy *= -1;
          const p = project(o.x, o.y, o.z);
          const pulse = 1 + Math.sin(o.phase) * 0.15;
          const r = o.r * p.scale * pulse;
          if (r < 1) return;
          const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r);
          grad.addColorStop(0, `rgba(${o.hue}, 0.55)`);
          grad.addColorStop(0.4, `rgba(${o.hue}, 0.2)`);
          grad.addColorStop(1, `rgba(${o.hue}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
          ctx.fill();
          // bright core
          ctx.fillStyle = `rgba(${o.hue}, ${0.9 * pulse})`;
          ctx.shadowBlur = 25;
          ctx.shadowColor = `rgba(${o.hue}, 1)`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(1, r * 0.08), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

      // SPARKS — wand trail attracted to last mouse
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        // attraction toward cursor for swirl effect
        const dx = lastMouseX - s.x;
        const dy = lastMouseY - s.y;
        const d = Math.hypot(dx, dy) + 0.001;
        s.vx += (dx / d) * 0.02;
        s.vy += (dy / d) * 0.02 - 0.01;
        s.vx *= 0.97;
        s.vy *= 0.97;
        s.x += s.vx;
        s.y += s.vy;
        const a = 1 - s.life / s.max;
        if (a <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(${s.c}, ${a})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${s.c}, 1)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.6 * a + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // LIGHTNING flash
      triggerLightning();
      if (lightning > 0) {
        ctx.fillStyle = `rgba(180, 255, 200, ${lightning * 0.12})`;
        ctx.fillRect(0, 0, W(), H());
        lightning -= 0.08;
        if (lightning < 0) lightning = 0;
      }

      // SCANLINE overlay (very subtle, VR-headset feel)
      ctx.fillStyle = "rgba(80, 220, 130, 0.015)";
      for (let y = 0; y < H(); y += 3) ctx.fillRect(0, y, W(), 1);

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mousemove", trackMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden
      />
      {/* Vignette + chromatic aberration overlay for VR feel */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none mix-blend-screen opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(80,220,130,0.06), transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(212,175,55,0.06), transparent 50%)",
        }}
      />
    </>
  );
}
