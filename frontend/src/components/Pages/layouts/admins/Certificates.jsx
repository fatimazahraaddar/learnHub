import { useEffect, useMemo, useState } from "react";
import { Award, Download, Search, Filter, CheckCircle, X, ShieldCheck, ShieldOff, Eye } from "lucide-react";
import { fetchAdminCertificatesData } from "../../../../api";
 
const STATUS_COLORS = {
  Valid:   { bg: "#ECFDF5", color: "#16A34A" },
  Revoked: { bg: "#FFF5F5", color: "#dc2626" },
  Pending: { bg: "#FFF8F0", color: "#C47A1A" },
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
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .acer-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .acer-stat-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 20px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .acer-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .acer-stat-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .acer-stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1.1; margin-bottom: 4px; }
  .acer-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
 
  .acer-toolbar {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px;
    padding: 16px 20px; display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;
  }
  .acer-toolbar-title { font-size: 1.15rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  .acer-search {
    display: flex; align-items: center; gap: 8px;
    background: #F6F8FA; border: 1px solid #E8ECF0;
    border-radius: 10px; padding: 7px 14px; min-width: 200px;
  }
  .acer-search input {
    border: none; background: transparent; outline: none;
    font-size: 0.875rem; color: #1A202C;
    font-family: 'DM Sans', sans-serif; width: 160px;
  }
  .acer-search input::placeholder { color: #A0AEC0; }
 
  .acer-btn-filter {
    display: flex; align-items: center; gap: 6px;
    background: #F6F8FA; border: 1px solid #E8ECF0;
    border-radius: 10px; padding: 7px 14px;
    font-size: 0.875rem; font-weight: 500; color: #4A5568;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }
  .acer-btn-filter:hover { background: #EEF1F5; border-color: #CBD5E0; }
  .acer-btn-filter.active { background: #EBF4FF; border-color: #4A90E2; color: #4A90E2; }
 
  .acer-btn-primary {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    border: none; border-radius: 10px; padding: 8px 16px;
    font-size: 0.875rem; font-weight: 600; color: #fff;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
  }
  .acer-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
 
  .acer-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; overflow: hidden; margin-bottom: 20px;
  }
  .acer-card-header {
    padding: 16px 20px; border-bottom: 1px solid #F0F3F7;
    display: flex; align-items: center; justify-content: space-between;
  }
  .acer-card-title { font-size: 1rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  .acer-table { width: 100%; border-collapse: collapse; }
  .acer-table thead tr { background: #F6F8FA; border-bottom: 1px solid #E8ECF0; }
  .acer-table th {
    padding: 13px 18px; font-size: 0.75rem; font-weight: 600; color: #8492A6;
    text-transform: uppercase; letter-spacing: 0.06em; text-align: left; white-space: nowrap;
  }
  .acer-table tbody tr { border-bottom: 1px solid #F0F3F7; transition: background 0.15s; }
  .acer-table tbody tr:last-child { border-bottom: none; }
  .acer-table tbody tr:hover { background: #FAFBFC; }
  .acer-table td { padding: 14px 18px; font-size: 0.875rem; color: #2D3748; }
 
  .acer-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
  }
  .acer-badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
 
  .acer-action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 9px;
    border: 1px solid #E8ECF0; background: #fff;
    cursor: pointer; transition: background 0.15s, border-color 0.15s, transform 0.15s;
    color: #5A6A7E;
  }
  .acer-action-btn:hover { background: #F0F4FF; border-color: #C5D5F5; color: #4A90E2; transform: translateY(-1px); }
  .acer-action-btn.revoke:hover { background: #FFF5F5; border-color: #FFC5C5; color: #dc2626; }
  .acer-action-btn.restore:hover { background: #ECFDF5; border-color: #A7F3D0; color: #16A34A; }
 
  .acer-toast {
    background: #1A202C; color: #fff; border-radius: 10px;
    padding: 12px 18px; font-size: 0.875rem; font-weight: 500;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    animation: acer-fade 0.2s ease;
  }
  @keyframes acer-fade {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .acer-toast-close { background: none; border: none; color: #A0AEC0; cursor: pointer; font-size: 1rem; }
  .acer-toast-close:hover { color: #fff; }
 
  .acer-footer { padding: 14px 20px; font-size: 0.8rem; color: #A0AEC0; border-top: 1px solid #F0F3F7; }
 
  /* Modal */
  .acer-modal-overlay {
    position: fixed; inset: 0; background: rgba(15,20,35,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1050; backdrop-filter: blur(2px);
  }
  .acer-modal {
    background: #fff; border-radius: 18px; padding: 28px;
    width: 460px; max-width: 95vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: acer-fade 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }
  .acer-modal-title { font-size: 1.05rem; font-weight: 700; color: #1A202C; margin: 0; }
  .acer-modal label { display: block; font-size: 0.78rem; font-weight: 600; color: #4A5568; margin-bottom: 6px; }
  .acer-modal input[type="text"], .acer-modal input[type="color"] {
    width: 100%; padding: 9px 13px;
    border: 1px solid #E2E8F0; border-radius: 9px;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    color: #1A202C; outline: none; box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .acer-modal input[type="text"]:focus { border-color: #4A90E2; box-shadow: 0 0 0 3px rgba(74,144,226,0.12); }
  .acer-modal input[type="color"] { height: 42px; padding: 4px; cursor: pointer; }
  .acer-modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .acer-close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid #E2E8F0; background: #F6F8FA;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #8492A6; transition: background 0.15s;
  }
  .acer-close-btn:hover { background: #EEF1F5; color: #1A202C; }
  .acer-btn-cancel {
    padding: 9px 18px; border-radius: 9px;
    border: 1px solid #E2E8F0; background: #fff; color: #4A5568;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  }
  .acer-btn-cancel:hover { background: #F6F8FA; }
  .acer-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .acer-form-row.full { grid-template-columns: 1fr; }
`;
 
function TemplateEditor({ template, onClose, onSave }) {
  const [form, setForm] = useState({ ...template });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
 
  return (
    <div className="acer-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="acer-modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h5 className="acer-modal-title">Edit Certificate Template</h5>
          <button className="acer-close-btn" onClick={onClose} type="button"><X size={15} /></button>
        </div>
 
        <div className="acer-form-row">
          <div>
            <label>Platform Name</label>
            <input type="text" value={form.platformName} onChange={set("platformName")} />
          </div>
          <div>
            <label>Subtitle</label>
            <input type="text" value={form.subtitle} onChange={set("subtitle")} />
          </div>
        </div>
        <div className="acer-form-row full">
          <div>
            <label>Background (CSS gradient or color)</label>
            <input type="text" value={form.background} onChange={set("background")} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Accent Color</label>
          <input type="color" value={form.accentColor} onChange={set("accentColor")} />
        </div>
 
        <div className="acer-modal-footer">
          <button className="acer-btn-cancel" onClick={onClose} type="button">Cancel</button>
          <button className="acer-btn-primary" onClick={() => { onSave(form); onClose(); }} type="button">
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
 
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
    a.href = url; a.download = "certificates.csv"; a.click();
    URL.revokeObjectURL(url);
    setInfo("Certificates exported.");
  };
 
  const handleToggleRevoke = async (cert) => {
    const newStatus = cert.status === "Revoked" ? "Valid" : "Revoked";
    const { ok } = await updateCertStatus(cert.id, newStatus);
    if (!ok) { setInfo("Failed to update certificate status."); return; }
    setCerts((prev) => prev.map((item) => item.id === cert.id ? { ...item, status: newStatus } : item));
    setSummary((prev) => ({
      ...prev,
      valid:   newStatus === "Revoked" ? prev.valid - 1   : prev.valid + 1,
      revoked: newStatus === "Revoked" ? prev.revoked + 1 : prev.revoked - 1,
    }));
    setInfo(`Certificate ${cert.id} ${newStatus === "Revoked" ? "revoked" : "restored"}.`);
  };
 
  const STATS = [
    { label: "Total Issued", value: summary.total,   iconBg: "#EBF4FF", iconColor: "#4A90E2", Icon: Award        },
    { label: "Valid",        value: summary.valid,   iconBg: "#ECFDF5", iconColor: "#16A34A", Icon: CheckCircle  },
    { label: "Pending",      value: summary.pending, iconBg: "#FFF8F0", iconColor: "#C47A1A", Icon: Filter       },
    { label: "Revoked",      value: summary.revoked, iconBg: "#FFF5F5", iconColor: "#dc2626", Icon: ShieldOff    },
  ];
 
  return (
    <div className="acer-wrap">
      <style>{styles}</style>
 
      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 22 }}>
        {STATS.map((s) => (
          <div key={s.label} className="acer-stat-card">
            <div className="acer-stat-icon" style={{ background: s.iconBg }}>
              <s.Icon size={18} color={s.iconColor} />
            </div>
            <div className="acer-stat-value" style={{ color: s.iconColor }}>{s.value}</div>
            <div className="acer-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* TEMPLATE PREVIEW */}
      <div className="acer-card">
        <div className="acer-card-header">
          <span className="acer-card-title">Certificate Template</span>
          <button className="acer-btn-primary" type="button" onClick={() => setShowEditor(true)}>
            Edit Template
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{
            background: template.background, borderRadius: 14,
            padding: "32px 24px", textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Award size={32} color={template.accentColor} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: 4 }}>{template.subtitle}</p>
            <p style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 700, margin: "0 0 8px" }}>{template.platformName}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", margin: "0 0 4px" }}>This is to certify that</p>
            <p style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, margin: "0 0 4px" }}>[Learner Name]</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", margin: "0 0 4px" }}>has successfully completed</p>
            <p style={{ color: template.accentColor, fontSize: "1rem", fontWeight: 600, margin: "0 0 12px" }}>[Course Title]</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#4ade80", fontSize: "0.8rem" }}>
              <CheckCircle size={15} /> Verified Certificate — ID: CERT-XXXXXX
            </div>
          </div>
        </div>
      </div>
 
      {/* TOAST */}
      {info && (
        <div className="acer-toast">
          <span>{info}</span>
          <button className="acer-toast-close" onClick={() => setInfo("")}>✕</button>
        </div>
      )}
 
      {/* TOOLBAR */}
      <div className="acer-toolbar">
        <span className="acer-toolbar-title">Issued Certificates</span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div className="acer-search">
            <Search size={15} color="#A0AEC0" />
            <input placeholder="Search certificates..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button className={`acer-btn-filter ${onlyPending ? "active" : ""}`} type="button"
            onClick={() => setOnlyPending((p) => !p)}>
            <Filter size={14} /> {onlyPending ? "Pending only" : "All"}
          </button>
          <button className="acer-btn-primary" type="button" onClick={handleExport}>
            <Download size={15} /> Export
          </button>
        </div>
      </div>
 
      {/* TABLE */}
      <div className="acer-card" style={{ marginBottom: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="acer-table">
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Learner</th>
                <th>Course</th>
                <th>Issued Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#A0AEC0" }}>
                    No certificates found.
                  </td>
                </tr>
              )}
              {filtered.map((cert) => {
                const sc = STATUS_COLORS[cert.status] || STATUS_COLORS.Pending;
                return (
                  <tr key={cert.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#4A5568" }}>{cert.id}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img
                          src={cert.avatar}
                          alt={cert.user}
                          style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #E8ECF0" }}
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"; }}
                        />
                        <span style={{ fontWeight: 600, color: "#1A202C" }}>{cert.user}</span>
                      </div>
                    </td>
                    <td style={{ color: "#4A5568", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cert.course}</td>
                    <td style={{ color: "#8492A6" }}>{cert.issued}</td>
                    <td>
                      <span className="acer-badge" style={{ background: sc.bg, color: sc.color }}>
                        <span className="acer-badge-dot" style={{ background: sc.color }} />
                        {cert.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button className="acer-action-btn" title="View" type="button"
                          onClick={() => setInfo(`${cert.id} — ${cert.user} — ${cert.course} — ${cert.issued}`)}>
                          <Eye size={15} />
                        </button>
                        <button
                          className={`acer-action-btn ${cert.status === "Revoked" ? "restore" : "revoke"}`}
                          title={cert.status === "Revoked" ? "Restore" : "Revoke"}
                          type="button"
                          onClick={() => handleToggleRevoke(cert)}
                        >
                          {cert.status === "Revoked"
                            ? <ShieldCheck size={15} color="#16A34A" />
                            : <ShieldOff size={15} color="#dc2626" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="acer-footer">
          Showing <strong>{filtered.length}</strong> of <strong>{summary.total}</strong> certificates
        </div>
      </div>
 
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