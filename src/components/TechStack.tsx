import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "./Section";
import { Plus, X, Cpu, Trash2, Edit3, Save } from "lucide-react";
import { clickTick, hackBurst } from "@/lib/hackSound";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const STORE = "neeraj_techstack_v1";

type Tech = {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  color: string; // oklch hue 0-360
  note?: string;
};

const DEFAULT: Tech[] = [
  { id: "1", name: "React / TypeScript", category: "Frontend", level: 5, color: "200" },
  { id: "2", name: "Node.js", category: "Backend", level: 5, color: "140" },
  { id: "3", name: "Python", category: "AI/ML", level: 4, color: "60" },
  { id: "4", name: "Solidity", category: "Blockchain", level: 4, color: "270" },
  { id: "5", name: "Burp Suite", category: "Security", level: 5, color: "25" },
  { id: "6", name: "Nmap", category: "Recon", level: 5, color: "145" },
  { id: "7", name: "TensorFlow", category: "AI/ML", level: 3, color: "30" },
  { id: "8", name: "Docker", category: "DevOps", level: 4, color: "210" },
  { id: "html", name: "HTML", category: "Frontend", level: 5, color: "25" },
  { id: "css", name: "CSS", category: "Frontend", level: 5, color: "220" },
  { id: "javascript", name: "JavaScript", category: "Frontend", level: 5, color: "80" },
  { id: "cybersecurity", name: "Cyber Security", category: "Security", level: 5, color: "0" },
  { id: "ethicalhacking", name: "Ethical Hacking", category: "Security", level: 5, color: "120" },
  { id: "networksecurity", name: "Network Security", category: "Security", level: 5, color: "190" },
];

const CATEGORIES = ["Frontend", "Backend", "AI/ML", "Blockchain", "Security", "Recon", "DevOps", "Database", "Cloud", "Other"];

async function fetchTechStack(): Promise<Tech[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("tech_stack")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data as Tech[];
    } else {
      console.log("Database empty, seeding defaults...");
      const { error: seedError } = await (supabase as any)
        .from("tech_stack")
        .insert(DEFAULT);
      if (seedError) {
        console.error("Error seeding defaults:", seedError);
      }
      return DEFAULT;
    }
  } catch (err) {
    console.warn("Failed to connect to Supabase. Using local storage.", err);
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return DEFAULT;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) {
        const existingNames = new Set(arr.map((i) => i.name.toLowerCase()));
        const missingDefaults = DEFAULT.filter((d) => !existingNames.has(d.name.toLowerCase()));
        return [...arr, ...missingDefaults];
      }
      return DEFAULT;
    } catch {
      return DEFAULT;
    }
  }
}

async function saveTechItem(item: Tech): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from("tech_stack")
      .upsert({
        id: item.id,
        name: item.name,
        category: item.category,
        level: item.level,
        color: item.color,
        note: item.note || null
      });
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Failed to save to Supabase. Saved locally only.", err);
    return false;
  }
}

async function deleteTechItem(id: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from("tech_stack")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Failed to delete from Supabase. Deleted locally only.", err);
    return false;
  }
}

