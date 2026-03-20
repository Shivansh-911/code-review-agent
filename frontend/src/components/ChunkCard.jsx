import { motion } from "framer-motion";
import { FileCode, CheckCircle } from "lucide-react";
import { IssueCard } from "./IssueCard";
import { SEVERITY } from "./SeverityBadge";

export const ChunkCard = ({ chunk, chunkNumber }) => {
  const criticals   = chunk.issues.filter((i) => i.severity === "critical").length;
  const warnings    = chunk.issues.filter((i) => i.severity === "warning").length;
  const suggestions = chunk.issues.filter((i) => i.severity === "suggestion").length;
  const isClean     = chunk.issues.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.68, 0, 1.2] }}
      className="border border-white/5 rounded-2xl overflow-hidden bg-zinc-950/80"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-white/5 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-green-400/10 border border-green-400/20 flex items-center justify-center">
            <FileCode size={13} className="text-green-400" />
          </div>
          <span className="font-display font-semibold text-sm text-zinc-100">
            Chunk {chunkNumber}
          </span>
          <span className="text-xs font-mono text-zinc-600 bg-zinc-800 border border-zinc-700/50 px-2 py-0.5 rounded">
            {chunk.language}
          </span>
        </div>

        {/* Severity counts — full class strings, not dynamic */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {criticals > 0 && (
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${SEVERITY.critical.countBadge}`}>
              {criticals} critical
            </span>
          )}
          {warnings > 0 && (
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${SEVERITY.warning.countBadge}`}>
              {warnings} warning
            </span>
          )}
          {suggestions > 0 && (
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${SEVERITY.suggestion.countBadge}`}>
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
      <div className="p-3 flex flex-col gap-2">
        {isClean ? (
          <div className="flex items-center gap-2 py-2 px-1">
            <CheckCircle size={13} className="text-green-400" />
            <span className="text-xs font-mono text-zinc-600">No issues found in this chunk</span>
          </div>
        ) : (
          chunk.issues.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)
        )}
      </div>

      {/* Summary */}
      <div className="px-4 py-2.5 bg-zinc-900/40 border-t border-white/5">
        <p className="text-xs font-mono text-zinc-600 leading-relaxed">
          <span className="text-green-400/40 mr-1.5">▸</span>
          {chunk.summary}
        </p>
      </div>
    </motion.div>
  );
};