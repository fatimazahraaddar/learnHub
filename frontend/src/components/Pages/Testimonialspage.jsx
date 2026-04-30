import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const PRIMARY = "#1E3A5F";
const ACCENT = "#10B981";

function getInitials(name) {
  return name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={22}
          fill={(hovered || value) >= n ? "#F59E0B" : "none"}
          stroke={(hovered || value) >= n ? "#F59E0B" : "#9CA3AF"}
          style={{ cursor: onChange ? "pointer" : "default" }}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange && onChange(n)}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div
      className="card border-0 rounded-4 p-4 h-100"
      style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
    >
      <StarRating value={t.rating || 5} />
      <p className="mt-3 mb-3" style={{ color: "#374151", fontSize: "0.95rem", lineHeight: 1.6 }}>
        "{t.text}"
      </p>
      <div className="d-flex align-items-center gap-2 mt-auto">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: "40px", height: "40px", background: `${PRIMARY}22`, color: PRIMARY, fontWeight: 600, fontSize: "13px", flexShrink: 0 }}
        >
          {getInitials(t.name)}
        </div>
        <div>
          <p className="mb-0 fw-semibold" style={{ color: PRIMARY, fontSize: "14px" }}>{t.name}</p>
          <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>{t.role || "Learner"}</p>
        </div>
      </div>
    </div>
  );
}

function SubmitForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", role: "", text: "", rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) { setError("Please select a rating."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", role: "", text: "", rating: 0 });
        onSuccess?.();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to submit. Please try again.");
      }
    } catch {
      setError("Could not reach server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-4 rounded-4" style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}33` }}>
        <p className="fw-bold mb-1" style={{ color: PRIMARY }}>Thank you for your review!</p>
        <p className="text-muted mb-3 small">Your feedback helps other learners.</p>
        <button onClick={() => setSubmitted(false)} className="btn btn-sm" style={{ background: PRIMARY, color: "white", border: "none", borderRadius: "8px" }}>
          Write Another
        </button>
      </div>
    );
  }

  return (
    <div className="card border-0 rounded-4 p-4" style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      <h5 className="fw-bold mb-4" style={{ color: PRIMARY }}>Share Your Experience</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Your Rating</label>
          <StarRating value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" className="form-control rounded-3" style={{ border: `1px solid ${PRIMARY}22` }} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Role</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Learner, Developer" className="form-control rounded-3" style={{ border: `1px solid ${PRIMARY}22` }} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium small" style={{ color: PRIMARY }}>Your Review</label>
          <textarea required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Tell us about your experience..." className="form-control rounded-3" style={{ border: `1px solid ${PRIMARY}22` }} />
        </div>
        {error && <p className="text-danger small mb-2">{error}</p>}
        <button type="submit" disabled={submitting} className="btn w-100 fw-semibold"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}, #16324F)`, color: "white", borderRadius: "10px", border: "none", padding: "12px" }}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_BASE}/testimonials`);
      const json = await res.json();
      setTestimonials(json.data?.data || json.data || []);
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  return (
    <div style={{ backgroundColor: "#F4F7FB" }}>
      {/* HERO */}
      <div className="py-5 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%)` }}>
        <div className="container">
          <span className="badge px-3 py-2 rounded-pill mb-3"
            style={{ background: `${ACCENT}33`, color: ACCENT, fontSize: "0.85rem", fontWeight: 600 }}>
            Testimonials
          </span>
          <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
            What Our Learners Say
          </h1>
          <p style={{ opacity: 0.75 }}>Real stories from learners who transformed their careers with LearnHub.</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* FORM */}
          <div className="col-lg-4">
            <SubmitForm onSuccess={fetchTestimonials} />
          </div>

          {/* REVIEWS GRID */}
          <div className="col-lg-8">
            {loading ? (
              <p className="text-muted">Loading reviews...</p>
            ) : testimonials.length === 0 ? (
              <div className="text-center p-5 text-muted">
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="row g-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="col-md-6">
                    <TestimonialCard t={t} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}