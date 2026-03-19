import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Terminal, Loader2, ArrowRight } from "lucide-react";
import { registerUser } from "../api/auth";
import useAuthStore from "../store/authStore";
import { useToast } from "../components/Toast";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const toast    = useToast();
  const setAuth  = useAuthStore((s) => s.setAuth);

  const [form,     setForm]     = useState({ email: "", username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const data = await registerUser(form);
      toast("Account created! Redirecting...", "success");
      setAuth(data.access_token, { email: form.email, username: form.username });
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      toast(err.response?.data?.detail || "Registration failed. Try again.", "error");
      setLoading(false);
    }
  };

  const handleSignInClick = () => {
    toast("Taking you to sign in...", "info", 2000);
    setTimeout(() => navigate("/login"), 800);
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

      {/* Outer wrapper — 50% width */}
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

        {/* Logo + Name */}
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
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>
            Code<span style={{ color: "#4ade80" }}>Scan</span>
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#52525b", marginBottom: "32px", textAlign: "center" }}
        >
          Create your account to get started
        </motion.p>

        {/* Card */}
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
            alignItems: "center",
          }}
        >

          {/* Card heading */}
          <div style={{ textAlign: "center", marginBottom: "28px", width: "100%" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>
              Create account
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#3f3f46" }}>
              Get started with CodeScan for free
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>

              {/* Username */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#71717a", width: "68px", flexShrink: 0, textAlign: "right" }}>
                  Username
                </span>
                <input
                  type="text"
                  placeholder="your_handle"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused(null)}
                  required
                  style={{ ...inputStyle("username"), flex: 1 }}
                />
              </div>

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

            {/* Submit button */}
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
                  ? <><Loader2 size={15} className="animate-spin" />Creating...</>
                  : <>Create Account <ArrowRight size={15} /></>
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

          {/* Sign in link */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#52525b", textAlign: "center" }}>
            Already have an account?{" "}
            <span
              onClick={handleSignInClick}
              style={{ color: "#4ade80", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(74,222,128,0.3)", textUnderlineOffset: "3px", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.target.style.color = "#86efac")}
              onMouseLeave={(e) => (e.target.style.color = "#4ade80")}
            >
              Sign in
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