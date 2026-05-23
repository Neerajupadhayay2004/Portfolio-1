import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Projects } from "@/components/Projects";
import { BlockchainDemo } from "@/components/BlockchainDemo";
import { MagicalBackground } from "@/components/MagicalBackground";
import { ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Spellbook — Projects · Neeraj Upadhayay" },
      { name: "description", content: "Cyber Guard, Case Compass, Colosion, SARVA OS, Debt Recovery AI, Blockchain Security Suite — projects by Neeraj Upadhayay." },
      { property: "og:title", content: "Spellbook — Projects" },
      { property: "og:description", content: "AI security, blockchain, and full-stack creations." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div className="relative min-h-screen">
      <MagicalBackground />
      <Navbar />
      <main className="pt-32">
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="w-3.5 h-3.5" /> back to Great Hall
              </Link>
              <p className="font-mono text-xs tracking-[0.3em] text-accent mb-3">// THE SPELLBOOK</p>
              <h1 className="font-display text-5xl md:text-7xl text-gradient-magic mb-6">
                Forbidden Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl font-body italic">
                "Words are, in my not-so-humble opinion, our most inexhaustible source of magic." —
                each project below is a working spell, shipped, audited, and battle-tested.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/15 border border-secondary/40 font-mono text-xs text-accent">
                <Sparkles className="w-3.5 h-3.5" /> 6 spells · 5× hackathon wins · 1 published paper
              </div>
            </motion.div>
          </div>
        </section>

        <Projects />
        <BlockchainDemo />
      </main>
      <Footer />
    </div>
  );
}
