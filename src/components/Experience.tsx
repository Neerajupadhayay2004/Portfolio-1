import { motion } from "framer-motion";
import { Section } from "./Section";
import { Briefcase } from "lucide-react";

const items = [
  { org: "Happieloop Technology", role: "Cybersecurity Intern (Remote)", year: "Feb – Apr 2026", desc: "Network security analysis, vulnerability assessment, and continuous security monitoring." },
  { org: "Maincrafts Technology", role: "Java Full-Stack Intern (Remote)", year: "Feb – Mar 2026", desc: "Built production-grade full-stack Java applications. Awarded a Letter of Recommendation for performance." },
  { org: "Kasper Infotech", role: "Frontend Developer Intern (Remote)", year: "Jun – Aug 2025", desc: "Enhanced user experience by implementing responsive, accessible design across the web platform." },
  { org: "Navodita Infotech", role: "Cybersecurity Intern (Remote)", year: "May 2025", desc: "Collaborated with senior engineers on real-world threat detection and mitigation projects." },
  { org: "EduSkills × AICTE", role: "AI in Cybersecurity Intern (10 weeks)", year: "2025", desc: "ML for cyber, IDS/IPS, SOAR, EDR/XDR, UBA, and DFIR fundamentals." },
];

export function Experience() {
  return (
    <Section eyebrow="THE CHRONICLES" title="Internship Scrolls" id="experience">
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-secondary opacity-40" />
        <div className="space-y-12">
          {items.map((it, i) => (
            <motion.div
              key={it.org}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative grid md:grid-cols-2 gap-6 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className={`pl-12 md:pl-0 ${i % 2 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}>
                <p className="font-mono text-xs text-accent mb-1">{it.year}</p>
                <h3 className="font-display text-2xl text-foreground">{it.org}</h3>
                <p className="text-primary font-mono text-sm">{it.role}</p>
              </div>
              <div className="pl-12 md:pl-12">
                <p className="text-muted-foreground">{it.desc}</p>
              </div>
              <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center glow-gold">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
