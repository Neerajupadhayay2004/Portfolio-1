import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Plus, Trash2, MessageSquare, Loader2, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { clickTick, beep } from "@/lib/hackSound";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const STORE = "neeraj_ai_threads_v1";

type Thread = { id: string; title: string; updatedAt: number; messages: any[] };

function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveThreads(t: Thread[]) {
  try { localStorage.setItem(STORE, JSON.stringify(t)); } catch {}
}
function makeThread(): Thread {
  return { id: crypto.randomUUID(), title: "new chat", updatedAt: Date.now(), messages: [] };
}

export function AIAgent() {
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const bootRef = useRef(false);

  // bootstrap once
  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    const loaded = loadThreads();
    if (loaded.length === 0) {
      const t = makeThread();
      setThreads([t]); setActiveId(t.id); saveThreads([t]);
    } else {
      setThreads(loaded); setActiveId(loaded[0].id);
    }
  }, []);

  const active = threads.find((t) => t.id === activeId);

  const newThread = () => {
    const t = makeThread();
    const next = [t, ...threads];
    setThreads(next); setActiveId(t.id); saveThreads(next);
    clickTick();
  };
  const deleteThread = (id: string) => {
    const next = threads.filter((t) => t.id !== id);
    if (next.length === 0) {
      const t = makeThread();
      setThreads([t]); setActiveId(t.id); saveThreads([t]);
    } else {
      setThreads(next);
      if (activeId === id) setActiveId(next[0].id);
      saveThreads(next);
    }
    clickTick();
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.2, type: "spring" }}
        onClick={() => { setOpen((o) => !o); beep(800, 0.04, "square", 0.03); }}
        data-cursor="hover"
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_oklch(0.78_0.18_145/0.6)] inline-flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open NEERAJ.AI"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-ping" />}
      </motion.button>

      <AnimatePresence>
        {open && active && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 22 }}
            className="fixed bottom-24 right-6 z-[55] w-[min(92vw,720px)] h-[min(80vh,640px)] rounded-2xl border border-primary/40 bg-background/95 backdrop-blur-xl shadow-[0_0_80px_oklch(0.78_0.18_145/0.35)] overflow-hidden grid grid-cols-[180px_1fr]"
          >
            {/* THREADS */}
            <aside className="border-r border-border bg-card/40 flex flex-col">
              <button
                onClick={newThread}
                data-cursor="hover"
                className="m-2 px-2 py-1.5 text-[11px] font-mono rounded border border-accent/50 text-accent hover:bg-accent/10 inline-flex items-center gap-1.5 justify-center"
              >
                <Plus className="w-3 h-3" /> new chat
              </button>
              <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
                {threads.map((t) => (
                  <div
                    key={t.id}
                    className={`group flex items-center gap-1 rounded text-[11px] font-mono ${
                      t.id === activeId ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <button
                      onClick={() => { setActiveId(t.id); clickTick(); }}
                      data-cursor="hover"
                      className="flex-1 text-left px-2 py-1.5 truncate inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3 h-3 shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </button>
                    <button
                      onClick={() => deleteThread(t.id)}
                      data-cursor="hover"
                      className="opacity-0 group-hover:opacity-100 px-1.5 py-1 text-muted-foreground hover:text-destructive"
                      aria-label="delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border font-mono text-[9px] text-muted-foreground">
                {threads.length} thread{threads.length !== 1 ? "s" : ""} · local
              </div>
            </aside>

            {/* CHAT */}
            <ChatPane
              key={active.id}
              thread={active}
              onUpdate={(messages) => {
                const title =
                  active.title === "new chat" && messages[0]?.parts
                    ? (messages[0].parts.find((p: any) => p.type === "text")?.text || "new chat").slice(0, 32)
                    : active.title;
                const next = threads.map((t) =>
                  t.id === active.id ? { ...t, messages, title, updatedAt: Date.now() } : t
                );
                setThreads(next); saveThreads(next);
              }}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatPane({
  thread, onUpdate, onClose,
}: { thread: Thread; onUpdate: (m: any[]) => void; onClose: () => void }) {
  const transport = useRef(
    new DefaultChatTransport({
      api: `${SUPABASE_URL}/functions/v1/chat`,
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
  ).current;

  const { messages, sendMessage, status, error } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
  });

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // persist
  useEffect(() => { onUpdate(messages); /* eslint-disable-next-line */ }, [messages, status]);

  // autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // focus
  useEffect(() => {
    inputRef.current?.focus();
  }, [thread.id, status]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || status === "streaming" || status === "submitted") return;
    sendMessage({ text });
    setInput("");
    beep(1100, 0.03, "square", 0.025);
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/30">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="text-gradient-magic font-semibold">NEERAJ.AI</span>
          <span className="text-muted-foreground">// powered by Lovable AI</span>
        </div>
        <button onClick={onClose} data-cursor="hover" className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scanlines">
        {messages.length === 0 && (
          <div className="text-center font-mono text-xs text-muted-foreground mt-12 space-y-2">
            <div className="text-accent">$ neeraj.ai --init</div>
            <div>Ready. Ask me about projects, tech stack, security, blockchain or AI.</div>
            <div className="flex flex-wrap gap-1.5 justify-center mt-4">
              {["Tell me about Cyber Guard", "Suggest a bug bounty workflow", "Explain blockchain security", "Why hire Neeraj?"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  data-cursor="hover"
                  className="px-2 py-1 text-[10px] rounded border border-border hover:border-primary/60 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m: any) => {
          const text = (m.parts || []).map((p: any) => (p.type === "text" ? p.text : "")).join("");
          if (m.role === "user") {
            return (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-mono whitespace-pre-wrap">
                  {text}
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className="flex gap-2">
              <div className="w-7 h-7 shrink-0 rounded bg-accent/15 border border-accent/40 inline-flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="prose prose-sm prose-invert max-w-none flex-1 text-foreground font-mono text-[13px] leading-relaxed
                              prose-p:my-1 prose-pre:bg-card/60 prose-pre:border prose-pre:border-border prose-code:text-accent">
                <ReactMarkdown>{text || "…"}</ReactMarkdown>
              </div>
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="flex gap-2 items-center font-mono text-xs text-accent">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> thinking…
          </div>
        )}
        {error && (
          <div className="font-mono text-xs text-destructive">⚠ {String(error.message || error)}</div>
        )}
      </div>

      <form onSubmit={submit} className="border-t border-border p-2 flex gap-2 bg-card/30">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(e); }}
          rows={1}
          placeholder="$ ask neeraj.ai…"
          data-cursor="text"
          className="flex-1 resize-none bg-background border border-border rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary/60 max-h-32"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          data-cursor="hover"
          className="px-3 rounded bg-accent text-accent-foreground disabled:opacity-40 inline-flex items-center justify-center"
          aria-label="send"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
