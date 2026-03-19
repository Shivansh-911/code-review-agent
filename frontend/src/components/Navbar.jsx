import { motion } from "framer-motion";
import { Terminal, Cpu, LogOut, Code2 } from "lucide-react";
import useAuthStore from "../store/authStore";

export const Navbar = ({ onScrollToResults, hasResults }) => {
  const { user, logout } = useAuthStore();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.68, 0, 1.2] }}
      className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#07080a]/80"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Left — Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-400/10 border border-green-400/20 flex items-center justify-center shadow-[0_0_12px_rgba(74,222,128,0.15)]">
            <Terminal size={15} className="text-green-400" />
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">
            Code<span className="text-green-400">Scan</span>
          </span>
        </div>

        {/* Center — nav links */}
        <div className="hidden sm:flex items-center gap-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20">
            <Cpu size={12} className="text-green-400" />
            <span className="text-xs font-mono text-green-400">llama-3.3-70b</span>
          </div>

          {hasResults && (
            <button
              onClick={onScrollToResults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-150"
            >
              <Code2 size={12} />
              View Results
            </button>
          )}
        </div>

        {/* Right — user + logout */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs font-mono text-zinc-500 truncate max-w-[160px]">
            {user?.username || user?.email}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150"
          >
            <LogOut size={13} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};