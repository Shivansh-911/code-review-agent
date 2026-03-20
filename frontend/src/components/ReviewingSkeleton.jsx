import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const ReviewingSkeleton = ({ chunksReceived, totalChunks }) => {
  const pct = totalChunks > 0 ? Math.round((chunksReceived / totalChunks) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-3"
    >
      {/* Progress card */}
      <div className="border border-white/5 rounded-2xl p-4 bg-zinc-950/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Loader2 size={13} className="text-green-400 animate-spin" />
            <span className="font-display font-semibold text-sm text-zinc-200 cursor-blink">
              Analyzing
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-600">
            {chunksReceived} / {totalChunks || "?"} · {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
          />
        </div>

        {/* Dots */}
        <div className="flex gap-1">
          {Array.from({ length: totalChunks || 4 }).map((_, i) => (
            <motion.div
              key={i}
              animate={i === chunksReceived ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
              className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                i < chunksReceived ? "bg-green-400" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skeleton cards */}
      {[1, 0.5].map((opacity, i) => (
        <div
          key={i}
          className="border border-white/5 rounded-2xl overflow-hidden bg-zinc-950/80"
          style={{ opacity }}
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/80 border-b border-white/5">
            <div className="w-7 h-7 rounded-lg shimmer-box" />
            <div className="h-3 w-20 shimmer-box" />
            <div className="h-3 w-12 shimmer-box" />
          </div>
          <div className="p-3 flex flex-col gap-2">
            {[1, 0.65].map((op, j) => (
              <div key={j} className="border-l-2 border-zinc-800 pl-3 py-2.5 flex flex-col gap-2" style={{ opacity: op }}>
                <div className="flex gap-2">
                  <div className="h-5 w-16 shimmer-box rounded-md" />
                  <div className="h-5 w-20 shimmer-box rounded-md" />
                </div>
                <div className="h-2.5 w-full shimmer-box" />
                <div className="h-2.5 w-3/4 shimmer-box" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};