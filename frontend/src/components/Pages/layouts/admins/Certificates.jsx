import { useEffect, useMemo, useState } from "react";
import { Award, Download, Search, Filter, CheckCircle } from "lucide-react";
import { fetchAdminCertificatesData } from "../../../../lib/api";

const STATUS_COLORS = {
  Valid: { bg: "#F0FFF4", color: "#28A745" },
  Revoked: { bg: "#FFF5F5", color: "#dc2626" },
  Pending: { bg: "#FFF3E8", color: "#FF7A00" },
};

export function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [summary, setSummary] = useState({ total: 0, valid: 0, pending: 0, revoked: 0 });
  const [query, setQuery] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchAdminCertificatesData();
      if (!ok || !data?.status) return;
      setCerts(Array.isArray(data.certs) ? data.certs : []);
      setSummary(data.summary || { total: 0, valid: 0, pending: 0, revoked: 0 });
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = onlyPending ? certs.filter((c) => c.status === "Pending") : certs;
    if (!q) return base;
    return base.filter((c) => `${c.id} ${c.user} ${c.course}`.toLowerCase().includes(q));
  }, [certs, query, onlyPending]);

  const handleExport = () => {
    const header = "id,user,course,issued,status";
    const rows = filtered.map((c) => [c.id, c.user, c.course, c.issued, c.status].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificates.csv";
    a.click();
    URL.revokeObjectURL(url);
    setInfo("Certificates exported.");
  };

  return (
    <div className="container my-4">
      <div className="row g-3 mb-4">
        {[
          { label: "Total Issued", value: summary.total.toLocaleString(), color: "#4A90E2" },
          { label: "Valid", value: summary.valid.toLocaleString(), color: "#28A745" },
          { label: "Pending", value: summary.pending.toLocaleString(), color: "#FF7A00" },
          { label: "Revoked", value: summary.revoked.toLocaleString(), color: "#dc2626" },
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

      <div className="card shadow-sm border mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Certificate Template</h5>
          <button className="btn btn-sm btn-primary" type="button" onClick={() => setInfo("Template editor will be added in next release.")}>
            Edit Template
          </button>
        </div>
        <div className="card-body text-center" style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)", borderRadius: "0.5rem" }}>
          <div className="mb-3">
            <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 64, height: 64, backgroundColor: "rgba(255, 255, 0, 0.2)" }}>
              <Award size={32} className="text-warning" />
            </div>
            <p className="text-muted small mb-1">CERTIFICATE OF COMPLETION</p>
            <p className="text-white h3 fw-bold mb-1">LearnHub</p>
            <p className="text-muted small mb-1">This is to certify that</p>
            <p className="text-white h5 fw-semibold mb-1">[Learner Name]</p>
            <p className="text-muted small mb-1">has successfully completed</p>
            <p className="text-warning h6 fw-semibold mb-1">[Course Title]</p>
            <div className="d-flex align-items-center justify-content-center gap-2 text-success small mt-2">
              <CheckCircle size={16} /> Verified Certificate - ID: CERT-XXXXXX
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border">
        <div className="card-header d-flex justify-content-between align-items-center">
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
        {info ? <div className="alert alert-info py-2 mb-0 rounded-0">{info}</div> : null}
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
              {filtered.map((cert) => {
                const sc = STATUS_COLORS[cert.status] || STATUS_COLORS.Pending;
                return (
                  <tr key={cert.id}>
                    <td className="text-monospace small">{cert.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={cert.avatar} className="rounded-circle" alt={cert.user} style={{ width: 28, height: 28, objectFit: "cover" }} />
                        <span className="small fw-medium">{cert.user}</span>
                      </div>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>{cert.course}</td>
                    <td className="text-muted small">{cert.issued}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: sc.bg, color: sc.color }}>{cert.status}</span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-light btn-sm"
                          type="button"
                          onClick={() => setInfo(`Certificate ${cert.id} for ${cert.user}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          type="button"
                          onClick={() => {
                            setCerts((prev) =>
                              prev.map((item) =>
                                item.id === cert.id
                                  ? { ...item, status: item.status === "Revoked" ? "Valid" : "Revoked" }
                                  : item
                              )
                            );
                          }}
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
    </div>
  );
}
