import { useEffect, useRef, useState } from "react";
import {
  Camera, Award, BookOpen, Clock, Star, Linkedin, Twitter, Github,
} from "lucide-react";
import {
  fetchProfile, getStoredUser, getUserDisplayData, mergeStoredUser, saveProfile, apiRequest,
} from "../../../../api";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .tp-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .tp-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .tp-card-body { padding: 20px 24px; }
 
  .tp-banner {
    height: 130px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
  }
 
  .tp-avatar-wrap {
    position: relative;
    width: 96px;
    height: 96px;
    margin-top: -48px;
  }
  .tp-avatar-img {
    width: 96px; height: 96px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .tp-avatar-initials {
    width: 96px; height: 96px;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 2rem; font-weight: 700;
  }
  .tp-camera-btn {
    position: absolute; bottom: 0; right: 0;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #1A202C;
    border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff;
    transition: background 0.15s;
  }
  .tp-camera-btn:hover { background: #2D3748; }
 
  .tp-name { font-size: 1.25rem; font-weight: 700; color: #1A202C; margin: 0 0 2px; }
  .tp-role { font-size: 0.85rem; color: #8492A6; margin: 0 0 8px; }
  .tp-bio  { font-size: 0.875rem; color: #4A5568; margin: 0 0 12px; line-height: 1.6; }
 
  .tp-social-link {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px;
    border-radius: 9px;
    border: 1px solid #E8ECF0;
    background: #F6F8FA;
    color: #5A6A7E;
    text-decoration: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .tp-social-link:hover { background: #F0F4FF; border-color: #C5D5F5; color: #4A90E2; }
 
  .tp-btn-save {
    padding: 9px 20px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
    transition: opacity 0.15s, transform 0.15s;
  }
  .tp-btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
  .tp-btn-save.saved {
    background: linear-gradient(135deg, #16A34A, #15803d);
    box-shadow: 0 2px 8px rgba(22,163,74,0.3);
  }
 
  .tp-section-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1A202C;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #F0F3F7;
  }
 
  .tp-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    color: #4A5568;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .tp-input, .tp-textarea {
    width: 100%;
    padding: 9px 13px;
    border: 1px solid #E2E8F0;
    border-radius: 9px;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    color: #1A202C;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
    background: #fff;
  }
  .tp-input:focus, .tp-textarea:focus {
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74,144,226,0.12);
  }
  .tp-textarea { resize: vertical; min-height: 80px; }
 
  .tp-input-group {
    display: flex;
    align-items: center;
    border: 1px solid #E2E8F0;
    border-radius: 9px;
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .tp-input-group:focus-within {
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74,144,226,0.12);
  }
  .tp-input-group-icon {
    display: flex; align-items: center; justify-content: center;
    padding: 0 12px;
    background: #F6F8FA;
    border-right: 1px solid #E2E8F0;
    color: #8492A6;
    height: 38px;
  }
  .tp-input-group input {
    flex: 1;
    padding: 9px 13px;
    border: none;
    outline: none;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    color: #1A202C;
    background: transparent;
  }
 
  .tp-stat-item {
    display: flex; flex-direction: column; align-items: center;
    padding: 14px 8px;
    border-radius: 10px;
    background: #F6F8FA;
    transition: background 0.15s;
  }
  .tp-stat-item:hover { background: #EEF1F5; }
  .tp-stat-icon {
    width: 36px; height: 36px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 8px;
  }
  .tp-stat-value { font-size: 1.1rem; font-weight: 700; color: #1A202C; }
  .tp-stat-label { font-size: 0.72rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }
 
  .tp-streak-card {
    border-radius: 14px;
    padding: 20px 24px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff;
  }
  .tp-streak-title { font-size: 1rem; font-weight: 700; margin: 0 0 6px; }
  .tp-streak-text  { font-size: 0.82rem; opacity: 0.85; margin: 0; line-height: 1.5; }
 
  .tp-status-msg { font-size: 0.8rem; color: #8492A6; margin-top: 8px; }
  .tp-status-msg.success { color: #16A34A; }
  .tp-status-msg.error   { color: #dc2626; }
 
  .tp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 600px) { .tp-grid-2 { grid-template-columns: 1fr; } }
  .tp-mb { margin-bottom: 14px; }
`;
 
export function TrainerProfile() {
  const imageInputRef = useRef(null);
  const user = getUserDisplayData();
  const storedUser = getStoredUser();
  const accountId = Number(storedUser?.id || 0);
  const role = String(storedUser?.role || "trainer");
 
  const [form, setForm] = useState({
    firstName:  user.firstName || "Trainer",
    lastName:   user.lastName  || "",
    email:      user.email     || "",
    bio:        "Passionate trainer helping students achieve real progress.",
    location:   "Casablanca, Morocco",
    phone:      "+212 600000000",
    linkedin:   "",
    twitter:    "",
    github:     "",
    image:      user.image || "",
    image_file: null,
  });
 
  const [stats, setStats] = useState({ courses: 0, certificates: 0, hours: "0h", score: "0%" });
  const [saved, setSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
 
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
 
  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image_file: file, image: URL.createObjectURL(file) }));
  };
 
  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!accountId) return;
      const { data } = await fetchProfile(role, accountId);
      if (!mounted) return;
      if (data.status && data.profile) setForm((prev) => ({ ...prev, ...data.profile }));
    };
    loadProfile();
    return () => { mounted = false; };
  }, [accountId, role]);
 
  useEffect(() => {
    if (!accountId) return;
    const loadStats = async () => {
      const [coursesRes, certsRes] = await Promise.all([
        apiRequest("courses"),
        apiRequest("certificates"),
      ]);
      const courses = Array.isArray(coursesRes.data) ? coursesRes.data
        : Array.isArray(coursesRes.data?.data) ? coursesRes.data.data : [];
      const certs = Array.isArray(certsRes.data) ? certsRes.data
        : Array.isArray(certsRes.data?.data) ? certsRes.data.data : [];
      const trainerCourses = courses.filter((c) => Number(c.trainer_id) === accountId);
      const trainerCerts   = certs.filter((c) => Number(c.trainer_id) === accountId);
      setStats({ courses: trainerCourses.length, certificates: trainerCerts.length, hours: "0h", score: "0%" });
    };
    loadStats();
  }, [accountId]);
 
  const handleSave = async () => {
    if (!accountId) { setStatusMessage({ text: "Session user missing.", type: "error" }); return; }
    const formToSave = { ...form };
    if (form.image_file) formToSave.image = form.image_file;
    const { data } = await saveProfile(role, accountId, formToSave);
    if (!data.status) { setStatusMessage({ text: data.message || "Save failed.", type: "error" }); return; }
    if (data.profile) setForm((prev) => ({ ...prev, ...data.profile, image_file: null }));
    mergeStoredUser({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, image: form.image });
    setSaved(true);
    setStatusMessage({ text: "Profile updated successfully.", type: "success" });
    setTimeout(() => setSaved(false), 1600);
  };
 
  const statItems = [
    { icon: BookOpen, label: "Courses",      value: String(stats.courses),      bg: "#EBF4FF", color: "#4A90E2" },
    { icon: Award,    label: "Certificates", value: String(stats.certificates), bg: "#F3EBFF", color: "#7F3FBF" },
    { icon: Clock,    label: "Hours",        value: stats.hours,                bg: "#ECFDF5", color: "#16A34A" },
    { icon: Star,     label: "Score",        value: stats.score,                bg: "#FFFBEB", color: "#D97706" },
  ];
 
  return (
    <div className="tp-wrap">
      <style>{styles}</style>
 
      {/* ── Header card ── */}
      <div className="tp-card">
        <div className="tp-banner" />
        <div className="tp-card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
 
            {/* Avatar */}
            <div className="tp-avatar-wrap">
              {form.image ? (
                <img src={form.image} className="tp-avatar-img" alt="profile"
                  onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div className="tp-avatar-initials">
                  {form.firstName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <button className="tp-camera-btn" type="button" onClick={() => imageInputRef.current?.click()}>
                <Camera size={13} />
              </button>
              <input ref={imageInputRef} type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleImageFile} />
            </div>
 
            {/* Save */}
            <div style={{ textAlign: "right" }}>
              <button className={`tp-btn-save${saved ? " saved" : ""}`} onClick={handleSave} type="button">
                {saved ? "Saved ✓" : "Save Changes"}
              </button>
              {statusMessage.text && (
                <p className={`tp-status-msg ${statusMessage.type}`}>{statusMessage.text}</p>
              )}
            </div>
          </div>
 
          {/* Info */}
          <div style={{ marginTop: 16 }}>
            <p className="tp-name">{form.firstName} {form.lastName}</p>
            <p className="tp-role">Course Trainer · {form.location || "No location set"}</p>
            <p className="tp-bio">{form.bio || "No bio yet."}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {form.linkedin && <a href={form.linkedin} target="_blank" rel="noreferrer" className="tp-social-link"><Linkedin size={15} /></a>}
              {form.twitter  && <a href={form.twitter}  target="_blank" rel="noreferrer" className="tp-social-link"><Twitter  size={15} /></a>}
              {form.github   && <a href={form.github}   target="_blank" rel="noreferrer" className="tp-social-link"><Github   size={15} /></a>}
            </div>
          </div>
        </div>
      </div>
 
      {/* ── Main content ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
 
        {/* Left column */}
        <div>
          {/* Personal Information */}
          <div className="tp-card">
            <div className="tp-card-body">
              <p className="tp-section-title">Personal Information</p>
              <div className="tp-grid-2">
                {[
                  { label: "First Name", key: "firstName" },
                  { label: "Last Name",  key: "lastName"  },
                  { label: "Email",      key: "email"     },
                  { label: "Phone",      key: "phone"     },
                  { label: "Location",   key: "location"  },
                ].map((item) => (
                  <div className="tp-mb" key={item.key}>
                    <label className="tp-label">{item.label}</label>
                    <input className="tp-input" value={form[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)} />
                  </div>
                ))}
              </div>
 
              <div className="tp-mb">
                <label className="tp-label">Profile Image URL</label>
                <input className="tp-input"
                  value={typeof form.image === "string" ? form.image : ""}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://..." />
              </div>
              <div className="tp-mb">
                <label className="tp-label">Or Upload Image</label>
                <input type="file" accept="image/*" className="tp-input"
                  onChange={handleImageFile} />
              </div>
              <div>
                <label className="tp-label">Bio</label>
                <textarea className="tp-textarea" value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)} />
              </div>
            </div>
          </div>
 
          {/* Social Links */}
          <div className="tp-card">
            <div className="tp-card-body">
              <p className="tp-section-title">Social Links</p>
              {[
                { key: "linkedin", icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
                { key: "twitter",  icon: Twitter,  placeholder: "https://twitter.com/..."    },
                { key: "github",   icon: Github,   placeholder: "https://github.com/..."     },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="tp-mb" key={item.key}>
                    <div className="tp-input-group">
                      <span className="tp-input-group-icon"><Icon size={15} /></span>
                      <input value={form[item.key]} placeholder={item.placeholder}
                        onChange={(e) => handleChange(item.key, e.target.value)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
 
        {/* Right column */}
        <div>
          {/* Trainer Stats */}
          <div className="tp-card">
            <div className="tp-card-body">
              <p className="tp-section-title">Trainer Stats</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {statItems.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="tp-stat-item" key={s.label}>
                      <div className="tp-stat-icon" style={{ background: s.bg }}>
                        <Icon size={17} color={s.color} />
                      </div>
                      <span className="tp-stat-value">{s.value}</span>
                      <span className="tp-stat-label">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
 
          {/* Streak card */}
          <div className="tp-streak-card">
            <p className="tp-streak-title">🔥 7-Day Streak</p>
            <p className="tp-streak-text">Keep teaching every day to maintain your streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}