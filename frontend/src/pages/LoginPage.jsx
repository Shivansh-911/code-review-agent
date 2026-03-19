import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Terminal, Loader2, ArrowRight } from "lucide-react";
import { loginUser } from "../api/auth";
import useAuthStore from "../store/authStore";
import { useToast } from "../components/Toast";

const PILLS = [
  { label: "SQL Injection",  textColor: "#f87171", borderColor: "rgba(239,68,68,0.35)",  glowColor: "rgba(239,68,68,0.5)",  dotColor: "#ef4444" },
  { label: "Security Bugs",  textColor: "#fb923c", borderColor: "rgba(251,146,60,0.35)", glowColor: "rgba(251,146,60,0.5)", dotColor: "#f97316" },
  { label: "Code Smells",    textColor: "#facc15", borderColor: "rgba(250,204,21,0.35)", glowColor: "rgba(250,204,21,0.5)", dotColor: "#eab308" },
  { label: "Best Practices", textColor: "#4ade80", borderColor: "rgba(74,222,128,0.35)", glowColor: "rgba(74,222,128,0.5)", dotColor: "#22c55e" },
  { label: "Error Handling", textColor: "#38bdf8", borderColor: "rgba(56,189,248,0.35)", glowColor: "rgba(56,189,248,0.5)", dotColor: "#0ea5e9" },
];

const FeaturePill = ({ label, textColor, borderColor, glowColor, dotColor }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        boxShadow: hovered
          ? `0 0 12px ${glowColor}, 0 0 24px ${glowColor.replace("0.5","0.2")}`
          : "0 0 0px transparent",
        scale: hovered ? 1.08 : 1,
      }}
      transition={{ duration: 0.2 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        borderRadius: "999px",
        border: `1px solid ${borderColor}`,
        fontSize: "11px",
        fontFamily: "'JetBrains Mono', monospace",
        color: textColor,
        backgroundColor: `${dotColor}18`,
        cursor: "default",
        userSelect: "none",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dotColor, flexShrink: 0 }} />
      {label}
    </motion.span>
  );
};

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
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      toast(err.response?.data?.detail || "Invalid email or password.", "error");
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    toast("Taking you to registration...", "info", 2000);
    setTimeout(() => navigate("/register"), 800);
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: focused === field ? "rgba(20,24,28,0.80)" : "rgba(20,24,28,0.40)",
    border: `1px solid ${focused === field ? "rgba(74,222,128,0.55)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "13px",
    fontFamily: "'JetBrains Mono', monospace",
    color: focused === field ? "#e2e8f0" : "#71717a",
    outline: "none",
    backdropFilter: "blur(8px)",
    boxShadow: focused === field ? "0 0 18px rgba(74,222,128,0.12)" : "none",
    transition: "all 0.25s ease",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
    }}>
      <div className="bg-grid-anim" />
      <div className="orb orb-green" />
      <div className="orb orb-blue" />

      {/* Outer wrapper — 50% of viewport width, min 380px */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "50%",
          minWidth: "380px",
          // maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >

        {/* ── Logo + Name ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.25)",
            boxShadow: "0 0 28px rgba(74,222,128,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Terminal size={28} color="#4ade80" />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2.5rem", color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>
            Code<span style={{ color: "#4ade80" }}>Scan</span>
          </span>
        </motion.div>

        {/* ── Subtitle ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#52525b", marginBottom: "20px", textAlign: "center" }}
        >
          AI-powered code review · Powered by Groq LLM
        </motion.p>

        {/* ── Feature pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "32px" }}
        >
          {PILLS.map((p) => <FeaturePill key={p.label} {...p} />)}
        </motion.div>

        {/* ── Card — full width of wrapper ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, ease: [0.22, 0.68, 0, 1.2] }}
          style={{
            width: "100%",
            background: "rgba(9,11,14,0.88)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            padding: "36px 32px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",         /* center ALL card contents */
          }}
        >

          {/* Card heading — centered */}
          <div style={{ textAlign: "center", marginBottom: "28px", width: "100%" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>
              Welcome back
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#3f3f46" }}>
              Sign in to your CodeScan account
            </p>
          </div>

          {/* Form rows — full width */}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>

              {/* Email */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#71717a", width: "68px", flexShrink: 0, textAlign: "right" }}>
                  Email
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                  style={{ ...inputStyle("email"), flex: 1 }}
                />
              </div>

              {/* Password */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#71717a", width: "68px", flexShrink: 0, textAlign: "right" }}>
                  Password
                </span>
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                    style={{ ...inputStyle("password"), width: "100%", paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#52525b", padding: 0, display: "flex", alignItems: "center" }}
                  >
                    {showPass ? <EyeOff size={14} color="#52525b" /> : <Eye size={14} color="#52525b" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Sign In button — centered */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.05, boxShadow: "0 0 32px rgba(74,222,128,0.5)" } : {}}
                whileTap={!loading ? { scale: 0.96 } : {}}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: loading ? "rgba(74,222,128,0.55)" : "#4ade80",
                  color: "#071207",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  borderRadius: "12px",
                  padding: "11px 36px",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 0 20px rgba(74,222,128,0.3)",
                  letterSpacing: "0.01em",
                  transition: "background 0.2s",
                }}
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" />Signing in...</>
                  : <>Sign In <ArrowRight size={15} /></>
                }
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#3f3f46" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* Sign up text */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#52525b", textAlign: "center" }}>
            New user?{" "}
            <span
              onClick={handleSignUpClick}
              style={{ color: "#4ade80", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(74,222,128,0.3)", textUnderlineOffset: "3px", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.target.style.color = "#86efac")}
              onMouseLeave={(e) => (e.target.style.color = "#4ade80")}
            >
              Sign up
            </span>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#3f3f46", marginTop: "20px", textAlign: "center" }}
        >
          JWT secured · No code stored · Real-time streaming
        </motion.p>
      </motion.div>
    </div>
  );
};