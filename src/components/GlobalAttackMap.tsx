import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "./Section";
import { Globe2, Activity, Shield, Radio, Flame, ShieldCheck, Skull, Zap, Pause, Play, SkipForward, RotateCcw, Camera } from "lucide-react";
import { toast } from "sonner";
import { hackBurst, beep, clickTick } from "@/lib/hackSound";

type City = { name: string; lat: number; lon: number; country: string };
const CITIES: City[] = [
  { name: "Delhi",       lat: 28.6,  lon: 77.2,  country: "IN" },
  { name: "Mumbai",      lat: 19.0,  lon: 72.8,  country: "IN" },
  { name: "Singapore",   lat: 1.35,  lon: 103.8, country: "SG" },
  { name: "Tokyo",       lat: 35.7,  lon: 139.7, country: "JP" },
  { name: "Beijing",     lat: 39.9,  lon: 116.4, country: "CN" },
  { name: "Moscow",      lat: 55.75, lon: 37.6,  country: "RU" },
  { name: "Berlin",      lat: 52.5,  lon: 13.4,  country: "DE" },
  { name: "London",      lat: 51.5,  lon: -0.1,  country: "GB" },
  { name: "Paris",       lat: 48.85, lon: 2.35,  country: "FR" },
  { name: "New York",    lat: 40.7,  lon: -74,   country: "US" },
  { name: "San Francisco", lat: 37.77, lon: -122.4, country: "US" },
  { name: "São Paulo",   lat: -23.5, lon: -46.6, country: "BR" },
  { name: "Sydney",      lat: -33.8, lon: 151.2, country: "AU" },
  { name: "Lagos",       lat: 6.5,   lon: 3.4,   country: "NG" },
  { name: "Dubai",       lat: 25.2,  lon: 55.3,  country: "AE" },
];

const VECTORS = ["DDoS", "SQLi", "XSS", "Brute", "Phish", "Ransom", "ZeroDay", "MITM", "RCE"] as const;
type Vector = typeof VECTORS[number];

type Attack = { from: City; to: City; vector: Vector; t: number; dur: number; blocked: boolean };

