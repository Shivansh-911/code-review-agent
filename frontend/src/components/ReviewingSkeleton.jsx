import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const ReviewingSkeleton = ({ chunksReceived, totalChunks }) => {
  const pct = totalChunks > 0 ? Math.round((chunksReceived / totalChunks) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Progress card */}
      <div className="border border-white/5 rounded-2xl p-5 bg-zinc-950/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="text-green-400 animate-spin" />
            <span className="text-sm font-display font-semibold text-white cursor-blink">
              Analyzing
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {chunksReceived} / {totalChunks || "?"} chunks · {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-linear-to-r from-green-600 to-green-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Chunk dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalChunks || 4 }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i < chunksReceived ? "bg-green-400" : "bg-zinc-800"
              }`}
              animate={i === chunksReceived ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton cards */}
      {[1, 0.6].map((op, i) => (
        <div
          key={i}
          className="border border-white/5 rounded-2xl overflow-hidden"
          style={{ opacity: op }}
        >
          <div className="h-12 bg-zinc-900/70 border-b border-white/5 flex items-center gap-3 px-5">
            <div className="w-7 h-7 rounded-lg shimmer-box" />
            <div className="h-3 w-20 rounded shimmer-box" />
            <div className="h-3 w-14 rounded shimmer-box ml-2" />
          </div>
          <div className="p-4 space-y-2.5">
            {[1, 0.7].map((o, j) => (
              <div key={j} className="border-l-2 border-zinc-700 pl-4 py-3 space-y-2" style={{ opacity: o }}>
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded shimmer-box" />
                  <div className="h-5 w-20 rounded shimmer-box" />
                </div>
                <div className="h-3 w-full rounded shimmer-box" />
                <div className="h-3 w-3/4 rounded shimmer-box" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};