import { motion } from "framer-motion";
import { Section } from "./Section";
import { Trophy, Award, BookOpen, Rocket, Shield, Calendar, Users, Sparkles, Github } from "lucide-react";

const items = [
  {
    icon: Trophy,
    title: "🥇 Innovate Bharat Hackathon 2026",
    sub: "1st Place — Cybersecurity & Blockchain Track · Sharda University",
    body: "Built SARVA OS — a customizable real-time attack detection & monitoring OS with blockchain-secured logging.",
    tag: "WIN",
  },
  {
    icon: Trophy,
    title: "🥇 SGU Hackathon 2026",
    sub: "1st Place — Cybersecurity Track · SDGI Global University",
    body: "Engineered an end-to-end intrusion-response pipeline with AI-driven triage and immutable evidence logs.",
    tag: "WIN",
  },
  {
    icon: Shield,
    title: "🥇 Kwala Hacker House 2025",
    sub: "1st Place — Solidity Blockchain Firewall",
    body: "Cross-chain DeFi protection layer: smart-contract firewall blocking flash-loan, re-entrancy, and oracle-manipulation exploits.",
    tag: "WIN",
  },
  {
    icon: Sparkles,
    title: "OpenAI Academy × NxtWave State-Level Buildathon",
    sub: "State Qualifier · November 2025",
    body: "Qualified at the state stage with an AI-assisted security tooling prototype.",
    tag: "QUALIFIER",
  },
  {
    icon: BookOpen,
    title: "ICSC AI-2025 — Published Paper",
    sub: "Cyber Guard: AI-Powered Firewall with Web3 Integration",
    body: "97.8% threat detection · 1.4% false positive · <20ms enforcement latency. Presented at Compucom Institute, Jaipur.",
    tag: "PAPER",
  },
  {
    icon: Rocket,
    title: "Sonipat Startup Summit 4.0",
    sub: "AIC IIT Delhi · February 2026",
    body: "Represented IILM University. Showcased rider-assistance & collision-prevention innovation at the Industry Acceleration Edition.",
    tag: "SUMMIT",
  },
  {
    icon: Users,
    title: "10+ Hackathons & Tech Events",
    sub: "Full-stack & AI-based solutions",
    body: "Consistent contributor across national-level innovation contests, shipping production-ready prototypes under tight deadlines.",
    tag: "STREAK",
  },
  {
    icon: Calendar,
    title: "Ignite — IILM University",
    sub: "Innovation-Driven Events",
    body: "Active participant in campus innovation drives, mentoring juniors on cybersecurity fundamentals and rapid prototyping.",
    tag: "EVENT",
  },
  {
    icon: Github,
    title: "GitHub Copilot Dev Days · Microsoft Gurugram",
    sub: "Ignite Edition",
    body: "Gained insights into OSINT workflows, AI-driven development, and secure coding practices with Copilot.",
    tag: "ATTENDED",
  },
  {
    icon: Award,
    title: "5× Hackathon Champion",
    sub: "Cybersecurity · Blockchain · AI/ML",
    body: "Consistent winner across national-level innovation contests — credibility built one shipped spell at a time.",
    tag: "LEGEND",
  },
];

export function Achievements() {
  return (
    <Section eyebrow="GOLDEN SNITCHES" title="Triumphs & Trophies" id="achievements">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 30, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            whileHover={{ y: -8, rotateX: 4, rotateY: -4, scale: 1.02 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (i % 6) * 0.08 }}
            style={{ transformPerspective: 1000 }}
            className="group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-card to-card/40 border border-primary/20 hover:border-primary/60 transition-colors overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/40 font-mono text-[9px] tracking-widest text-accent">
              {it.tag}
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center mb-5 group-hover:rotate-6 group-hover:scale-110 transition-transform">
                <it.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg sm:text-xl text-foreground mb-1 leading-tight">{it.title}</h3>
              <p className="font-mono text-[11px] text-accent mb-3 leading-snug">{it.sub}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{it.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
