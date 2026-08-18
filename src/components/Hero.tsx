import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Terminal, Shield, Download, Cpu, Lock, Code2 } from "lucide-react";
import { Typewriter } from "./Typewriter";
import { keyTick, hackBurst, clickTick, successChime } from "@/lib/hackSound";

type Line = { kind: "in" | "out" | "sys" | "ok" | "err"; text: string };

const BOOT: Line[] = [
  { kind: "sys", text: "Cybersecurity workspace online · secure portfolio channel" },
  { kind: "sys", text: "Loading modules: [security] [ai/ml] [full-stack] [blockchain] ✓" },
  { kind: "sys", text: "Establishing secure session @ neeraj@portfolio:~$" },
  { kind: "ok", text: "Session ready. Type `help` to see available commands." },
];

const ASCII = String.raw`
   _   _ _____ _____ ____      _      _    _ 
  | \ | | ____| ____|  _ \    / \    | |  | |
  |  \| |  _| |  _| | |_) |  / _ \   | |  | |
  | |\  | |___| |___|  _ <  / ___ \  | |__| |
  |_| \_|_____|_____|_| \_\/_/   \_\  \____/`;

const HELP = [
  "help              show available commands",
  "whoami            print operator identity",
  "skills            list core stacks",
  "projects          list shipped projects",
  "social            print social handles",
  "contact           open contact channels",
  "resume            download resume.pdf",
  "uname -a          system info",
  "neofetch          system summary",
  "ls -la            list portfolio sections",
  "sudo hack         ✦ launch demo payload",
  "clear             clear the screen",
];

