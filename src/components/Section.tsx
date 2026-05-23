import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-3">// {eyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-magic">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}
