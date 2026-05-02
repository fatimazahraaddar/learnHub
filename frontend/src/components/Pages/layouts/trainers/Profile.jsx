import { useEffect, useRef, useState } from "react";
import {
  Camera, Award, BookOpen, Clock, Star, Linkedin, Twitter, Github,
} from "lucide-react";
import {
  fetchProfile, getStoredUser, getUserDisplayData, mergeStoredUser, saveProfile, apiRequest,
} from "../../../../api";
 
export function TrainerProfile() {
  const imageInputRef = useRef(null);
  const user = getUserDisplayData();
  const storedUser = getStoredUser();
  const accountId = Number(storedUser?.id || 0);
  const role = String(storedUser?.role || "trainer");
 
  const [form, setForm] = useState({
    firstName: user.firstName || "Trainer",
    lastName:  user.lastName  || "",
    email:     user.email     || "",
    bio:       "Passionate trainer helping students achieve real progress.",
    location:  "Casablanca, Morocco",
    phone:     "+212 600000000",
    linkedin:  "",
    twitter:   "",
    github:    "",
    image:     user.image || "",
    image_file: null,
  });
 
  const [stats, setStats] = useState({ courses: 0, certificates: 0, hours: "0h", score: "0%" });
  const [saved, setSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
 
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
 
      const trainerCourses = courses.filter(c => Number(c.trainer_id) === accountId);
      const trainerCerts   = certs.filter(c => Number(c.trainer_id) === accountId);
 
      setStats({
        courses:      trainerCourses.length,
        certificates: trainerCerts.length,
        hours:        "0h",
        score:        "0%",
      });
    };
    loadStats();
  }, [accountId]);
 
  const handleSave = async () => {
    if (!accountId) { setStatusMessage("Session user missing."); return; }
    const formToSave = { ...form };
    if (form.image_file) {
      formToSave.image = form.image_file;
    }
    const { data } = await saveProfile(role, accountId, formToSave);
    if (!data.status) { setStatusMessage(data.message || "Save failed"); return; }
    if (data.profile) setForm((prev) => ({ ...prev, ...data.profile, image_file: null }));
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    mergeStoredUser({ name: fullName, email: form.email, image: form.image });
    setSaved(true);
    setStatusMessage("Profile updated successfully.");
    setTimeout(() => setSaved(false), 1600);
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
                  src={form.image} width="100" height="100"
                  className="rounded-circle border border-3" alt="profile"
                  style={{ objectFit: "cover" }}
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
            <p className="text-muted">Course Trainer - {form.location || "No location set"}</p>
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
                <input className="form-control" value={typeof form.image === "string" ? form.image : ""}
                  onChange={(e) => handleChange("image", e.target.value)} placeholder="https://..." />
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
              <h5 className="mb-3">Trainer Stats</h5>
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
              <p className="small">Keep teaching every day to maintain your streak</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}