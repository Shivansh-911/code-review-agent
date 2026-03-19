import { motion } from "framer-motion";
import { FileCode, CheckCircle } from "lucide-react";
import { IssueCard } from "./IssueCard";

export const ChunkCard = ({ chunk, chunkNumber }) => {
  const criticals   = chunk.issues.filter((i) => i.severity === "critical").length;
  const warnings    = chunk.issues.filter((i) => i.severity === "warning").length;
  const suggestions = chunk.issues.filter((i) => i.severity === "suggestion").length;
  const isClean     = chunk.issues.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 0.68, 0, 1.2] }}
      className="border border-white/5 rounded-2xl overflow-hidden bg-zinc-950/80 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/70 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <FileCode size={13} className="text-green-400" />
          </div>
          <span className="font-display font-semibold text-sm text-white">
            Chunk {chunkNumber}
          </span>
          <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
            {chunk.language}
          </span>
        </div>

        {/* Severity counts */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {criticals > 0 && (
            <span className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
              {criticals} critical
            </span>
          )}
          {warnings > 0 && (
            <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded">
              {warnings} warning
            </span>
          )}
          {suggestions > 0 && (
            <span className="text-xs font-mono text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded">
              {suggestions} suggestion
            </span>
          )}
          {isClean && (
            <span className="flex items-center gap-1 text-xs font-mono text-green-400">
              <CheckCircle size={11} /> Clean
            </span>
          )}
        </div>
      </div>

      {/* Issues */}
      <div className="p-4 space-y-2.5">
        {isClean ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500 py-2 px-1">
            <CheckCircle size={13} className="text-green-400" />
            No issues found in this chunk
          </div>
        ) : (
          chunk.issues.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)
        )}
      </div>

      {/* Summary */}
      <div className="px-5 py-3 bg-zinc-900/40 border-t border-white/5">
        <p className="text-xs font-mono text-zinc-500 leading-relaxed">
          <span className="text-green-500/60 mr-1.5">▸</span>
          {chunk.summary}
        </p>
      </div>
    </motion.div>
  );
};