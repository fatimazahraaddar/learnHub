import { useEffect, useMemo, useState } from "react";
import { Save, Globe, Palette } from "lucide-react";
import { fetchPlatformSettings, savePlatformSettings } from "../../../../api";
 
const SETTING_TABS = [
  { id: "general",    label: "General",    icon: Globe    },
  { id: "appearance", label: "Appearance", icon: Palette  },
];
 
const DEFAULT_SETTINGS = {
  site_name:    "LearnHub",
  tagline:      "Empowering Learners Worldwide",
  description:  "A modern e-learning platform delivering world-class education.",
  support_email: "support@learnhub.com",
  support_phone: "+1 (555) 234-5678",
  primary_color: "#4A90E2",
  accent_color:  "#7F3FBF",
  nav_links: ["Home", "Courses", "Blog"],
};
 
export function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings]   = useState(DEFAULT_SETTINGS);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");
  const [info, setInfo]           = useState("");
 
  useEffect(() => {
    let cancelled = false;
 
    const load = async () => {
      setLoading(true);
      setError("");
      const { ok, data } = await fetchPlatformSettings();
      if (cancelled) return;
      if (ok && data?.status) {
        setSettings((prev) => ({ ...prev, ...(data.settings || {}) }));
      } else {
        setError(data?.message || "Unable to load settings.");
      }
      setLoading(false);
    };
 
    load();
    return () => { cancelled = true; };
  }, []);
 
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setInfo("");
    const { ok, data } = await savePlatformSettings(settings);
    setSaving(false);
    if (!ok || !data?.status) {
      setError(data?.message || "Unable to save settings.");
      return;
    }
    if (data.settings) {
      setSettings((prev) => ({ ...prev, ...data.settings }));
    }
    setInfo(data.message || "Settings saved.");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
 
  const navLinksDisplay = useMemo(
    () => (Array.isArray(settings.nav_links) ? settings.nav_links : []),
    [settings.nav_links]
  );
 
  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="text-muted mt-2">Loading settings...</p>
    </div>
  );
 
  return (
    <div className="container my-4">
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {info  && <div className="alert alert-success py-2">{info}</div>}
 
      <div className="row g-4">
 
        {/* SIDEBAR */}
        <div className="col-lg-3">
          <div className="card shadow-sm border rounded-3 p-3">
            {SETTING_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`btn w-100 d-flex align-items-center gap-2 mb-1 ${
                  activeTab === tab.id ? "btn-warning fw-semibold" : "btn-light text-dark"
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
 
        {/* CONTENT */}
        <div className="col-lg-9 d-flex flex-column gap-4">
 
          {/* GENERAL */}
          {activeTab === "general" && (
            <div className="card shadow-sm border rounded-3 p-4">
              <h5 className="fw-bold mb-4">General Settings</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small">Platform Name</label>
                  <input
                    value={settings.site_name || ""}
                    onChange={(e) => setSettings((p) => ({ ...p, site_name: e.target.value }))}
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small">Tagline</label>
                  <input
                    value={settings.tagline || ""}
                    onChange={(e) => setSettings((p) => ({ ...p, tagline: e.target.value }))}
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small">Description</label>
                  <textarea
                    value={settings.description || ""}
                    onChange={(e) => setSettings((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small">Support Email</label>
                  <input
                    value={settings.support_email || ""}
                    onChange={(e) => setSettings((p) => ({ ...p, support_email: e.target.value }))}
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small">Support Phone</label>
                  <input
                    value={settings.support_phone || ""}
                    onChange={(e) => setSettings((p) => ({ ...p, support_phone: e.target.value }))}
                    className="form-control form-control-sm"
                  />
                </div>
              </div>
 
              {/* Save button */}
              <div className="mt-4 d-flex justify-content-end">
                <button
                  className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                  onClick={handleSave}
                  disabled={saving}
                  type="button"
                >
                  <Save size={15} />
                  {saving ? "Saving…" : saved ? "Saved ✓" : "Save Settings"}
                </button>
              </div>
            </div>
          )}
 
          {/* APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="card shadow-sm border rounded-3 p-4">
              <h5 className="fw-bold mb-4">Appearance & Branding</h5>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label small">Primary Color</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => setSettings((p) => ({ ...p, primary_color: e.target.value }))}
                      className="form-control form-control-color"
                    />
                    <input
                      value={settings.primary_color}
                      onChange={(e) => setSettings((p) => ({ ...p, primary_color: e.target.value }))}
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <label className="form-label small">Accent Color</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="color"
                      value={settings.accent_color}
                      onChange={(e) => setSettings((p) => ({ ...p, accent_color: e.target.value }))}
                      className="form-control form-control-color"
                    />
                    <input
                      value={settings.accent_color}
                      onChange={(e) => setSettings((p) => ({ ...p, accent_color: e.target.value }))}
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
              </div>
 
              <div className="mt-4">
                <label className="form-label small">Color Presets</label>
                <div className="d-flex gap-2 flex-wrap">
                  {[
                    { primary: "#4A90E2", accent: "#7F3FBF", name: "Default" },
                    { primary: "#10b981", accent: "#059669", name: "Emerald" },
                    { primary: "#f59e0b", accent: "#d97706", name: "Amber"   },
                    { primary: "#ef4444", accent: "#dc2626", name: "Red"     },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      className="btn btn-light btn-sm d-flex align-items-center gap-2"
                      onClick={() => setSettings((p) => ({ ...p, primary_color: preset.primary, accent_color: preset.accent }))}
                      type="button"
                    >
                      <span style={{ width: 16, height: 16, backgroundColor: preset.primary, borderRadius: 3 }} />
                      <span style={{ width: 16, height: 16, backgroundColor: preset.accent,  borderRadius: 3 }} />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
 
              <div className="mt-4">
                <label className="form-label small">Preview</label>
                <div className="border rounded-3 overflow-hidden">
                  <div
                    className="d-flex align-items-center p-3 text-white"
                    style={{ background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.accent_color})` }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center bg-white text-dark fw-bold"
                      style={{ width: 32, height: 32, borderRadius: 8 }}
                    >
                      {(settings.site_name || "L").charAt(0).toUpperCase()}
                    </div>
                    <span className="ms-2 fw-semibold">{settings.site_name}</span>
                    <div className="ms-auto d-flex gap-3">
                      {navLinksDisplay.map((n) => <small key={n}>{n}</small>)}
                    </div>
                  </div>
                  <div className="p-3 bg-white d-flex gap-2">
                    <button className="btn btn-sm text-white" style={{ backgroundColor: settings.primary_color }} type="button">Primary</button>
                    <button className="btn btn-sm text-white" style={{ backgroundColor: settings.accent_color }}  type="button">Accent</button>
                  </div>
                </div>
              </div>
 
              {/* Save button */}
              <div className="mt-4 d-flex justify-content-end">
                <button
                  className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                  onClick={handleSave}
                  disabled={saving}
                  type="button"
                >
                  <Save size={15} />
                  {saving ? "Saving…" : saved ? "Saved ✓" : "Save Settings"}
                </button>
              </div>
            </div>
          )}
 
        </div>
      </div>
    </div>
  );
}