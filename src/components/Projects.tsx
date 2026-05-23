import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Section } from "./Section";
import {
  ExternalLink, Github, Shield, Car, Coins, BookOpen, Link2,
  Bug, Recycle, Brain, CalendarClock, ShoppingCart, Plus, X, Trash2, Save, Sparkles,
  Rocket, FileText, PlayCircle,
} from "lucide-react";
import { successChime, clickTick } from "@/lib/hackSound";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ICONS = { Shield, Car, Coins, BookOpen, Link2, Bug, Recycle, Brain, CalendarClock, ShoppingCart };
type IconKey = keyof typeof ICONS;

type ProjectStatus = "planned" | "in-dev" | "live" | "deployed" | "archived";

type Project = {
  icon: IconKey;
  name: string;
  tag: string;
  desc: string;
  stack: string[];
  live: string;
  code: string;
  deploy?: string;
  docs?: string;
  video?: string;
  status?: ProjectStatus;
  custom?: boolean;
};

export const projects: Project[] = [
  { icon: "Shield", name: "Cyber Guard", tag: "AI Firewall × Web3", desc: "Next-gen AI-powered firewall with blockchain-secured logging. 97.8% detection accuracy, <20ms latency. Published research at ICSC AI-2025.", stack: ["Python","TensorFlow","Solidity","React","Web3.js","MongoDB"], live: "https://dashboard.sarva.cloud/blockchain", code: "https://github.com/Neerajupadhayay2004" },
  { icon: "Car", name: "Colosion", tag: "AI Collision Avoidance · PWA", desc: "Real-time AI-powered rider safety platform — collision detection via TensorFlow.js camera, offline navigation, voice commands, native Android/iOS via Capacitor.", stack: ["React","TS","TensorFlow.js","Leaflet","Capacitor","OSRM"], live: "https://collosion.netlify.app/", code: "https://github.com/Neerajupadhayay2004/collisionguard-pro" },
  { icon: "Coins", name: "Debt Recovery AI", tag: "Enterprise SaaS · ML", desc: "Enterprise-grade DCA management platform with ML recovery prediction, automated case routing, RLS security, and multi-agency support.", stack: ["React","ML","PostgreSQL","RLS","Analytics"], live: "https://github.com/Neerajupadhayay2004/debt-recovery-ai", code: "https://github.com/Neerajupadhayay2004/debt-recovery-ai" },
  { icon: "BookOpen", name: "Case Compass", tag: "AI Knowledge Retrieval · Enterprise", desc: "AI-powered, context-aware policy retrieval system for enterprise case management. Delivers just-in-time policy clauses with verifiable citations.", stack: ["React","RAG","LLM","Vector DB","Citations"], live: "https://appian1.netlify.app/", code: "https://github.com/Neerajupadhayay2004/case-compass" },
  { icon: "Link2", name: "Blockchain Security Suite", tag: "Smart Contract Audits · Web3", desc: "On-chain logging & integrity layer used across Cyber Guard and SARVA OS. Solidity smart contracts, immutable audit trails, tamper-proof event signing.", stack: ["Solidity","Hardhat","Ethers.js","IPFS"], live: "https://github.com/Neerajupadhayay2004", code: "https://github.com/Neerajupadhayay2004" },
  { icon: "Shield", name: "SARVA OS", tag: "Custom Security OS", desc: "Hackathon-winning customizable security OS with real-time attack detection, intelligent monitoring, and blockchain-integrity logging.", stack: ["Linux","Python","Blockchain","SOC"], live: "#", code: "https://github.com/Neerajupadhayay2004" },
  { icon: "Brain", name: "AegisAI Sentinel", tag: "Autonomous AI SOC · SMB Security", desc: "Autonomous AI-driven cybersecurity platform delivering enterprise-grade protection for SMBs — real-time threat detection, automated incident response, 24/7 monitoring.", stack: ["AI/ML","Python","SOAR","SIEM","Cloud"], live: "https://github.com/Neerajupadhayay2004/aegisai-sentinel", code: "https://github.com/Neerajupadhayay2004/aegisai-sentinel" },
  { icon: "Bug", name: "Bug Bounty Recon Report", tag: "Offensive Security · Reconnaissance", desc: "Professional bug-bounty style security assessment covering port & service discovery, web tech fingerprinting, directory enumeration, and PoC validation.", stack: ["Nmap","Burp Suite","OSINT","OWASP","Recon-ng"], live: "https://github.com/Neerajupadhayay2004/bug-bounty-recon-report", code: "https://github.com/Neerajupadhayay2004/bug-bounty-recon-report" },
  { icon: "Recycle", name: "CircuVerse AI", tag: "AI for Sustainability · Smart Cities", desc: "AI-driven circular waste intelligence system tackling plastic pollution through smart segregation, reuse planning, and citizen awareness.", stack: ["React","AI/ML","TypeScript","Vision","Analytics"], live: "https://github.com/Neerajupadhayay2004/circuverse-ai", code: "https://github.com/Neerajupadhayay2004/circuverse-ai" },
  { icon: "CalendarClock", name: "AI Time Scheduler", tag: "Optimization · Gemini AI", desc: "Advanced AI-powered timetable generator producing optimized, conflict-free schedules from teachers, classes, subjects, days, and hours.", stack: ["React","TypeScript","Vite","Tailwind","Gemini AI"], live: "https://github.com/Neerajupadhayay2004/Time-scheduler.ai", code: "https://github.com/Neerajupadhayay2004/Time-scheduler.ai" },
  { icon: "ShoppingCart", name: "Grocery Commerce", tag: "Full-Stack E-Commerce", desc: "Modern grocery e-commerce platform with category browsing, cart management, secure checkout flow, and responsive UI.", stack: ["React","TypeScript","Tailwind","Node","REST"], live: "https://github.com/Neerajupadhayay2004/grocery", code: "https://github.com/Neerajupadhayay2004/grocery" },
];

