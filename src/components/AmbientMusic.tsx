import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Self-contained ambient "Hedwig-ish" pad generated with Web Audio API.
 * No external assets — fully offline, copyright-clean.
 */
export function AmbientMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const seqRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  // Hedwig-inspired motif (B minor-ish)
  const motif = [
    { f: 246.94, d: 0.6 }, // B3
    { f: 392.0, d: 0.6 }, // G4
    { f: 369.99, d: 1.2 }, // F#4
    { f: 293.66, d: 0.6 }, // D4
    { f: 246.94, d: 1.2 }, // B3
    { f: 220.0, d: 0.6 }, // A3
    { f: 196.0, d: 1.2 }, // G3
  ];

  const stop = () => {
    if (seqRef.current) window.clearTimeout(seqRef.current);
    seqRef.current = null;
    nodesRef.current.forEach((n) => {
      try {
        n.gain.gain.cancelScheduledValues(0);
        n.gain.gain.setValueAtTime(n.gain.gain.value, ctxRef.current!.currentTime);
        n.gain.gain.linearRampToValueAtTime(0, ctxRef.current!.currentTime + 0.4);
        n.osc.stop(ctxRef.current!.currentTime + 0.5);
      } catch {}
    });
    nodesRef.current = [];
  };

  const playNote = (freq: number, dur: number, when: number) => {
    const ctx = ctxRef.current!;
    // Flute-like: sine carrier + soft breath noise + vibrato
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator(); // octave shimmer
    const gain = ctx.createGain();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();

    osc.type = "sine";
    osc2.type = "sine";
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 2;

    vibrato.frequency.value = 5.5;
    vibratoGain.gain.value = freq * 0.008;
    vibrato.connect(vibratoGain).connect(osc.frequency);
    vibrato.connect(vibratoGain).connect(osc2.frequency);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.08;
    osc2.connect(osc2Gain).connect(gain);

    // Soft attack & release — wooden flute envelope
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.16, when + 0.12);
    gain.gain.linearRampToValueAtTime(0.12, when + dur * 0.7);
    gain.gain.linearRampToValueAtTime(0, when + dur);

    osc.connect(gain).connect(masterRef.current!);
    osc.start(when);
    vibrato.start(when);
    osc2.start(when);
    osc.stop(when + dur + 0.1);
    osc2.stop(when + dur + 0.1);
    vibrato.stop(when + dur + 0.1);
    nodesRef.current.push({ osc, gain });
    nodesRef.current.push({ osc: osc2, gain: osc2Gain });
    nodesRef.current.push({ osc: vibrato, gain: vibratoGain });
  };

  const start = async () => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0.35;
      // gentle reverb-ish via lowpass
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2200;
      master.connect(lp).connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    const ctx = ctxRef.current!;
    if (ctx.state === "suspended") await ctx.resume();

    let cursor = ctx.currentTime + 0.1;
    const scheduleLoop = () => {
      motif.forEach((n) => {
        playNote(n.f, n.d * 0.9, cursor);
        // soft harmony a fifth below, octave up shimmer
        playNote(n.f / 1.5, n.d * 0.9, cursor);
        cursor += n.d;
      });
      const wait = Math.max(50, (cursor - ctx.currentTime - 0.5) * 1000);
      seqRef.current = window.setTimeout(scheduleLoop, wait);
    };
    scheduleLoop();
    setPlaying(true);
  };

  const toggle = () => {
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      start();
    }
  };

  useEffect(() => () => stop(), []);

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08, rotate: 5 }}
      whileTap={{ scale: 0.94 }}
      aria-label={playing ? "Mute ambient music" : "Play ambient music"}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-primary/40 bg-card/60 text-primary hover:bg-primary/10 transition-colors"
      title={playing ? "Mute flute melody" : "Play Hedwig flute melody"}
    >
      {playing ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
      {playing && (
        <motion.span
          className="absolute inset-0 rounded-full border border-primary/60"
          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <Music className="w-2.5 h-2.5 absolute -top-1 -right-1 text-accent" />
    </motion.button>
  );
}
