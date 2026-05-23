import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Achievements } from "@/components/Achievements";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MagicalBackground } from "@/components/MagicalBackground";
import { BlockchainDemo } from "@/components/BlockchainDemo";
import { GlobalAttackMap } from "@/components/GlobalAttackMap";
import { TechStack } from "@/components/TechStack";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neeraj Upadhayay — Cybersecurity Wizard & Full-Stack Sorcerer" },
      { name: "description", content: "Portfolio of Neeraj Upadhayay — Cybersecurity student, ethical hacker, 5× hackathon winner, AI/ML & blockchain security researcher." },
      { property: "og:title", content: "Neeraj Upadhayay — Cybersecurity Wizard" },
      { property: "og:description", content: "Ethical hacker, full-stack developer, AI/ML & blockchain security researcher." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen vr-stage">
      <MagicalBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Achievements />
        <Projects compact />
        <TechStack />
        <GlobalAttackMap />
        <BlockchainDemo />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
