import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Shield,
  Mail,
  Phone,
  MapPin,
  Save,
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

export function AdminProfile() {
  const imageInputRef = useRef(null);
  const user = getUserDisplayData();
  const storedUser = getStoredUser();
  const accountId = Number(storedUser?.id || 0);
  const role = String(storedUser?.role || "admin");

  const [form, setForm] = useState({
    firstName: user.firstName || "Admin",
    lastName: user.lastName || "",
    email: user.email || "",
    roleTitle: "Platform Administrator",
    bio: "Responsible for platform operations, moderation, and growth.",
    location: "Casablanca, Morocco",
    phone: "+212 600000000",
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
            background: "linear-gradient(135deg,#FF7A00,#FF9A40)",
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
            <button className="btn btn-warning text-white" onClick={handleSave} type="button">
              <Save size={16} className="me-1" />
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>

          <div className="mt-3">
            <h4>
              {form.firstName} {form.lastName}
            </h4>
            <p className="text-muted mb-1">{form.roleTitle}</p>
            <p className="text-muted">{form.bio}</p>
            {statusMessage ? <p className="small text-muted mb-0">{statusMessage}</p> : null}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">Admin Information</h5>

              <div className="row">
                {[
                  { label: "First Name", key: "firstName", icon: Shield },
                  { label: "Last Name", key: "lastName", icon: Shield },
                  { label: "Email", key: "email", icon: Mail },
                  { label: "Phone", key: "phone", icon: Phone },
                  { label: "Location", key: "location", icon: MapPin },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="col-md-6 mb-3" key={item.key}>
                      <label className="form-label d-flex align-items-center gap-2">
                        <Icon size={14} />
                        {item.label}
                      </label>
                      <input
                        className="form-control"
                        value={form[item.key]}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mb-3">
                <label className="form-label">Role Title</label>
                <input
                  className="form-control"
                  value={form.roleTitle}
                  onChange={(e) => handleChange("roleTitle", e.target.value)}
                />
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
                { key: "linkedin", icon: Linkedin, placeholder: "LinkedIn URL" },
                { key: "twitter", icon: Twitter, placeholder: "Twitter / X URL" },
                { key: "github", icon: Github, placeholder: "GitHub URL" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="input-group mb-3" key={item.key}>
                    <span className="input-group-text">
                      <Icon size={18} />
                    </span>
                    <input
                      className="form-control"
                      placeholder={item.placeholder}
                      value={form[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


