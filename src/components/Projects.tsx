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

// Verified projects from the current GitHub portfolio. Keep repository URLs canonical.
export const projects: Project[] = [
  { icon: "Shield", name: "Sarva Firewall", tag: "AI Firewall · Cybersecurity", desc: "Security-focused full-stack firewall platform for threat detection, attack simulation, dashboards, and defensive security workflows.", stack: ["React","TypeScript","Python","FastAPI","Supabase","Render","Netlify"], live: "https://firewall-dun.vercel.app/", code: "https://github.com/Neerajupadhayay2004/FIREWALL", status: "deployed" },
  { icon: "Shield", name: "Sarva Multi-Purpose Offline Assistant", tag: "AI Assistant · Offline-first", desc: "Privacy-oriented assistant project focused on useful local workflows and multi-purpose AI capabilities without relying entirely on cloud services.", stack: ["Python","AI/ML","Local AI","Linux"], live: "https://github.com/Neerajupadhayay2004/Sarva-Multi-Purpose-Offline-Assistant", code: "https://github.com/Neerajupadhayay2004/Sarva-Multi-Purpose-Offline-Assistant" },
  { icon: "Brain", name: "AegisAI Sentinel", tag: "Autonomous AI SOC · Cybersecurity", desc: "AI-driven security operations platform focused on threat detection, monitoring, security automation, and incident-response workflows.", stack: ["Python","AI/ML","SIEM","SOAR","Cloud","Cybersecurity"], live: "https://github.com/Neerajupadhayay2004/aegisai-sentinel", code: "https://github.com/Neerajupadhayay2004/aegisai-sentinel" },
  { icon: "Car", name: "CollisionGuard Pro", tag: "AI Safety · PWA", desc: "AI-powered rider safety application with collision-awareness workflows and an interactive web/mobile-oriented experience.", stack: ["React","TypeScript","TensorFlow.js","Leaflet","Capacitor","OSRM"], live: "https://collosion.netlify.app/", code: "https://github.com/Neerajupadhayay2004/collisionguard-pro", status: "deployed" },
  { icon: "Coins", name: "Debt Recovery AI", tag: "Enterprise SaaS · AI/ML", desc: "Enterprise debt-recovery platform concept combining automation, analytics, intelligent workflows, and case management for recovery operations.", stack: ["React","AI/ML","PostgreSQL","Analytics","RLS"], live: "https://github.com/Neerajupadhayay2004/debt-recovery-ai", code: "https://github.com/Neerajupadhayay2004/debt-recovery-ai" },
  { icon: "Recycle", name: "CircuVerse AI", tag: "AI for Sustainability · Smart Cities", desc: "AI-powered circular-economy concept focused on smarter waste handling, sustainability, citizen awareness, and data-driven planning.", stack: ["React","TypeScript","AI/ML","Computer Vision","Analytics"], live: "https://github.com/Neerajupadhayay2004/circuverse-ai", code: "https://github.com/Neerajupadhayay2004/circuverse-ai" },
  { icon: "CalendarClock", name: "AI Time Scheduler", tag: "Generative AI · Optimization", desc: "AI-assisted timetable generator designed to produce optimized, conflict-aware schedules from classes, teachers, subjects, days, and time slots.", stack: ["React","TypeScript","Vite","Tailwind CSS","Gemini AI"], live: "https://github.com/Neerajupadhayay2004/Time-scheduler.ai", code: "https://github.com/Neerajupadhayay2004/Time-scheduler.ai" },
  { icon: "ShoppingCart", name: "Grocery Commerce", tag: "Full-Stack Web · E-Commerce", desc: "Responsive grocery commerce project with product browsing, categories, shopping flows, and modern web UI patterns.", stack: ["React","TypeScript","Tailwind CSS","Node.js","REST API"], live: "https://github.com/Neerajupadhayay2004/grocery", code: "https://github.com/Neerajupadhayay2004/grocery" },
  { icon: "Bug", name: "Phishing Detection System", tag: "Cybersecurity · Threat Detection", desc: "Security project focused on identifying and analyzing phishing indicators and suspicious web activity.", stack: ["Python","Machine Learning","Cybersecurity","Threat Detection"], live: "https://github.com/Neerajupadhayay2004/Phishing-Detection-System-IC_CS_03-", code: "https://github.com/Neerajupadhayay2004/Phishing-Detection-System-IC_CS_03-" },
  { icon: "Shield", name: "Automated Vulnerability Scanner", tag: "AppSec · Risk Prioritization", desc: "Automated security scanning workflow for discovering application weaknesses and organizing findings by security risk and priority.", stack: ["Python","Web Security","Vulnerability Scanning","Risk Scoring","Automation"], live: "https://github.com/Neerajupadhayay2004/Automated-vulnerability-scanner-with-risk-proritization", code: "https://github.com/Neerajupadhayay2004/Automated-vulnerability-scanner-with-risk-proritization" },
  { icon: "Link2", name: "AI Advanced Firewall with Blockchain", tag: "AI Security · Blockchain", desc: "Security architecture combining AI-assisted detection with blockchain-backed integrity and tamper-evident event logging concepts.", stack: ["Python","AI/ML","Blockchain","Solidity","Web3"], live: "https://github.com/Neerajupadhayay2004/AI-Advanced-Firewall-with-Blockchain", code: "https://github.com/Neerajupadhayay2004/AI-Advanced-Firewall-with-Blockchain" },
  { icon: "Bug", name: "Bug Bounty Recon Report", tag: "Offensive Security · Recon", desc: "Bug-bounty style reconnaissance and security assessment work covering attack-surface discovery, enumeration, fingerprinting, and validation.", stack: ["Nmap","Burp Suite","OSINT","OWASP","Recon"], live: "https://github.com/Neerajupadhayay2004/bug-bounty-recon-report", code: "https://github.com/Neerajupadhayay2004/bug-bounty-recon-report" },
  { icon: "Brain", name: "Profile Intelligence Tool", tag: "OSINT · Intelligence", desc: "OSINT-oriented profile intelligence project for collecting, correlating, and analyzing publicly available information.", stack: ["Python","OSINT","Web Scraping","Data Analysis"], live: "https://github.com/Neerajupadhayay2004/Profile-Intelligence-Tool", code: "https://github.com/Neerajupadhayay2004/Profile-Intelligence-Tool" },
  { icon: "Brain", name: "AI-Powered Social Media Intelligence", tag: "OSINT · AI", desc: "AI-enhanced social-media intelligence project aimed at extracting useful signals from public social data for investigation and analysis.", stack: ["Python","AI/ML","OSINT","NLP","Data Analysis"], live: "https://github.com/Neerajupadhayay2004/AI-Powered-Social-Media-Intelligence-Tool-Integrate-AI-", code: "https://github.com/Neerajupadhayay2004/AI-Powered-Social-Media-Intelligence-Tool-Integrate-AI-" },
  { icon: "Shield", name: "Honeypot Network", tag: "Threat Intelligence · Honeypots", desc: "Honeypot-focused security project for capturing suspicious activity, studying attacker behavior, and generating threat intelligence signals.", stack: ["Python","Honeypots","Threat Intelligence","Networking","Linux"], live: "https://github.com/Neerajupadhayay2004/honeypot-network", code: "https://github.com/Neerajupadhayay2004/honeypot-network" },
  { icon: "Shield", name: "Monitor the Situation Dashboard", tag: "Threat Intelligence · Real-Time Data", desc: "Real-time situational-awareness dashboard aggregating security, infrastructure, environmental, and global feeds into a unified monitoring experience.", stack: ["Go","WebSockets","PostgreSQL","MapLibre","Time-Series Data","APIs"], live: "https://github.com/Neerajupadhayay2004/monitor-the-situation-dashboard-", code: "https://github.com/Neerajupadhayay2004/monitor-the-situation-dashboard-" },
  { icon: "Brain", name: "WorldIntel", tag: "AI · Intelligence Platform", desc: "AI-oriented intelligence platform project bringing together modern web, automation, authentication, mapping, and data workflows.", stack: ["Next.js","TypeScript","Tailwind CSS","Convex","n8n","Gemini API","Mapbox","Clerk","Vercel"], live: "https://github.com/Neerajupadhayay2004/worlIntel", code: "https://github.com/Neerajupadhayay2004/worlIntel" },
  { icon: "Link2", name: "Notion OS AI Agent Orchestrator", tag: "AI Agents · Automation", desc: "AI-agent orchestration project designed around connected productivity workflows, tools, and automated task execution.", stack: ["TypeScript","AI Agents","Notion API","Automation","OpenAI/Gemini-style LLM Workflows"], live: "https://github.com/Neerajupadhayay2004/enter-NotionOSAIAgentOrchestrator", code: "https://github.com/Neerajupadhayay2004/enter-NotionOSAIAgentOrchestrator" },
  { icon: "Bug", name: "Network Traffic Analyzer", tag: "Network Security · Analysis", desc: "Network-security project for inspecting and analyzing traffic patterns to support detection, troubleshooting, and security investigation.", stack: ["Python","Networking","Packet Analysis","Cybersecurity","Data Analysis"], live: "https://github.com/Neerajupadhayay2004/Network_Trafiic_analyzer", code: "https://github.com/Neerajupadhayay2004/Network_Trafiic_analyzer" },
  { icon: "Bug", name: "Wireshark Packet Analysis", tag: "Network Security · DFIR", desc: "Hands-on packet-analysis work using captured network traffic to investigate protocols, anomalies, and suspicious communication patterns.", stack: ["Wireshark","Networking","Packet Analysis","Cybersecurity","Incident Response"], live: "https://github.com/Neerajupadhayay2004/Wireshark-Packet-Analysis-AlfidoTech-Task-03", code: "https://github.com/Neerajupadhayay2004/Wireshark-Packet-Analysis-AlfidoTech-Task-03" },
  { icon: "Bug", name: "Incident Response Simulation", tag: "Blue Team · Incident Response", desc: "Practical incident-response simulation covering investigation, triage, containment thinking, and security reporting.", stack: ["Incident Response","SOC","Threat Analysis","Security Operations"], live: "https://github.com/Neerajupadhayay2004/Incident-Response-Simulation-AlfidoTech-Task-04", code: "https://github.com/Neerajupadhayay2004/Incident-Response-Simulation-AlfidoTech-Task-04" },
  { icon: "Shield", name: "Cyber Crime Reporting Portal", tag: "Civic Tech · Cybersecurity", desc: "Web-based portal concept for reporting cyber incidents and improving access to cyber-crime reporting workflows.", stack: ["React","TypeScript","Web Development","Cybersecurity","UI/UX"], live: "https://github.com/Neerajupadhayay2004/Cyber-Crime-Reporting-Portal-", code: "https://github.com/Neerajupadhayay2004/Cyber-Crime-Reporting-Portal-" },
  { icon: "Brain", name: "Smart Bharat AI Civic Companion", tag: "GenAI · GovTech", desc: "AI-powered citizen platform concept helping users discover and navigate government services through a unified conversational experience.", stack: ["React","TypeScript","GenAI","Supabase","APIs","Netlify","Render"], live: "https://smart-bharat.netlify.app/", code: "https://github.com/Neerajupadhayay2004/smart_Bharat_AI-Powered-civic-companion", status: "deployed" },
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
        icon: p.icon, name: p.name, tag: p.tag, desc: p.desc, stack: p.stack,
        live: p.live || null, code: p.code || null, deploy: p.deploy || null,
        docs: p.docs || null, video: p.video || null, status: p.status || null, custom: true,
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
    const { error } = await (supabase as any).from("projects").delete().eq("name", name);
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
      if (active) { setCustom(data); setLoading(false); }
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
    setCustom(next); successChime();
    toast.success("✦ Project committed to ledger", { description: `${draft.name} now lives in the spellbook.` });
    setDraft({ icon: "Shield", name: "", tag: "", desc: "", stack: [], live: "", code: "", deploy: "", docs: "", video: "", status: "in-dev", custom: true });
    setStackInput(""); setOpen(false);
    await saveProjectToDb(newProj);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const remove = async (name: string) => {
    const next = custom.filter((p) => p.name !== name);
    setCustom(next); clickTick(); toast("Project removed");
    await deleteProjectFromDb(name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <Section eyebrow="THE SPELLBOOK" title="Forbidden Projects" id="projects">
      {!compact && (
        <div className="flex items-center justify-between mb-6 -mt-6">
          <p className="font-mono text-xs text-muted-foreground">
            {loading ? "syncing spellbook ledger..." : `${all.length} projects · ${custom.length} added by you · synchronized`}
          </p>
          <button onClick={() => { setOpen(true); clickTick(); }} data-cursor="hover" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent/10 border border-accent/50 text-accent font-mono text-xs hover:bg-accent hover:text-accent-foreground transition-all">
            <Plus className="w-4 h-4" /> add_project.sh
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {list.map((p, i) => {
          const Icon = ICONS[p.icon] || Shield;
          return (
            <motion.article key={p.name + i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.5) }} whileHover={{ y: -8, rotateX: 2, rotateY: -2 }} style={{ transformStyle: "preserve-3d" }} className="group relative p-8 rounded-2xl bg-card border border-border hover:border-accent/60 transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center"><Icon className="w-6 h-6 text-accent" /></div>
                  <div className="flex items-center gap-2">
                    {p.custom && <span className="font-mono text-[10px] text-accent border border-accent/40 px-1.5 py-0.5 rounded">+YOURS</span>}
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">// {String(i + 1).padStart(2, "0")}</span>
                    {p.custom && <button onClick={() => remove(p.name)} data-cursor="hover" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </div>
                <p className="font-mono text-xs text-accent mb-1">{p.tag}</p>
                <h3 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">{p.stack.map((s) => <span key={s} className="px-2 py-0.5 text-[11px] font-mono rounded bg-background/60 border border-border text-foreground/70">{s}</span>)}</div>
                {p.status && <div className="mb-3"><StatusBadge status={p.status} /></div>}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {p.live && <a href={p.live} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-accent transition-colors"><ExternalLink className="w-4 h-4" /> Live</a>}
                  {p.code && <a href={p.code} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-accent transition-colors"><Github className="w-4 h-4" /> Source</a>}
                  {p.deploy && <a href={p.deploy} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-accent hover:text-primary transition-colors"><Rocket className="w-4 h-4" /> Deploy</a>}
                  {p.docs && <a href={p.docs} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-foreground/70 hover:text-accent transition-colors"><FileText className="w-4 h-4" /> Docs</a>}
                  {p.video && <a href={p.video} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-sm font-mono text-foreground/70 hover:text-accent transition-colors"><PlayCircle className="w-4 h-4" /> Demo</a>}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5"><h3 className="font-display text-2xl">Add Project</h3><button onClick={() => setOpen(false)}><X className="w-5 h-5" /></button></div>
              <div className="grid gap-4">
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Project name" className="px-3 py-2 rounded-md bg-background border border-border" />
                <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} placeholder="Tagline" className="px-3 py-2 rounded-md bg-background border border-border" />
                <textarea value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} placeholder="Description" rows={4} className="px-3 py-2 rounded-md bg-background border border-border" />
                <div className="flex gap-2"><input value={stackInput} onChange={(e) => setStackInput(e.target.value)} placeholder="Add technology" className="flex-1 px-3 py-2 rounded-md bg-background border border-border" /><button onClick={() => { const v = stackInput.trim(); if (v) setDraft({ ...draft, stack: [...draft.stack, v] }); setStackInput(""); }} className="px-3 py-2 border border-border rounded-md">Add</button></div>
                <div className="flex flex-wrap gap-1.5">{draft.stack.map((s) => <button key={s} onClick={() => setDraft({ ...draft, stack: draft.stack.filter((x) => x !== s) })} className="px-2 py-1 text-xs rounded bg-background border border-border">{s}</button>)}</div>
                <input value={draft.live} onChange={(e) => setDraft({ ...draft, live: e.target.value })} placeholder="Live URL" className="px-3 py-2 rounded-md bg-background border border-border" />
                <input value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} placeholder="GitHub URL" className="px-3 py-2 rounded-md bg-background border border-border" />
                <button onClick={save} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground"><Save className="w-4 h-4" /> Save Project</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const labels: Record<ProjectStatus, string> = { planned: "PLANNED", "in-dev": "IN DEV", live: "LIVE", deployed: "DEPLOYED", archived: "ARCHIVED" };
  return <span className="font-mono text-[10px] tracking-widest border border-accent/30 px-2 py-1 rounded text-accent">{labels[status]}</span>;
}
