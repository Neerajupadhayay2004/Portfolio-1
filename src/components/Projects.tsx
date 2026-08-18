import { motion } from "framer-motion";
import { ExternalLink, Github, Shield, Brain, Code2, Bug, Network, Database, Globe, Smartphone, Wallet, Bot, FileSearch, ShoppingCart, Map, LockKeyhole } from "lucide-react";
import { Section } from "./Section";

type Project = { icon: any; name: string; tag: string; desc: string; stack: string[]; code: string; live?: string };
const G = "https://github.com/Neerajupadhayay2004/";

// Public projects and repositories from the current GitHub account. Repository links are canonical.
export const projects: Project[] = [
  { icon: Shield, name: "SARVA Firewall", tag: "Cybersecurity · AI Firewall", desc: "AI-powered firewall and security platform for threat detection, security dashboards and defensive workflows.", stack: ["Python", "FastAPI", "React", "Supabase"], code: G + "FIREWALL", live: "https://firewall-dun.vercel.app/" },
  { icon: Shield, name: "AI Advanced Firewall with Blockchain", tag: "AI Security · Web3", desc: "AI-assisted firewall architecture combined with blockchain-backed integrity and security logging.", stack: ["Python", "AI/ML", "Solidity", "Blockchain"], code: G + "AI-Advanced-Firewall-with-Blockchain" },
  { icon: Bot, name: "SARVA Multi-Purpose Offline Assistant", tag: "AI Assistant · Offline", desc: "Multi-purpose assistant project focused on local and privacy-oriented workflows.", stack: ["Python", "AI/ML", "Local AI", "Linux"], code: G + "Sarva-Multi-Purpose-Offline-Assistant" },
  { icon: Brain, name: "AegisAI Sentinel", tag: "Autonomous AI SOC", desc: "AI-driven security operations platform for threat detection, monitoring and automated security workflows.", stack: ["Python", "AI/ML", "SIEM", "SOAR"], code: G + "aegisai-sentinel" },
  { icon: Smartphone, name: "CollisionGuard Pro", tag: "AI Safety · PWA", desc: "AI-powered rider safety system with collision-awareness, navigation and mobile-oriented workflows.", stack: ["React", "TypeScript", "TensorFlow.js", "Leaflet"], code: G + "collisionguard-pro", live: "https://collosion.netlify.app/" },
  { icon: Brain, name: "Debt Recovery AI", tag: "Enterprise AI · Analytics", desc: "Intelligent debt-recovery platform combining automation, analytics and case-management workflows.", stack: ["React", "AI/ML", "PostgreSQL", "Analytics"], code: G + "debt-recovery-ai" },
  { icon: Globe, name: "CircuVerse AI", tag: "AI · Sustainability", desc: "AI-driven circular-economy project focused on waste intelligence and sustainability.", stack: ["React", "TypeScript", "AI/ML", "Computer Vision"], code: G + "circuverse-ai" },
  { icon: Brain, name: "AI Time Scheduler", tag: "Generative AI · Optimization", desc: "AI-assisted timetable generator for optimized and conflict-aware academic scheduling.", stack: ["React", "TypeScript", "Vite", "Gemini AI"], code: G + "Time-scheduler.ai" },
  { icon: ShoppingCart, name: "Grocery Commerce", tag: "Full-Stack · E-Commerce", desc: "Modern grocery-commerce project with product browsing, categories and shopping workflows.", stack: ["React", "TypeScript", "Tailwind", "Node.js"], code: G + "grocery" },
  { icon: Bug, name: "Phishing Detection System", tag: "Cybersecurity · Phishing", desc: "Security project for detecting and analyzing phishing indicators and suspicious activity.", stack: ["Python", "ML", "Cybersecurity", "Threat Detection"], code: G + "Phishing-Detection-System-IC_CS_03-" },
  { icon: Shield, name: "Automated Vulnerability Scanner", tag: "AppSec · Risk Prioritization", desc: "Automated application-security scanning and risk-prioritization workflow.", stack: ["Python", "Web Security", "Scanning", "Risk Scoring"], code: G + "Automated-vulnerability-scanner-with-risk-proritization" },
  { icon: Bug, name: "Bug Bounty Recon Report", tag: "Offensive Security · Recon", desc: "Bug-bounty style reconnaissance and security assessment work covering attack-surface discovery and validation.", stack: ["Nmap", "Burp Suite", "OSINT", "OWASP"], code: G + "bug-bounty-recon-report" },
  { icon: Brain, name: "Profile Intelligence Tool", tag: "OSINT · Intelligence", desc: "OSINT-oriented profile intelligence project for collecting and analyzing public information.", stack: ["Python", "OSINT", "Web Scraping", "Analysis"], code: G + "Profile-Intelligence-Tool" },
  { icon: Brain, name: "AI-Powered Social Media Intelligence", tag: "OSINT · AI", desc: "AI-enhanced social-media intelligence project for investigation and analysis.", stack: ["Python", "AI/ML", "OSINT", "NLP"], code: G + "AI-Powered-Social-Media-Intelligence-Tool-Integrate-AI-" },
  { icon: Shield, name: "Social Media Metadata Analyzer", tag: "OSINT · Metadata", desc: "Tooling for inspecting and analyzing social-media metadata for intelligence workflows.", stack: ["Python", "OSINT", "Metadata", "Analysis"], code: G + "social-media-metadata-analyzer" },
  { icon: Shield, name: "Honeypot Network", tag: "Threat Intelligence · Honeypots", desc: "Honeypot-focused project for capturing suspicious activity and studying attacker behavior.", stack: ["Python", "Honeypots", "Networking", "Threat Intel"], code: G + "honeypot-network" },
  { icon: Network, name: "Monitor the Situation Dashboard", tag: "Threat Intelligence · Real-Time", desc: "Real-time situational-awareness dashboard aggregating security, infrastructure and global feeds.", stack: ["Go", "WebSockets", "PostgreSQL", "MapLibre"], code: G + "monitor-the-situation-dashboard-" },
  { icon: Brain, name: "WorldIntel", tag: "AI · Intelligence Platform", desc: "AI-oriented intelligence platform combining web, automation, mapping and data workflows.", stack: ["Next.js", "TypeScript", "Convex", "n8n", "Gemini"], code: G + "worlIntel" },
  { icon: Bot, name: "Notion OS AI Agent Orchestrator", tag: "AI Agents · Automation", desc: "AI-agent orchestration project for connected productivity tools and automated workflows.", stack: ["TypeScript", "AI Agents", "Notion", "Automation"], code: G + "enter-NotionOSAIAgentOrchestrator" },
  { icon: Network, name: "Network Traffic Analyzer", tag: "Network Security", desc: "Network-security project for inspecting and analyzing traffic patterns for investigation and detection.", stack: ["Python", "Networking", "Packet Analysis", "Security"], code: G + "Network_Trafiic_analyzer" },
  { icon: LockKeyhole, name: "Web Application Security Basics", tag: "Web Security · AppSec", desc: "Hands-on web-application security work covering foundational application-security concepts.", stack: ["Web Security", "OWASP", "AppSec", "Testing"], code: G + "Web-Application-Security-Basics-AlfidoTech-Task2" },
  { icon: Network, name: "Wireshark Packet Analysis", tag: "Network Security · DFIR", desc: "Packet-analysis work for investigating protocols, anomalies and suspicious communication.", stack: ["Wireshark", "Networking", "Packet Analysis", "DFIR"], code: G + "Wireshark-Packet-Analysis-AlfidoTech-Task-03" },
  { icon: Shield, name: "Incident Response Simulation", tag: "Blue Team · SOC", desc: "Incident-response simulation covering investigation, triage, containment and reporting.", stack: ["Incident Response", "SOC", "Threat Analysis"], code: G + "Incident-Response-Simulation-AlfidoTech-Task-04" },
  { icon: Shield, name: "Cyber Crime Reporting Portal", tag: "Cybersecurity · Civic Tech", desc: "Web portal concept for cyber-incident reporting workflows.", stack: ["Web", "Cybersecurity", "UI/UX"], code: G + "Cyber-Crime-Reporting-Portal-" },
  { icon: Brain, name: "Smart Bharat AI Civic Companion", tag: "GenAI · GovTech", desc: "AI-powered citizen platform for discovering and navigating government services.", stack: ["React", "GenAI", "APIs", "Supabase"], code: G + "smart_Bharat_AI-Powered-civic-companion", live: "https://smart-bharat.netlify.app/" },
  { icon: Shield, name: "Phantom Cyber Core", tag: "Cybersecurity", desc: "Cybersecurity-focused project and experimentation repository.", stack: ["Cybersecurity", "Security Engineering"], code: G + "phantom-cyber-core" },
  { icon: Shield, name: "AI Trust Guard", tag: "AI Security", desc: "AI-security project focused on trust, safety and defensive AI workflows.", stack: ["AI", "Security", "Trust"], code: G + "ai-trust-guard" },
  { icon: Wallet, name: "QIE Secure Wallet", tag: "Blockchain · Wallet", desc: "Secure-wallet project exploring blockchain asset and transaction workflows.", stack: ["Blockchain", "Web3", "Wallet"], code: G + "qie-secure-wallet" },
  { icon: Bot, name: "Gemini Rider Assist", tag: "AI · Mobility", desc: "AI-assisted rider and mobility project using Gemini-oriented workflows.", stack: ["AI", "Gemini", "Mobility"], code: G + "gemini-rider-assist" },
  { icon: Smartphone, name: "Driver Alert AI", tag: "AI · Road Safety", desc: "AI-based driver-alert and road-safety project.", stack: ["AI/ML", "Computer Vision", "Safety"], code: G + "driver-alert-ai" },
  { icon: Map, name: "RoadWise AI", tag: "AI · Mobility", desc: "AI-oriented road and mobility project focused on smarter travel and safety workflows.", stack: ["AI", "Maps", "Mobility"], code: G + "roadwise-ai" },
  { icon: Bot, name: "Sir's Intelligent Assistant", tag: "AI Assistant", desc: "Intelligent-assistant project exploring AI-powered productivity workflows.", stack: ["AI", "Assistant", "Automation"], code: G + "sir-s-intelligent-assistant" },
  { icon: Brain, name: "Nexus AI Core", tag: "AI Platform", desc: "AI-core experimentation and platform project.", stack: ["AI", "LLM", "Automation"], code: G + "nexus-ai-core" },
  { icon: Brain, name: "LLM Hack", tag: "LLM · AI", desc: "LLM-focused experimentation and development project.", stack: ["LLM", "AI", "Python"], code: G + "LLM-hack" },
  { icon: Brain, name: "Algorithm AI", tag: "AI · Algorithms", desc: "AI and algorithm experimentation project.", stack: ["Python", "AI", "Algorithms"], code: G + "algorithm-ai" },
  { icon: Code2, name: "MLM", tag: "Machine Learning", desc: "Machine-learning experimentation repository.", stack: ["Python", "Machine Learning", "Data"], code: G + "mlm" },
  { icon: Database, name: "KYC", tag: "FinTech · Data", desc: "KYC-oriented application and data workflow project.", stack: ["Web", "Data", "KYC"], code: G + "kyc" },
  { icon: Globe, name: "Hidden Spots Stories", tag: "Web Application", desc: "Web project for discovering and presenting hidden places and stories.", stack: ["Web", "JavaScript", "UI/UX"], code: G + "hidden-spots-stories" },
  { icon: Globe, name: "Google Home Dev Challenge", tag: "Application Development", desc: "Development challenge project exploring connected-device and application workflows.", stack: ["JavaScript", "APIs", "Web"], code: G + "google-home-dev-challenge" },
  { icon: Code2, name: "HTML-CSS-JS", tag: "Frontend Development", desc: "Frontend practice and web-development projects using core browser technologies.", stack: ["HTML", "CSS", "JavaScript"], code: G + "HTML-CSS-JS" },
  { icon: Code2, name: "IILM Web Technology", tag: "Web Development", desc: "Academic web-technology projects and practical frontend development work.", stack: ["HTML", "CSS", "JavaScript"], code: G + "IILM-Web-Technology" },
  { icon: Code2, name: "IILM Web Technology Major Project", tag: "Web Development", desc: "Major academic web-technology project.", stack: ["Web", "JavaScript", "Frontend"], code: G + "IILM-Web-Technology-lab-major-project" },
  { icon: Code2, name: "Java Full-Stack Internship Task", tag: "Java · Full Stack", desc: "Java full-stack internship task and application-development work.", stack: ["Java", "Full Stack", "Web"], code: G + "Java-Full-Stack-Web-Development-Internship-Task-1" },
  { icon: Code2, name: "Java Project", tag: "Java Development", desc: "Java programming and application-development practice repository.", stack: ["Java"], code: G + "java-project" },
  { icon: Code2, name: "Java LeetCode", tag: "DSA · Java", desc: "Java solutions and algorithm practice repository.", stack: ["Java", "DSA", "Algorithms"], code: G + "JAVA-LEET-CODE" },
  { icon: Code2, name: "HCF-LCM", tag: "Programming · Algorithms", desc: "Programming project implementing HCF and LCM computation.", stack: ["Programming", "Algorithms"], code: G + "HCF-LCM" },
  { icon: FileSearch, name: "OSINT", tag: "Open-Source Intelligence", desc: "OSINT experimentation and intelligence-gathering project repository.", stack: ["OSINT", "Recon", "Investigation"], code: G + "osint" },
  { icon: Shield, name: "Subdomain Finder Tool", tag: "Reconnaissance · Security", desc: "Security-reconnaissance tool for discovering subdomains during authorized assessments.", stack: ["Python", "Recon", "OSINT"], code: G + "Subdomain-Finder-Tool-Development" },
  { icon: Bug, name: "Malware IITH", tag: "Malware Analysis · Security", desc: "Malware-security research and analysis repository.", stack: ["Cybersecurity", "Malware Analysis", "Research"], code: G + "Malware-IITH" },
  { icon: Shield, name: "Cybersecurity Task 1", tag: "Cybersecurity", desc: "Hands-on cybersecurity task and assessment repository.", stack: ["Cybersecurity", "Security Testing"], code: G + "-IC_CS_01-for-Cyber-Security-Task-1" },
  { icon: Brain, name: "Madhurvass", tag: "Application Project", desc: "Application-development project repository.", stack: ["Software Development"], code: G + "madhurvass" },
  { icon: Bot, name: "Digital Heroes", tag: "Digital Innovation", desc: "Digital innovation and application project.", stack: ["Web", "Innovation"], code: G + "Digital-Heroes" },
];

export function Projects({ compact = false }: { compact?: boolean }) {
  const list = compact ? projects.slice(0, 6) : projects;
  return (
    <Section eyebrow="THE PROJECT ARCHIVE" title="Projects & Repositories" id="projects">
      <p className="font-mono text-xs text-muted-foreground mb-8">{projects.length} public projects · every card links directly to its GitHub repository</p>
      <div className="grid md:grid-cols-2 gap-6">
        {list.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.article key={p.name} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: Math.min(i * 0.025, 0.35) }} whileHover={{ y: -6 }} className="group relative p-7 rounded-2xl bg-card border border-border hover:border-accent/60 transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center"><Icon className="w-5 h-5 text-accent" /></div>
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground">// {String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="font-mono text-xs text-accent mb-1">{p.tag}</p>
                <h3 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">{p.stack.map((s) => <span key={s} className="px-2 py-0.5 text-[11px] font-mono rounded bg-background/60 border border-border text-foreground/70">{s}</span>)}</div>
                <div className="flex flex-wrap gap-4">
                  <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-accent transition-colors"><Github className="w-4 h-4" /> Repository</a>
                  {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-mono text-accent hover:text-primary transition-colors"><ExternalLink className="w-4 h-4" /> Live Demo</a>}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
