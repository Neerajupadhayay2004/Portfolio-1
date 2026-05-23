import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Section } from "./Section";
import { Link2, ShieldCheck, AlertTriangle, Hash, Plus, Pickaxe, FileSearch, BookOpen } from "lucide-react";
import { CitationModal } from "./CitationModal";

// tiny djb2 hash → hex (visual only, deterministic)
function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  // expand to 16 hex chars
  let s = h.toString(16).padStart(8, "0");
  let h2 = 0;
  for (let i = 0; i < input.length; i++) h2 = ((h2 * 31) ^ input.charCodeAt(i)) >>> 0;
  s += h2.toString(16).padStart(8, "0");
  return s;
}

type Block = {
  index: number;
  timestamp: string;
  event: string;
  citation: string;
  prevHash: string;
  nonce: number;
  hash: string;
  tampered?: boolean;
};

const GENESIS: Block = {
  index: 0,
  timestamp: "2026-01-01T00:00:00Z",
  event: "GENESIS :: Cyber Guard ledger initialized",
  citation: "RFC-0 · Bootstrap Spell",
  prevHash: "0000000000000000",
  nonce: 0,
  hash: hash("0|GENESIS"),
};

const SEED_EVENTS = [
  { event: "AUTH_SUCCESS user=auror_42 ip=10.0.0.7", citation: "Policy §4.2 — MFA Enforced" },
  { event: "BLOCK_INTRUSION src=185.220.101.7 rule=R-9", citation: "Policy §7.1 — Tor Exit Block" },
  { event: "CONTRACT_DEPLOY addr=0xCa5e…C0Mp", citation: "Audit-Trail SOP §3" },
  { event: "ALERT severity=HIGH service=auth-svc", citation: "SOC Runbook §12" },
];

function mineBlock(prev: Block, event: string, citation: string): Block {
  const ts = new Date().toISOString();
  const idx = prev.index + 1;
  let nonce = 0;
  let h = "";
  // toy PoW: hash must start with "0"
  while (true) {
    h = hash(`${idx}|${ts}|${event}|${citation}|${prev.hash}|${nonce}`);
    if (h.startsWith("0")) break;
    nonce++;
    if (nonce > 50000) break;
  }
  return { index: idx, timestamp: ts, event, citation, prevHash: prev.hash, nonce, hash: h };
}

function rehash(b: Block, prevHash: string): Block {
  const h = hash(`${b.index}|${b.timestamp}|${b.event}|${b.citation}|${prevHash}|${b.nonce}`);
  return { ...b, prevHash, hash: h };
}

