import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      setEnabled(false);
      return;
    }
    document.body.style.cursor = "none";

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const canvas = trailRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    let mx = w / 2, my = h / 2, rx = mx, ry = my;
    const trail: { x: number; y: number; a: number }[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
      trail.push({ x: mx, y: my, a: 1 });
      if (trail.length > 28) trail.shift();
      const t = e.target as HTMLElement;
      const interactive = !!t.closest("a,button,input,textarea,select,[role=button],[data-cursor=hover]");
      setHover(interactive);
    };
    const onDown = () => ring.classList.add("cc-down");
    const onUp = () => ring.classList.remove("cc-down");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;

      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.a *= 0.92;
        ctx.beginPath();
        ctx.fillStyle = `oklch(0.85 0.22 145 / ${p.a})`;
        ctx.arc(p.x, p.y, 2 + i * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={trailRef} className="pointer-events-none fixed inset-0 z-[9998]" />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] w-8 h-8 rounded-full border-2 mix-blend-screen transition-[width,height,background,border-color] duration-150 ${
          hover
            ? "w-12 h-12 border-[oklch(0.78_0.16_85)] bg-[oklch(0.78_0.16_85_/_0.12)]"
            : "border-[oklch(0.85_0.22_145)] bg-[oklch(0.85_0.22_145_/_0.05)]"
        }`}
        style={{ boxShadow: "0 0 18px oklch(0.85 0.22 145 / 0.55)" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] w-1.5 h-1.5 rounded-full bg-[oklch(0.85_0.22_145)]"
      />
      <style>{`
        .cc-down { transform: translate(var(--x),var(--y)) scale(0.7) !important; }
        @media (pointer: coarse) { canvas { display: none; } }
      `}</style>
    </>
  );
}
