import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Terminal, Loader2, ArrowRight, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { registerUser } from "../api/auth";
import { useToast } from "../components/Toast";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const toast    = useToast();

  const [form,           setForm]           = useState({ email: "", username: "", password: "", confirm_password: "" });
  const [showPass,       setShowPass]       = useState(false);
  const [showConfirm,    setShowConfirm]    = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [focused,        setFocused]        = useState(null);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const passwordsMatch = form.password === form.confirm_password;
  const showMatch      = confirmTouched && form.confirm_password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!passwordsMatch) { toast("Passwords do not match.", "error"); return; }
    setLoading(true);
    try {
      await registerUser(form);
      toast("Account created! Please sign in.", "success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      toast(err.response?.data?.detail || "Registration failed. Try again.", "error");
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    toast("Taking you to sign in...", "info", 2000);
    setTimeout(() => navigate("/login"), 800);
  };

  const inputCls = (field) => {
    const isConfirm   = field === "confirm_password";
    const hasMismatch = isConfirm && showMatch && !passwordsMatch;
    const hasMatch    = isConfirm && showMatch && passwordsMatch;
    const isFocused   = focused === field;

    if (hasMismatch) return "w-full rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all duration-200 bg-zinc-900/70 border border-red-500/50 text-zinc-100 shadow-[0_0_14px_rgba(239,68,68,0.1)]";
    if (hasMatch)    return "w-full rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all duration-200 bg-zinc-900/70 border border-green-500/50 text-zinc-100 shadow-[0_0_14px_rgba(74,222,128,0.1)]";
    if (isFocused)   return "w-full rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all duration-200 bg-zinc-900/80 border border-green-500/50 text-zinc-100 shadow-[0_0_16px_rgba(74,222,128,0.12)]";
    return "w-full rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all duration-200 bg-zinc-900/50 border border-white/10 text-zinc-400 hover:border-white/20 hover:bg-zinc-900/60";
  };

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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="font-mono text-xs text-zinc-600 mb-8 text-center"
        >
          Create your account to get started
        </motion.p>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.22, 0.68, 0, 1.2] }}
          className="w-full bg-zinc-950/90 backdrop-blur-2xl border border-white/5 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-7">
            <h2 className="font-display font-bold text-xl text-white mb-1.5">Create account</h2>
            <p className="font-mono text-xs text-zinc-700">Get started with CodeScan for free</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-zinc-500 w-16 text-right shrink-0">Username</span>
              <input type="text" placeholder="your_handle" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onFocus={() => setFocused("username")} onBlur={() => setFocused(null)}
                required className={`${inputCls("username")} flex-1`} />
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-zinc-500 w-16 text-right shrink-0">Email</span>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                required className={`${inputCls("email")} flex-1`} />
            </div>

            {/* Password */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-zinc-500 w-16 text-right shrink-0">Password</span>
              <div className="relative flex-1">
                <input type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  required className={`${inputCls("password")} w-full pr-10`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-zinc-500 w-16 text-right shrink-0">Confirm</span>
              <div className="relative flex-1">
                <input type={showConfirm ? "text" : "password"} placeholder="••••••••" value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  onFocus={() => setFocused("confirm_password")}
                  onBlur={() => { setFocused(null); setConfirmTouched(true); }}
                  required className={`${inputCls("confirm_password")} w-full pr-16`} />
                {/* Match icon */}
                <AnimatePresence>
                  {showMatch && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="absolute right-9 top-1/2 -translate-y-1/2"
                    >
                      {passwordsMatch
                        ? <CheckCircle size={13} className="text-green-400" />
                        : <XCircle    size={13} className="text-red-400" />
                      }
                    </motion.span>
                  )}
                </AnimatePresence>
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Match message */}
            <AnimatePresence>
              {showMatch && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`text-xs font-mono pl-20 ${passwordsMatch ? "text-green-400" : "text-red-400"}`}
                >
                  {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <div className="flex justify-center mt-2">
              <motion.button
                type="submit"
                disabled={loading || (showMatch && !passwordsMatch)}
                whileHover={!loading && passwordsMatch ? { scale: 1.05 } : {}}
                whileTap={!loading && passwordsMatch ? { scale: 0.96 } : {}}
                className="flex items-center gap-2 bg-green-400 text-zinc-950 font-display font-bold text-sm px-8 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:bg-green-300 shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_28px_rgba(74,222,128,0.5)]"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" />Creating...</>
                  : <>Create Account <ArrowRight size={15} /></>
                }
              </motion.button>
            </div>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="font-mono text-xs text-zinc-700">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-center text-sm text-zinc-600 font-body">
            Already have an account?{" "}
            <span
              onClick={handleSignIn}
              className="text-green-400 hover:text-green-300 cursor-pointer font-semibold underline underline-offset-4 decoration-green-400/30 hover:decoration-green-300/60 transition-colors duration-150"
            >
              Sign in
            </span>
          </p>
        </motion.div>

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