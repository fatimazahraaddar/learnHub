import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { fetchLearnerCertificates, getStoredUser } from "../../../../lib/api";

export function LearnerCertificates() {
  const [certs, setCerts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      if (!user?.id) {
        setMessage("Please login first.");
        return;
      }

      const { ok, data } = await fetchLearnerCertificates(user.id);

      if (!ok || !Array.isArray(data)) {
        setMessage(data.message || "Failed to load certificates.");
        return;
      }

      setCerts(data);
    };

    load();
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Award size={20} color="#FF7A00" />
        <h4 className="fw-bold mb-0">Earned Certificates ({certs.length})</h4>
      </div>

      {message ? <div className="alert alert-warning">{message}</div> : null}

      <div className="row g-4">
        {certs.map((cert) => (
          <div key={cert.id} className="col-md-6">
            <div className="card shadow-sm border h-100">
              <div className="card-body">
                <h6 className="fw-semibold">Course #{cert.course_id}</h6>
                <p className="mb-1">{cert.course_title}</p>
                <p className="text-muted small mb-2">Certificate ID: {cert.id}</p>
                <a
                  href={cert.certificate_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Open Certificate
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
