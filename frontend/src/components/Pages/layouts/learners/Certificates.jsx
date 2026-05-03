import { useEffect, useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { fetchLearnerCertificates, getStoredUser } from "../../../../api";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .lcert-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .lcert-toolbar {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
    margin-bottom: 20px;
  }
  .lcert-toolbar-left { display: flex; align-items: center; gap: 10px; }
  .lcert-toolbar-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: #FFF3E8;
    display: flex; align-items: center; justify-content: center;
  }
  .lcert-toolbar-title { font-size: 1.15rem; font-weight: 700; color: #1A202C; margin: 0; }
  .lcert-count {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 20px;
    background: #FFF3E8; color: #FF7A00;
    font-size: 0.75rem; font-weight: 600;
  }
 
  .lcert-alert {
    padding: 10px 14px; border-radius: 9px;
    font-size: 0.85rem; font-weight: 500; margin-bottom: 16px;
    background: #FFFBEB; border: 1px solid #FDE68A; color: #D97706;
  }
 
  .lcert-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }
 
  .lcert-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .lcert-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
 
  .lcert-card-banner {
    height: 6px;
    background: linear-gradient(90deg, #FF7A00, #FF9A40);
  }
  .lcert-card-body { padding: 18px 20px; }
 
  .lcert-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    background: #FFF3E8;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
 
  .lcert-course-num {
    font-size: 0.72rem; font-weight: 600; color: #FF7A00;
    text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px;
  }
  .lcert-course-title {
    font-size: 0.95rem; font-weight: 700; color: #1A202C;
    margin: 0 0 6px; line-height: 1.4;
  }
  .lcert-cert-id {
    font-size: 0.75rem; color: #A0AEC0; margin: 0 0 16px;
  }
 
  .lcert-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 9px; border: none;
    background: linear-gradient(135deg, #FF7A00, #FF9A40);
    color: #fff; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(255,122,0,0.25);
    transition: opacity 0.15s, transform 0.15s;
  }
  .lcert-btn:hover { opacity: 0.9; transform: translateY(-1px); color: #fff; }
 
  .lcert-empty {
    text-align: center; padding: 60px 20px;
    color: #A0AEC0; font-size: 0.875rem;
  }
`;
 
export function LearnerCertificates() {
  const [certs, setCerts]     = useState([]);
  const [message, setMessage] = useState("");
 
  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      if (!user?.id) { setMessage("Please login first."); return; }
      const { ok, data } = await fetchLearnerCertificates(user.id);
      if (!ok || !Array.isArray(data)) { setMessage(data.message || "Failed to load certificates."); return; }
      setCerts(data);
    };
    load();
  }, []);
 
  return (
    <div className="lcert-wrap">
      <style>{styles}</style>
 
      {/* Toolbar */}
      <div className="lcert-toolbar">
        <div className="lcert-toolbar-left">
          <div className="lcert-toolbar-icon">
            <Award size={18} color="#FF7A00" />
          </div>
          <span className="lcert-toolbar-title">Earned Certificates</span>
          <span className="lcert-count">{certs.length}</span>
        </div>
      </div>
 
      {message && <div className="lcert-alert">{message}</div>}
 
      {/* Grid */}
      {certs.length === 0 && !message ? (
        <div className="lcert-empty">No certificates earned yet.</div>
      ) : (
        <div className="lcert-grid">
          {certs.map((cert) => (
            <div key={cert.id} className="lcert-card">
              <div className="lcert-card-banner" />
              <div className="lcert-card-body">
                <div className="lcert-icon-wrap">
                  <Award size={20} color="#FF7A00" />
                </div>
                <p className="lcert-course-num">Course #{cert.course_id}</p>
                <p className="lcert-course-title">{cert.course_title || "Untitled Course"}</p>
                <p className="lcert-cert-id">Certificate ID: {cert.id}</p>
                <a
                  href={cert.certificate_url}
                  target="_blank"
                  rel="noreferrer"
                  className="lcert-btn"
                >
                  <ExternalLink size={13} /> Open Certificate
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}