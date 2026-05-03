import { useEffect, useRef, useState } from "react";
import {
  Camera, Award, BookOpen, Clock, Star, Linkedin, Twitter, Github,
} from "lucide-react";
import {
  fetchProfile, getStoredUser, getUserDisplayData, mergeStoredUser, saveProfile, apiRequest,
} from "../../../../api";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .lp-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .lp-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .lp-card-body { padding: 20px 24px; }
 
  .lp-banner {
    height: 130px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
  }
 
  .lp-avatar-wrap { position: relative; width: 96px; height: 96px; margin-top: -48px; }
  .lp-avatar-img {
    width: 96px; height: 96px;
    border-radius: 50%; object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .lp-avatar-initials {
    width: 96px; height: 96px; border-radius: 50%;
    border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 2rem; font-weight: 700;
  }
  .lp-camera-btn {
    position: absolute; bottom: 0; right: 0;
    width: 28px; height: 28px; border-radius: 50%;
    background: #1A202C; border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff; transition: background 0.15s;
  }
  .lp-camera-btn:hover { background: #2D3748; }
 
  .lp-name { font-size: 1.25rem; font-weight: 700; color: #1A202C; margin: 0 0 2px; }
  .lp-role { font-size: 0.85rem; color: #8492A6; margin: 0 0 8px; }
  .lp-bio  { font-size: 0.875rem; color: #4A5568; margin: 0 0 12px; line-height: 1.6; }
 
  .lp-social-link {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 9px;
    border: 1px solid #E8ECF0; background: #F6F8FA;
    color: #5A6A7E; text-decoration: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .lp-social-link:hover { background: #F0F4FF; border-color: #C5D5F5; color: #4A90E2; }
 
  .lp-btn-save {
    padding: 9px 20px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
    transition: opacity 0.15s, transform 0.15s;
  }
  .lp-btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
  .lp-btn-save.saved { background: linear-gradient(135deg, #16A34A, #15803d); box-shadow: 0 2px 8px rgba(22,163,74,0.3); }
 
  .lp-section-title {
    font-size: 1rem; font-weight: 700; color: #1A202C;
    margin: 0 0 16px; padding-bottom: 12px;
    border-bottom: 1px solid #F0F3F7;
  }
 
  .lp-label {
    display: block; font-size: 0.78rem; font-weight: 600;
    color: #4A5568; margin-bottom: 6px;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .lp-input, .lp-textarea {
    width: 100%; padding: 9px 13px;
    border: 1px solid #E2E8F0; border-radius: 9px;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    color: #1A202C; outline: none; box-sizing: border-box; background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .lp-input:focus, .lp-textarea:focus {
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74,144,226,0.12);
  }
  .lp-textarea { resize: vertical; min-height: 80px; }
 
  .lp-input-group {
    display: flex; align-items: center;
    border: 1px solid #E2E8F0; border-radius: 9px; overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .lp-input-group:focus-within {
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74,144,226,0.12);
  }
  .lp-input-group-icon {
    display: flex; align-items: center; justify-content: center;
    padding: 0 12px; background: #F6F8FA;
    border-right: 1px solid #E2E8F0; color: #8492A6; height: 38px;
  }
  .lp-input-group input {
    flex: 1; padding: 9px 13px; border: none; outline: none;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    color: #1A202C; background: transparent;
  }
 
  .lp-stat-item {
    display: flex; flex-direction: column; align-items: center;
    padding: 14px 8px; border-radius: 10px; background: #F6F8FA;
    transition: background 0.15s;
  }
  .lp-stat-item:hover { background: #EEF1F5; }
  .lp-stat-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 8px;
  }
  .lp-stat-value { font-size: 1.1rem; font-weight: 700; color: #1A202C; }
  .lp-stat-label { font-size: 0.72rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }
 
  .lp-streak-card {
    border-radius: 14px; padding: 20px 24px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff;
  }
  .lp-streak-title { font-size: 1rem; font-weight: 700; margin: 0 0 6px; }
  .lp-streak-text  { font-size: 0.82rem; opacity: 0.85; margin: 0; line-height: 1.5; }
 
  .lp-skills-wrap {
    display: flex; flex-wrap: wrap; gap: 8px;
  }
  .lp-skill-badge {
    display: inline-flex; align-items: center;
    padding: 5px 12px; border-radius: 20px;
    background: #EBF4FF; color: #4A90E2;
    font-size: 0.78rem; font-weight: 600;
  }
 
  .lp-status-msg { font-size: 0.8rem; color: #8492A6; margin-top: 8px; }
  .lp-status-msg.success { color: #16A34A; }
  .lp-status-msg.error   { color: #dc2626; }
 
  .lp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 600px) { .lp-grid-2 { grid-template-columns: 1fr; } }
  .lp-mb { margin-bottom: 14px; }
`;
 
export const Skills = () => {
  const [skills, setSkills]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
 
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        const data = await response.json();
        setSkills(data);
      } catch {
        setError("Failed to load skills.");
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);
 
  return (
    <div className="lp-card">
      <div className="lp-card-body">
        <p className="lp-section-title">Skills</p>
        {loading && <span style={{ fontSize: "0.85rem", color: "#8492A6" }}>Loading...</span>}
        {error   && <span style={{ fontSize: "0.85rem", color: "#dc2626" }}>{error}</span>}
        {!loading && !error && (
          <div className="lp-skills-wrap">
            {skills.map((skill) => (
              <span key={skill} className="lp-skill-badge">{skill}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
 
export function LearnerProfile() {
  const imageInputRef = useRef(null);
  const user      = getUserDisplayData();
  const storedUser = getStoredUser();
  const accountId  = Number(storedUser?.id || 0);
  const role       = String(storedUser?.role || "learner");
 
  const [form, setForm] = useState({
    firstName: user.firstName || "Learner",
    lastName:  user.lastName  || "",
    email:     user.email     || "",
    bio: "", location: "", phone: "",
    linkedin: "", twitter: "", github: "", image: "",
  });
  const [stats, setStats]             = useState({ courses: 0, certificates: 0, hours: "0h", score: "0%" });
  const [saved, setSaved]             = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
 
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
 
  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleChange("image", file);
  };
 
  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!accountId) return;
      try {
        const res = await fetchProfile(role, accountId);
        const data = res?.data;
        if (!mounted || !data) return;
        if (data.status && data.profile) setForm((prev) => ({ ...prev, ...data.profile }));
      } catch (err) { console.error("Failed to load profile:", err); }
    };
    loadProfile();
    return () => { mounted = false; };
  }, [accountId, role]);
 
  useEffect(() => {
    if (!accountId) return;
    const loadStats = async () => {
      try {
        const [enrollRes, certRes] = await Promise.all([
          apiRequest("enrollments"), apiRequest("certificates"),
        ]);
        const enrollData = enrollRes?.data;
        const certData   = certRes?.data;
        const enrollments = Array.isArray(enrollData) ? enrollData : Array.isArray(enrollData?.data) ? enrollData.data : [];
        const certs       = Array.isArray(certData)   ? certData   : Array.isArray(certData?.data)   ? certData.data   : [];
        const userEnrollments = enrollments.filter((e) => Number(e.user_id) === accountId);
        const userCerts       = certs.filter((c) => Number(c.user_id) === accountId);
        setStats({ courses: userEnrollments.length, certificates: userCerts.length, hours: "0h", score: "0%" });
      } catch (err) { console.error("Failed to load stats:", err); }
    };
    loadStats();
  }, [accountId]);
 
  const handleSave = async () => {
    if (!accountId) { setStatusMessage({ text: "Session user missing.", type: "error" }); return; }
    try {
      const res  = await saveProfile(role, accountId, form);
      const data = res?.data;
      if (!data) { setStatusMessage({ text: "Unexpected response from server.", type: "error" }); return; }
      if (!data.status) { setStatusMessage({ text: data.message || "Save failed.", type: "error" }); return; }
      if (data.profile) setForm((prev) => ({ ...prev, ...data.profile }));
      mergeStoredUser({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, image: form.image });
      setSaved(true);
      setStatusMessage({ text: "Profile updated successfully.", type: "success" });
      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      setStatusMessage({ text: "Save failed: " + (err.message || "Unknown error"), type: "error" });
    }
  };
 
  const statItems = [
    { icon: BookOpen, label: "Courses",      value: String(stats.courses),      bg: "#EBF4FF", color: "#4A90E2" },
    { icon: Award,    label: "Certificates", value: String(stats.certificates), bg: "#F3EBFF", color: "#7F3FBF" },
    { icon: Clock,    label: "Hours",        value: stats.hours,                bg: "#ECFDF5", color: "#16A34A" },
    { icon: Star,     label: "Score",        value: stats.score,                bg: "#FFFBEB", color: "#D97706" },
  ];
 
  const imageDisplay = form.image
    ? (typeof form.image === "string" ? form.image : URL.createObjectURL(form.image))
    : null;
 
  return (
    <div className="lp-wrap">
      <style>{styles}</style>
 
      {/* Header card */}
      <div className="lp-card">
        <div className="lp-banner" />
        <div className="lp-card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div className="lp-avatar-wrap">
              {imageDisplay ? (
                <img src={imageDisplay} className="lp-avatar-img" alt="profile"
                  onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div className="lp-avatar-initials">
                  {form.firstName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <button className="lp-camera-btn" type="button" onClick={() => imageInputRef.current?.click()}>
                <Camera size={13} />
              </button>
              <input ref={imageInputRef} type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleImageFile} />
            </div>
 
            <div style={{ textAlign: "right" }}>
              <button className={`lp-btn-save${saved ? " saved" : ""}`} onClick={handleSave} type="button">
                {saved ? "Saved ✓" : "Save Changes"}
              </button>
              {statusMessage.text && (
                <p className={`lp-status-msg ${statusMessage.type}`}>{statusMessage.text}</p>
              )}
            </div>
          </div>
 
          <div style={{ marginTop: 16 }}>
            <p className="lp-name">{form.firstName} {form.lastName}</p>
            <p className="lp-role">{form.location || "No location set"}</p>
            <p className="lp-bio">{form.bio || "No bio yet."}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {form.linkedin && <a href={form.linkedin} target="_blank" rel="noreferrer" className="lp-social-link"><Linkedin size={15} /></a>}
              {form.twitter  && <a href={form.twitter}  target="_blank" rel="noreferrer" className="lp-social-link"><Twitter  size={15} /></a>}
              {form.github   && <a href={form.github}   target="_blank" rel="noreferrer" className="lp-social-link"><Github   size={15} /></a>}
            </div>
          </div>
        </div>
      </div>
 
      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
 
        {/* Left column */}
        <div>
          {/* Personal Information */}
          <div className="lp-card">
            <div className="lp-card-body">
              <p className="lp-section-title">Personal Information</p>
              <div className="lp-grid-2">
                {[
                  { label: "First Name", key: "firstName" },
                  { label: "Last Name",  key: "lastName"  },
                  { label: "Email",      key: "email"     },
                  { label: "Phone",      key: "phone"     },
                  { label: "Location",   key: "location"  },
                ].map((item) => (
                  <div className="lp-mb" key={item.key}>
                    <label className="lp-label">{item.label}</label>
                    <input className="lp-input" value={form[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)} />
                  </div>
                ))}
              </div>
 
              <div className="lp-mb">
                <label className="lp-label">Profile Image URL</label>
                <input className="lp-input"
                  value={typeof form.image === "string" ? form.image : ""}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://..." />
              </div>
              <div className="lp-mb">
                <label className="lp-label">Or Upload Image</label>
                <input type="file" accept="image/*" className="lp-input" onChange={handleImageFile} />
              </div>
              <div>
                <label className="lp-label">Bio</label>
                <textarea className="lp-textarea" value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)} />
              </div>
            </div>
          </div>
 
          {/* Social Links */}
          <div className="lp-card">
            <div className="lp-card-body">
              <p className="lp-section-title">Social Links</p>
              {[
                { key: "linkedin", icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
                { key: "twitter",  icon: Twitter,  placeholder: "https://twitter.com/..."    },
                { key: "github",   icon: Github,   placeholder: "https://github.com/..."     },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="lp-mb" key={item.key}>
                    <div className="lp-input-group">
                      <span className="lp-input-group-icon"><Icon size={15} /></span>
                      <input value={form[item.key]} placeholder={item.placeholder}
                        onChange={(e) => handleChange(item.key, e.target.value)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
 
          {/* Skills */}
          <Skills />
        </div>
 
        {/* Right column */}
        <div>
          {/* Learning Stats */}
          <div className="lp-card">
            <div className="lp-card-body">
              <p className="lp-section-title">Learning Stats</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {statItems.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="lp-stat-item" key={s.label}>
                      <div className="lp-stat-icon" style={{ background: s.bg }}>
                        <Icon size={17} color={s.color} />
                      </div>
                      <span className="lp-stat-value">{s.value}</span>
                      <span className="lp-stat-label">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
 
          {/* Streak */}
          <div className="lp-streak-card">
            <p className="lp-streak-title">🔥 7-Day Streak</p>
            <p className="lp-streak-text">Keep learning every day to maintain your streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}