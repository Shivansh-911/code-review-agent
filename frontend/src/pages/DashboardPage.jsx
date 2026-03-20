import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, RotateCcw, Code2, Terminal, Zap,
  AlertTriangle, Lightbulb, CheckCircle2,
  ChevronRight, FileCode, LogOut, Cpu, Loader2
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { useReviewSocket } from "../hooks/useReviewSocket";
import { ChunkCard } from "../components/ChunkCard";
import { ReviewingSkeleton } from "../components/ReviewingSkeleton";
import { useToast } from "../components/Toast";

const SAMPLE = `import os
import requests

class UserService:
    def __init__(self, db):
        self.db = db
        self.secret = 'abc123'

    def get_user(self, id):
        query = 'SELECT * FROM users WHERE id=' + str(id)
        return self.db.execute(query)

    def login(self, username, password):
        query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'"
        result = self.db.execute(query)
        if result:
            return True
        return False

def process_file(filename):
    f = open(filename)
    data = f.read()
    return eval(data)

def run_command(user_input):
    os.system(user_input)`;

export const DashboardPage = () => {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { status, chunks, totalChunks, errorMsg, startReview, reset } = useReviewSocket();
  const toast = useToast();
  const [code, setCode] = useState("");
  const resultsRef = useRef(null);
  const bottomRef  = useRef(null);

  const isReviewing = status === "reviewing" || status === "connecting";
  const isDone      = status === "done";
  const hasResults  = chunks.length > 0;

  useEffect(() => {
    if (chunks.length === 1 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chunks.length]);

  useEffect(() => {
    if (isReviewing && chunks.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chunks.length, isReviewing]);

  const handleReview = () => { if (code.trim()) startReview(code, token); };

  const handleReset = () => {
    reset();
    setCode("");
    toast("Review cleared.", "info", 2000);
  };

  const handleLogout = () => {
    toast("Signing out...", "info", 1500);
    setTimeout(() => { logout(); navigate("/login"); }, 1500);
  };

  const stats = chunks.reduce(
    (acc, c) => { c.issues.forEach((i) => { acc[i.severity] = (acc[i.severity] || 0) + 1; acc.total++; }); return acc; },
    { critical: 0, warning: 0, suggestion: 0, total: 0 }
  );

  const lineCount = code.split("\n").length;

  const bannerCls = stats.critical > 0
    ? "bg-red-500/10 border border-red-500/20 text-red-400"
    : stats.warning > 0
    ? "bg-yellow-400/10 border border-yellow-400/20 text-yellow-400"
    : "bg-green-400/10 border border-green-400/20 text-green-400";

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 relative">
      <div className="bg-grid-anim" />
      <div className="orb orb-green" />
      <div className="orb orb-blue" />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 0.68, 0, 1.2] }}
        className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/85 backdrop-blur-xl"
      >
        <div className="px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center shadow-[0_0_12px_rgba(74,222,128,0.15)]">
              <Terminal size={15} className="text-green-400" />
            </div>
            <span className="font-display font-extrabold text-lg text-white tracking-tight">
              Code<span className="text-green-400">Scan</span>
            </span>
          </div>

          {/* Model badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20">
            <Cpu size={11} className="text-green-400" />
            <span className="text-xs font-mono text-green-400">llama-3.3-70b</span>
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-600 hidden sm:block">
              {user?.username || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Two-column layout */}
      <main className="flex-1 grid grid-cols-2 relative z-10 overflow-hidden">

        {/* LEFT — Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.68, 0, 1.2] }}
          className="flex flex-col border-r border-white/5"
          style={{ height: "calc(100vh - 56px)", position: "sticky", top: 56 }}
        >
          {/* Editor top bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-zinc-900/80 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <div className="flex items-center gap-2">
                <Code2 size={12} className="text-zinc-600" />
                <span className="text-xs font-mono text-zinc-600">paste_code_here.py</span>
              </div>
            </div>
            <button
              onClick={() => setCode(SAMPLE)}
              className="flex items-center gap-1 text-xs font-mono text-zinc-700 hover:text-green-400 transition-colors duration-150"
            >
              <ChevronRight size={11} />load sample
            </button>
          </div>

          {/* Editor */}
          <div className="flex flex-1 overflow-hidden">
            {/* Line numbers */}
            <div className="select-none w-11 shrink-0 bg-zinc-900/30 border-r border-white/5 py-3 flex flex-col items-end pr-2.5 overflow-hidden">
              {Array.from({ length: Math.max(lineCount, 30) }).map((_, i) => (
                <span key={i} className="text-xs font-mono text-zinc-800 leading-6 block">{i + 1}</span>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={"// Paste your code here...\n// Python, JS, Go, Java, Rust — any language"}
              disabled={isReviewing}
              spellCheck={false}
              className="flex-1 bg-zinc-950/50 text-zinc-300 text-sm leading-6 p-3 overflow-auto placeholder-zinc-800 caret-green-400 disabled:opacity-60"
            />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-900/80 border-t border-white/5 shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-zinc-700">{lineCount} lines</span>
              <span className="text-xs font-mono text-zinc-700">{code.length} chars</span>
              <span className="text-xs font-mono text-zinc-700">UTF-8</span>
            </div>
            <div className="flex items-center gap-2.5">
              {(hasResults || status === "error") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-200 border border-white/10 hover:border-white/20 hover:bg-zinc-800/50 px-3 py-1.5 rounded-lg transition-all duration-150"
                >
                  <RotateCcw size={11} /> Reset
                </motion.button>
              )}
              <motion.button
                whileHover={!isReviewing && code.trim() ? { scale: 1.04 } : {}}
                whileTap={!isReviewing && code.trim() ? { scale: 0.96 } : {}}
                onClick={handleReview}
                disabled={isReviewing || !code.trim()}
                className="flex items-center gap-2 bg-green-400 text-zinc-950 font-display font-bold text-sm px-5 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-300 transition-colors duration-150 shadow-[0_0_16px_rgba(74,222,128,0.25)]"
              >
                {isReviewing
                  ? <><Loader2 size={13} className="animate-spin" />Analyzing...</>
                  : <><Play size={13} fill="currentColor" />Run Review</>
                }
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Results */}
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 0.68, 0, 1.2] }}
          className="flex flex-col overflow-y-auto bg-zinc-950/50"
          style={{ height: "calc(100vh - 56px)" }}
        >
          {/* Results header — sticky within column */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-zinc-950/90 backdrop-blur border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2.5">
              <Terminal size={14} className="text-green-400" />
              <span className="font-display font-semibold text-sm text-zinc-100">Review Results</span>
              <AnimatePresence>
                {isDone && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-mono text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded"
                  >
                    Complete
                  </motion.span>
                )}
                {isReviewing && (
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded"
                  >
                    Streaming...
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <AnimatePresence>
              {isDone && stats.total > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                  {stats.critical > 0 && (
                    <span className="flex items-center gap-1 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                      <Zap size={9} fill="currentColor" />{stats.critical}
                    </span>
                  )}
                  {stats.warning > 0 && (
                    <span className="flex items-center gap-1 text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded">
                      <AlertTriangle size={9} />{stats.warning}
                    </span>
                  )}
                  {stats.suggestion > 0 && (
                    <span className="flex items-center gap-1 text-xs font-mono text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded">
                      <Lightbulb size={9} />{stats.suggestion}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results body */}
          <div className="flex-1 p-5 flex flex-col gap-4">

            {/* Idle empty state */}
            {status === "idle" && !hasResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center min-h-96 gap-5 border border-dashed border-white/5 rounded-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                  <Terminal size={24} className="text-zinc-700" />
                </div>
                <div className="text-center">
                  <p className="font-display font-semibold text-zinc-600 mb-1.5">Awaiting review</p>
                  <p className="font-mono text-xs text-zinc-700">Paste code on the left and hit Run Review</p>
                </div>
                <div className="flex items-center gap-6">
                  {[
                    { icon: FileCode,  label: "Any language", cls: "text-green-400/50" },
                    { icon: Zap,       label: "Security scan", cls: "text-red-400/50"   },
                    { icon: Lightbulb, label: "Best practices", cls: "text-sky-400/50"  },
                  ].map(({ icon: Icon, label, cls }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                        <Icon size={15} className={cls} />
                      </div>
                      <span className="font-mono text-xs text-zinc-700">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Completion banner */}
            <AnimatePresence>
              {isDone && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-mono ${bannerCls}`}
                >
                  <CheckCircle2 size={14} />
                  Review complete · <strong>{stats.total} issue{stats.total !== 1 ? "s" : ""}</strong> across {chunks.length} chunk{chunks.length !== 1 ? "s" : ""}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chunk cards */}
            {chunks.map((chunk, i) => (
              <ChunkCard key={chunk.chunk_index} chunk={chunk} chunkNumber={i + 1} />
            ))}

            {/* Skeleton */}
            {isReviewing && (
              <ReviewingSkeleton chunksReceived={chunks.length} totalChunks={totalChunks} />
            )}

            {/* Error */}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 border border-red-500/20 rounded-2xl bg-red-500/10 text-center"
              >
                <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                  <Zap size={18} className="text-red-400" />
                </div>
                <p className="font-display font-bold text-red-400 mb-1.5">Review Failed</p>
                <p className="text-xs font-mono text-zinc-500 max-w-xs">{errorMsg}</p>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        </motion.div>
      </main>
    </div>
  );
};