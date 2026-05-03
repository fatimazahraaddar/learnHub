import { useEffect, useRef, useState } from "react";
import { Camera, Shield, Mail, Phone, MapPin, Save, Linkedin, Twitter, Github, Loader2 } from "lucide-react";
import { fetchProfile, getUserDisplayData, saveProfile } from "../../../../api";
 
const INFO_FIELDS = [
  { label: "First Name", key: "firstName", Icon: Shield },
  { label: "Last Name",  key: "lastName",  Icon: Shield },
  { label: "Email",      key: "email",     Icon: Mail   },
  { label: "Phone",      key: "phone",     Icon: Phone  },
  { label: "Location",   key: "location",  Icon: MapPin },
];
 
const SOCIAL_FIELDS = [
  { key: "linkedin", Icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
  { key: "twitter",  Icon: Twitter,  placeholder: "https://twitter.com/..."    },
  { key: "github",   Icon: Github,   placeholder: "https://github.com/..."     },
];
 
const EMPTY_FORM = {
  firstName: "", lastName: "", email: "",
  roleTitle: "Platform Administrator",
  bio: "", location: "", phone: "",
  linkedin: "", twitter: "", github: "",
  image: "", image_file: null, imagePreview: null,
};
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .ap-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .ap-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .ap-card-body { padding: 20px 24px; }
 
  .ap-banner {
    height: 130px;
    background: linear-gradient(135deg, #FF7A00, #FF9A40);
  }
 
  .ap-avatar-wrap { position: relative; width: 96px; height: 96px; margin-top: -48px; }
  .ap-avatar-img {
    width: 96px; height: 96px;
    border-radius: 50%; object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .ap-avatar-initials {
    width: 96px; height: 96px;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    background: linear-gradient(135deg, #FF7A00, #FF9A40);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 2rem; font-weight: 700;
  }
  .ap-camera-btn {
    position: absolute; bottom: 0; right: 0;
    width: 28px; height: 28px; border-radius: 50%;
    background: #1A202C; border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff; transition: background 0.15s;
  }
  .ap-camera-btn:hover { background: #2D3748; }
 
  .ap-name  { font-size: 1.25rem; font-weight: 700; color: #1A202C; margin: 0 0 2px; }
  .ap-role  { font-size: 0.85rem; color: #8492A6; margin: 0 0 8px; }
  .ap-bio   { font-size: 0.875rem; color: #4A5568; margin: 0 0 12px; line-height: 1.6; }
 
  .ap-social-link {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 9px;
    border: 1px solid #E8ECF0; background: #F6F8FA;
    color: #5A6A7E; text-decoration: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .ap-social-link:hover { background: #FFF3E8; border-color: #FFD0A8; color: #FF7A00; }
 
  .ap-btn-save {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 20px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #FF7A00, #FF9A40);
    color: #fff; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 8px rgba(255,122,0,0.3);
    transition: opacity 0.15s, transform 0.15s;
  }
  .ap-btn-save:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .ap-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
  .ap-btn-save.saved { background: linear-gradient(135deg, #16A34A, #15803d); box-shadow: 0 2px 8px rgba(22,163,74,0.3); }
 
  .ap-section-title {
    font-size: 1rem; font-weight: 700; color: #1A202C;
    margin: 0 0 16px; padding-bottom: 12px;
    border-bottom: 1px solid #F0F3F7;
  }
 
  .ap-label {
    display: block; font-size: 0.78rem; font-weight: 600;
    color: #4A5568; margin-bottom: 6px;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .ap-input, .ap-textarea {
    width: 100%; padding: 9px 13px;
    border: 1px solid #E2E8F0; border-radius: 9px;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    color: #1A202C; outline: none; box-sizing: border-box; background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .ap-input:focus, .ap-textarea:focus {
    border-color: #FF7A00;
    box-shadow: 0 0 0 3px rgba(255,122,0,0.12);
  }
  .ap-textarea { resize: vertical; min-height: 80px; }
 
  .ap-input-group {
    display: flex; align-items: center;
    border: 1px solid #E2E8F0; border-radius: 9px; overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .ap-input-group:focus-within {
    border-color: #FF7A00;
    box-shadow: 0 0 0 3px rgba(255,122,0,0.12);
  }
  .ap-input-group-icon {
    display: flex; align-items: center; justify-content: center;
    padding: 0 12px; background: #F6F8FA;
    border-right: 1px solid #E2E8F0; color: #8492A6; height: 38px;
  }
  .ap-input-group input {
    flex: 1; padding: 9px 13px; border: none; outline: none;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    color: #1A202C; background: transparent;
  }
 
  .ap-alert {
    padding: 10px 14px; border-radius: 9px;
    font-size: 0.85rem; font-weight: 500; margin-bottom: 16px;
  }
  .ap-alert.error   { background: #FFF5F5; border: 1px solid #FED7D7; color: #dc2626; }
  .ap-alert.success { background: #ECFDF5; border: 1px solid #A7F3D0; color: #16A34A; }
 
  .ap-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 0; gap: 12px;
    color: #8492A6; font-size: 0.875rem;
  }
 
  .ap-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 600px) { .ap-grid-2 { grid-template-columns: 1fr; } }
  .ap-mb { margin-bottom: 14px; }
`;
 
export function AdminProfile() {
  const imageInputRef = useRef(null);
  const user = getUserDisplayData();
 
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageTimestamp, setImageTimestamp] = useState(() => Date.now());
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState("");
  const [statusMessage, setStatusMessage] = useState("");
 
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { ok, data } = await fetchProfile();
      if (cancelled) return;
      if (ok && data?.status && data.profile) setForm((prev) => ({ ...prev, ...data.profile }));
      else setError(data?.message || "Failed to load profile.");
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);
 
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
 
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image_file: file, imagePreview: URL.createObjectURL(file) }));
  };
 
  const handleSave = async () => {
    setSaving(true); setError(""); setStatusMessage("");
    const submissionData = {
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, phone: form.phone, location: form.location,
      bio: form.bio, linkedin: form.linkedin, twitter: form.twitter, github: form.github,
      image: form.image_file instanceof File ? form.image_file : form.image,
    };
    const { data } = await saveProfile("admin", null, submissionData);
    setSaving(false);
    if (!data?.status) { setError(data?.message || "Validation Error. Check your data."); return; }
    const updatedUser = data.profile || data;
    if (updatedUser?.id || updatedUser?.image !== undefined) {
      const [first = "", ...rest] = (updatedUser.name || "").split(" ");
      setForm((prev) => ({
        ...prev,
        image: updatedUser.image || prev.image,
        firstName: updatedUser.firstName || first || prev.firstName,
        lastName: updatedUser.lastName || rest.join(" ") || prev.lastName,
        email: updatedUser.email ?? prev.email,
        phone: updatedUser.phone ?? prev.phone,
        location: updatedUser.location ?? prev.location,
        bio: updatedUser.bio ?? prev.bio,
        linkedin: updatedUser.linkedin ?? prev.linkedin,
        twitter: updatedUser.twitter ?? prev.twitter,
        github: updatedUser.github ?? prev.github,
        imagePreview: null, image_file: null,
      }));
    }
    setImageTimestamp(Date.now());
    setStatusMessage("Profile updated successfully!");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
 
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://"))
      return `${path}${path.includes("?") ? "&" : "?"}t=${imageTimestamp}`;
    if (path.startsWith("/storage/")) return `http://localhost:8000${path}?t=${imageTimestamp}`;
    return `http://localhost:8000/storage/${path}?t=${imageTimestamp}`;
  };
 
  const displayImage = form.imagePreview || buildImageUrl(form.image);
  const initials = (form.firstName || user.firstName || "A").charAt(0).toUpperCase();
  const fullName = `${form.firstName} ${form.lastName}`.trim() || user.fullName;
 
  if (loading) return (
    <div className="ap-wrap">
      <style>{styles}</style>
      <div className="ap-loading">
        <Loader2 size={28} color="#FF7A00" />
        <span>Loading profile...</span>
      </div>
    </div>
  );
 
  return (
    <div className="ap-wrap">
      <style>{styles}</style>
 
      {error         && <div className="ap-alert error">{error}</div>}
      {statusMessage && <div className="ap-alert success">{statusMessage}</div>}
 
      {/* Header card */}
      <div className="ap-card">
        <div className="ap-banner" />
        <div className="ap-card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div className="ap-avatar-wrap">
              {displayImage ? (
                <img key={displayImage} src={displayImage} className="ap-avatar-img" alt="profile"
                  onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div className="ap-avatar-initials">{initials}</div>
              )}
              <button className="ap-camera-btn" type="button" onClick={() => imageInputRef.current?.click()}>
                <Camera size={13} />
              </button>
              <input ref={imageInputRef} type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleImageFile} />
            </div>
 
            <button
              className={`ap-btn-save${saved ? " saved" : ""}`}
              onClick={handleSave} disabled={saving} type="button"
            >
              {saving
                ? <><Loader2 size={15} /> Saving...</>
                : <><Save size={15} /> {saved ? "Saved ✓" : "Save Changes"}</>
              }
            </button>
          </div>
 
          <div style={{ marginTop: 16 }}>
            <p className="ap-name">{fullName}</p>
            <p className="ap-role">{form.roleTitle}</p>
            <p className="ap-bio">{form.bio || "No bio yet."}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {form.linkedin && <a href={form.linkedin} target="_blank" rel="noreferrer" className="ap-social-link"><Linkedin size={15} /></a>}
              {form.twitter  && <a href={form.twitter}  target="_blank" rel="noreferrer" className="ap-social-link"><Twitter  size={15} /></a>}
              {form.github   && <a href={form.github}   target="_blank" rel="noreferrer" className="ap-social-link"><Github   size={15} /></a>}
            </div>
          </div>
        </div>
      </div>
 
      {/* Admin Information */}
      <div className="ap-card">
        <div className="ap-card-body">
          <p className="ap-section-title">Admin Information</p>
          <div className="ap-grid-2">
            {INFO_FIELDS.map((field) => (
              <div className="ap-mb" key={field.key}>
                <label className="ap-label">{field.label}</label>
                <input className="ap-input" value={form[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)} />
              </div>
            ))}
            <div className="ap-mb">
              <label className="ap-label">Role Title</label>
              <input className="ap-input" value={form.roleTitle || ""}
                onChange={(e) => handleChange("roleTitle", e.target.value)} />
            </div>
          </div>
 
          <div className="ap-mb">
            <label className="ap-label">Bio</label>
            <textarea className="ap-textarea" value={form.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)} />
          </div>
          <div className="ap-mb">
            <label className="ap-label">Profile Image URL</label>
            <input className="ap-input" value={form.image || ""}
              onChange={(e) => handleChange("image", e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="ap-label">Or Upload Image</label>
            <input type="file" accept="image/*" className="ap-input" onChange={handleImageFile} />
          </div>
        </div>
      </div>
 
      {/* Social Links */}
      <div className="ap-card">
        <div className="ap-card-body">
          <p className="ap-section-title">Social Links</p>
          {SOCIAL_FIELDS.map((field) => (
            <div className="ap-mb" key={field.key}>
              <div className="ap-input-group">
                <span className="ap-input-group-icon"><field.Icon size={15} /></span>
                <input placeholder={field.placeholder} value={form[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 