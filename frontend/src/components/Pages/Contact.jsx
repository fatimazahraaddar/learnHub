import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { submitContactMessage } from "../../lib/api";

export function ContactPage() {
const [submitted, setSubmitted] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

const handleSubmit = async (e) => {
e.preventDefault();
setErrorMessage("");
setIsSubmitting(true);

try {
const { data } = await submitContactMessage({
name: form.name,
email: form.email,
subject: form.subject,
message: form.message,
});

if (!data.status) {
setErrorMessage(data.message || "Failed to send message");
return;
}

setSubmitted(true);
setForm({ name: "", email: "", subject: "", message: "" });
} catch {
setErrorMessage("Unable to reach server. Please try again.");
} finally {
setIsSubmitting(false);
}
};

const contactInfo = [
{ icon: Mail, label: "Email Us", value: "[hello@learnhub.com](mailto:hello@learnhub.com)", sub: "We reply within 24 hours", color: "#4A90E2 "  },
{ icon: Phone, label: "Call Us", value: "+212 555555555", sub: "Mon–Fri, 9AM–6PM EST", color: "#7F3FBF" },
{ icon: MapPin, label: "Visit Us", value: "123 adresse", sub: "San Francisco, CA 94105", color: "#FF7A00" },
{ icon: Clock, label: "Business Hours", value: "Mon–Fri: 9AM–6PM", sub: "Sat: 10AM–4PM", color: "#28A745" },
];

return ( <div className="bg-light">


  {/* Hero */}
  <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)" }} className="py-5 text-center text-white">
    <div className="container">
      <h1 className="mb-3 fw-bold">Get in Touch</h1>
      <p className="text-light">Have questions? We'd love to hear from you.</p>
    </div>
  </div>

  <div className="container py-5">

    {/* Contact Cards */}
    <div className="row mb-5">
      {contactInfo.map((info) => (
        <div key={info.label} className="col-md-6 col-lg-3 mb-4">
          <div className="card text-center p-4 shadow-sm h-100">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded"
              style={{ width: "50px", height: "50px", backgroundColor: `${info.color}20` }}
            >
              <info.icon size={20} style={{ color: info.color }} />
            </div>
            <p className="fw-semibold mb-1">{info.label}</p>
            <p className="text-muted small mb-1">{info.value}</p>
            <p className="text-secondary small">{info.sub}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="row g-4">

      {/* Contact Form */}
      <div className="col-lg-6">
        <h2 className="fw-bold mb-2">Send Us a Message</h2>
        <p className="text-muted mb-4">Fill out the form and we'll get back to you.</p>

        {submitted ? (
          <div className="text-center p-5 bg-success bg-opacity-10 rounded border">
            <CheckCircle size={40} className="text-success mb-3" />
            <h5 className="fw-semibold">Message Sent!</h5>
            <p className="text-muted">We'll respond within 24 hours.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn btn-primary mt-3"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  className="form-control"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Subject</label>
              <select
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="form-select"
              >
                <option value="">Select a subject</option>
                <option>Course Inquiry</option>
                <option>Technical Support</option>
                <option>Billing Question</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us how we can help you..."
                className="form-control"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            >
              <Send size={16} />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {errorMessage ? <p className="text-danger mt-3 mb-0">{errorMessage}</p> : null}
          </form>
        )}
      </div>

      {/* Map + FAQ */}
      <div className="col-lg-6">
        <div className="mb-4">
          <img
            src="https://images.unsplash.com/photo-1565688527174-775059ac429c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
            alt="Office"
            className="img-fluid rounded"
          />
        </div>

        <div className="card p-4 shadow-sm">
          <h5 className="fw-semibold mb-3">Frequently Asked Questions</h5>

          {[
            { q: "How do I enroll in a course?", a: "Simply browse and enroll instantly." },
            { q: "Can I get a refund?", a: "Yes, 30-day guarantee." },
            { q: "Are certificates recognized?", a: "Yes, worldwide." },
            { q: "How long access?", a: "Lifetime access." },
          ].map((faq, i) => (
            <div key={i} className="mb-3">
              <p className="fw-semibold mb-1">{faq.q}</p>
              <p className="text-muted small">{faq.a}</p>
            </div>
          ))}

        </div>
      </div>

    </div>
  </div>
</div>

);
}
