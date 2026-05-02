import { useEffect, useMemo, useState } from "react";
import { Award, Download, Search, Filter, CheckCircle, X } from "lucide-react";
import { fetchAdminCertificatesData } from "../../../../api";

const STATUS_COLORS = {
  Valid:   { bg: "#F0FFF4", color: "#28A745" },
  Revoked: { bg: "#FFF5F5", color: "#dc2626" },
  Pending: { bg: "#FFF3E8", color: "#FF7A00" },
};

const TOKEN_KEY = "auth_token";

async function updateCertStatus(rawId, status) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`http://127.0.0.1:8000/api/certificates/${rawId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: status.toLowerCase() }),
  });
  return { ok: res.ok };
}

// ── Template Editor Modal ─────────────────────────────────────────────────────
function TemplateEditor({ template, onClose, onSave }) {
  const [form, setForm] = useState({ ...template });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: 480, maxWidth: "95vw" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Edit Certificate Template</h5>
          <button className="btn btn-sm btn-light rounded-circle" onClick={onClose} type="button">
            <X size={16} />
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold small">Platform Name</label>
          <input className="form-control" value={form.platformName} onChange={set("platformName")} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold small">Subtitle</label>
          <input className="form-control" value={form.subtitle} onChange={set("subtitle")} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold small">Background (CSS gradient or color)</label>
          <input className="form-control" value={form.background} onChange={set("background")} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold small">Accent Color</label>
          <input type="color" className="form-control form-control-color" value={form.accentColor} onChange={set("accentColor")} />
        </div>

        <div className="d-flex gap-2 justify-content-end mt-3">
          <button className="btn btn-outline-secondary" onClick={onClose} type="button">Cancel</button>
          <button
            className="btn text-white fw-semibold"
            style={{ background: "linear-gradient(135deg,#4A90E2,#7F3FBF)" }}
            onClick={() => { onSave(form); onClose(); }}
            type="button"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AdminCertificates() {
  const [certs,       setCerts]       = useState([]);
  const [summary,     setSummary]     = useState({ total: 0, valid: 0, pending: 0, revoked: 0 });
  const [query,       setQuery]       = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [info,        setInfo]        = useState("");
  const [showEditor,  setShowEditor]  = useState(false);
  const [template,    setTemplate]    = useState({
    platformName: "LearnHub",
    subtitle:     "CERTIFICATE OF COMPLETION",
    background:   "linear-gradient(135deg, #0f0c29, #302b63)",
    accentColor:  "#FFC107",
  });

  useEffect(() => {
    let cancelled = false;
    fetchAdminCertificatesData().then(({ ok, data }) => {
      if (cancelled || !ok || !data?.status) return;
      setCerts(Array.isArray(data.certs) ? data.certs : []);
      setSummary(data.summary || { total: 0, valid: 0, pending: 0, revoked: 0 });
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q    = query.trim().toLowerCase();
    const base = onlyPending ? certs.filter((c) => c.status === "Pending") : certs;
    if (!q) return base;
    return base.filter((c) => `${c.id} ${c.user} ${c.course}`.toLowerCase().includes(q));
  }, [certs, query, onlyPending]);

  const handleExport = () => {
    const header = "id,user,course,issued,status";
    const rows   = filtered.map((c) => [c.id, c.user, c.course, c.issued, c.status].join(","));
    const csv    = [header, ...rows].join("\n");
    const blob   = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href       = url;
    a.download   = "certificates.csv";
    a.click();
    URL.revokeObjectURL(url);
    setInfo("Certificates exported.");
  };

  const handleToggleRevoke = async (cert) => {
    const newStatus = cert.status === "Revoked" ? "Valid" : "Revoked";
   const { ok } = await updateCertStatus(cert.id, newStatus);
    if (!ok) { setInfo("Failed to update certificate status."); return; }

    setCerts((prev) =>
      prev.map((item) => item.id === cert.id ? { ...item, status: newStatus } : item)
    );
    setSummary((prev) => ({
      ...prev,
      valid:   newStatus === "Revoked" ? prev.valid - 1   : prev.valid + 1,
      revoked: newStatus === "Revoked" ? prev.revoked + 1 : prev.revoked - 1,
    }));
    setInfo(`Certificate ${cert.id} ${newStatus === "Revoked" ? "revoked" : "restored"}.`);
  };

  return (
    <div className="container my-4">

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Issued", value: summary.total,   color: "#4A90E2" },
          { label: "Valid",        value: summary.valid,   color: "#28A745" },
          { label: "Pending",      value: summary.pending, color: "#FF7A00" },
          { label: "Revoked",      value: summary.revoked, color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} className="col-6 col-sm-3">
            <div className="card text-center shadow-sm border h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-1" style={{ color: s.color }}>{s.value}</h5>
                <p className="text-muted mb-0 small">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Template Preview */}
      <div className="card shadow-sm border mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Certificate Template</h5>
          <button
            className="btn btn-sm btn-primary"
            type="button"
            onClick={() => setShowEditor(true)}
          >
            Edit Template
          </button>
        </div>
        <div
          className="card-body text-center"
          style={{ background: template.background, borderRadius: "0.5rem" }}
        >
          <div className="mb-3">
            <div
              className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 64, height: 64, backgroundColor: "rgba(255,255,0,0.2)" }}
            >
              <Award size={32} style={{ color: template.accentColor }} />
            </div>
            <p className="text-muted small mb-1">{template.subtitle}</p>
            <p className="text-white h3 fw-bold mb-1">{template.platformName}</p>
            <p className="text-muted small mb-1">This is to certify that</p>
            <p className="text-white h5 fw-semibold mb-1">[Learner Name]</p>
            <p className="text-muted small mb-1">has successfully completed</p>
            <p className="h6 fw-semibold mb-1" style={{ color: template.accentColor }}>[Course Title]</p>
            <div className="d-flex align-items-center justify-content-center gap-2 text-success small mt-2">
              <CheckCircle size={16} /> Verified Certificate - ID: CERT-XXXXXX
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="card shadow-sm border">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Issued Certificates</h5>
          <div className="d-flex gap-2 flex-wrap">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-0"><Search size={16} className="text-muted" /></span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className={`btn btn-sm d-flex align-items-center gap-1 ${onlyPending ? "btn-secondary text-white" : "btn-outline-secondary"}`}
              type="button"
              onClick={() => setOnlyPending((prev) => !prev)}
            >
              <Filter size={16} /> {onlyPending ? "All" : "Pending"}
            </button>
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" type="button" onClick={handleExport}>
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {info && (
          <div className="alert alert-info py-2 mb-0 rounded-0 d-flex justify-content-between align-items-center">
            <span>{info}</span>
            <button className="btn-close btn-sm" onClick={() => setInfo("")} />
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-muted">
              <tr>
                {["Certificate ID", "Learner", "Course", "Issued Date", "Status", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">No certificates found.</td></tr>
              )}
              {filtered.map((cert) => {
                const sc = STATUS_COLORS[cert.status] || STATUS_COLORS.Pending;
                return (
                  <tr key={cert.id}>
                    <td className="text-monospace small">{cert.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={cert.avatar}
                          className="rounded-circle"
                          alt={cert.user}
                          style={{ width: 28, height: 28, objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"; }}
                        />
                        <span className="small fw-medium">{cert.user}</span>
                      </div>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>{cert.course}</td>
                    <td className="text-muted small">{cert.issued}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {cert.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-light btn-sm"
                          type="button"
                          onClick={() => setInfo(`Certificate ${cert.id} — ${cert.user} — ${cert.course} — ${cert.issued}`)}
                        >
                          View
                        </button>
                        <button
                          className={`btn btn-sm ${cert.status === "Revoked" ? "btn-outline-success" : "btn-outline-danger"}`}
                          type="button"
                          onClick={() => handleToggleRevoke(cert)}
                        >
                          {cert.status === "Revoked" ? "Restore" : "Revoke"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Editor Modal */}
      {showEditor && (
        <TemplateEditor
          template={template}
          onClose={() => setShowEditor(false)}
          onSave={(newTemplate) => {
            setTemplate(newTemplate);
            setInfo("Template updated successfully!");
          }}
        />
      )}
    </div>
  );
}