export function BlockchainDemo() {
  const [chain, setChain] = useState<Block[]>(() => {
    let c = [GENESIS];
    SEED_EVENTS.slice(0, 2).forEach((e) => c.push(mineBlock(c[c.length - 1], e.event, e.citation)));
    return c;
  });
  const [evt, setEvt] = useState("");
  const [cite, setCite] = useState("");
  const [mining, setMining] = useState(false);
  const [activeCitation, setActiveCitation] = useState<{ citation: string; hash: string; index: number } | null>(null);

  const addBlock = async () => {
    const e = evt.trim() || SEED_EVENTS[chain.length % SEED_EVENTS.length].event;
    const c = cite.trim() || SEED_EVENTS[chain.length % SEED_EVENTS.length].citation;
    setMining(true);
    await new Promise((r) => setTimeout(r, 600));
    setChain((prev) => [...prev, mineBlock(prev[prev.length - 1], e, c)]);
    setEvt("");
    setCite("");
    setMining(false);
  };

  const tamper = (i: number) => {
    setChain((prev) =>
      prev.map((b, idx) =>
        idx === i ? { ...b, event: b.event + " ⚠tampered", tampered: true } : b
      )
    );
  };

  const reseal = () => {
    setChain((prev) => {
      const out: Block[] = [prev[0]];
      for (let i = 1; i < prev.length; i++) {
        const r = rehash({ ...prev[i], tampered: false }, out[i - 1].hash);
        out.push(r);
      }
      return out;
    });
  };

  // validation: each block's prevHash must equal previous block's recomputed hash
  const validity = chain.map((b, i) => {
    if (i === 0) return true;
    const recomputed = hash(
      `${b.index}|${b.timestamp}|${b.event}|${b.citation}|${b.prevHash}|${b.nonce}`
    );
    const prevOk = b.prevHash === chain[i - 1].hash;
    return recomputed === b.hash && prevOk;
  });
  const chainOk = validity.every(Boolean);

  return (
    <Section
      eyebrow="THE PENSIEVE LEDGER"
      title="Immutable Logs & Citations"
      id="blockchain"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-1 space-y-5"
        >
          <p className="font-mono text-xs text-accent">// how the spell works</p>
          <h3 className="font-display text-2xl text-foreground">
            Every event is sealed in a block — chained by a cryptographic hash.
          </h3>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="flex gap-3">
              <Hash className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p><b className="text-foreground">Hash linkage.</b> Each block stores the previous block's hash. Editing any byte breaks the chain.</p>
            </div>
            <div className="flex gap-3">
              <FileSearch className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p><b className="text-foreground">Citations attached.</b> Policies, runbooks, and audit references travel with the event — verifiable forever.</p>
            </div>
            <div className="flex gap-3">
              <Pickaxe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p><b className="text-foreground">Proof-of-Work.</b> A nonce is mined until the hash satisfies the difficulty (here: starts with <code className="font-mono text-accent">0</code>).</p>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p><b className="text-foreground">Tamper detection.</b> Modify a block → its hash changes → all subsequent blocks become invalid.</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="font-mono text-xs text-muted-foreground mb-2">~/append-block.cast</p>
            <input
              value={evt}
              onChange={(e) => setEvt(e.target.value)}
              maxLength={120}
              placeholder="event (e.g. AUTH_FAIL ip=…)"
              className="w-full px-3 py-2 mb-2 rounded bg-background/60 border border-border font-mono text-xs text-foreground focus:outline-none focus:border-primary"
            />
            <input
              value={cite}
              onChange={(e) => setCite(e.target.value)}
              maxLength={80}
              placeholder="citation (Policy §x.y)"
              className="w-full px-3 py-2 mb-3 rounded bg-background/60 border border-border font-mono text-xs text-foreground focus:outline-none focus:border-primary"
            />
            <button
              onClick={addBlock}
              disabled={mining}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground font-mono text-xs disabled:opacity-50 hover:scale-[1.02] transition-transform"
            >
              {mining ? <><Pickaxe className="w-3.5 h-3.5 animate-spin" /> Mining…</> : <><Plus className="w-3.5 h-3.5" /> Append Block</>}
            </button>
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-lg border font-mono text-xs ${
              chainOk
                ? "bg-secondary/10 border-secondary/40 text-accent"
                : "bg-destructive/10 border-destructive/50 text-destructive"
            }`}
          >
            {chainOk ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>
              chain.status = {chainOk ? "VALID · all citations verified" : "BROKEN · tamper detected"}
            </span>
            {!chainOk && (
              <button onClick={reseal} className="ml-auto px-3 py-1 rounded bg-primary text-primary-foreground">
                Reseal
              </button>
            )}
          </div>
        </motion.div>

        {/* Chain visualization */}
        <div className="lg:col-span-2 relative">
          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 custom-scroll">
            <AnimatePresence initial={false}>
              {chain.map((b, i) => {
                const ok = validity[i];
                return (
                  <motion.div
                    key={b.hash + i}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className={`relative rounded-xl border p-5 bg-card overflow-hidden ${
                      ok ? "border-primary/30" : "border-destructive/60"
                    }`}
                  >
                    {!ok && (
                      <div className="absolute inset-0 bg-destructive/10 pointer-events-none" />
                    )}
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                            ok
                              ? "bg-primary/15 border-primary/40 text-primary"
                              : "bg-destructive/20 border-destructive/60 text-destructive"
                          }`}
                        >
                          <Link2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-display text-lg text-foreground">
                            Block #{b.index}
                            {i === 0 && <span className="ml-2 text-xs text-accent font-mono">[GENESIS]</span>}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">{b.timestamp}</p>
                        </div>
                      </div>
                      {i > 0 && (
                        <button
                          onClick={() => tamper(i)}
                          className="font-mono text-[10px] px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          tamper()
                        </button>
                      )}
                    </div>

                    <div className="relative grid sm:grid-cols-2 gap-3 mt-4 font-mono text-[11px]">
                      <div className="p-3 rounded bg-background/50 border border-border">
                        <p className="text-muted-foreground mb-1">event</p>
                        <p className="text-foreground break-all">{b.event}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveCitation({ citation: b.citation, hash: b.hash, index: b.index })}
                        className="group/cite text-left p-3 rounded bg-background/50 border border-border hover:border-accent/60 hover:bg-accent/5 transition-colors"
                      >
                        <p className="text-muted-foreground mb-1 flex items-center gap-1.5">
                          citation
                          <BookOpen className="w-3 h-3 text-accent opacity-60 group-hover/cite:opacity-100 transition-opacity" />
                          <span className="ml-auto text-[9px] text-accent/70 group-hover/cite:text-accent">view →</span>
                        </p>
                        <p className="text-accent break-all underline decoration-dotted underline-offset-2">{b.citation}</p>
                      </button>
                      <div className="p-3 rounded bg-background/50 border border-border">
                        <p className="text-muted-foreground mb-1">prevHash</p>
                        <p className="text-primary/80 break-all">{b.prevHash}</p>
                      </div>
                      <div className="p-3 rounded bg-background/50 border border-border">
                        <p className="text-muted-foreground mb-1">hash · nonce={b.nonce}</p>
                        <p className={`break-all ${ok ? "text-primary" : "text-destructive"}`}>{b.hash}</p>
                      </div>
                    </div>

                    {i < chain.length - 1 && (
                      <div className="flex justify-center mt-4">
                        <motion.div
                          animate={{ y: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className={`w-px h-6 ${ok ? "bg-gradient-to-b from-primary to-accent" : "bg-destructive"}`}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <CitationModal
        citation={activeCitation?.citation ?? null}
        blockHash={activeCitation?.hash}
        blockIndex={activeCitation?.index}
        onClose={() => setActiveCitation(null)}
      />
    </Section>
  );
}
