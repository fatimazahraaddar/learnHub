import { useState } from "react";
import { CheckCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardRouteByRole, loginUser, registerUser } from "../../api";
 
const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";
 
export function AuthPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup]         = useState(false);
  const [name, setName]                 = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [message, setMessage]           = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const switchMode = (nextIsSignup) => {
    if (isSubmitting || nextIsSignup === isSignup) return;
    setIsSignup(nextIsSignup);
    setMessage("");
  };
 
  const handleRegister = async () => {
    if (isSubmitting) return;
    if (!name || !email || !password) { setMessage("Please fill required fields"); return; }
    setIsSubmitting(true);
    setMessage("");
    try {
      const { ok, data } = await registerUser({
        name: `${name} ${lastName}`.trim(),
        email: email.trim(),
        password,
        password_confirmation: password,
        role: "learner",
        device_name: "web-browser",
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
 
  const handleLogin = async () => {
    if (isSubmitting) return;
    if (!email || !password) { setMessage("Email and password are required"); return; }
    setIsSubmitting(true);
    setMessage("");
    try {
      const { ok, data } = await loginUser({ email: email.trim(), password, device_name: "web-browser" });
      if (ok) {
        navigate(getDashboardRouteByRole((data.user || {}).role || "learner"), { replace: true });
        return;
      }
      setMessage(data?.message || data?.errors?.email?.[0] || data?.errors?.password?.[0] || "Login failed");
    } catch { setMessage("Cannot reach server. Start backend API and try again."); }
    finally { setIsSubmitting(false); }
  };
 
  const inputStyle = { border: `1px solid ${PRIMARY}22`, borderRadius: "10px" };
 
  return (
    <div className="container-fluid p-0">
      <div className="row g-0 vh-100">
 
        {/* ── LEFT PANEL ── */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center text-white p-5 position-relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%)` }}>
 
          <div className="position-absolute rounded-circle"
            style={{ width: "20rem", height: "20rem", top: "-5rem", right: "-5rem", filter: "blur(4rem)", backgroundColor: ACCENT, opacity: 0.12 }} />
          <div className="position-absolute rounded-circle"
            style={{ width: "16rem", height: "16rem", bottom: "-4rem", left: "-4rem", filter: "blur(4rem)", backgroundColor: ACCENT, opacity: 0.1 }} />
 
          <div className="position-relative">
            <div className="d-flex align-items-center gap-2 mb-5">
              <div className="d-flex align-items-center justify-content-center rounded"
                style={{ width: "36px", height: "36px", background: `linear-gradient(135deg, ${ACCENT}, #059669)` }}>
                <BookOpen size={20} color="#fff" />
              </div>
              <span className="fs-4 fw-bold">Learn<span style={{ color: ACCENT }}>Hub</span></span>
            </div>
 
            <span className="badge px-3 py-2 rounded-pill mb-4"
              style={{ background: `${ACCENT}33`, color: ACCENT, fontWeight: 600 }}>
              #1 E-Learning Platform 2026
            </span>
 
            <h1 className="fw-bold mb-4" style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", lineHeight: 1.2 }}>
              Start Your Learning <br />
              <span style={{ color: ACCENT }}>Journey Today</span>
            </h1>
 
            <ul className="list-unstyled mt-4">
              {[
                "Access 1,200+ expert courses",
                "Learn at your own pace",
                "Earn recognized certificates",
                "Join 500K+ learners worldwide",
              ].map((item, i) => (
                <li key={i} className="mb-3 d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{ width: "26px", height: "26px", background: `${ACCENT}33` }}>
                    <CheckCircle size={14} style={{ color: ACCENT }} />
                  </div>
                  <span style={{ opacity: 0.9 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
 
        {/* ── RIGHT PANEL ── */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center"
          style={{ background: "#F4F7FB" }}>
          <div className="bg-white p-4 rounded-4 shadow-sm" style={{ width: "420px", border: `1px solid ${PRIMARY}12` }}>
 
            {/* tabs */}
            <div className="d-flex mb-4 rounded-pill p-1" style={{ background: "#F4F7FB" }}>
              {[{ label: "Sign In", value: false }, { label: "Create Account", value: true }].map(({ label, value }) => (
                <button key={label} type="button"
                  onClick={() => switchMode(value)}
                  disabled={isSubmitting}
                  className="btn w-50 rounded-pill fw-medium"
                  style={isSignup === value
                    ? { background: PRIMARY, color: "white", boxShadow: `0 4px 12px ${PRIMARY}33` }
                    : { background: "transparent", color: "#6B7280" }}>
                  {label}
                </button>
              ))}
            </div>
 
            {message && (
              <div className="alert py-2 small mb-3"
                style={{ background: "#FFF0F0", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "10px" }}>
                {message}
              </div>
            )}
 
            {/* ── SIGN IN ── */}
            {!isSignup ? (
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <h4 className="fw-bold mb-1" style={{ color: PRIMARY }}>Welcome back!</h4>
                <p className="text-muted mb-4 small">Sign in to continue your learning journey.</p>
 
                <div className="mb-3">
                  <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Email</label>
                  <input type="email" className="form-control" style={inputStyle} autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Password</label>
                  <input type="password" className="form-control" style={inputStyle} autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn w-100 fw-semibold"
                  style={{ background: `linear-gradient(135deg, ${PRIMARY}, #16324F)`, color: "white", borderRadius: "10px", padding: "12px", border: "none" }}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
                <p className="text-center small mt-3 mb-0">
                  Don't have an account?{" "}
                  <span style={{ color: ACCENT, cursor: "pointer", fontWeight: 600 }}
                    onClick={() => switchMode(true)}>Create one</span>
                </p>
              </form>
 
            ) : (
 
              /* ── SIGN UP ── */
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                <h4 className="fw-bold mb-1" style={{ color: PRIMARY }}>Create your account</h4>
                <p className="text-muted mb-4 small">Join 500,000+ learners. Free to start.</p>
 
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-medium small" style={{ color: PRIMARY }}>First Name</label>
                    <input className="form-control" style={inputStyle}
                      value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="First name" />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Last Name</label>
                    <input className="form-control" style={inputStyle}
                      value={lastName} onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Email</label>
                  <input type="email" className="form-control" style={inputStyle} autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Password</label>
                  <input type="password" className="form-control" style={inputStyle} autoComplete="new-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn w-100 fw-semibold"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #059669)`, color: "white", borderRadius: "10px", padding: "12px", border: "none" }}>
                  {isSubmitting ? "Creating..." : "Create Account"}
                </button>
                <p className="text-center small mt-3 mb-0">
                  Already have an account?{" "}
                  <span style={{ color: PRIMARY, cursor: "pointer", fontWeight: 600 }}
                    onClick={() => switchMode(false)}>Sign in</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}