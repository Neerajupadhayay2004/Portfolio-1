import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Terminal, Shield, Download, Cpu, Lock, Code2 } from "lucide-react";
import { Typewriter } from "./Typewriter";
import { keyTick, hackBurst, clickTick, successChime } from "@/lib/hackSound";

type Line = { kind: "in" | "out" | "sys" | "ok" | "err"; text: string };

const BOOT: Line[] = [
  { kind: "sys", text: "BlackArch Linux 2026.04 · kernel 6.9.2-hardened" },
  { kind: "sys", text: "Loading modules: [crypto] [tls] [ebpf] [wireguard] ✓" },
  { kind: "sys", text: "Establishing secure session @ neeraj@portfolio:~$" },
  { kind: "ok",  text: "Session ready. Type `help` to see available commands." },
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

  // Boot animation
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
    else if (["clear","cls"].includes(lc)) clickTick();
    else successChime();

    switch (lc) {
      case "help":
        print(HELP.map((t) => ({ kind: "out" as const, text: "  " + t })));
        break;
      case "whoami":
        print([
          { kind: "out", text: "neeraj_upadhayay :: cybersecurity_engineer" },
          { kind: "out", text: "role  : ethical_hacker · full-stack · ai/ml · blockchain" },
          { kind: "out", text: "edu   : IILM University · B.Tech CSE (Cyber Sec)" },
          { kind: "out", text: "stack : python · ts · solidity · tensorflow · linux" },
        ]);
        break;
      case "skills":
        print([
          { kind: "out", text: "[security]  pentest · osint · soc · burp · nmap · metasploit · wireshark" },
          { kind: "out", text: "[ai/ml]     tensorflow · pytorch · rag · vector_db · gemini · openai" },
          { kind: "out", text: "[blockchain] solidity · hardhat · ethers · web3 · ipfs · audit" },
          { kind: "out", text: "[fullstack] react · ts · vite · node · postgres · supabase · tailwind" },
          { kind: "out", text: "[devops]    docker · k8s · github_actions · cloudflare · aws" },
        ]);
        break;
      case "projects":
        print([
          { kind: "out", text: "01  cyber_guard          ai firewall × web3 (97.8% acc)" },
          { kind: "out", text: "02  aegisai_sentinel     autonomous ai soc for smb" },
          { kind: "out", text: "03  case_compass         rag + citations for enterprise" },
          { kind: "out", text: "04  blockchain_suite     solidity audit + on-chain logs" },
          { kind: "out", text: "05  colosion             ai collision avoidance pwa" },
          { kind: "out", text: "06  bug_bounty_recon     offensive recon report" },
          { kind: "out", text: "07  circuverse_ai        ai for circular economy" },
          { kind: "out", text: "08  time_scheduler_ai    gemini-powered scheduler" },
          { kind: "out", text: "09  debt_recovery_ai     enterprise dca platform" },
          { kind: "out", text: "10  sarva_os             custom security os" },
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
        print([{ kind: "out", text: "Linux blackarch 6.9.2-hardened #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux" }]);
        break;
      case "neofetch":
        print([
          { kind: "out", text: "OS      : BlackArch Linux x86_64" },
          { kind: "out", text: "Host    : neeraj@portfolio" },
          { kind: "out", text: "Kernel  : 6.9.2-hardened" },
          { kind: "out", text: "Shell   : zsh 5.9 (oh-my-zsh)" },
          { kind: "out", text: "DE      : i3-gaps · picom · polybar" },
          { kind: "out", text: "Term    : alacritty · tmux" },
          { kind: "out", text: "CPU     : Ryzen 7 · 16GB RAM · NVMe" },
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
            { kind: "ok", text: "✓ payload signed · ✓ proxychains active · ✓ tor circuit built" },
            { kind: "ok", text: "→ scanning targets… 1024/1024 ports complete" },
            { kind: "ok", text: "→ deploying ai-firewall bypass… 100%" },
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
        {/* Left: identity */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/40 bg-accent/5 text-accent text-[11px] font-mono mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <Lock className="w-3 h-3" /> SECURE_CHANNEL · TLS 1.3 · IILM UNIVERSITY
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="font-mono font-bold text-5xl md:text-7xl leading-[1.05] mb-6 tracking-tight"
          >
            <span className="block text-foreground">&gt; neeraj_</span>
            <span className="block text-gradient-magic">upadhayay<span className="text-accent">.sh</span></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mb-6 font-mono"
          >
            <span className="text-accent">// role:</span>{" "}
            <Typewriter
              className="text-foreground"
              words={[
                "Cybersecurity Engineer",
                "Ethical Hacker · OSCP track",
                "AI/ML Researcher",
                "Blockchain Auditor",
                "Full-Stack Developer",
                "5× Hackathon Winner",
              ]}
            />
            <br />
            <span className="text-foreground/85">
              ship secure systems that don't break under load — fluent in
              <span className="text-primary"> AI/ML</span>,
              <span className="text-primary"> blockchain</span>,
              <span className="text-primary"> full-stack</span>.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {[
              { icon: Shield, label: "ethical_hacker" },
              { icon: Cpu, label: "ai_ml_engineer" },
              { icon: Code2, label: "full_stack_dev" },
              { icon: Terminal, label: "blackarch_user" },
            ].map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-card border border-border text-xs font-mono text-foreground/80 hover:border-accent/60 transition-colors"
              >
                <b.icon className="w-3 h-3 text-accent" /> {b.label}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="https://www.linkedin.com/in/neeraj-upadhayay-a0958a246/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:scale-[1.03] hover-lift glow-gold transition-transform"
            >
              <Linkedin className="w-4 h-4" /> ./connect.sh
            </a>
            <a
              href="https://github.com/Neerajupadhayay2004"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-accent/50 text-accent font-mono text-sm hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <Github className="w-4 h-4" /> git://github
            </a>
            <a
              href="/Neeraj_Upadhayay.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-secondary/60 text-foreground bg-secondary/15 font-mono text-sm hover:bg-secondary/30 transition-all"
            >
              <Download className="w-4 h-4" /> wget resume.pdf
            </a>
          </motion.div>
        </div>

        {/* Right: interactive terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
          style={{ perspective: 1200 }}
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/25 to-secondary/25 rounded-2xl blur-2xl glow-pulse" />
          <div
            onClick={() => inputRef.current?.focus()}
            className="relative rounded-xl bg-[oklch(0.09_0.02_160)] border border-primary/30 shadow-[var(--shadow-deep)] overflow-hidden scanlines cursor-text"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background/60">
              <span className="w-3 h-3 rounded-full bg-destructive" />
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span className="ml-3 text-[11px] font-mono text-muted-foreground truncate">
                root@blackarch: ~/portfolio · zsh
              </span>
              <span className="ml-auto text-[10px] font-mono text-accent/70">{nowStamp()}</span>
            </div>

            <div
              ref={scrollRef}
              className="font-mono text-[12.5px] md:text-sm p-4 md:p-5 h-[340px] md:h-[380px] overflow-y-auto custom-scroll leading-relaxed"
            >
              <pre className="text-primary text-[9px] md:text-[10px] leading-[1.15] mb-3 select-none">
                {ASCII}
              </pre>
              {history.map((l, i) => (
                l && (
                  <div key={i} className="whitespace-pre-wrap break-words">
                    {l.kind === "in" && (
                      <span>
                        <span className="text-accent">neeraj@blackarch</span>
                        <span className="text-muted-foreground">:</span>
                        <span className="text-primary">~/portfolio</span>
                        <span className="text-muted-foreground">$ </span>
                        <span className="text-foreground">{l.text}</span>
                      </span>
                    )}
                    {l.kind === "out" && <span className="text-foreground/85">{l.text}</span>}
                    {l.kind === "sys" && <span className="text-muted-foreground italic">{l.text}</span>}
                    {l.kind === "ok"  && <span className="text-accent">{l.text}</span>}
                    {l.kind === "err" && <span className="text-destructive">{l.text}</span>}
                  </div>
                )
              ))}

              {booted && (
                <div className="flex items-center mt-1">
                  <span className="text-accent">neeraj@blackarch</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-primary">~/portfolio</span>
                  <span className="text-muted-foreground">$&nbsp;</span>
                  <input
                    ref={inputRef}
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    spellCheck={false}
                    autoComplete="off"
                    className="flex-1 bg-transparent border-0 outline-none text-foreground caret-accent font-mono text-[12.5px] md:text-sm"
                    aria-label="terminal input"
                  />
                  <span className="cursor-blink" />
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-border bg-background/40 flex flex-wrap gap-1.5">
              {["help", "whoami", "skills", "projects", "sudo hack", "clear"].map((q) => (
                <button
                  key={q}
                  onClick={() => { run(q); inputRef.current?.focus(); }}
                  className="px-2 py-0.5 text-[10px] font-mono rounded border border-border text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