export function TechStack() {
  const [items, setItems] = useState<Tech[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tech | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchTechStack().then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const cats = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);

  const save = async (t: Tech) => {
    let updatedItems: Tech[] = [];
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === t.id);
      if (i >= 0) { const cp = [...prev]; cp[i] = t; updatedItems = cp; return cp; }
      updatedItems = [t, ...prev];
      return updatedItems;
    });
    setOpen(false); setEditing(null);
    hackBurst();
    toast.success("✦ tech stack updated");

    await saveTechItem(t);
    localStorage.setItem(STORE, JSON.stringify(updatedItems));
  };

  const remove = async (id: string) => {
    let updatedItems: Tech[] = [];
    setItems((p) => {
      const next = p.filter((x) => x.id !== id);
      updatedItems = next;
      return next;
    });
    clickTick();

    await deleteTechItem(id);
    localStorage.setItem(STORE, JSON.stringify(updatedItems));
  };

  return (
    <Section eyebrow="ARSENAL" title="Tech Stack" id="techstack">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => { setFilter(c); clickTick(); }}
              data-cursor="hover"
              className={`px-2.5 py-1 text-[10px] font-mono rounded border transition-all ${
                filter === c
                  ? "bg-primary/15 border-primary/60 text-primary"
                  : "bg-background/40 border-border text-muted-foreground hover:text-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setEditing(null); setOpen(true); clickTick(); }}
          data-cursor="hover"
          className="px-3 py-1.5 text-xs font-mono rounded border border-accent/60 text-accent hover:bg-accent/10 inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> add tech
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {loading ? (
          <div className="col-span-full text-center font-mono text-xs text-muted-foreground py-12 animate-pulse">
            syncing arsenal ledger...
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {visible.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -3 }}
                  className="group relative rounded-xl border bg-card/50 p-3 overflow-hidden"
                  style={{
                    borderColor: `oklch(0.7 0.18 ${t.color} / 0.4)`,
                    boxShadow: `0 0 24px oklch(0.7 0.18 ${t.color} / 0.15)`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5" style={{ color: `oklch(0.78 0.18 ${t.color})` }} />
                      <span className="font-mono text-xs text-muted-foreground">{t.category}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button
                        onClick={() => { setEditing(t); setOpen(true); clickTick(); }}
                        data-cursor="hover"
                        className="text-muted-foreground hover:text-primary"
                        aria-label="edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        data-cursor="hover"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="font-display text-base mt-2 truncate" title={t.name}>{t.name}</div>
                  <div className="flex gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full"
                        style={{
                          background: i < t.level
                            ? `oklch(0.78 0.18 ${t.color})`
                            : "oklch(0.3 0.02 220 / 0.4)",
                        }}
                      />
                    ))}
                  </div>
                  {t.note && <div className="mt-2 font-mono text-[10px] text-muted-foreground line-clamp-2">{t.note}</div>}
                </motion.div>
              ))}
            </AnimatePresence>
            {visible.length === 0 && (
              <div className="col-span-full text-center font-mono text-xs text-muted-foreground py-12">
                no tech in this category — add one
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <TechModal
            initial={editing}
            onClose={() => { setOpen(false); setEditing(null); }}
            onSave={save}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}

function TechModal({
  initial, onClose, onSave,
}: { initial: Tech | null; onClose: () => void; onSave: (t: Tech) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Frontend");
  const [level, setLevel] = useState(initial?.level ?? 3);
  const [color, setColor] = useState(initial?.color ?? "145");
  const [note, setNote] = useState(initial?.note ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      name: name.trim(), category, level, color, note: note.trim() || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-md grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-primary/40 bg-card p-6 space-y-4 shadow-[0_0_60px_oklch(0.78_0.18_145/0.25)]"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-gradient-magic">
            {initial ? "edit tech" : "add tech"}
          </h3>
          <button type="button" onClick={onClose} data-cursor="hover" className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-muted-foreground">name</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)} autoFocus
            data-cursor="text"
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
            placeholder="e.g. Rust"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-muted-foreground">category</label>
            <select
              value={category} onChange={(e) => setCategory(e.target.value)}
              data-cursor="hover"
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-muted-foreground">level: {level}/5</label>
            <input
              type="range" min={1} max={5} value={level}
              onChange={(e) => setLevel(+e.target.value)}
              data-cursor="hover"
              className="w-full accent-[oklch(0.78_0.18_145)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-muted-foreground">accent color (hue)</label>
          <input
            type="range" min={0} max={360} value={color}
            onChange={(e) => setColor(e.target.value)}
            data-cursor="hover"
            className="w-full"
            style={{
              background: "linear-gradient(to right, oklch(0.7 0.2 0), oklch(0.7 0.2 60), oklch(0.7 0.2 145), oklch(0.7 0.2 220), oklch(0.7 0.2 290), oklch(0.7 0.2 360))",
              borderRadius: 4, height: 6, appearance: "none",
            }}
          />
          <div className="h-2 rounded" style={{ background: `oklch(0.78 0.18 ${color})` }} />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-muted-foreground">note (optional)</label>
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)} rows={2}
            data-cursor="text"
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60 resize-none"
            placeholder="how / where I use it"
          />
        </div>

        <button
          type="submit"
          data-cursor="hover"
          className="w-full py-2.5 rounded bg-primary text-primary-foreground font-mono text-sm inline-flex items-center justify-center gap-2 hover:opacity-90"
        >
          <Save className="w-4 h-4" /> {initial ? "update" : "add"} tech
        </button>
      </motion.form>
    </motion.div>
  );
}
