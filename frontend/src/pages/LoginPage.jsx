import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Terminal, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { loginUser } from "../api/auth";
import useAuthStore from "../store/authStore";
import { useToast } from "../components/Toast";

const PILLS = [
  { label: "SQL Injection",  cls: "text-red-400    border-red-500/30    bg-red-500/10",    dot: "bg-red-500"    },
  { label: "Security Bugs",  cls: "text-orange-400 border-orange-500/30 bg-orange-500/10", dot: "bg-orange-500" },
  { label: "Code Smells",    cls: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", dot: "bg-yellow-400" },
  { label: "Best Practices", cls: "text-green-400  border-green-400/30  bg-green-400/10",  dot: "bg-green-400"  },
  { label: "Error Handling", cls: "text-sky-400    border-sky-400/30    bg-sky-400/10",    dot: "bg-sky-400"    },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const toast    = useToast();
  const setAuth  = useAuthStore((s) => s.setAuth);

  const [form,     setForm]     = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });
      toast("Signed in successfully! Redirecting...", "success");
      setAuth(data.access_token, { email: form.email });
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      toast(err.response?.data?.detail || "Invalid email or password.", "error");
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    toast("Taking you to registration...", "info", 2000);
    setTimeout(() => navigate("/register"), 800);
  };

  const inputCls = (field) =>
    `w-full rounded-xl px-4 py-2.5 text-sm font-mono transition-all duration-200 outline-none bg-zinc-900/50 border ${
      focused === field
        ? "border-green-500/50 bg-zinc-900/80 shadow-[0_0_16px_rgba(74,222,128,0.12)] text-zinc-100"
        : "border-white/10 text-zinc-400 hover:border-white/20 hover:bg-zinc-900/60"
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="bg-grid-anim" />
      <div className="orb orb-green" />
      <div className="orb orb-blue" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
        className="relative z-10 w-full max-w-lg flex flex-col items-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-400/10 border border-green-400/20 flex items-center justify-center shadow-[0_0_24px_rgba(74,222,128,0.2)]">
            <Terminal size={26} className="text-green-400" />
          </div>
          <span className="font-display font-extrabold text-4xl text-white tracking-tight">
            Code<span className="text-green-400">Scan</span>
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="font-mono text-xs text-zinc-600 mb-6 text-center"
        >
          AI-powered code review · Powered by Groq LLM
        </motion.p>

        {/* Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {PILLS.map((p) => (
            <motion.span
              key={p.label}
              whileHover={{ scale: 1.08 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono cursor-default transition-shadow duration-200 hover:shadow-[0_0_12px_currentColor] ${p.cls}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              {p.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, ease: [0.22, 0.68, 0, 1.2] }}
          className="w-full bg-zinc-950/90 backdrop-blur-2xl border border-white/5 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-7">
            <h2 className="font-display font-bold text-xl text-white mb-1.5">Welcome back</h2>
            <p className="font-mono text-xs text-zinc-700">Sign in to your CodeScan account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-zinc-500 w-16 text-right shrink-0">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                required
                className={inputCls("email")}
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-zinc-500 w-16 text-right shrink-0">Password</span>
              <div className="relative flex-1">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required
                  className={`${inputCls("password")} pr-10 w-full`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.96 } : {}}
                className="flex items-center gap-2 bg-green-400 text-zinc-950 font-display font-bold text-sm px-8 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:bg-green-300 shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_28px_rgba(74,222,128,0.5)]"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" />Signing in...</>
                  : <>Sign In <ArrowRight size={15} /></>
                }
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="font-mono text-xs text-zinc-700">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-zinc-600 font-body">
            New user?{" "}
            <span
              onClick={handleSignUp}
              className="text-green-400 hover:text-green-300 cursor-pointer font-semibold underline underline-offset-4 decoration-green-400/30 hover:decoration-green-300/60 transition-colors duration-150"
            >
              Sign up
            </span>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1.5 mt-5 text-xs font-mono text-zinc-700"
        >
          <ShieldCheck size={11} className="text-green-400/30" />
          JWT secured · No code stored · Real-time streaming
        </motion.div>
      </motion.div>
    </div>
  );
};