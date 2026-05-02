import { useEffect, useRef, useState } from "react";
import {
  Camera, Award, BookOpen, Clock, Star, Linkedin, Twitter, Github,
} from "lucide-react";
import {
  fetchProfile, getStoredUser, getUserDisplayData, mergeStoredUser, saveProfile, apiRequest,
} from "../../../../api";
 
export const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        const data = await response.json();
        setSkills(data);
      } catch {
        setError("Erreur lors du chargement des skills");
      } finally {
        setLoading(false);
      }
    };
 
    fetchSkills();
  }, []);
 
  if (loading) return <div className="card mb-4"><div className="card-body">Chargement...</div></div>;
  if (error) return <div className="card mb-4"><div className="card-body text-danger">{error}</div></div>;
 
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="mb-3">Skills</h5>
        <div className="d-flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="badge bg-primary">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export function LearnerProfile() {
  const imageInputRef = useRef(null);
  const user = getUserDisplayData();
  const storedUser = getStoredUser();
  const accountId = Number(storedUser?.id || 0);
  const role = String(storedUser?.role || "learner");
 
  const [form, setForm] = useState({
    firstName: user.firstName || "Learner",
    lastName:  user.lastName  || "",
    email:     user.email     || "",
    bio:       "",
    location:  "",
    phone:     "",
    linkedin:  "",
    twitter:   "",
    github:    "",
    image:     "",
  });
 
  const [stats, setStats] = useState({ courses: 0, certificates: 0, hours: "0h", score: "0%" });
  const [saved, setSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
 
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
 
  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleChange("image", file);
  };
 
  // ✅ FIX: wrapped in try/catch, safe optional chaining on res?.data
  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!accountId) return;
      try {
        const res = await fetchProfile(role, accountId);
        const data = res?.data;
        if (!mounted || !data) return;
        if (data.status && data.profile) setForm((prev) => ({ ...prev, ...data.profile }));
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
    return () => { mounted = false; };
  }, [accountId, role]);
 
  // ✅ FIX: wrapped in try/catch, safe optional chaining on each res?.data
  useEffect(() => {
    if (!accountId) return;
    const loadStats = async () => {
      try {
        const [enrollRes, certRes] = await Promise.all([
          apiRequest("enrollments"),
          apiRequest("certificates"),
        ]);
 
        const enrollData = enrollRes?.data;
        const certData   = certRes?.data;
 
        const enrollments = Array.isArray(enrollData) ? enrollData
          : Array.isArray(enrollData?.data) ? enrollData.data : [];
        const certs = Array.isArray(certData) ? certData
          : Array.isArray(certData?.data) ? certData.data : [];
 
        const userEnrollments = enrollments.filter(e => Number(e.user_id) === accountId);
        const userCerts       = certs.filter(c => Number(c.user_id) === accountId);
 
        setStats({
          courses:      userEnrollments.length,
          certificates: userCerts.length,
          hours:        "0h",
          score:        "0%",
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    loadStats();
  }, [accountId]);
 
  // ✅ FIX: wrapped in try/catch, safe optional chaining on res?.data
  const handleSave = async () => {
    if (!accountId) { setStatusMessage("Session user missing."); return; }
 
    try {
      const res = await saveProfile(role, accountId, form);
      const data = res?.data;
 
      if (!data) {
        setStatusMessage("Unexpected response from server.");
        return;
      }
 
      if (!data.status) {
        setStatusMessage(data.message || "Save failed");
        return;
      }
 
      if (data.profile) setForm((prev) => ({ ...prev, ...data.profile }));
 
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      mergeStoredUser({ name: fullName, email: form.email, image: form.image });
      setSaved(true);
      setStatusMessage("Profile updated successfully.");
      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      console.error("Save error:", err);
      setStatusMessage("Save failed: " + (err.message || "Unknown error"));
    }
  };
 
  return (
    <div className="container my-4">
      <div className="card shadow-sm mb-4">
        <div style={{ height: "130px", background: "linear-gradient(135deg,#4A90E2,#7F3FBF)" }} />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-end">
            <div className="position-relative" style={{ width: 100, height: 100 }}>
              {form.image ? (
                <img
                  src={typeof form.image === "string" ? form.image : URL.createObjectURL(form.image)}
                  width="100" height="100"
                  className="rounded-circle border border-3" alt="profile"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div
                  className="rounded-circle border border-3 d-flex align-items-center justify-content-center bg-secondary text-white"
                  style={{ width: 100, height: 100, fontSize: 36 }}
                >
                  {form.firstName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <button className="btn btn-dark btn-sm position-absolute bottom-0 end-0" type="button"
                onClick={() => imageInputRef.current?.click()}>
                <Camera size={16} />
              </button>
            </div>
            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSave} type="button">
                {saved ? "Saved ✓" : "Save Changes"}
              </button>
              {statusMessage && <p className="small text-muted mb-0 mt-2">{statusMessage}</p>}
            </div>
          </div>
 
          <div className="mt-3">
            <h4>{form.firstName} {form.lastName}</h4>
            <p className="text-muted">{form.location || "No location set"}</p>
            <p>{form.bio || "No bio yet."}</p>
            <div className="d-flex gap-3">
              {form.linkedin && <a href={form.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
              {form.twitter  && <a href={form.twitter}  target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
              {form.github   && <a href={form.github}   target="_blank" rel="noreferrer"><Github   size={18} /></a>}
            </div>
          </div>
        </div>
      </div>
 
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">Personal Information</h5>
              <div className="row">
                {[
                  { label: "First Name", key: "firstName" },
                  { label: "Last Name",  key: "lastName"  },
                  { label: "Email",      key: "email"     },
                  { label: "Phone",      key: "phone"     },
                  { label: "Location",   key: "location"  },
                ].map((item) => (
                  <div className="col-md-6 mb-3" key={item.key}>
                    <label className="form-label">{item.label}</label>
                    <input className="form-control" value={form[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)} />
                  </div>
                ))}
              </div>
 
              <div className="mb-3">
                <label className="form-label">Profile Image URL</label>
                <input className="form-control"
                  value={typeof form.image === "string" ? form.image : ""}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://..." />
              </div>
              <div className="mb-3">
                <label className="form-label">Or Upload Image</label>
                <input ref={imageInputRef} type="file" accept="image/*"
                  className="form-control" onChange={handleImageFile} />
              </div>
              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea className="form-control" rows="3" value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)} />
              </div>
            </div>
          </div>
 
          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Social Links</h5>
              {[
                { key: "linkedin", icon: Linkedin },
                { key: "twitter",  icon: Twitter  },
                { key: "github",   icon: Github   },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="input-group mb-3" key={item.key}>
                    <span className="input-group-text"><Icon size={18} /></span>
                    <input className="form-control" value={form[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
 
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">Learning Stats</h5>
              <div className="row text-center">
                {[
                  { icon: BookOpen, label: "Courses",      value: String(stats.courses)      },
                  { icon: Award,    label: "Certificates", value: String(stats.certificates) },
                  { icon: Clock,    label: "Hours",        value: stats.hours                },
                  { icon: Star,     label: "Score",        value: stats.score                },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="col-6 mb-3" key={s.label}>
                      <Icon size={22} />
                      <h5>{s.value}</h5>
                      <small className="text-muted">{s.label}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
 
          <div className="card text-white" style={{ background: "linear-gradient(135deg,#4A90E2,#7F3FBF)" }}>
            <div className="card-body">
              <h6>7-Day Streak</h6>
              <p className="small">Keep learning every day to maintain your streak</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}