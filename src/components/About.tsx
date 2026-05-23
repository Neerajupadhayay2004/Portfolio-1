import { motion } from "framer-motion";
import { Section } from "./Section";

const skills = [
  { cat: "Offensive", items: ["BlackArch Linux (daily)", "Kali / Parrot OS", "Pentesting & VAPT", "Wireshark / Burp / Metasploit"] },
  { cat: "Defensive", items: ["SOC Monitoring", "EDR/XDR", "DFIR", "IDS/IPS"] },
  { cat: "AI / ML", items: ["TensorFlow", "Scikit-learn", "Threat Intelligence", "Anomaly Detection"] },
  { cat: "Blockchain", items: ["Solidity", "Web3.js", "Smart Contracts", "On-chain Logging"] },
  { cat: "Full-Stack", items: ["React + TS", "Node.js", "Java", "MongoDB / PostgreSQL"] },
  { cat: "DevOps", items: ["Docker", "Linux Kernel", "Cloud Security", "CI/CD"] },
];

export function About() {
  return (
    <Section eyebrow="THE WIZARD" title="House of Code & Cipher" id="about">
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-1 p-8 rounded-2xl bg-card border border-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <p className="font-mono text-xs text-accent mb-2">~/identity.yml</p>
          <h3 className="font-display text-2xl mb-4 text-foreground">A Modern Auror</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Cybersecurity student at IILM University, ethical hacker, and full-stack developer
            crafting AI-driven security spells. Daily-driver on{" "}
            <span className="text-primary font-mono">BlackArch Linux</span> — published researcher,
            5× hackathon champion, and relentless learner turning theory into shipped, real-world defense systems.
          </p>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between gap-2"><span className="text-muted-foreground">house</span><span className="text-primary">Slytherin/Ravenclaw</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted-foreground">distro</span><span className="text-primary">BlackArch Linux</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted-foreground">wand</span><span className="text-primary">Mechanical KB, 11¾"</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted-foreground">patronus</span><span className="text-primary">Penguin (Linux)</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted-foreground">trophies</span><span className="text-primary">5× hackathon wins</span></div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {skills.map((s, i) => (
            <motion.div
              key={s.cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-xl bg-card/60 border border-border hover-lift backdrop-blur-sm"
            >
              <h4 className="font-display text-lg text-primary mb-3">{s.cat}</h4>
              <ul className="space-y-1.5">
                {s.items.map((it) => (
                  <li key={it} className="font-mono text-xs text-foreground/80 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent" /> {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
