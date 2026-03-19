import { Zap, AlertTriangle, Lightbulb } from "lucide-react";

const SEV = {
  critical: {
    label: "Critical",
    Icon: Zap,
    badge:  "bg-red-500/10 text-red-400 border border-red-500/30",
    border: "border-l-red-500",
    dot:    "bg-red-500",
  },
  warning: {
    label: "Warning",
    Icon: AlertTriangle,
    badge:  "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
    border: "border-l-yellow-400",
    dot:    "bg-yellow-400",
  },
  suggestion: {
    label: "Suggestion",
    Icon: Lightbulb,
    badge:  "bg-sky-400/10 text-sky-400 border border-sky-400/30",
    border: "border-l-sky-400",
    dot:    "bg-sky-400",
  },
};

export const SeverityBadge = ({ severity }) => {
  const c = SEV[severity] || SEV.suggestion;
  const Icon = c.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium ${c.badge}`}>
      <Icon size={10} />
      {c.label}
    </span>
  );
};

export const severityClasses = (severity) => SEV[severity] || SEV.suggestion;