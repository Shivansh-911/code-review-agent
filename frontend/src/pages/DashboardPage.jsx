import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, RotateCcw, Code2, Terminal,
  Zap, AlertTriangle, Lightbulb, CheckCircle2,
  ChevronRight, FileCode
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { useReviewSocket } from "../hooks/useReviewSocket";
import { Navbar } from "../components/Navbar";
import { ChunkCard } from "../components/ChunkCard";
import { ReviewingSkeleton } from "../components/ReviewingSkeleton";

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
  const { token } = useAuthStore();
  const { status, chunks, totalChunks, errorMsg, startReview, reset } = useReviewSocket();
  const [code, setCode] = useState("");
  const resultsRef = useRef(null);
  const bottomRef  = useRef(null);

  const isReviewing = status === "reviewing" || status === "connecting";
  const isDone      = status === "done";
  const hasResults  = chunks.length > 0;

  // Auto-scroll to results when first chunk arrives
  useEffect(() => {
    if (chunks.length === 1 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chunks.length]);

  // Auto-scroll to bottom as new chunks stream in
  useEffect(() => {
    if (isReviewing && chunks.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chunks.length, isReviewing]);

  const handleReview = () => {
    if (!code.trim()) return;
    startReview(code, token);
  };

  const handleReset = () => { reset(); setCode(""); };

  const stats = chunks.reduce(
    (acc, c) => {
      c.issues.forEach((i) => { acc[i.severity] = (acc[i.severity] || 0) + 1; acc.total++; });
      return acc;
    },
    { critical: 0, warning: 0, suggestion: 0, total: 0 }
  );

  const lineCount = code.split("\n").length;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated background */}
      <div className="bg-grid-anim" />
      <div className="orb orb-green" />
      <div className="orb orb-blue" />

      <Navbar
        hasResults={hasResults}
        onScrollToResults={() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      {/* Main centered container */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">

        {/* === HERO HEADING === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.68, 0, 1.2] }}
          className="text-center"
        >
          <h2 className="font-display font-extrabold text-3xl text-white tracking-tight mb-2">
            Paste. Review. <span className="text-green-400">Fix.</span>
          </h2>
          <p className="text-zinc-500 font-mono text-sm">
            Paste any code snippet and get an AI-powered security & quality review in seconds.
          </p>
        </motion.div>

        {/* === CODE INPUT PANEL === */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 0.68, 0, 1.2] }}
          className="bg-zinc-950/90 backdrop-blur-xl border border-white/6 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/70 border-b border-white/5">
            <div className="flex items-center gap-3">
              {/* Traffic lights */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <div className="flex items-center gap-2">
                <Code2 size={13} className="text-zinc-500" />
                <span className="text-xs font-mono text-zinc-500">paste_code_here</span>
              </div>
            </div>
            <button
              onClick={() => setCode(SAMPLE)}
              className="flex items-center gap-1 text-xs font-mono text-zinc-600 hover:text-green-400 transition-colors duration-150"
            >
              <ChevronRight size={11} />load sample
            </button>
          </div>

          {/* Editor with line numbers */}
          <div className="flex" style={{ height: 380 }}>
            {/* Line numbers */}
            <div className="select-none w-12 py-3 flex flex-col items-end pr-3 bg-zinc-900/30 border-r border-white/4 overflow-hidden shrink-0">
              {Array.from({ length: Math.max(lineCount, 18) }).map((_, i) => (
                <span key={i} className="text-xs font-mono text-zinc-700 leading-6">{i + 1}</span>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={"// Paste your code here...\n// Supports any language — Python, JS, Go, Java, etc."}
              className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-700 p-3 leading-6 overflow-auto focus:outline-none"
              spellCheck={false}
              disabled={isReviewing}
            />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-900/40 border-t border-white/4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-zinc-600">{lineCount} lines</span>
              <span className="text-xs font-mono text-zinc-600">{code.length} chars</span>
              {code.length > 0 && <span className="text-xs font-mono text-zinc-600">UTF-8</span>}
            </div>
            <div className="flex items-center gap-3">
              {(hasResults || status === "error") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-all duration-150"
                >
                  <RotateCcw size={11} />Reset
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReview}
                disabled={isReviewing || !code.trim()}
                className="flex items-center gap-2 bg-green-400 text-zinc-950 font-display font-bold text-sm px-5 py-2 rounded-xl hover:bg-green-300 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(74,222,128,0.25)] hover:shadow-[0_0_24px_rgba(74,222,128,0.4)]"
              >
                {isReviewing
                  ? <><div className="w-3.5 h-3.5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />Analyzing...</>
                  : <><Play size={13} fill="currentColor" />Run Review</>
                }
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* === RESULTS PANEL === */}
        <AnimatePresence>
          {(isReviewing || hasResults || status === "error") && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 0.68, 0, 1.2] }}
              className="space-y-5"
            >
              {/* Results heading */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Terminal size={16} className="text-green-400" />
                  <h3 className="font-display font-bold text-lg text-white">
                    Review Results
                  </h3>
                  {isDone && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs font-mono text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-lg"
                    >
                      Complete
                    </motion.span>
                  )}
                  {isReviewing && (
                    <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-lg animate-pulse2">
                      Streaming...
                    </span>
                  )}
                </div>

                {/* Aggregate stats */}
                {isDone && stats.total > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    {stats.critical > 0 && (
                      <span className="flex items-center gap-1 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg">
                        <Zap size={10} fill="currentColor" />{stats.critical}
                      </span>
                    )}
                    {stats.warning > 0 && (
                      <span className="flex items-center gap-1 text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-lg">
                        <AlertTriangle size={10} />{stats.warning}
                      </span>
                    )}
                    {stats.suggestion > 0 && (
                      <span className="flex items-center gap-1 text-xs font-mono text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2.5 py-1 rounded-lg">
                        <Lightbulb size={10} />{stats.suggestion}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Completion banner */}
              <AnimatePresence>
                {isDone && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-mono ${
                      stats.critical > 0
                        ? "bg-red-500/8 border-red-500/20 text-red-400"
                        : stats.warning > 0
                        ? "bg-yellow-400/8 border-yellow-400/20 text-yellow-400"
                        : "bg-green-400/8 border-green-400/20 text-green-400"
                    }`}
                  >
                    <CheckCircle2 size={15} />
                    Review complete ·{" "}
                    <strong>{stats.total} issue{stats.total !== 1 ? "s" : ""}</strong>{" "}
                    found across {chunks.length} chunk{chunks.length !== 1 ? "s" : ""}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chunk cards (live as they arrive) */}
              <div className="space-y-4">
                {chunks.map((chunk, i) => (
                  <ChunkCard key={chunk.chunk_index} chunk={chunk} chunkNumber={i + 1} />
                ))}
              </div>

              {/* Streaming skeleton for remaining chunks */}
              {isReviewing && (
                <ReviewingSkeleton chunksReceived={chunks.length} totalChunks={totalChunks} />
              )}

              {/* Error state */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 border border-red-500/20 rounded-2xl bg-red-500/5 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                    <Zap size={20} className="text-red-400" />
                  </div>
                  <p className="font-display font-bold text-red-400 mb-2">Review Failed</p>
                  <p className="text-sm font-mono text-zinc-500 max-w-sm">{errorMsg}</p>
                </motion.div>
              )}

              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state CTA */}
        {status === "idle" && !hasResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-3 py-8 text-center"
          >
            <div className="flex items-center gap-6 text-zinc-700">
              {[
                { icon: FileCode, label: "Any language" },
                { icon: Zap,      label: "Instant results" },
                { icon: Terminal, label: "Streaming output" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Icon size={16} className="text-zinc-600" />
                  </div>
                  <span className="text-xs font-mono text-zinc-700">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};