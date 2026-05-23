import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Menu, X } from "lucide-react";
import { useState } from "react";
import { AmbientMusic } from "./AmbientMusic";
import { ThemeSwitcher } from "./ThemeSwitcher";

const links = [
  { to: "/", label: "Great Hall" },
  { to: "/projects", label: "Spellbook" },
  { to: "/contact", label: "Owl Post" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Wand2 className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
          <span className="font-display text-lg sm:text-xl tracking-widest text-gradient-magic">NEERAJ.U</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors relative group"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <AmbientMusic />
          <ThemeSwitcher />
          <a
            href="https://github.com/Neerajupadhayay2004"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md border border-primary/40 text-primary text-sm font-mono hover:bg-primary hover:text-primary-foreground transition-all"
          >
            $ ./hire_me
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-md border border-border text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/90"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm text-muted-foreground hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="https://github.com/Neerajupadhayay2004"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-primary/40 text-primary text-sm font-mono w-fit"
              >
                $ ./hire_me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