const STORAGE_KEY = "neeraj_custom_projects_v1";

async function fetchCustomProjects(): Promise<Project[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return (data || []) as Project[];
  } catch (err) {
    console.warn("Failed to fetch projects from Supabase. Using local storage.", err);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

async function saveProjectToDb(p: Project): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from("projects")
      .insert({
        icon: p.icon,
        name: p.name,
        tag: p.tag,
        desc: p.desc,
        stack: p.stack,
        live: p.live || null,
        code: p.code || null,
        deploy: p.deploy || null,
        docs: p.docs || null,
        video: p.video || null,
        status: p.status || null,
        custom: true
      });
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Failed to save project to Supabase. Saved locally only.", err);
    return false;
  }
}

async function deleteProjectFromDb(name: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from("projects")
      .delete()
      .eq("name", name);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Failed to delete project from Supabase. Deleted locally only.", err);
    return false;
  }
}

export function Projects({ compact = false }: { compact?: boolean }) {
  const [custom, setCustom] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Project>({
    icon: "Shield", name: "", tag: "", desc: "", stack: [], live: "", code: "",
    deploy: "", docs: "", video: "", status: "in-dev", custom: true,
  });
  const [stackInput, setStackInput] = useState("");

  useEffect(() => {
    let active = true;
    fetchCustomProjects().then((data) => {
      if (active) {
        setCustom(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const all = [...custom, ...projects];
  const list = compact ? all.slice(0, 3) : all;

  const save = async () => {
    if (!draft.name.trim() || !draft.desc.trim()) {
      toast.error("Name and description are required");
      return;
    }
    const newProj = { ...draft, custom: true };
    const next = [newProj, ...custom];
    setCustom(next);
    successChime();
    toast.success("✦ Project committed to ledger", { description: `${draft.name} now lives in the spellbook.` });
    setDraft({ icon: "Shield", name: "", tag: "", desc: "", stack: [], live: "", code: "", deploy: "", docs: "", video: "", status: "in-dev", custom: true });
    setStackInput("");
    setOpen(false);

    await saveProjectToDb(newProj);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const remove = async (name: string) => {
    const next = custom.filter((p) => p.name !== name);
    setCustom(next);
    clickTick();
    toast("Project removed");

    await deleteProjectFromDb(name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <Section eyebrow="THE SPELLBOOK" title="Forbidden Projects" id="projects">
      {!compact && (
        <div className="flex items-center justify-between mb-6 -mt-6">
          <p className="font-mono text-xs text-muted-foreground">
            {loading 
              ? "syncing spellbook ledger..." 
              : `${all.length} projects · ${custom.length} added by you · synchronized`
            }
          </p>
          <button
            onClick={() => { setOpen(true); clickTick(); }}
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent/10 border border-accent/50 text-accent font-mono text-xs hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <Plus className="w-4 h-4" /> add_project.sh
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {list.map((p, i) => {
          const Icon = ICONS[p.icon] || Shield;
          return (
            <motion.article
              key={p.name + i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.5) }}
              whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
              style={{ transformStyle: "preserve-3d" }}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-accent/60 transition-colors overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex items-center gap-2">
                    {p.custom && (
                      <span className="font-mono text-[10px] text-accent border border-accent/40 px-1.5 py-0.5 rounded">
                        +YOURS
                      </span>
                    )}
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">// {String(i + 1).padStart(2, "0")}</span>
                    {p.custom && (
                      <button onClick={() => remove(p.name)} data-cursor="hover" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="font-mono text-xs text-accent mb-1">{p.tag}</p>
                <h3 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.stack.map((s) => (
                    <span key={s} className="px-2 py-0.5 text-[11px] font-mono rounded bg-background/60 border border-border text-foreground/70">{s}</span>
                  ))}
                </div>
                {p.status && (
                  <div className="mb-3">
                    <StatusBadge status={p.status} />
                  </div>
                )}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-accent transition-colors">
                      <ExternalLink className="w-4 h-4" /> Live
                    </a>
                  )}
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-accent transition-colors">
                      <Github className="w-4 h-4" /> Source
                    </a>
                  )}
                  {p.deploy && (
                    <a href={p.deploy} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-accent hover:text-primary transition-colors">
                      <Rocket className="w-4 h-4" /> Deploy
                    </a>
                  )}
                  {p.docs && (
                    <a href={p.docs} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-foreground/70 hover:text-accent transition-colors">
                      <FileText className="w-4 h-4" /> Docs
                    </a>
                  )}
                  {p.video && (
                    <a href={p.video} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-foreground/70 hover:text-accent transition-colors">
                      <PlayCircle className="w-4 h-4" /> Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-background/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-card border border-accent/40 rounded-2xl p-6 glow-emerald"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-accent">// COMMIT NEW PROJECT</p>
                  <h3 className="font-display text-2xl text-gradient-magic flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" /> add_project.sh
                  </h3>
                </div>
                <button onClick={() => setOpen(false)} data-cursor="hover" className="text-muted-foreground hover:text-destructive">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="name *" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
                  <Field label="tag (e.g. AI · Web3)" value={draft.tag} onChange={(v) => setDraft({ ...draft, tag: v })} />
                </div>
                <div>
                  <label className="text-muted-foreground">description *</label>
                  <textarea
                    value={draft.desc}
                    onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
                    rows={3}
                    data-cursor="hover"
                    className="w-full mt-1 px-3 py-2 rounded bg-background border border-border focus:border-accent outline-none text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="live url" value={draft.live} onChange={(v) => setDraft({ ...draft, live: v })} />
                  <Field label="code / repo url" value={draft.code} onChange={(v) => setDraft({ ...draft, code: v })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="deploy url (vercel/netlify)" value={draft.deploy || ""} onChange={(v) => setDraft({ ...draft, deploy: v })} />
                  <Field label="docs url" value={draft.docs || ""} onChange={(v) => setDraft({ ...draft, docs: v })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="demo video url" value={draft.video || ""} onChange={(v) => setDraft({ ...draft, video: v })} />
                  <div>
                    <label className="text-muted-foreground">status</label>
                    <select
                      value={draft.status || "in-dev"}
                      onChange={(e) => setDraft({ ...draft, status: e.target.value as ProjectStatus })}
                      className="w-full mt-1 px-3 py-2 rounded bg-background border border-border text-foreground"
                    >
                      <option value="planned">planned</option>
                      <option value="in-dev">in-dev</option>
                      <option value="live">live</option>
                      <option value="deployed">deployed</option>
                      <option value="archived">archived</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground">icon</label>
                  <select
                    value={draft.icon}
                    onChange={(e) => setDraft({ ...draft, icon: e.target.value as IconKey })}
                    className="w-full mt-1 px-3 py-2 rounded bg-background border border-border text-foreground"
                  >
                    {Object.keys(ICONS).map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground">stack (press Enter to add)</label>
                  <input
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && stackInput.trim()) {
                        e.preventDefault();
                        setDraft({ ...draft, stack: [...draft.stack, stackInput.trim()] });
                        setStackInput("");
                      }
                    }}
                    className="w-full mt-1 px-3 py-2 rounded bg-background border border-border focus:border-accent outline-none text-foreground"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {draft.stack.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-secondary/20 border border-secondary/40 text-foreground/80 inline-flex items-center gap-1">
                        {s}
                        <button onClick={() => setDraft({ ...draft, stack: draft.stack.filter((_, i) => i !== idx) })}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={save}
                  data-cursor="hover"
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground hover:scale-[1.02] glow-gold transition-transform"
                >
                  <Save className="w-4 h-4" /> commit & deploy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-cursor="hover"
        className="w-full mt-1 px-3 py-2 rounded bg-background border border-border focus:border-accent outline-none text-foreground"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const map: Record<ProjectStatus, { label: string; cls: string; dot: string }> = {
    planned:   { label: "PLANNED",  cls: "border-border text-muted-foreground bg-background/40", dot: "bg-muted-foreground" },
    "in-dev":  { label: "IN-DEV",   cls: "border-primary/50 text-primary bg-primary/10",         dot: "bg-primary animate-pulse" },
    live:      { label: "LIVE",     cls: "border-accent/60 text-accent bg-accent/10",            dot: "bg-accent animate-pulse" },
    deployed:  { label: "DEPLOYED", cls: "border-accent/60 text-accent bg-accent/15",            dot: "bg-accent" },
    archived:  { label: "ARCHIVED", cls: "border-border text-muted-foreground bg-background/40 line-through", dot: "bg-muted-foreground" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono rounded border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} /> {s.label}
    </span>
  );
}
