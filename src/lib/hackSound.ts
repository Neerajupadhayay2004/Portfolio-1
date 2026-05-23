let ctx: AudioContext | null = null;
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

export function beep(freq = 880, dur = 0.06, type: OscillatorType = "square", gain = 0.05) {
  const a = ac(); if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g).connect(a.destination);
  const t = a.currentTime;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur);
}

export function hackBurst() {
  const seq = [440, 660, 880, 1320, 990, 1760];
  seq.forEach((f, i) => setTimeout(() => beep(f, 0.05, "square", 0.04), i * 55));
}

export function clickTick() { beep(1400, 0.02, "square", 0.025); }
export function keyTick() { beep(900 + Math.random() * 400, 0.012, "square", 0.018); }
export function successChime() {
  [523, 659, 784, 1046].forEach((f, i) =>
    setTimeout(() => beep(f, 0.12, "sine", 0.05), i * 80)
  );
}