export function GlobalAttackMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ total: 0, blocked: 0, breached: 0 });
  const [feed, setFeed] = useState<Attack[]>([]);
  const [intensity, setIntensity] = useState(3); // 1-5
  const [firewall, setFirewall] = useState(true);
  const [hackMode, setHackMode] = useState(false);
  const [filters, setFilters] = useState<Record<Vector, boolean>>(
    () => Object.fromEntries(VECTORS.map((v) => [v, true])) as Record<Vector, boolean>
  );
  const [sound, setSound] = useState(true);
  const [paused, setPaused] = useState(false);
  const stepRef = useRef(0);

  // refs to read latest in animation loop
  const filtersRef = useRef(filters);
  const intensityRef = useRef(intensity);
  const firewallRef = useRef(firewall);
  const hackRef = useRef(hackMode);
  const soundRef = useRef(sound);
  const pausedRef = useRef(paused);
  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => { intensityRef.current = intensity; }, [intensity]);
  useEffect(() => { firewallRef.current = firewall; }, [firewall]);
  useEffect(() => { hackRef.current = hackMode; }, [hackMode]);
  useEffect(() => { soundRef.current = sound; }, [sound]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const SIZE = 520;
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width = "100%";
    canvas.style.maxWidth = SIZE + "px";
    canvas.style.height = "auto";
    ctx.scale(DPR, DPR);

    const cx = SIZE / 2, cy = SIZE / 2, R = SIZE / 2 - 24;
    let rot = 0;
    const attacks: Attack[] = [];
    let firewallPulse = 0;

    const project = (lat: number, lon: number, rotation: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = ((lon + rotation) * Math.PI) / 180;
      const x = Math.cos(phi) * Math.sin(theta);
      const y = -Math.sin(phi);
      const z = Math.cos(phi) * Math.cos(theta);
      return { x: cx + x * R, y: cy + y * R, z };
    };

    let spawnTimer = 0;
    let raf = 0;

    const draw = () => {
      const fw = firewallRef.current;
      const hack = hackRef.current;
      const inten = intensityRef.current;
      const flt = filtersRef.current;
      const isPaused = pausedRef.current && stepRef.current === 0;

      if (isPaused) {
        // freeze: redraw last frame state without advancing time
        raf = requestAnimationFrame(draw);
        return;
      }
      if (stepRef.current > 0) stepRef.current--;

      // spawn attacks based on intensity
      spawnTimer++;
      const spawnEvery = Math.max(4, 30 - inten * 5);
      if (spawnTimer >= spawnEvery) {
        spawnTimer = 0;
        const enabled = VECTORS.filter((v) => flt[v]);
        if (enabled.length) {
          const a = CITIES[Math.floor(Math.random() * CITIES.length)];
          let b = CITIES[Math.floor(Math.random() * CITIES.length)];
          if (b === a) b = CITIES[(CITIES.indexOf(a) + 1) % CITIES.length];
          const blockProb = fw ? 0.85 - (inten - 3) * 0.05 : 0.1;
          const atk: Attack = {
            from: a, to: b,
            vector: enabled[Math.floor(Math.random() * enabled.length)],
            t: 0, dur: 50 + Math.random() * 50,
            blocked: Math.random() < blockProb,
          };
          attacks.push(atk);
          if (soundRef.current) {
            if (atk.blocked) beep(1200, 0.025, "square", 0.012);
            else beep(180, 0.06, "sawtooth", 0.025);
          }
          setStats((s) => ({
            total: s.total + 1,
            blocked: s.blocked + (atk.blocked ? 1 : 0),
            breached: s.breached + (atk.blocked ? 0 : 1),
          }));
          setFeed((f) => [atk, ...f].slice(0, 9));
        }
      }

      ctx.clearRect(0, 0, SIZE, SIZE);

      // bg glow — red tint in hack mode
      const grad = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.4);
      grad.addColorStop(0, hack ? "oklch(0.55 0.24 25 / 0.22)" : "oklch(0.5 0.18 150 / 0.18)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // firewall ring
      if (fw) {
        firewallPulse += 0.04;
        const pulse = (Math.sin(firewallPulse) + 1) / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, R + 10 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `oklch(0.78 0.18 145 / ${0.35 + pulse * 0.4})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        // inner shield arc segments
        for (let i = 0; i < 12; i++) {
          const a0 = (i / 12) * Math.PI * 2 + firewallPulse * 0.1;
          ctx.beginPath();
          ctx.arc(cx, cy, R + 4, a0, a0 + 0.18);
          ctx.strokeStyle = `oklch(0.85 0.22 145 / ${0.5 + pulse * 0.4})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      // sphere
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = hack ? "oklch(0.12 0.08 25 / 0.85)" : "oklch(0.13 0.04 160 / 0.85)";
      ctx.fill();
      ctx.strokeStyle = hack ? "oklch(0.65 0.26 25 / 0.7)" : "oklch(0.85 0.22 145 / 0.55)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // graticule
      ctx.strokeStyle = hack ? "oklch(0.65 0.26 25 / 0.18)" : "oklch(0.85 0.22 145 / 0.18)";
      ctx.lineWidth = 0.6;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = project(lat, lon, rot);
          if (p.z < 0) { ctx.moveTo(p.x, p.y); continue; }
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let lon = -180; lon <= 180; lon += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(lat, lon, rot);
          if (p.z < 0) { ctx.moveTo(p.x, p.y); continue; }
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // cities
      CITIES.forEach((c) => {
        const p = project(c.lat, c.lon, rot);
        if (p.z < 0) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = hack ? "oklch(0.85 0.26 25)" : "oklch(0.85 0.22 145 / 0.9)";
        ctx.fill();
      });

      // attacks
      for (let i = attacks.length - 1; i >= 0; i--) {
        const a = attacks[i];
        a.t++;
        const k = a.t / a.dur;
        if (k > 1) { attacks.splice(i, 1); continue; }
        const p1 = project(a.from.lat, a.from.lon, rot);
        const p2 = project(a.to.lat, a.to.lon, rot);
        if (p1.z < -0.3 && p2.z < -0.3) continue;
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2 - 80 * (1 - Math.abs(p1.z - p2.z));
        const ease = k;
        const bx = (1 - ease) * (1 - ease) * p1.x + 2 * (1 - ease) * ease * mx + ease * ease * p2.x;
        const by = (1 - ease) * (1 - ease) * p1.y + 2 * (1 - ease) * ease * my + ease * ease * p2.y;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(mx, my, bx, by);
        ctx.strokeStyle = a.blocked
          ? `oklch(0.78 0.18 145 / ${0.6 * (1 - k * 0.6)})`
          : `oklch(0.6 0.24 25 / ${0.8 * (1 - k * 0.6)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = a.blocked ? "oklch(0.85 0.22 145)" : "oklch(0.65 0.26 25)";
        ctx.fill();

        // firewall hit flash near edge
        if (a.blocked && k > 0.85 && k < 0.92 && fw) {
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, 12, 0, Math.PI * 2);
          ctx.strokeStyle = "oklch(0.85 0.22 145 / 0.7)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      rot += 0.08 + inten * 0.03;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleVector = (v: Vector) => {
    setFilters((f) => ({ ...f, [v]: !f[v] }));
    clickTick();
  };

  return (
    <Section eyebrow="LIVE THREAT MAP" title="Global Cyber Attack View" id="threat-map">
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`relative rounded-2xl border bg-card/50 p-4 overflow-hidden transition-colors ${
            hackMode ? "border-destructive/60 shadow-[0_0_60px_oklch(0.55_0.24_25/0.4)]" : "border-border"
          }`}
        >
          <div className="absolute inset-0 scanlines pointer-events-none" />
          <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-muted-foreground flex-wrap">
            <span className={`w-2 h-2 rounded-full animate-pulse ${hackMode ? "bg-destructive" : "bg-accent"}`} />
            <Radio className="w-3.5 h-3.5 text-accent" />
            LIVE · 3D GLOBE · {CITIES.length} NODES · INTENSITY {intensity}/5
            {hackMode && <span className="text-destructive">· ⚠ HACK_MODE</span>}
            {!firewall && <span className="text-destructive">· ✗ FIREWALL_DOWN</span>}
            {paused && <span className="text-primary">· ❚❚ PAUSED · INSPECT</span>}
          </div>

          {/* PLAYBACK CONTROLS */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              onClick={() => { setPaused((v) => !v); clickTick(); }}
              data-cursor="hover"
              className={`px-2.5 py-1 text-[10px] font-mono rounded border inline-flex items-center gap-1.5 transition-all ${
                paused ? "bg-primary/15 border-primary/60 text-primary" : "bg-accent/15 border-accent/60 text-accent"
              }`}
            >
              {paused ? <><Play className="w-3 h-3" /> resume</> : <><Pause className="w-3 h-3" /> pause</>}
            </button>
            <button
              onClick={() => { stepRef.current = 1; clickTick(); }}
              disabled={!paused}
              data-cursor="hover"
              className="px-2.5 py-1 text-[10px] font-mono rounded border inline-flex items-center gap-1.5 bg-background/40 border-border text-muted-foreground hover:text-accent disabled:opacity-40"
            >
              <SkipForward className="w-3 h-3" /> step
            </button>
            <button
              onClick={() => {
                setStats({ total: 0, blocked: 0, breached: 0 });
                setFeed([]);
                clickTick();
                toast("✦ Telemetry buffer cleared");
              }}
              data-cursor="hover"
              className="px-2.5 py-1 text-[10px] font-mono rounded border inline-flex items-center gap-1.5 bg-background/40 border-border text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="w-3 h-3" /> reset
            </button>
            <button
              onClick={() => {
                const c = canvasRef.current; if (!c) return;
                const url = c.toDataURL("image/png");
                const a = document.createElement("a");
                a.href = url; a.download = `threat-map-${Date.now()}.png`; a.click();
                clickTick();
                toast.success("✦ Snapshot exported");
              }}
              data-cursor="hover"
              className="px-2.5 py-1 text-[10px] font-mono rounded border inline-flex items-center gap-1.5 bg-background/40 border-border text-muted-foreground hover:text-primary"
            >
              <Camera className="w-3 h-3" /> snapshot
            </button>
          </div>

          <div className="flex justify-center">
            <canvas ref={canvasRef} className="rounded-full" />
          </div>

          {/* CONTROLS */}
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground mr-1">// vectors:</span>
              {VECTORS.map((v) => (
                <button
                  key={v}
                  onClick={() => toggleVector(v)}
                  data-cursor="hover"
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${
                    filters[v]
                      ? "bg-accent/15 border-accent/60 text-accent"
                      : "bg-background/40 border-border text-muted-foreground line-through"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
              <label className="font-mono text-[10px] text-muted-foreground flex items-center gap-2">
                <Flame className="w-3 h-3 text-destructive" /> intensity
                <input
                  type="range" min={1} max={5} value={intensity}
                  onChange={(e) => { setIntensity(+e.target.value); clickTick(); }}
                  data-cursor="hover"
                  className="flex-1 accent-[oklch(0.85_0.22_145)]"
                />
                <span className="text-accent w-4">{intensity}</span>
              </label>

              <Toggle
                active={firewall} onClick={() => { setFirewall((v) => !v); hackBurst(); }}
                icon={ShieldCheck} label={firewall ? "firewall: ON" : "firewall: OFF"}
                color={firewall ? "accent" : "destructive"}
              />
              <Toggle
                active={hackMode} onClick={() => { setHackMode((v) => !v); hackBurst(); }}
                icon={Skull} label={hackMode ? "hack_mode: ON" : "hack_mode"}
                color="destructive"
              />
              <Toggle
                active={sound} onClick={() => { setSound((v) => !v); clickTick(); }}
                icon={Zap} label={sound ? "sfx: ON" : "sfx: OFF"}
                color="primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 font-mono text-xs">
            <Stat icon={Activity} label="ATTACKS" value={stats.total} color="text-primary" />
            <Stat icon={Shield} label="BLOCKED" value={stats.blocked} color="text-accent" />
            <Stat icon={Globe2} label="BREACHED" value={stats.breached} color="text-destructive" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-border bg-card/50 p-4"
        >
          <MiniMap feed={feed} hack={hackMode} />
          <div className="font-mono text-xs text-accent mb-3 mt-4">// LIVE FEED · /var/log/soc</div>
          <div className="space-y-1.5 font-mono text-[11px] max-h-[340px] overflow-hidden">
            {feed.length === 0 && <div className="text-muted-foreground">awaiting telemetry…</div>}
            {feed.map((a, i) => (
              <motion.div
                key={i + a.from.name + a.to.name + a.t}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 p-1.5 rounded border ${
                  a.blocked ? "bg-background/50 border-border/50" : "bg-destructive/10 border-destructive/40"
                }`}
              >
                <span className="text-muted-foreground">{new Date().toTimeString().slice(0, 8)}</span>
                <span className={a.blocked ? "text-accent" : "text-destructive font-bold"}>
                  {a.blocked ? "BLOCK" : "ALERT"}
                </span>
                <span className="text-foreground/80">{a.vector}</span>
                <span className="text-muted-foreground">{a.from.country}→{a.to.country}</span>
                <span className="text-foreground/60 truncate">{a.from.name}→{a.to.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function Toggle({ active, onClick, icon: Icon, label, color }: any) {
  const cls = active
    ? color === "destructive"
      ? "bg-destructive/15 border-destructive/60 text-destructive"
      : color === "primary"
      ? "bg-primary/15 border-primary/60 text-primary"
      : "bg-accent/15 border-accent/60 text-accent"
    : "bg-background/40 border-border text-muted-foreground";
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      className={`px-2.5 py-1 text-[10px] font-mono rounded border inline-flex items-center gap-1.5 transition-all ${cls}`}
    >
      <Icon className="w-3 h-3" /> {label}
    </button>
  );
}

function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground"><Icon className="w-3 h-3" /> {label}</div>
      <div className={`text-xl ${color} mt-1`}>{value}</div>
    </div>
  );
}

function MiniMap({ feed, hack }: { feed: Attack[]; hack: boolean }) {
  // simple equirectangular projection 360x180 lon/lat -> w/h
  const W = 320, H = 160;
  const proj = (lat: number, lon: number) => ({
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  });
  const stroke = hack ? "oklch(0.65 0.26 25 / 0.4)" : "oklch(0.78 0.18 145 / 0.35)";
  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="font-mono text-[10px] text-muted-foreground mb-2 flex items-center justify-between">
        <span>// 2D MINIMAP · equirectangular</span>
        <span className="text-accent">{feed.length} active</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* graticule */}
        <rect x={0} y={0} width={W} height={H} fill={hack ? "oklch(0.1 0.05 25 / 0.5)" : "oklch(0.13 0.04 160 / 0.5)"} />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(i + 1) * (H / 8)} x2={W} y2={(i + 1) * (H / 8)} stroke={stroke} strokeWidth={0.4} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * (W / 12)} y1={0} x2={(i + 1) * (W / 12)} y2={H} stroke={stroke} strokeWidth={0.4} />
        ))}
        {/* nodes */}
        {CITIES.map((c) => {
          const p = proj(c.lat, c.lon);
          return <circle key={c.name} cx={p.x} cy={p.y} r={1.4} fill={hack ? "oklch(0.85 0.26 25)" : "oklch(0.85 0.22 145)"} />;
        })}
        {/* attack arcs */}
        {feed.slice(0, 6).map((a, i) => {
          const p1 = proj(a.from.lat, a.from.lon);
          const p2 = proj(a.to.lat, a.to.lon);
          const mx = (p1.x + p2.x) / 2;
          const my = Math.min(p1.y, p2.y) - 18;
          const col = a.blocked ? "oklch(0.85 0.22 145)" : "oklch(0.65 0.26 25)";
          return (
            <g key={i}>
              <path d={`M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`} stroke={col} strokeWidth={0.8} fill="none" opacity={0.7}>
                <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="1.5s" repeatCount="indefinite" />
              </path>
              <circle cx={p2.x} cy={p2.y} r={2} fill={col}>
                <animate attributeName="r" values="2;5;2" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
