import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare } from "lucide-react";
import { submitContactMessage } from "../../api";
 
const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 
  .cp-wrap { font-family: 'DM Sans', sans-serif; background: #F6F8FA; min-height: 100vh; }
 
  /* ── Hero ── */
  .cp-hero {
    background: linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%);
    padding: 56px 0 48px; text-align: center;
  }
  .cp-hero-tag {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 20px; margin-bottom: 16px;
    background: rgba(16,185,129,0.2); color: ${ACCENT};
    font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .cp-hero-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
    color: #fff; margin: 0 0 12px; line-height: 1.2;
  }
  .cp-hero-sub { font-size: 0.95rem; color: rgba(255,255,255,0.65); margin: 0; }
 
  /* ── Container ── */
  .cp-container { max-width: 1120px; margin: 0 auto; padding: 40px 24px; }
 
  /* ── Info cards grid ── */
  .cp-info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 36px;
  }
  @media (max-width: 900px) { .cp-info-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px)  { .cp-info-grid { grid-template-columns: 1fr; } }
 
  .cp-info-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; padding: 20px 16px; text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .cp-info-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); transform: translateY(-3px); }
  .cp-info-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 12px;
  }
  .cp-info-label { font-size: 0.72rem; font-weight: 700; color: #A0AEC0; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px; }
  .cp-info-value { font-size: 0.875rem; font-weight: 700; margin: 0 0 3px; }
  .cp-info-sub   { font-size: 0.75rem; color: #A0AEC0; margin: 0; }
 
  /* ── Two-column layout ── */
  .cp-main-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  }
  @media (max-width: 768px) { .cp-main-grid { grid-template-columns: 1fr; } }
 
  /* ── Card shell ── */
  .cp-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 16px; overflow: hidden;
  }
  .cp-card-body { padding: 28px; }
 
  /* ── Section tag (same as blog) ── */
  .cp-section-tag {
    font-size: 0.72rem; font-weight: 700; color: ${ACCENT};
    text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 2px;
  }
  .cp-section-title { font-size: 1rem; font-weight: 800; color: ${PRIMARY}; margin: 0 0 4px; }
  .cp-section-sub   { font-size: 0.82rem; color: #8492A6; margin: 0 0 22px; }
 
  /* ── Form ── */
  .cp-label { font-size: 0.8rem; font-weight: 600; color: ${PRIMARY}; display: block; margin-bottom: 6px; }
  .cp-input, .cp-select, .cp-textarea {
    width: 100%; padding: 10px 13px; border-radius: 10px;
    border: 1px solid rgba(30,58,95,0.15);
    background: #FAFBFD; color: #1A202C;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: ${ACCENT}; box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
  }
  .cp-textarea { resize: vertical; min-height: 120px; }
  .cp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  @media (max-width: 480px) { .cp-row { grid-template-columns: 1fr; } }
  .cp-field { margin-bottom: 14px; }
 
  .cp-submit-btn {
    width: 100%; padding: 12px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, ${PRIMARY}, #16324F);
    color: #fff; font-size: 0.875rem; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 3px 12px rgba(30,58,95,0.25);
    transition: opacity 0.15s, transform 0.15s;
  }
  .cp-submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .cp-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
 
  /* ── Success state ── */
  .cp-success {
    text-align: center; padding: 40px 24px;
    background: rgba(16,185,129,0.06);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 12px;
  }
  .cp-success-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(16,185,129,0.15);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .cp-success-title { font-size: 1rem; font-weight: 800; color: ${PRIMARY}; margin: 0 0 6px; }
  .cp-success-sub   { font-size: 0.82rem; color: #8492A6; margin: 0 0 18px; }
  .cp-send-another {
    padding: 9px 20px; border-radius: 10px; border: none;
    background: ${PRIMARY}; color: #fff;
    font-size: 0.82rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
 
  /* ── Error ── */
  .cp-error { font-size: 0.8rem; color: #E53E3E; margin-top: 10px; }
 
  /* ── Right column: image + FAQ ── */
  .cp-office-img {
    width: 100%; height: 200px; object-fit: cover; display: block;
  }
 
  .cp-faq-item {
    padding: 14px 0;
    border-bottom: 1px solid rgba(30,58,95,0.07);
    display: flex; align-items: flex-start; gap: 10px;
  }
  .cp-faq-item:last-child { border-bottom: none; padding-bottom: 0; }
  .cp-faq-dot {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; margin-top: 2px;
    background: rgba(16,185,129,0.15);
    display: flex; align-items: center; justify-content: center;
  }
  .cp-faq-q { font-size: 0.85rem; font-weight: 700; color: ${PRIMARY}; margin: 0 0 3px; }
  .cp-faq-a { font-size: 0.78rem; color: #8492A6; margin: 0; line-height: 1.5; }
 
  /* ── Newsletter (same as blog) ── */
  .cp-newsletter {
    border-radius: 18px; padding: 52px 40px; text-align: center; margin-top: 36px;
    background: linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%);
    box-shadow: 0 8px 40px rgba(30,58,95,0.3);
  }
  .cp-newsletter-tag {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;
    background: rgba(16,185,129,0.2); color: ${ACCENT};
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .cp-newsletter-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0 0 8px; }
  .cp-newsletter-sub   { font-size: 0.875rem; color: rgba(255,255,255,0.55); margin: 0 0 24px; }
  .cp-newsletter-row   { display: flex; gap: 10px; max-width: 420px; margin: 0 auto; }
  .cp-newsletter-input {
    flex: 1; padding: 10px 14px; border-radius: 10px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(16,185,129,0.4); color: #fff;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.15s;
  }
  .cp-newsletter-input::placeholder { color: rgba(255,255,255,0.35); }
  .cp-newsletter-input:focus { border-color: ${ACCENT}; }
  .cp-newsletter-btn {
    padding: 10px 20px; border-radius: 10px; border: none;
    background: ${ACCENT}; color: #fff;
    font-size: 0.875rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; white-space: nowrap;
    box-shadow: 0 3px 12px rgba(16,185,129,0.35);
    transition: opacity 0.15s;
  }
  .cp-newsletter-btn:hover { opacity: 0.88; }
  .cp-newsletter-msg { font-size: 0.8rem; color: ${ACCENT}; margin-top: 10px; }
`;
 
export function ContactPage() {
  const [submitted, setSubmitted]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterInfo, setNewsletterInfo]   = useState("");
 
  // Inject styles once
  if (typeof document !== "undefined" && !document.getElementById("cp-styles")) {
    const tag = document.createElement("style");
    tag.id = "cp-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const { data } = await submitContactMessage(form);
      if (!data.status) { setErrorMessage(data.message || "Failed to send message"); return; }
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrorMessage("Unable to reach server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const handleSubscribe = () => {
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      setNewsletterInfo("Please enter a valid email address.");
      return;
    }
    setNewsletterInfo("Subscribed successfully ✓");
    setNewsletterEmail("");
  };
 
  const infoCards = [
    { icon: Mail,   label: "Email Us",       value: "hello@learnhub.com",  sub: "We reply within 24 hours", color: PRIMARY },
    { icon: Phone,  label: "Call Us",        value: "+212 555 555 555",    sub: "Mon–Fri, 9AM–6PM EST",     color: ACCENT  },
    { icon: MapPin, label: "Visit Us",       value: "123 Learning Ave",    sub: "San Francisco, CA 94105",  color: "#FF7A00" },
    { icon: Clock,  label: "Business Hours", value: "Mon–Fri: 9AM–6PM",   sub: "Sat: 10AM–4PM",            color: "#E91E8C" },
  ];
 
  const faqs = [
    { q: "How do I enroll in a course?", a: "Simply browse our catalog and enroll instantly with one click." },
    { q: "Can I get a refund?",          a: "Yes, we offer a 30-day money-back guarantee, no questions asked." },
    { q: "Are certificates recognized?", a: "Yes, our certificates are recognized by employers worldwide." },
    { q: "How long is my access?",       a: "You get lifetime access to all enrolled courses." },
  ];
 
  return (
    <div className="cp-wrap">
 
      {/* ── Hero ── */}
      <div className="cp-hero">
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div className="cp-hero-tag">Contact</div>
          <h1 className="cp-hero-title">Get in Touch</h1>
          <p className="cp-hero-sub">Have questions? We'd love to hear from you.</p>
        </div>
      </div>
 
      <div className="cp-container">
 
        {/* ── Info cards ── */}
        <div className="cp-info-grid">
          {infoCards.map((card) => (
            <div key={card.label} className="cp-info-card">
              <div className="cp-info-icon" style={{ background: `${card.color}18` }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <p className="cp-info-label">{card.label}</p>
              <p className="cp-info-value" style={{ color: card.color }}>{card.value}</p>
              <p className="cp-info-sub">{card.sub}</p>
            </div>
          ))}
        </div>
 
        {/* ── Main grid ── */}
        <div className="cp-main-grid">
 
          {/* Left — Form */}
          <div className="cp-card">
            <div className="cp-card-body">
              <p className="cp-section-tag">Message</p>
              <p className="cp-section-title">Send Us a Message</p>
              <p className="cp-section-sub">Fill out the form and we'll get back to you shortly.</p>
 
              {submitted ? (
                <div className="cp-success">
                  <div className="cp-success-icon">
                    <CheckCircle size={26} style={{ color: ACCENT }} />
                  </div>
                  <p className="cp-success-title">Message Sent!</p>
                  <p className="cp-success-sub">We'll respond within 24 hours.</p>
                  <button className="cp-send-another" onClick={() => setSubmitted(false)}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="cp-row">
                    <div>
                      <label className="cp-label">Full Name</label>
                      <input required className="cp-input" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name" />
                    </div>
                    <div>
                      <label className="cp-label">Email</label>
                      <input required type="email" className="cp-input" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Subject</label>
                    <select required className="cp-select" value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                      <option value="">Select a subject</option>
                      <option>Course Inquiry</option>
                      <option>Technical Support</option>
                      <option>Billing Question</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Message</label>
                    <textarea required className="cp-textarea" value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you..." />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="cp-submit-btn">
                    <Send size={15} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                  {errorMessage && <p className="cp-error">{errorMessage}</p>}
                </form>
              )}
            </div>
          </div>
 
          {/* Right — Image + FAQ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
 
            {/* Office image */}
            <div className="cp-card" style={{ overflow: "hidden" }}>
              <img
                src="https://images.unsplash.com/photo-1565688527174-775059ac429c?w=800&q=80"
                alt="Our office"
                className="cp-office-img"
              />
            </div>
 
            {/* FAQ */}
            <div className="cp-card">
              <div className="cp-card-body">
                <p className="cp-section-tag">FAQ</p>
                <p className="cp-section-title" style={{ marginBottom: 16 }}>Frequently Asked Questions</p>
                {faqs.map((faq, i) => (
                  <div key={i} className="cp-faq-item">
                    <div className="cp-faq-dot">
                      <CheckCircle size={11} style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <p className="cp-faq-q">{faq.q}</p>
                      <p className="cp-faq-a">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
        </div>
 
        {/* ── Newsletter (same as blog) ── */}
        <div className="cp-newsletter">
          <div className="cp-newsletter-tag">Newsletter</div>
          <h4 className="cp-newsletter-title">Stay in the Loop</h4>
          <p className="cp-newsletter-sub">Get latest articles delivered to your inbox.</p>
          <div className="cp-newsletter-row">
            <input
              className="cp-newsletter-input"
              placeholder="Your email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            />
            <button className="cp-newsletter-btn" type="button" onClick={handleSubscribe}>
              Subscribe
            </button>
          </div>
          {newsletterInfo && <p className="cp-newsletter-msg">{newsletterInfo}</p>}
        </div>
 
      </div>
    </div>
  );
}