import { Link } from "react-router-dom";
import { BookOpen, Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { createElement, useState } from "react";

const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";

export function Footer() {
  const [email, setEmail] = useState("");
  const [info, setInfo]   = useState("");

  const socialLinks = [
    { icon: Facebook,  url: "https://facebook.com" },
    { icon: Twitter,   url: "https://x.com" },
    { icon: Linkedin,  url: "https://linkedin.com" },
    { icon: Instagram, url: "https://instagram.com" },
    { icon: Youtube,   url: "https://youtube.com" },
  ];

  const contactItems = [
    { icon: Mail,   text: "hello@learnhub.com" },
    { icon: Phone,  text: "+1 (555) 234-5678" },
    { icon: MapPin, text: "123 Learning Ave, San Francisco, CA" },
  ];

  return (
    <footer style={{ backgroundColor: PRIMARY }} className="text-white">
      <div className="container py-5">
        <div className="row g-4">

          {/* ── Brand ── */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div className="d-flex align-items-center justify-content-center rounded"
                style={{ width: "36px", height: "36px", background: `linear-gradient(135deg, ${ACCENT}, #059669)` }}>
                <BookOpen size={20} color="#fff" />
              </div>
              <span className="fs-4 fw-bold ms-2">
                Learn<span style={{ color: ACCENT }}>Hub</span>
              </span>
            </div>
            <p className="small mb-4" style={{ color: "rgba(255,255,255,0.55)", maxWidth: "280px", lineHeight: 1.7 }}>
              Empowering learners worldwide with high-quality, accessible education. Join over 500,000 students building their future.
            </p>
            <div className="d-flex gap-2">
              {socialLinks.map(({ icon, url }, i) => (
                <button key={i} type="button"
                  onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                  className="d-flex align-items-center justify-content-center rounded-3 border-0"
                  style={{ width: "36px", height: "36px", backgroundColor: `${ACCENT}22`, transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = ACCENT}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = `${ACCENT}22`}>
                  {createElement(icon, { size: 16, color: "#fff" })}
                </button>
              ))}
            </div>
          </div>

          {/* ── Platform ── */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-semibold mb-3" style={{ color: ACCENT }}>Platform</h5>
            <ul className="list-unstyled">
              {[
                { label: "Browse Courses",   path: "/courses" },
                { label: "About Us",         path: "/about" },
                { label: "Blog",             path: "/blog" },
                { label: "Become a Trainer", path: "/trainer" },
                { label: "Contact",          path: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path}
                    className="text-decoration-none small d-block mb-2"
                    style={{ color: "rgba(255,255,255,0.55)", transition: "color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-semibold mb-3" style={{ color: ACCENT }}>Categories</h5>
            <ul className="list-unstyled">
              {["Development", "Data Science", "Marketing", "Design", "Business", "Creative"].map((cat) => (
                <li key={cat}>
                  <Link to="/courses"
                    className="text-decoration-none small d-block mb-2"
                    style={{ color: "rgba(255,255,255,0.55)", transition: "color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact + Newsletter ── */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-semibold mb-3" style={{ color: ACCENT }}>Contact Us</h5>
            <ul className="list-unstyled mb-3">
              {contactItems.map((item) => (
  <li key={item.text} className="d-flex align-items-start mb-2">
    <item.icon size={15} color={ACCENT} className="me-2 mt-1 flex-shrink-0" />
                  <span className="small" style={{ color: "rgba(255,255,255,0.55)" }}>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <p className="small mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>Subscribe to newsletter</p>
            <div className="d-flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control form-control-sm"
                style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${ACCENT}44`, color: "white", borderRadius: "8px" }}
              />
              <button className="btn btn-sm fw-semibold px-3" type="button"
                style={{ background: ACCENT, color: "white", borderRadius: "8px", border: "none", whiteSpace: "nowrap" }}
                onClick={() => {
                  if (!email.trim() || !email.includes("@")) { setInfo("Enter a valid email."); return; }
                  setInfo("Subscribed ✓");
                  setEmail("");
                }}>
                Go
              </button>
            </div>
            {info && <small className="d-block mt-2" style={{ color: ACCENT }}>{info}</small>}
          </div>
        </div>

        {/* ── Bottom ── */}
        <div className="mt-5 pt-3 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2"
          style={{ borderTop: `1px solid ${ACCENT}33` }}>
          <p className="small mb-0" style={{ color: "rgba(255,255,255,0.4)" }}>© 2026 LearnHub. All rights reserved.</p>
          <div className="d-flex gap-3">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(label => (
              <a key={label} href="#"
                className="small text-decoration-none"
                style={{ color: "rgba(255,255,255,0.4)", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}