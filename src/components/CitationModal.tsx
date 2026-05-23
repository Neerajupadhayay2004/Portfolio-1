import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ShieldCheck, Hash, Link2 } from "lucide-react";
import { useEffect } from "react";

export type CitationDoc = {
  ref: string;
  title: string;
  source: string;
  effective: string;
  body: string;
  clauses: { id: string; text: string }[];
};

const LIBRARY: Record<string, CitationDoc> = {
  "Policy §4.2 — MFA Enforced": {
    ref: "Policy §4.2",
    title: "Multi-Factor Authentication Enforcement",
    source: "Cyber Guard SecOps Handbook · v3.1",
    effective: "2026-01-15",
    body: "All privileged identities (auror_*, admin_*, root) MUST complete a second-factor challenge (TOTP / WebAuthn) within 30s of password validation. Failure to satisfy the challenge generates an AUTH_FAIL event and triggers rate-limit R-12.",
    clauses: [
      { id: "4.2.1", text: "Hardware keys (FIDO2) are preferred over TOTP for production-tier accounts." },
      { id: "4.2.2", text: "Successful authentications are written to the immutable ledger with prevHash linkage." },
      { id: "4.2.3", text: "MFA bypass requires two-of-three quorum and is logged as event POLICY_OVERRIDE." },
    ],
  },
  "Policy §7.1 — Tor Exit Block": {
    ref: "Policy §7.1",
    title: "Anonymizing Network Ingress Control",
    source: "Cyber Guard Network Defense Manual",
    effective: "2025-11-02",
    body: "Inbound connections originating from known Tor exit relays, public VPN egress pools, or residential-proxy networks are denied at the edge unless an explicit allow-listed identity is presented.",
    clauses: [
      { id: "7.1.a", text: "Source IP is checked against the live exit-list every 5 minutes." },
      { id: "7.1.b", text: "Each block emits BLOCK_INTRUSION with rule R-9 and src metadata." },
      { id: "7.1.c", text: "Three consecutive blocks from the same /24 trigger an automated SOC ticket." },
    ],
  },
  "Audit-Trail SOP §3": {
    ref: "Audit-Trail SOP §3",
    title: "Smart-Contract Deployment Audit Trail",
    source: "Blockchain Security Suite · SOP",
    effective: "2026-02-10",
    body: "Every contract deployment must record: deployer address, bytecode hash, constructor args hash, and the auditor signature. The CONTRACT_DEPLOY event is irreversible and pinned to IPFS.",
    clauses: [
      { id: "3.1", text: "Bytecode hash MUST match the audited artifact (SHA-256)." },
      { id: "3.2", text: "Deployment without a signed audit attestation is rejected at the gateway." },
      { id: "3.3", text: "Re-deploys to the same address are forbidden — emit ALERT severity=HIGH." },
    ],
  },
  "SOC Runbook §12": {
    ref: "SOC Runbook §12",
    title: "High-Severity Auth Service Alert",
    source: "Pensieve SOC Runbook",
    effective: "2026-03-01",
    body: "When auth-svc emits severity=HIGH, the on-call analyst has 15 minutes to triage. Failure to acknowledge escalates to the duty wizard via Owl Post (PagerDuty bridge).",
    clauses: [
      { id: "12.1", text: "Pull the last 50 ledger blocks tagged service=auth-svc." },
      { id: "12.2", text: "Verify chain integrity with `pensieve verify --tail=50`." },
      { id: "12.3", text: "If tampering detected, freeze writes and invoke reseal() under quorum." },
    ],
  },
  "RFC-0 · Bootstrap Spell": {
    ref: "RFC-0",
    title: "Genesis Block Specification",
    source: "Cyber Guard Ledger RFC",
    effective: "2026-01-01",
    body: "The genesis block MUST be deterministic, contain no operator data, and serve as the immutable root of trust for the entire append-only ledger.",
    clauses: [
      { id: "0.1", text: "prevHash is fixed to 0000000000000000." },
      { id: "0.2", text: "Genesis cannot be tampered, mined, or rewritten." },
    ],
  },
};

function lookup(citation: string): CitationDoc {
  if (LIBRARY[citation]) return LIBRARY[citation];
  // generic fallback for user-added citations
  return {
    ref: citation || "Custom Reference",
    title: "User-Defined Citation",
    source: "Custom · appended at runtime",
    effective: new Date().toISOString().slice(0, 10),
    body: "This citation was attached to a ledger event by the operator. No formal policy text was registered, but the reference is permanently bound to the block and verifiable via the chain.",
    clauses: [
      { id: "u.1", text: "Reference text is sealed in the block payload." },
      { id: "u.2", text: "Auditors may resolve this reference against the external policy store." },
    ],
  };
}

interface Props {
  citation: string | null;
  blockHash?: string;
  blockIndex?: number;
  onClose: () => void;
}

export function CitationModal({ citation, blockHash, blockIndex, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (citation) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [citation, onClose]);

  return (
    <AnimatePresence>
      {citation && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            style={{ transformPerspective: 1200 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/40 bg-card shadow-[0_25px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border bg-background/60 text-muted-foreground hover:text-primary hover:border-primary/60 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {(() => {
              const doc = lookup(citation);
              return (
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-accent">
                      // CITATION · {doc.ref}
                    </p>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl text-gradient-magic mb-3 leading-tight">
                    {doc.title}
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-3 mb-6 font-mono text-[11px]">
                    <div className="p-3 rounded bg-background/50 border border-border">
                      <p className="text-muted-foreground mb-1">source</p>
                      <p className="text-foreground break-words">{doc.source}</p>
                    </div>
                    <div className="p-3 rounded bg-background/50 border border-border">
                      <p className="text-muted-foreground mb-1">effective</p>
                      <p className="text-primary">{doc.effective}</p>
                    </div>
                    {blockIndex !== undefined && (
                      <div className="p-3 rounded bg-background/50 border border-border sm:col-span-2 flex items-center gap-2">
                        <Link2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-muted-foreground">sealed in</span>
                        <span className="text-primary">Block #{blockIndex}</span>
                        {blockHash && (
                          <span className="text-foreground/70 break-all">· {blockHash.slice(0, 16)}…</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5 rounded-lg bg-background/40 border border-primary/20 mb-6">
                    <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-body italic">
                      "{doc.body}"
                    </p>
                  </div>

                  <p className="font-mono text-xs text-accent mb-3 flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5" /> clauses
                  </p>
                  <ul className="space-y-2">
                    {doc.clauses.map((c) => (
                      <motion.li
                        key={c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * parseFloat(c.id) || 0.1 }}
                        className="flex gap-3 text-sm text-muted-foreground"
                      >
                        <span className="font-mono text-[11px] text-primary shrink-0 mt-0.5">§{c.id}</span>
                        <span className="leading-relaxed">{c.text}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-accent">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified · sealed by cryptographic chain · tamper-evident
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
