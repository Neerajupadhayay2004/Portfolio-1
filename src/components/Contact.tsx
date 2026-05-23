import { motion, AnimatePresence } from "framer-motion";
import { Section } from "./Section";
import { Linkedin, Github, Code2, Mail, Send, Download, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const channels = [
  { icon: Linkedin, label: "LinkedIn", handle: "neeraj-upadhayay-a0958a246", href: "https://www.linkedin.com/in/neeraj-upadhayay-a0958a246/" },
  { icon: Github, label: "GitHub", handle: "Neerajupadhayay2004", href: "https://github.com/Neerajupadhayay2004" },
  { icon: Code2, label: "LeetCode", handle: "problemset", href: "https://leetcode.com/problemset/" },
  { icon: Mail, label: "Email", handle: "neerajupadhayay347@gmail.com", href: "mailto:neerajupadhayay347@gmail.com" },
];

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(80),
  email: z.string().trim().email("Invalid email").max(160),
  message: z.string().trim().min(5, "Too short").max(800),
});

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      setStatus({ ok: false, msg: r.error.issues[0].message });
      toast.error("Validation failed", { description: r.error.issues[0].message });
      return;
    }
    setStatus(null);
    setSending(true);

    const t = toast.loading("✦ Casting Sending Charm…", {
      description: "Encrypting payload · Signing transmission · Dispatching owl post",
    });

    // Simulated cast sequence for polished UX
    await new Promise((res) => setTimeout(res, 1600));

    const subject = encodeURIComponent(`Professional Inquiry from ${r.data.name}`);
    const body = encodeURIComponent(`${r.data.message}\n\n— ${r.data.name} (${r.data.email})`);

    toast.success("Message dispatched ✓", {
      id: t,
      description: "Your email client is opening — please confirm send to complete delivery.",
      duration: 6000,
    });

    setSending(false);
    setSent(true);
    setStatus({ ok: true, msg: "Transmission ready — confirm send in your email client to deliver." });
    window.location.href = `mailto:neerajupadhayay347@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", message: "" });
    }, 4000);
  };

  return (
    <Section eyebrow="CONTACT" title="Get In Touch" id="contact">
      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xl text-foreground mb-4 font-display">
            Let's build something secure together.
          </p>
          <p className="text-foreground/80 mb-8 leading-relaxed">
            I'm available for cybersecurity consulting, full-stack engineering, AI/ML research collaborations,
            and hackathon partnerships. For the fastest response, please reach out via email at{" "}
            <a href="mailto:neerajupadhayay347@gmail.com" className="text-primary underline-offset-4 hover:underline font-mono">
              neerajupadhayay347@gmail.com
            </a>
            .
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {channels.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-5 rounded-xl bg-card border border-border hover:border-primary/60 hover-lift"
              >
                <c.icon className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-display text-base text-foreground">{c.label}</p>
                <p className="font-mono text-[11px] text-muted-foreground truncate">{c.handle}</p>
              </motion.a>
            ))}
          </div>
          <a
            href="/Neeraj_Upadhayay.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground font-mono text-sm hover:scale-105 transition-transform glow-gold"
          >
            <Download className="w-4 h-4" /> Download Resume
          </a>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative p-8 rounded-2xl bg-card border border-primary/30 overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative space-y-4">
            <p className="font-mono text-xs text-accent">~/contact.form</p>
            <h3 className="font-display text-2xl text-foreground mb-2">Send a Professional Inquiry</h3>
            <p className="text-sm text-muted-foreground mb-2">
              I respond within 24 hours. For collaborations, hackathons, security audits, or full-stack engagements — please share a brief context below.
            </p>

            <div>
              <label className="font-mono text-xs text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={80}
                className="w-full mt-1 px-4 py-3 rounded-md bg-background/60 border border-border focus:border-primary focus:outline-none font-mono text-sm text-foreground"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={160}
                className="w-full mt-1 px-4 py-3 rounded-md bg-background/60 border border-border focus:border-primary focus:outline-none font-mono text-sm text-foreground"
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-muted-foreground">Your Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={800}
                className="w-full mt-1 px-4 py-3 rounded-md bg-background/60 border border-border focus:border-primary focus:outline-none font-mono text-sm text-foreground resize-none"
                placeholder="Hello Neeraj, I'd like to discuss a project / role / collaboration regarding..."
              />
            </div>

            {status && (status.ok ? (
              <p className="font-mono text-xs text-accent">{status.msg}</p>
            ) : (
              <p className="font-mono text-xs text-destructive">{status.msg}</p>
            ))}

            <motion.button
              type="submit"
              disabled={sending || sent}
              whileTap={{ scale: 0.98 }}
              className="relative w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground font-mono text-sm overflow-hidden disabled:opacity-90 disabled:cursor-wait glow-gold"
            >
              <span className="absolute inset-0 holo opacity-60 pointer-events-none" />
              <AnimatePresence mode="wait">
                {sending ? (
                  <motion.span key="sending" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="relative inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Casting Sending Charm…</span>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </motion.span>
                ) : sent ? (
                  <motion.span key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Message Dispatched
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative inline-flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send Secure Message
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            {sending && (
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.6, ease: "easeInOut" }} className="h-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-full" />
            )}
          </div>
        </motion.form>
      </div>
    </Section>
  );
}