function nowStamp() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export function Hero() {
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [logIdx, setLogIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < BOOT.length) {
        setHistory((h) => [...h, BOOT[i]]);
        i++;
      }
      if (i >= BOOT.length) {
        clearInterval(t);
        setBooted(true);
      }
    }, 450);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history]);

  const print = (lines: Line[]) => setHistory((h) => [...h, ...lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    print([{ kind: "in", text: cmd }]);
    if (!cmd) return;
    setCmdLog((l) => [...l, cmd]);
    setLogIdx(0);

    const [c, ...args] = cmd.split(/\s+/);
    const lc = c.toLowerCase();
    if (lc === "sudo" && args[0] === "hack") hackBurst();
    else if (["clear", "cls"].includes(lc)) clickTick();
    else successChime();

    switch (lc) {
      case "help":
        print(HELP.map((t) => ({ kind: "out" as const, text: "  " + t })));
        break;
      case "whoami":
        print([
          { kind: "out", text: "neeraj_upadhayay :: cybersecurity_engineer" },
          { kind: "out", text: "role  : ethical_hacking · full-stack · ai/ml · blockchain" },
          { kind: "out", text: "edu   : IILM University · B.Tech CSE (Cyber Sec)" },
          { kind: "out", text: "stack : python · typescript · solidity · react · linux" },
        ]);
        break;
      case "skills":
        print([
          { kind: "out", text: "[security]  pentest · osint · soc · burp · nmap · wireshark" },
          { kind: "out", text: "[ai/ml]     tensorflow · pytorch · rag · vector db · gemini · openai" },
          { kind: "out", text: "[blockchain] solidity · hardhat · ethers.js · web3 · ipfs" },
          { kind: "out", text: "[fullstack] react · typescript · vite · node.js · postgres · supabase · tailwind" },
          { kind: "out", text: "[backend]   python · fastapi · sql · rest apis · websockets" },
          { kind: "out", text: "[devops]    docker · github actions · vercel · netlify · render · cloud tooling" },
        ]);
        break;
      case "projects":
        print([
          { kind: "out", text: "01  sarva_firewall          ai firewall · fastapi · supabase" },
          { kind: "out", text: "02  aegisai_sentinel        autonomous ai soc" },
          { kind: "out", text: "03  collisionguard_pro      ai safety pwa" },
          { kind: "out", text: "04  debt_recovery_ai        enterprise ai/analytics" },
          { kind: "out", text: "05  circuverse_ai           ai for sustainability" },
          { kind: "out", text: "06  time_scheduler_ai       gemini-powered optimization" },
          { kind: "out", text: "07  automated_vuln_scanner  appsec · risk prioritization" },
          { kind: "out", text: "08  profile_intelligence    osint · intelligence" },
          { kind: "out", text: "09  honeypot_network        threat intelligence" },
          { kind: "out", text: "10  monitor_the_situation   real-time threat dashboard" },
          { kind: "out", text: "11  worldintel               ai intelligence platform" },
          { kind: "out", text: "12  smart_bharat             genai · civic tech" },
        ]);
        break;
      case "social":
        print([
          { kind: "out", text: "github   : github.com/Neerajupadhayay2004" },
          { kind: "out", text: "linkedin : linkedin.com/in/neeraj-upadhayay-a0958a246" },
          { kind: "out", text: "leetcode : leetcode.com/problemset" },
          { kind: "out", text: "email    : neerajupadhayay347@gmail.com" },
        ]);
        break;
      case "contact":
        print([{ kind: "ok", text: "→ scrolling to contact module…" }]);
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "resume":
      case "cv":
        print([{ kind: "ok", text: "→ initiating resume.pdf download…" }]);
        window.location.href = "/Neeraj_Upadhayay.pdf";
        break;
      case "uname":
        print([{ kind: "out", text: "Linux cybersecurity-workstation x86_64 · secure developer environment" }]);
        break;
      case "neofetch":
        print([
          { kind: "out", text: "OS      : Linux" },
          { kind: "out", text: "Host    : neeraj@portfolio" },
          { kind: "out", text: "Focus   : Cybersecurity · AI/ML · Full-Stack" },
          { kind: "out", text: "Shell   : developer terminal" },
          { kind: "out", text: "Tools   : Docker · Git · GitHub · Burp · Nmap · Wireshark" },
        ]);
        break;
      case "ls":
        print([
          { kind: "out", text: "drwxr-xr-x  about/        experience/   achievements/" },
          { kind: "out", text: "drwxr-xr-x  projects/     blockchain/   contact/" },
          { kind: "out", text: "-rw-r--r--  resume.pdf    skills.json   README.md" },
        ]);
        break;
      case "sudo":
        if (args[0] === "hack") {
          print([
            { kind: "sys", text: "[sudo] password for neeraj: ********" },
            { kind: "ok", text: "✓ secure channel verified · ✓ defensive demo enabled" },
            { kind: "ok", text: "→ loading project portfolio… 100%" },
            { kind: "ok", text: "→ showcasing cybersecurity + AI + full-stack systems" },
            { kind: "ok", text: "✦ Access granted. Welcome, operator." },
          ]);
        } else {
          print([{ kind: "err", text: `sudo: ${args.join(" ") || "(nothing)"}: command not found` }]);
        }
        break;
      case "clear":
      case "cls":
        setHistory([]);
        break;
      case "echo":
        print([{ kind: "out", text: args.join(" ") }]);
        break;
      case "exit":
        print([{ kind: "sys", text: "logout — connection closed." }]);
        break;
      default:
        print([{ kind: "err", text: `command not found: ${c} — try \`help\`` }]);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key.length === 1) {
      keyTick();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdLog.length === 0) return;
      const next = Math.min(logIdx + 1, cmdLog.length);
      setLogIdx(next);
      setInput(cmdLog[cmdLog.length - next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(logIdx - 1, 0);
      setLogIdx(next);
      setInput(next === 0 ? "" : cmdLog[cmdLog.length - next] || "");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 parchment-bg" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-secondary/15 blur-3xl animate-flicker" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center w-full">
        <div>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/40 bg-accent/5 text-accent text-[11px] font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <Lock className="w-3 h-3" /> SECURE_CHANNEL · IILM UNIVERSITY
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }} className="font-mono font-bold text-5xl md:text-7xl leading-[1.05] mb-6 tracking-tight">
            <span className="block text-foreground">&gt; neeraj_</span>
            <span className="block text-gradient-magic">upadhayay<span className="text-accent">.sh</span></span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.9 }} className="text-base md:text-lg text-muted-foreground max-w-xl mb-6 font-mono">
            <span className="text-accent">// role:</span>{" "}
            <Typewriter
              className="text-foreground"
              words={[
                "Cybersecurity Engineer",
                "Ethical Hacker",
                "AI/ML Developer",
                "Blockchain Security Builder",
                "Full-Stack Developer",
                "Security Researcher",
              ]}
            />
            <br />
            <span className="text-foreground/85">
              building secure, intelligent systems across
              <span className="text-primary"> cybersecurity</span>,
              <span className="text-primary"> AI/ML</span>,
              <span className="text-primary"> blockchain</span>, and
              <span className="text-primary"> full-stack engineering</span>.
            </span>
          </motion.p>

          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/Neerajupadhayay2004" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-accent transition-colors font-mono text-sm"><Github className="w-4 h-4" /> GitHub</a>
            <a href="https://linkedin.com/in/neeraj-upadhayay-a0958a246" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-accent transition-colors font-mono text-sm"><Linkedin className="w-4 h-4" /> LinkedIn</a>
            <a href="/Neeraj_Upadhayay.pdf" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground font-mono text-sm"><Download className="w-4 h-4" /> Resume</a>
          </div>
        </div>

        <div className="relative rounded-2xl border border-accent/20 bg-card/60 backdrop-blur-sm overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border font-mono text-[11px] text-muted-foreground"><span>neeraj@portfolio:~</span><span>{booted ? nowStamp() : "booting..."}</span></div>
          <pre className="px-4 pt-4 text-[8px] md:text-[10px] text-accent overflow-x-auto">{ASCII}</pre>
          <div ref={scrollRef} className="h-[360px] overflow-y-auto px-4 pb-4 font-mono text-xs space-y-1">
            {history.map((line, i) => <div key={`${i}-${line.text}`} className={line.kind === "err" ? "text-destructive" : line.kind === "ok" ? "text-accent" : line.kind === "sys" ? "text-muted-foreground" : "text-foreground/80"}>{line.text}</div>)}
            <div className="flex items-center gap-2 pt-2"><span className="text-primary">neeraj@portfolio:~$</span><input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} disabled={!booted} placeholder={booted ? "type help" : "initializing..."} className="flex-1 bg-transparent outline-none text-foreground" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
