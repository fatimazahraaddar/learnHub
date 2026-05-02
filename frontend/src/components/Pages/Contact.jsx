import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { submitContactMessage } from "../../api";

const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";

export function ContactPage() {
  const [submitted, setSubmitted]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

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

  const contactInfo = [
    { icon: Mail,   label: "Email Us",       value: "hello@learnhub.com", sub: "We reply within 24 hours",  color: PRIMARY },
    { icon: Phone,  label: "Call Us",        value: "+212 555 555 555",   sub: "Mon–Fri, 9AM–6PM EST",      color: ACCENT },
    { icon: MapPin, label: "Visit Us",       value: "123 Learning Ave",   sub: "San Francisco, CA 94105",   color: "#FF7A00" },
    { icon: Clock,  label: "Business Hours", value: "Mon–Fri: 9AM–6PM",  sub: "Sat: 10AM–4PM",             color: "#E91E8C" },
  ];

  return (
    <div style={{ backgroundColor: "#F4F7FB" }}>

      {/* ── HERO ── */}
      <div className="py-5 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%)` }}>
        <div className="container">
          <span className="badge px-3 py-2 rounded-pill mb-3"
            style={{ background: `${ACCENT}33`, color: ACCENT, fontSize: "0.85rem", fontWeight: 600 }}>
            Contact
          </span>
          <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
            Get in Touch
          </h1>
          <p style={{ opacity: 0.75 }}>Have questions? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="container py-5">

        {/* ── CONTACT CARDS ── */}
        <div className="row g-4 mb-5">
          {contactInfo.map((info) => (
            <div key={info.label} className="col-md-6 col-lg-3">
              <div className="card border-0 rounded-4 text-center p-4 h-100"
                style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", transition: "transform .2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
                  style={{ width: "52px", height: "52px", background: `${info.color}18` }}>
                  <info.icon size={22} style={{ color: info.color }} />
                </div>
                <p className="fw-bold mb-1" style={{ color: PRIMARY }}>{info.label}</p>
                <p className="small mb-1" style={{ color: info.color, fontWeight: 600 }}>{info.value}</p>
                <p className="text-muted small mb-0">{info.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">

          {/* ── FORM ── */}
          <div className="col-lg-6">
            <div className="card border-0 rounded-4 p-4"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h2 className="fw-bold mb-1" style={{ color: PRIMARY }}>Send Us a Message</h2>
              <p className="text-muted mb-4">Fill out the form and we'll get back to you.</p>

              {submitted ? (
                <div className="text-center p-5 rounded-4"
                  style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}33` }}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                    style={{ width: "60px", height: "60px", background: `${ACCENT}22` }}>
                    <CheckCircle size={30} style={{ color: ACCENT }} />
                  </div>
                  <h5 className="fw-bold mb-1" style={{ color: PRIMARY }}>Message Sent!</h5>
                  <p className="text-muted mb-4">We'll respond within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn fw-semibold px-4"
                    style={{ background: PRIMARY, color: "white", borderRadius: "10px", border: "none" }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium" style={{ color: PRIMARY }}>Full Name</label>
                      <input required value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your name" className="form-control rounded-3"
                        style={{ border: `1px solid ${PRIMARY}22` }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium" style={{ color: PRIMARY }}>Email</label>
                      <input required type="email" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Enter your email" className="form-control rounded-3"
                        style={{ border: `1px solid ${PRIMARY}22` }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium" style={{ color: PRIMARY }}>Subject</label>
                      <select required value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="form-select rounded-3"
                        style={{ border: `1px solid ${PRIMARY}22` }}>
                        <option value="">Select a subject</option>
                        <option>Course Inquiry</option>
                        <option>Technical Support</option>
                        <option>Billing Question</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium" style={{ color: PRIMARY }}>Message</label>
                      <textarea required rows={5} value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help you..."
                        className="form-control rounded-3"
                        style={{ border: `1px solid ${PRIMARY}22` }} />
                    </div>
                    <div className="col-12">
                      <button type="submit" disabled={isSubmitting}
                        className="btn w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, #16324F)`, color: "white", borderRadius: "10px", border: "none", padding: "12px" }}>
                        <Send size={16} />
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </div>
                  {errorMessage && <p className="text-danger mt-3 mb-0">{errorMessage}</p>}
                </form>
              )}
            </div>
          </div>

          {/* ── MAP + FAQ ── */}
          <div className="col-lg-6">
            <div className="rounded-4 overflow-hidden mb-4 shadow"
              style={{ border: `2px solid ${ACCENT}33` }}>
              <img
                src="https://images.unsplash.com/photo-1565688527174-775059ac429c?w=600&q=80"
                alt="Office" className="img-fluid w-100"
                style={{ height: "220px", objectFit: "cover" }}
              />
            </div>

            <div className="card border-0 rounded-4 p-4"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h5 className="fw-bold mb-4" style={{ color: PRIMARY }}>
                Frequently Asked Questions
              </h5>
              {[
                { q: "How do I enroll in a course?", a: "Simply browse and enroll instantly." },
                { q: "Can I get a refund?",          a: "Yes, 30-day money-back guarantee." },
                { q: "Are certificates recognized?", a: "Yes, recognized worldwide." },
                { q: "How long is my access?",       a: "You get lifetime access." },
              ].map((faq, i) => (
                <div key={i} className="mb-3 pb-3"
                  style={{ borderBottom: i < 3 ? `1px solid ${PRIMARY}12` : "none" }}>
                  <div className="d-flex align-items-start gap-2">
                    <div className="flex-shrink-0 mt-1 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "20px", height: "20px", background: `${ACCENT}22` }}>
                      <CheckCircle size={12} style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <p className="fw-semibold mb-1" style={{ color: PRIMARY }}>{faq.q}</p>
                      <p className="text-muted small mb-0">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}