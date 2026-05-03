import { useState } from "react";
import { CheckCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardRouteByRole, loginUser, registerUser } from "../../api";
 
const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 
  .auth-wrap {
    font-family: 'DM Sans', sans-serif;
    display: flex; height: 100vh; overflow: hidden;
  }
 
  /* ── Left panel ── */
  .auth-left {
    flex: 1; display: none;
    flex-direction: column; justify-content: center;
    padding: 56px 48px; position: relative; overflow: hidden;
    background: linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%);
  }
  @media (min-width: 768px) { .auth-left { display: flex; } }
 
  .auth-blob {
    position: absolute; border-radius: 50%;
    filter: blur(60px); pointer-events: none;
  }
 
  .auth-logo {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 48px;
  }
  .auth-logo-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, ${ACCENT}, #059669);
    display: flex; align-items: center; justify-content: center;
  }
  .auth-logo-text {
    font-size: 1.3rem; font-weight: 800; color: #fff;
  }
  .auth-logo-text span { color: ${ACCENT}; }
 
  .auth-left-tag {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 20px; margin-bottom: 20px;
    background: rgba(16,185,129,0.2); color: ${ACCENT};
    font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
    width: fit-content;
  }
 
  .auth-left-title {
    font-size: clamp(1.7rem, 2.5vw, 2.4rem);
    font-weight: 800; color: #fff; line-height: 1.2; margin: 0 0 28px;
  }
  .auth-left-title span { color: ${ACCENT}; }
 
  .auth-feature-list { list-style: none; padding: 0; margin: 0; }
  .auth-feature-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.07);
    font-size: 0.875rem; color: rgba(255,255,255,0.85); font-weight: 500;
  }
  .auth-feature-item:last-child { border-bottom: none; }
  .auth-feature-dot {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
    background: rgba(16,185,129,0.2);
    display: flex; align-items: center; justify-content: center;
  }
 
  /* ── Right panel ── */
  .auth-right {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 32px 24px; background: #F6F8FA; overflow-y: auto;
  }
 
  .auth-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 16px; padding: 32px; width: 100%;
    box-shadow: 0 4px 24px rgba(30,58,95,0.08);
  }
 
  /* ── Tabs ── */
  .auth-tabs {
    display: flex; background: #F6F8FA;
    border-radius: 12px; padding: 4px; margin-bottom: 28px;
  }
  .auth-tab {
    flex: 1; padding: 9px 12px; border-radius: 9px; border: none;
    font-size: 0.82rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .auth-tab.active {
    background: ${PRIMARY}; color: #fff;
    box-shadow: 0 2px 10px rgba(30,58,95,0.25);
  }
  .auth-tab.inactive {
    background: transparent; color: #8492A6;
  }
  .auth-tab.inactive:hover { color: ${PRIMARY}; }
  .auth-tab:disabled { opacity: 0.5; cursor: not-allowed; }
 
  /* ── Form elements ── */
  .auth-form-title { font-size: 1.1rem; font-weight: 800; color: ${PRIMARY}; margin: 0 0 4px; }
  .auth-form-sub   { font-size: 0.8rem; color: #8492A6; margin: 0 0 22px; }
 
  .auth-label {
    font-size: 0.78rem; font-weight: 700; color: ${PRIMARY};
    display: block; margin-bottom: 6px;
  }
  .auth-input {
    width: 100%; padding: 10px 13px; border-radius: 10px;
    border: 1px solid rgba(30,58,95,0.15);
    background: #FAFBFD; color: #1A202C;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .auth-input:focus {
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
  }
  .auth-field   { margin-bottom: 14px; }
  .auth-row     { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
 
  /* ── Buttons ── */
  .auth-btn-primary {
    width: 100%; padding: 12px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, ${PRIMARY}, #16324F);
    color: #fff; font-size: 0.875rem; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    box-shadow: 0 3px 12px rgba(30,58,95,0.25);
    transition: opacity 0.15s, transform 0.15s;
  }
  .auth-btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .auth-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
 
  .auth-btn-accent {
    width: 100%; padding: 12px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, ${ACCENT}, #059669);
    color: #fff; font-size: 0.875rem; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    box-shadow: 0 3px 12px rgba(16,185,129,0.3);
    transition: opacity 0.15s, transform 0.15s;
  }
  .auth-btn-accent:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .auth-btn-accent:disabled { opacity: 0.6; cursor: not-allowed; }
 
  /* ── Alert ── */
  .auth-alert {
    padding: 10px 14px; border-radius: 10px; margin-bottom: 16px;
    background: #FFF0F0; border: 1px solid #FECACA;
    color: #DC2626; font-size: 0.8rem; font-weight: 500;
  }
 
  /* ── Switch link ── */
  .auth-switch {
    text-align: center; margin-top: 16px;
    font-size: 0.8rem; color: #8492A6;
  }
  .auth-switch-link {
    font-weight: 700; cursor: pointer; text-decoration: none;
  }
`;
 
export function AuthPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup]         = useState(false);
  const [name, setName]                 = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [message, setMessage]           = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  if (typeof document !== "undefined" && !document.getElementById("auth-styles")) {
    const tag = document.createElement("style");
    tag.id = "auth-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }
 
  const switchMode = (next) => {
    if (isSubmitting || next === isSignup) return;
    setIsSignup(next);
    setMessage("");
  };
 
  const handleLogin = async () => {
    if (isSubmitting) return;
    if (!email || !password) { setMessage("Email and password are required"); return; }
    setIsSubmitting(true); setMessage("");
    try {
      const { ok, data } = await loginUser({ email: email.trim(), password, device_name: "web-browser" });
      if (ok) { navigate(getDashboardRouteByRole((data.user || {}).role || "learner"), { replace: true }); return; }
      setMessage(data?.message || data?.errors?.email?.[0] || data?.errors?.password?.[0] || "Login failed");
    } catch { setMessage("Cannot reach server. Start backend API and try again."); }
    finally { setIsSubmitting(false); }
  };
 
  const handleRegister = async () => {
    if (isSubmitting) return;
    if (!name || !email || !password) { setMessage("Please fill required fields"); return; }
    setIsSubmitting(true); setMessage("");
    try {
      const { ok, data } = await registerUser({
        name: `${name} ${lastName}`.trim(), email: email.trim(),
        password, password_confirmation: password,
        role: "learner", device_name: "web-browser",
      });
      if (ok) {
        setMessage("Account created successfully.");
        navigate(getDashboardRouteByRole((data.user || {}).role || "learner"), { replace: true });
        return;
      }
      setMessage(data?.message || data?.errors?.email?.[0] || data?.errors?.password?.[0] || "Register failed");
    } catch { setMessage("Cannot reach server. Start backend API and try again."); }
    finally { setIsSubmitting(false); }
  };
 
  return (
    <div className="auth-wrap">
 
      {/* ── Left panel ── */}
      <div className="auth-left">
        {/* blobs */}
        <div className="auth-blob"
          style={{ width: 320, height: 320, top: -80, right: -80, background: ACCENT, opacity: 0.1 }} />
        <div className="auth-blob"
          style={{ width: 240, height: 240, bottom: -60, left: -60, background: ACCENT, opacity: 0.08 }} />
 
        <div style={{ position: "relative" }}>
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <BookOpen size={20} color="#fff" />
            </div>
            <span className="auth-logo-text">Learn<span>Hub</span></span>
          </div>
 
          {/* Tag */}
          <div className="auth-left-tag">#1 E-Learning Platform 2026</div>
 
          {/* Title */}
          <h1 className="auth-left-title">
            Start Your Learning<br />
            <span>Journey Today</span>
          </h1>
 
          {/* Features */}
          <ul className="auth-feature-list">
            {[
              "Access 1,200+ expert courses",
              "Learn at your own pace",
              "Earn recognized certificates",
              "Join 500K+ learners worldwide",
            ].map((item) => (
              <li key={item} className="auth-feature-item">
                <div className="auth-feature-dot">
                  <CheckCircle size={13} style={{ color: ACCENT }} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
 
      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card">
 
          {/* Tabs */}
          <div className="auth-tabs">
            {[{ label: "Sign In", value: false }, { label: "Create Account", value: true }].map(({ label, value }) => (
              <button
                key={label} type="button"
                className={`auth-tab ${isSignup === value ? "active" : "inactive"}`}
                disabled={isSubmitting}
                onClick={() => switchMode(value)}
              >
                {label}
              </button>
            ))}
          </div>
 
          {message && <div className="auth-alert">{message}</div>}
 
          {/* ── Sign In ── */}
          {!isSignup ? (
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <p className="auth-form-title">Welcome back!</p>
              <p className="auth-form-sub">Sign in to continue your learning journey.</p>
 
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input type="email" className="auth-input" autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input type="password" className="auth-input" autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" />
              </div>
 
              <button type="submit" disabled={isSubmitting} className="auth-btn-primary">
                {isSubmitting ? "Signing in…" : "Sign In"}
              </button>
 
              <p className="auth-switch">
                Don't have an account?{" "}
                <span className="auth-switch-link" style={{ color: ACCENT }} onClick={() => switchMode(true)}>
                  Create one
                </span>
              </p>
            </form>
 
          ) : (
 
            /* ── Sign Up ── */
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
              <p className="auth-form-title">Create your account</p>
              <p className="auth-form-sub">Join 500,000+ learners. Free to start.</p>
 
              <div className="auth-row">
                <div>
                  <label className="auth-label">First Name</label>
                  <input className="auth-input" value={name}
                    onChange={(e) => setName(e.target.value)} placeholder="First name" />
                </div>
                <div>
                  <label className="auth-label">Last Name</label>
                  <input className="auth-input" value={lastName}
                    onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                </div>
              </div>
 
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input type="email" className="auth-input" autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input type="password" className="auth-input" autoComplete="new-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password" />
              </div>
 
              <button type="submit" disabled={isSubmitting} className="auth-btn-accent">
                {isSubmitting ? "Creating…" : "Create Account"}
              </button>
 
              <p className="auth-switch">
                Already have an account?{" "}
                <span className="auth-switch-link" style={{ color: PRIMARY }} onClick={() => switchMode(false)}>
                  Sign in
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}