import { Zap, AlertTriangle, Lightbulb } from "lucide-react";

// All class names are FULL STRINGS — never built dynamically
// Safelist in tailwind.config.js covers these
export const SEVERITY = {
  critical: {
    badge:       "bg-red-500/10 text-red-400 border border-red-500/30",
    leftBorder:  "border-l-red-500",
    countBadge:  "bg-red-500/10 text-red-400 border border-red-500/20",
    Icon: Zap,
  },
  warning: {
    badge:       "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
    leftBorder:  "border-l-yellow-400",
    countBadge:  "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
    Icon: AlertTriangle,
  },
  suggestion: {
    badge:       "bg-sky-400/10 text-sky-400 border border-sky-400/30",
    leftBorder:  "border-l-sky-400",
    countBadge:  "bg-sky-400/10 text-sky-400 border border-sky-400/20",
    Icon: Lightbulb,
  },
};

export const SeverityBadge = ({ severity }) => {
  const s = SEVERITY[severity] || SEVERITY.suggestion;
  const Icon = s.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium ${s.badge}`}>
      <Icon size={10} />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};