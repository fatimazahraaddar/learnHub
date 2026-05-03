import { Link } from "react-router-dom";
import { BookOpen, Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
 
const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .ft-wrap {
    background-color: ${PRIMARY};
    font-family: 'DM Sans', sans-serif;
    color: #fff;
  }
 
  .ft-inner { max-width: 1120px; margin: 0 auto; padding: 60px 24px 0; }
 
  .ft-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 2fr;
    gap: 40px;
  }
  @media (max-width: 900px) { .ft-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 540px) { .ft-grid { grid-template-columns: 1fr; } }
 
  /* Brand */
  .ft-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
    text-decoration: none;
  }
  .ft-logo-icon {
    width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg, ${ACCENT}, #059669);
    display: flex; align-items: center; justify-content: center;
  }
  .ft-logo-text { font-size: 1.2rem; font-weight: 800; color: #fff; }
  .ft-logo-accent { color: ${ACCENT}; }
 
  .ft-brand-desc {
    font-size: 0.82rem; color: rgba(255,255,255,0.5);
    line-height: 1.75; margin: 0 0 20px; max-width: 270px;
  }
 
  .ft-social-btn {
    width: 34px; height: 34px; border-radius: 9px; border: none;
    background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s, transform 0.15s; flex-shrink: 0;
  }
  .ft-social-btn:hover { background: ${ACCENT}; transform: translateY(-2px); }
 
  /* Nav columns */
  .ft-col-title {
    font-size: 0.82rem; font-weight: 700; color: ${ACCENT};
    text-transform: uppercase; letter-spacing: 0.06em;
    margin: 0 0 16px;
  }
  .ft-link {
    display: block; font-size: 0.83rem; font-weight: 500;
    color: rgba(255,255,255,0.5); text-decoration: none;
    margin-bottom: 10px; transition: color 0.15s;
  }
  .ft-link:hover { color: #fff; }
 
  /* Contact */
  .ft-contact-item {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 10px;
  }
  .ft-contact-icon { flex-shrink: 0; margin-top: 2px; }
  .ft-contact-text { font-size: 0.82rem; color: rgba(255,255,255,0.5); line-height: 1.5; }
 
  /* Newsletter */
  .ft-newsletter-label {
    font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.5);
    text-transform: uppercase; letter-spacing: 0.05em;
    margin: 16px 0 8px;
  }
  .ft-newsletter-row { display: flex; gap: 8px; }
  .ft-newsletter-input {
    flex: 1; padding: 8px 12px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: 9px; color: #fff;
    font-size: 0.83rem; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.15s;
  }
  .ft-newsletter-input::placeholder { color: rgba(255,255,255,0.3); }
  .ft-newsletter-input:focus { border-color: ${ACCENT}; }
  .ft-newsletter-btn {
    padding: 8px 16px; border-radius: 9px; border: none;
    background: ${ACCENT}; color: #fff;
    font-size: 0.83rem; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; white-space: nowrap;
    transition: opacity 0.15s;
  }
  .ft-newsletter-btn:hover { opacity: 0.88; }
  .ft-newsletter-msg { font-size: 0.78rem; color: ${ACCENT}; margin-top: 6px; }
 
  /* Bottom */
  .ft-bottom {
    max-width: 1120px; margin: 0 auto;
    padding: 20px 24px 24px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
    border-top: 1px solid rgba(16,185,129,0.2);
    margin-top: 48px;
  }
  .ft-copy { font-size: 0.78rem; color: rgba(255,255,255,0.35); margin: 0; }
  .ft-legal-links { display: flex; gap: 20px; }
  .ft-legal-link {
    font-size: 0.78rem; color: rgba(255,255,255,0.35);
    text-decoration: none; transition: color 0.15s;
  }
  .ft-legal-link:hover { color: rgba(255,255,255,0.75); }
`;
 
export function Footer() {
  const [email, setEmail] = useState("");
  const [info, setInfo]   = useState("");
 
  useEffect(() => {
    if (document.getElementById("ft-styles")) return;
    const tag = document.createElement("style");
    tag.id = "ft-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }, []);
 
  const socialLinks = [
    { icon: Facebook,  url: "https://facebook.com"  },
    { icon: Twitter,   url: "https://x.com"          },
    { icon: Linkedin,  url: "https://linkedin.com"  },
    { icon: Instagram, url: "https://instagram.com" },
    { icon: Youtube,   url: "https://youtube.com"   },
  ];
 
  const contactItems = [
    { icon: Mail,    text: "hello@learnhub.com"                   },
    { icon: Phone,   text: "+1 (555) 234-5678"                    },
    { icon: MapPin,  text: "123 Learning Ave, San Francisco, CA"  },
  ];
 
  const handleSubscribe = () => {
    if (!email.trim() || !email.includes("@")) { setInfo("Enter a valid email."); return; }
    setInfo("Subscribed ✓");
    setEmail("");
  };
 
  return (
    <footer className="ft-wrap">
      <div className="ft-inner">
        <div className="ft-grid">
 
          {/* Brand */}
          <div>
            <Link to="/" className="ft-logo">
              <div className="ft-logo-icon"><BookOpen size={18} color="#fff" /></div>
              <span className="ft-logo-text">Learn<span className="ft-logo-accent">Hub</span></span>
            </Link>
            <p className="ft-brand-desc">
              Empowering learners worldwide with high-quality, accessible education. Join over 500,000 students building their future.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {socialLinks.map(({ icon, url }) => {
                const SocialIcon = icon;
                return (
                  <button key={url} type="button" className="ft-social-btn"
                    onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
                    <SocialIcon size={15} color="#fff" />
                  </button>
                );
              })}
            </div>
          </div>
 
          {/* Platform */}
          <div>
            <p className="ft-col-title">Platform</p>
            {[
              { label: "Browse Courses",   path: "/courses" },
              { label: "About Us",         path: "/about"   },
              { label: "Blog",             path: "/blog"    },
              { label: "Become a Trainer", path: "/trainer" },
              { label: "Contact",          path: "/contact" },
            ].map((item) => (
              <Link key={item.label} to={item.path} className="ft-link">{item.label}</Link>
            ))}
          </div>
 
          {/* Categories */}
          <div>
            <p className="ft-col-title">Categories</p>
            {["Development", "Data Science", "Marketing", "Design", "Business", "Creative"].map((cat) => (
              <Link key={cat} to="/courses" className="ft-link">{cat}</Link>
            ))}
          </div>
 
          {/* Contact + Newsletter */}
          <div>
            <p className="ft-col-title">Contact Us</p>
            {contactItems.map(({ icon, text }) => {
              const ContactIcon = icon;
              return (
                <div key={text} className="ft-contact-item">
                  <ContactIcon size={14} color={ACCENT} className="ft-contact-icon" />
                  <span className="ft-contact-text">{text}</span>
                </div>
              );
            })}
 
            <p className="ft-newsletter-label">Subscribe to newsletter</p>
            <div className="ft-newsletter-row">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ft-newsletter-input"
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button type="button" className="ft-newsletter-btn" onClick={handleSubscribe}>Go</button>
            </div>
            {info && <p className="ft-newsletter-msg">{info}</p>}
          </div>
 
        </div>
      </div>
 
      {/* Bottom */}
      <div className="ft-bottom">
        <p className="ft-copy">© 2026 LearnHub. All rights reserved.</p>
        <div className="ft-legal-links">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((label) => (
            <a key={label} href="#" className="ft-legal-link">{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}