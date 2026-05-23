export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between font-mono text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Neeraj Upadhayay · Crafted with ⚡ & ☕ in the Restricted Section</p>
        <p>"Mischief Managed." · v1.0.0</p>
      </div>
    </footer>
  );
}
