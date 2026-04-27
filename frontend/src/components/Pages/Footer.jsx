import { Link } from "react-router-dom";
import { BookOpen, Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { createElement, useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const socialLinks = [
    { icon: Facebook, url: "https://facebook.com" },
    { icon: Twitter, url: "https://x.com" },
    { icon: Linkedin, url: "https://linkedin.com" },
    { icon: Instagram, url: "https://instagram.com" },
    { icon: Youtube, url: "https://youtube.com" },
  ];

  return (
    <footer className="text-white" style={{ backgroundColor: "#1a1a2e" }}>
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded"
                style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #4A90E2, #7F3FBF)" }}
              >
                <BookOpen size={20} color="#fff" />
              </div>
              <span className="fs-4 fw-bold ms-2">
                Learn<span style={{ color: "#4A90E2" }}>Hub</span>
              </span>
            </div>
            <p className="text-secondary small mb-3" style={{ maxWidth: "280px" }}>
              Empowering learners worldwide with high-quality, accessible education. Join over 500,000 students building their future.
            </p>
            <div className="d-flex gap-2">
              {socialLinks.map(({ icon, url }, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                  className="d-flex align-items-center justify-content-center rounded  border-0"
                  style={{ width: "36px", height: "36px",backgroundColor:"gray" }}
                >
                  {createElement(icon, { size: 16, color: "#f1ecec" })}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="text-white mb-3">Platform</h5>
            <ul className="list-unstyled">
              {[
                { label: "Browse Courses", path: "/courses" },
                { label: "About Us", path: "/about" },
                { label: "Blog", path: "/blog" },
                { label: "Become a Trainer", path: "/trainer" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-secondary text-decoration-none small d-block mb-2">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6">
            <h5 className="text-white mb-3">Categories</h5>
            <ul className="list-unstyled">
              {["Development", "Data Science", "Marketing", "Design", "Business", "Creative"].map((cat) => (
                <li key={cat}>
                  <Link to="/courses" className="text-secondary text-decoration-none small d-block mb-2">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-3">Contact Us</h5>
            <ul className="list-unstyled mb-3">
              <li className="d-flex align-items-start mb-2">
                <Mail size={16} color="#ccc" className="me-2 mt-1" />
                <span className="small text-secondary">hello@learnhub.com</span>
              </li>
              <li className="d-flex align-items-start mb-2">
                <Phone size={16} color="#ccc" className="me-2 mt-1" />
                <span className="small text-secondary">+1 (555) 234-5678</span>
              </li>
              <li className="d-flex align-items-start mb-2">
                <MapPin size={16} color="#ccc" className="me-2 mt-1" />
                <span className="small text-secondary">123 Learning Ave, San Francisco, CA</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <p className="small text-secondary mb-2">Subscribe to newsletter</p>
              <div className="d-flex">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control form-control-sm me-2 bg-dark text-white border-secondary"
                  style={{ minWidth: "0" }}
                />
                <button
                  className="btn btn-sm text-white"
                  style={{ backgroundColor: "#4A90E2" }}
                  type="button"
                  onClick={() => {
                    if (!email.trim() || !email.includes("@")) {
                      setInfo("Enter a valid email.");
                      return;
                    }
                    setInfo("Subscribed.");
                    setEmail("");
                  }}
                >
                  Go
                </button>
              </div>
              {info ? <small className="text-secondary d-block mt-2">{info}</small> : null}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-top border-secondary mt-4 pt-3 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
          <p className="small text-secondary mb-0">© 2026 LearnHub. All rights reserved.</p>
          <div className="d-flex gap-3">
            <a href="#" className="small text-secondary text-decoration-none">Privacy Policy</a>
            <a href="#" className="small text-secondary text-decoration-none">Terms of Service</a>
            <a href="#" className="small text-secondary text-decoration-none">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
