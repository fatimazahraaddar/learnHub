import { useEffect, useRef, useState } from "react";
import { Camera, Shield, Mail, Phone, MapPin, Save, Linkedin, Twitter, Github, Loader2 } from "lucide-react";
import { fetchProfile, getUserDisplayData, mergeStoredUser, saveProfile } from "../../../../lib/api";

const INFO_FIELDS = [
  { label: "First Name", key: "firstName", Icon: Shield },
  { label: "Last Name", key: "lastName", Icon: Shield },
  { label: "Email", key: "email", Icon: Mail },
  { label: "Phone", key: "phone", Icon: Phone },
  { label: "Location", key: "location", Icon: MapPin },
];

const SOCIAL_FIELDS = [
  { key: "linkedin", Icon: Linkedin, placeholder: "LinkedIn URL" },
  { key: "twitter", Icon: Twitter, placeholder: "Twitter / X URL" },
  { key: "github", Icon: Github, placeholder: "GitHub URL" },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  roleTitle: "Platform Administrator",
  bio: "",
  location: "",
  phone: "",
  linkedin: "",
  twitter: "",
  github: "",
  image: "",
};

export function AdminProfile() {
  const imageInputRef = useRef(null);
  const user = getUserDisplayData();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { ok, data } = await fetchProfile();
      if (cancelled) return;
      if (ok && data?.status && data.profile) {
        setForm((prev) => ({ ...prev, ...data.profile }));
      } else {
        setError(data?.message || "Failed to load profile.");
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm(prev => ({ ...prev, imageFile: file }));

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm(prev => ({ ...prev, imagePreview: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setStatusMessage("");

    const submissionData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      location: form.location,
      bio: form.bio,
      linkedin: form.linkedin,
      twitter: form.twitter,
      github: form.github,
      image: form.imageFile instanceof File ? form.imageFile : null
    };

    const { ok, data } = await saveProfile(null, null, submissionData);

    setSaving(false);

    if (!ok || !data?.status) {
      setError(data?.message || "Validation Error. Check your data.");
      return;
    }

    if (data.profile) {
      setForm((prev) => ({
        ...prev,
        ...data.profile,
        imagePreview: null,
        imageFile: null
      }));
    }

    setStatusMessage("Profile updated successfully!");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const initials = (form.firstName || user.firstName || "A").charAt(0).toUpperCase();
  const fullName = `${form.firstName} ${form.lastName}`.trim() || user.fullName;

  if (loading) return (
    <div className="text-center py-5">
      <Loader2 size={32} className="text-primary" />
      <p className="text-muted mt-2">Loading profile...</p>
    </div>
  );

  return (
    <div className="container my-4">

      {error && <div className="alert alert-danger  py-2">{error}</div>}
      {statusMessage && <div className="alert alert-success py-2">{statusMessage}</div>}

      <div className="card shadow-sm mb-4">
        <div style={{ height: 130, background: "linear-gradient(135deg,#FF7A00,#FF9A40)" }} />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-end">

            <div className="position-relative" style={{ marginTop: -50 }}>
              {(form.imagePreview || form.image) ? (
                <img
                  src={`http://localhost:8000/storage/${form.image ?? form.imagePreview}`}
                  width={100} height={100}
                  className="rounded-circle border border-3 border-white object-fit-cover"
                  alt="profile"
                />
              ) : (
                <div
                  className="rounded-circle border border-3 border-white d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: 100, height: 100, fontSize: 36, background: "linear-gradient(135deg,#FF7A00,#FF9A40)" }}
                >
                  {initials}
                </div>
              )}
              <button
                className="btn btn-dark btn-sm position-absolute bottom-0 end-0"
                type="button"
                onClick={() => imageInputRef.current?.click()}
              >
                <Camera size={14} />
              </button>
            </div>

            <button
              className="btn btn-warning text-white d-flex align-items-center gap-1"
              onClick={handleSave}
              disabled={saving}
              type="button"
            >
              {saving
                ? <><span className="spinner-border spinner-border-sm" /> Saving...</>
                : <><Save size={16} /> {saved ? "Saved ✓" : "Save Changes"}</>
              }
            </button>
          </div>

          <div className="mt-3">
            <h4>{fullName}</h4>
            <p className="text-muted mb-1">{form.roleTitle}</p>
            <p className="text-muted small mb-0">{form.bio}</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">Admin Information</h5>
              <div className="row">
                {INFO_FIELDS.map((field) => (
                  <div className="col-md-6 mb-3" key={field.key}>
                    <label className="form-label d-flex align-items-center gap-2">
                      <field.Icon size={14} /> {field.label}
                    </label>
                    <input
                      className="form-control"
                      value={form[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  </div>
                ))}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Role Title</label>
                  <input
                    className="form-control"
                    value={form.roleTitle || ""}
                    onChange={(e) => handleChange("roleTitle", e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Profile Image URL</label>
                <input
                  className="form-control"
                  value={form.image || ""}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="mb-0">
                <label className="form-label">Or Upload Image</label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageFile}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Social Links</h5>
              {SOCIAL_FIELDS.map((field) => (
                <div className="input-group mb-3" key={field.key}>
                  <span className="input-group-text"><field.Icon size={18} /></span>
                  <input
                    className="form-control"
                    placeholder={field.placeholder}
                    value={form[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}