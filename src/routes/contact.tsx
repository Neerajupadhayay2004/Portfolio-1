import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";
import { MagicalBackground } from "@/components/MagicalBackground";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Owl Post — Contact · Neeraj Upadhayay" },
      { name: "description", content: "Get in touch with Neeraj Upadhayay for collaborations, hackathons, and security projects." },
      { property: "og:title", content: "Owl Post — Contact" },
      { property: "og:description", content: "Reach out for security & full-stack collaborations." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <MagicalBackground />
      <Navbar />
      <main className="pt-24">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
