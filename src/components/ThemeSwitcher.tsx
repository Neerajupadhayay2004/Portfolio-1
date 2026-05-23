import { useEffect, useState } from "react";
import { Palette, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clickTick } from "@/lib/hackSound";

type Theme = {
  id: string;
  name: string;
  desc: string;
  swatch: string;
};

const THEMES: Theme[] = [
  { id: "hacker",   name: "Matrix Hacker",   desc: "Default neon green terminal",  swatch: "linear-gradient(135deg,#0a1f15,#1cff9c)" },
  { id: "cyber",    name: "Cyber Blue",      desc: "Cool cyan SOC console",        swatch: "linear-gradient(135deg,#0a1424,#3bd1ff)" },
  { id: "blood",    name: "Red Team",        desc: "Crimson offensive ops",        swatch: "linear-gradient(135deg,#1a0808,#ff3b3b)" },
  { id: "magic",    name: "Gold Sorcerer",   desc: "Warm magical gold + emerald",  swatch: "linear-gradient(135deg,#1a1408,#f5c542)" },
  { id: "neon",     name: "Neon Violet",     desc: "Cyberpunk magenta + violet",   swatch: "linear-gradient(135deg,#140a24,#c43bff)" },
  { id: "mono",     name: "Mono Terminal",   desc: "Pure black & white CRT",       swatch: "linear-gradient(135deg,#000,#e6e6e6)" },
];

const STORAGE_KEY = "neeraj_theme_v1";

function applyTheme(id: string) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("hacker");

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) || "hacker";
    setActive(saved);
    applyTheme(saved);
  }, []);

  const choose = (id: string) => {
    setActive(id);
    applyTheme(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
    clickTick();
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(v => !v); clickTick(); }}
        className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-md border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
        aria-label="Change theme"
        title="Change theme"
      >
        <Palette className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-72 z-50 rounded-lg border border-primary/30 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-border/60 font-mono text-xs text-muted-foreground flex items-center gap-2">
                <span className="text-primary">$</span> theme --select
              </div>
              <div className="p-2 grid gap-1 max-h-[60vh] overflow-y-auto custom-scroll">
                {THEMES.map((t) => {
                  const isActive = active === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => choose(t.id)}
                      className={`group flex items-center gap-3 p-2 rounded-md text-left transition-all border ${
                        isActive
                          ? "border-primary/60 bg-primary/10"
                          : "border-transparent hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      <span
                        className="w-9 h-9 rounded-md border border-border/60 shrink-0"
                        style={{ background: t.swatch }}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block font-mono text-sm text-foreground truncate">{t.name}</span>
                        <span className="block font-mono text-[11px] text-muted-foreground truncate">{t.desc}</span>
                      </span>
                      {isActive && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="px-3 py-2 border-t border-border/60 font-mono text-[10px] text-muted-foreground">
                Saved locally · applies instantly
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
