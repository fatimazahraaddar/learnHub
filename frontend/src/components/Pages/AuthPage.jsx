import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardRouteByRole, loginUser, registerUser } from "../../lib/api";

export function AuthPage() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormFeedback = () => {
    setMessage("");
  };

  const switchMode = (nextIsSignup) => {
    if (isSubmitting || nextIsSignup === isSignup) return;
    setIsSignup(nextIsSignup);
    resetFormFeedback();
  };

  const handleRegister = async () => {
    if (isSubmitting) return;

    if (!name || !email || !password) {
      setMessage("Please fill required fields");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const fullName = `${name} ${lastName}`.trim();
      const { ok, data } = await registerUser({
        name: fullName || name,
        email: email.trim(),
        password,
        password_confirmation: password,
        role: "learner",
        device_name: "web-browser",
      });

      if (ok) {
        setMessage("Account created successfully. You are now logged in.");
        const user = data.user || { email, role: "learner" };
        navigate(getDashboardRouteByRole(user.role), { replace: true });
        return;
      }

      setMessage(
        data?.message ||
          data?.errors?.email?.[0] ||
          data?.errors?.password?.[0] ||
          "Register failed"
      );
    } catch {
      setMessage("Cannot reach server. Start backend API and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    if (isSubmitting) return;

    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const { ok, data } = await loginUser({
        email: email.trim(),
        password,
        device_name: "web-browser",
      });

      if (ok) {
        const user = data.user || { email, role: "learner" };
        navigate(getDashboardRouteByRole(user.role), { replace: true });
        return;
      }

      setMessage(
        data?.message ||
          data?.errors?.email?.[0] ||
          data?.errors?.password?.[0] ||
          "Login failed"
      );
    } catch {
      setMessage("Cannot reach server. Start backend API and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSigninSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 vh-100">
        <div
          className="col-lg-6 d-none d-lg-flex flex-column justify-content-center text-white p-5"
          style={{
            background: "linear-gradient(135deg, #0f0c29, #302b63)",
          }}
        >
          <h2 className="fw-bold mb-4">LearnHub</h2>

          <h1 className="fw-bold mb-4">
            Start Your Learning <br /> Journey Today
          </h1>

          <ul className="list-unstyled">
            <li className="mb-3 d-flex align-items-center">
              <CheckCircle className="me-2 text-primary" /> Access 1,200+ courses
            </li>
            <li className="mb-3 d-flex align-items-center">
              <CheckCircle className="me-2 text-primary" /> Learn at your own pace
            </li>
            <li className="mb-3 d-flex align-items-center">
              <CheckCircle className="me-2 text-primary" /> Earn certificates
            </li>
            <li className="mb-3 d-flex align-items-center">
              <CheckCircle className="me-2 text-primary" /> Join 500K+ learners
            </li>
          </ul>
        </div>

        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div className="bg-white p-4 shadow rounded-4" style={{ width: "420px" }}>
            <div className="d-flex mb-4 bg-light rounded-pill p-1">
              <button
                type="button"
                onClick={() => switchMode(false)}
                disabled={isSubmitting}
                className={`btn w-50 rounded-pill ${!isSignup ? "btn-light" : "text-muted"}`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => switchMode(true)}
                disabled={isSubmitting}
                className={`btn w-50 rounded-pill ${isSignup ? "btn-light" : "text-muted"}`}
              >
                Create Account
              </button>
            </div>

            <p style={{ color: "red" }}>{message}</p>

            {!isSignup ? (
              <form onSubmit={handleSigninSubmit}>
                <h4 className="fw-bold mb-2">Welcome back!</h4>
                <p className="text-muted mb-3">Sign in to continue your learning journey.</p>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn w-100 text-white fw-bold"
                  style={{
                    background: "linear-gradient(135deg, #4A90E2, #7F3FBF)",
                  }}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit}>
                <h4 className="fw-bold mb-2">Create your account</h4>
                <p className="text-muted mb-3">Join 500,000+ learners. Free to start.</p>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label>First Name</label>
                    <input
                      name="name"
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      value={name}
                    />
                  </div>

                  <div className="col-6 mb-3">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      className="form-control"
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      value={lastName}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    value={email}
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    name="password"
                    className="form-control"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    value={password}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn w-100 text-white fw-bold"
                  style={{
                    background: "linear-gradient(135deg, #4A90E2, #7F3FBF)",
                  }}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
