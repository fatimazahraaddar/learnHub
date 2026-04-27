import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Award,
  BookOpen,
  Clock,
  Star,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";
import {
  fetchProfile,
  getStoredUser,
  getUserDisplayData,
  mergeStoredUser,
  saveProfile,
} from "../../../../lib/api";

export function LearnerProfile() {
  const imageInputRef = useRef(null);
  const user = getUserDisplayData();
  const storedUser = getStoredUser();
  const accountId = Number(storedUser?.id || 0);
  const role = String(storedUser?.role || "learner");

  const [form, setForm] = useState({
    firstName: user.firstName || "Learner",
    lastName: user.lastName || "",
    email: user.email || "",
    bio: "Passionate learner and aspiring full-stack developer.",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    linkedin: "",
    twitter: "",
    github: "",
    image: user.image || "",
  });

  const [saved, setSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      handleChange("image", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (!accountId) return;
      const { data } = await fetchProfile(role, accountId);
      if (!mounted) return;

      if (data.status && data.profile) {
        setForm((prev) => ({ ...prev, ...data.profile }));
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [accountId, role]);

  const handleSave = async () => {
    if (!accountId) {
      setStatusMessage("Session user missing.");
      return;
    }

    const { data } = await saveProfile(role, accountId, form);

    if (!data.status) {
      setStatusMessage(data.message || "Save failed");
      return;
    }

    if (data.profile) {
      setForm((prev) => ({ ...prev, ...data.profile }));
    }

    const fullName = `${form.firstName} ${form.lastName}`.trim();
    mergeStoredUser({
      name: fullName,
      email: form.email,
      image: form.image || user.image,
    });

    setSaved(true);
    setStatusMessage("Profile updated successfully.");
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm mb-4">
        <div
          style={{
            height: "130px",
            background: "linear-gradient(135deg,#4A90E2,#7F3FBF)",
          }}
        />

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-end">
            <div className="position-relative">
              <img
                src={form.image || user.image}
                width="100"
                height="100"
                className="rounded-circle border border-3"
                alt="profile"
              />
              <button className="btn btn-dark btn-sm position-absolute bottom-0 end-0" type="button" onClick={() => imageInputRef.current?.click()}> 
                <Camera size={16} />
              </button>
            </div>

            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSave} type="button">
                {saved ? "Saved" : "Save Changes"}
              </button>
              {statusMessage ? <p className="small text-muted mb-0 mt-2">{statusMessage}</p> : null}
            </div>
          </div>

          <div className="mt-3">
            <h4>
              {form.firstName} {form.lastName}
            </h4>
            <p className="text-muted">Full-Stack Developer - {form.location}</p>
            <p>{form.bio}</p>

            <div className="d-flex gap-3">
              <a href="#"><Linkedin size={18} /></a>
              <a href="#"><Twitter size={18} /></a>
              <a href="#"><Github size={18} /></a>
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
                  { label: "Last Name", key: "lastName" },
                  { label: "Email", key: "email" },
                  { label: "Phone", key: "phone" },
                  { label: "Location", key: "location" },
                ].map((item) => (
                  <div className="col-md-6 mb-3" key={item.key}>
                    <label className="form-label">{item.label}</label>
                    <input
                      className="form-control"
                      value={form[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label">Profile Image URL</label>
                <input
                  className="form-control"
                  value={form.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Or Upload Image</label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageFile}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Social Links</h5>

              {[
                { key: "linkedin", icon: Linkedin },
                { key: "twitter", icon: Twitter },
                { key: "github", icon: Github },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="input-group mb-3" key={item.key}>
                    <span className="input-group-text">
                      <Icon size={18} />
                    </span>
                    <input
                      className="form-control"
                      value={form[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                    />
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
                  { icon: BookOpen, label: "Courses", value: "6" },
                  { icon: Award, label: "Certificates", value: "2" },
                  { icon: Clock, label: "Hours", value: "48h" },
                  { icon: Star, label: "Score", value: "94%" },
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

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">Skills</h5>
              <div className="d-flex flex-wrap gap-2">
                {["HTML/CSS", "JavaScript", "React", "Python", "SEO", "UI Design"].map((skill) => (
                  <span key={skill} className="badge bg-primary">
                    {skill}
                  </span>
                ))}
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


