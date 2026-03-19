import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Terminal, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { loginUser, registerUser } from "../api/auth";
import useAuthStore from "../store/authStore";

export const AuthPage = () => {
  const [mode,     setMode]     = useState("login");
  const [form,     setForm]     = useState({ email: "", username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = mode === "login"
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);
      setAuth(data.access_token, { email: form.email, username: form.username });
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:border-green-500/60 focus:bg-zinc-800 transition-all duration-200";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Animated background */}
      <div className="bg-grid-anim" />
      <div className="orb orb-green" />
      <div className="orb orb-blue" />

      {/* Hero text above card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.68, 0, 1.2] }}
        className="text-center mb-8 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-400/10 border border-green-400/20 mb-5 shadow-[0_0_30px_rgba(74,222,128,0.15)]">
          <Terminal size={28} className="text-green-400" />
        </div>
        <h1 className="font-display font-extrabold text-4xl text-white tracking-tight mb-2">
          Code<span className="text-green-400">Scan</span>
        </h1>
        <p className="text-zinc-500 font-mono text-sm">
          AI-powered code review · Powered by Groq LLM
        </p>
        {/* Feature pills */}
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          {["SQL Injection", "Security Bugs", "Code Smells", "Best Practices"].map((f) => (
            <span key={f} className="text-xs font-mono text-zinc-600 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Zap size={9} className="text-green-500" />{f}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 0.68, 0, 1.2] }}
        className="w-full max-w-md relative z-10 bg-zinc-950/90 backdrop-blur-xl border border-white/8 rounded-2xl p-7 shadow-2xl shadow-black/60"
      >
        {/* Tab switcher */}
        <div className="flex bg-zinc-900 rounded-xl p-1 mb-6 border border-zinc-800">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-200 capitalize ${
                mode === m
                  ? "bg-green-400 text-zinc-950 shadow-[0_0_12px_rgba(74,222,128,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username (register only) */}
          <AnimatePresence>
            {mode === "register" && (
              <motion.div
                key="username-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-widest">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="your_handle"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required={mode === "register"}
                  className={inp}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className={inp}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className={`${inp} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 text-red-400 text-sm bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <span className="font-mono text-xs bg-red-500/20 px-1.5 py-0.5 rounded mt-0.5 shrink-0">ERR</span>
                <span className="font-body">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-green-400 text-zinc-950 font-display font-bold py-3.5 rounded-xl hover:bg-green-300 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(74,222,128,0.25)] hover:shadow-[0_0_28px_rgba(74,222,128,0.4)] text-sm mt-1"
          >
            {loading
              ? <Loader2 size={16} className="animate-spin" />
              : <>{mode === "login" ? "Sign In" : "Create Account"}<ArrowRight size={15} /></>
            }
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-zinc-600 font-mono">
          <ShieldCheck size={11} className="text-green-500/50" />
          JWT secured · No code stored · Real-time streaming
        </div>
      </motion.div>
    </div>
  );
};