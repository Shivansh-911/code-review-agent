import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SeverityBadge, severityClasses } from "./SeverityBadge";

export const IssueCard = ({ issue, index }) => {
  const c = severityClasses(issue.severity);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 0.68, 0, 1.2] }}
      className={`border-l-2 ${c.border} bg-zinc-900/60 rounded-r-xl px-4 py-3.5 hover:bg-zinc-800/60 transition-colors duration-200`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge severity={issue.severity} />
          <span className="text-xs font-mono text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded">
            {issue.type}
          </span>
        </div>
        {issue.line_hint && issue.line_hint !== "N/A" && (
          <span className="flex items-center gap-1 text-xs font-mono text-zinc-500 shrink-0">
            <MapPin size={10} />
            line {issue.line_hint}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed font-body">{issue.description}</p>
    </motion.div>
  );
};