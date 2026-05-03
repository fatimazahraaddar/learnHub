import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Users, Star, ImagePlus, Clock, X, BookOpen } from "lucide-react";
import {
  createCourseFromForm, deleteCourseById, fetchCourses,
  getStoredUser, uploadImageFile, updateCourseFromForm,
} from "../../../../api";
import { resolveCourseImage } from "../../../../lib/courseImage";
import { ActionToast } from "../../ActionToast";

const EMPTY_FORM = {
  id: "", title: "", category: "Development",
  duration: "", description: "", image_url: "", image_file: null,
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .tc-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
  .tc-stat-card {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px;
    padding: 20px; transition: box-shadow 0.2s, transform 0.2s;
  }
  .tc-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .tc-stat-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .tc-stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1.1; margin-bottom: 4px; }
  .tc-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
  .tc-toolbar {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px;
    padding: 16px 20px; display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;
  }
  .tc-toolbar-title { font-size: 1.15rem; font-weight: 700; color: #1A202C; margin: 0; }
  .tc-btn-filter {
    display: flex; align-items: center; gap: 6px; background: #F6F8FA;
    border: 1px solid #E8ECF0; border-radius: 10px; padding: 7px 14px;
    font-size: 0.875rem; font-weight: 500; color: #4A5568;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  }
  .tc-btn-filter:hover { background: #EEF1F5; border-color: #CBD5E0; }
  .tc-btn-filter.active { background: #EBF4FF; border-color: #4A90E2; color: #4A90E2; }
  .tc-btn-add {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    border: none; border-radius: 10px; padding: 8px 16px;
    font-size: 0.875rem; font-weight: 600; color: #fff;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
  }
  .tc-btn-add:hover { opacity: 0.9; transform: translateY(-1px); }
  .tc-editor {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px;
    padding: 24px; margin-bottom: 24px; animation: tc-fade-in 0.15s ease;
    border-left: 3px solid #4A90E2;
  }
  .tc-editor.mode-edit { border-left-color: #7F3FBF; }
  @keyframes tc-fade-in { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .tc-form-label { display: block; font-size: 0.78rem; font-weight: 600; color: #4A5568; margin-bottom: 6px; }
  .tc-form-control {
    width: 100%; padding: 9px 13px; border: 1px solid #E2E8F0; border-radius: 9px;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif; color: #1A202C;
    outline: none; box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s; background: #fff;
  }
  .tc-form-control:focus { border-color: #4A90E2; box-shadow: 0 0 0 3px rgba(74,144,226,0.12); }
  .tc-btn-save {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px;
    border-radius: 9px; border: none; background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff; font-size: 0.875rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; box-shadow: 0 2px 8px rgba(74,144,226,0.3); transition: opacity 0.15s;
  }
  .tc-btn-save:hover { opacity: 0.9; }
  .tc-btn-save.mode-edit { background: linear-gradient(135deg, #7F3FBF, #4A90E2); }
  .tc-btn-cancel {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px;
    border-radius: 9px; border: 1px solid #E2E8F0; background: #fff; color: #4A5568;
    font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  }
  .tc-btn-cancel:hover { background: #F6F8FA; }
  .tc-close-btn {
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid #E2E8F0;
    background: #F6F8FA; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #8492A6; transition: background 0.15s;
  }
  .tc-close-btn:hover { background: #EEF1F5; color: #1A202C; }
  .tc-course-card {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px;
    overflow: hidden; margin-bottom: 16px; transition: box-shadow 0.2s, transform 0.2s;
  }
  .tc-course-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .tc-action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 9px; border: 1px solid #E8ECF0;
    background: #fff; cursor: pointer; transition: background 0.15s, transform 0.15s; color: #5A6A7E;
  }
  .tc-action-btn:hover { background: #F0F4FF; border-color: #C5D5F5; color: #4A90E2; transform: translateY(-1px); }
  .tc-action-btn.danger:hover { background: #FFF5F5; border-color: #FFC5C5; color: #dc2626; }
  .tc-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
  }
  .tc-footer { padding: 14px 20px; font-size: 0.8rem; color: #A0AEC0; border-top: 1px solid #F0F3F7; }
`;

export function TrainerCourses() {
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState({ show: false, text: "", variant: "info" });
  const [loading, setLoading] = useState(false);

  const user = getStoredUser();
  const accountId = Number(user?.id || 0);

  const showToast = (text, variant = "info") => setToast({ show: true, text, variant });

  const imagePreview = useMemo(() => {
    if (form.image_file) return URL.createObjectURL(form.image_file);
    return resolveCourseImage(form.image_url, form.title);
  }, [form.image_file, form.image_url, form.title]);

  useEffect(() => {
    if (!accountId) return;
    const load = async () => {
      setLoading(true);
      const { ok, data } = await fetchCourses();
      const list = Array.isArray(data?.courses) ? data.courses : [];
      setCourses(list.filter((c) => Number(c.trainer_id) === accountId));
      if (!ok) showToast("Failed to load courses", "danger");
      setLoading(false);
    };
    load();
  }, [accountId]);

  useEffect(() => {
    return () => { if (form.image_file) URL.revokeObjectURL(imagePreview); };
  }, [form.image_file, imagePreview]);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const openCreate = () => { setIsEdit(false); setForm(EMPTY_FORM); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openEdit = (course) => {
    setIsEdit(true);
    setForm({ id: String(course.id), title: course.title || "", category: course.category || "Development", duration: course.duration_minutes || "", description: course.description || "", image_url: course.image || "", image_file: null });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { showToast("Title and description are required", "danger"); return; }
    let finalForm = { ...form };
    if (form.image_file) {
      const upload = await uploadImageFile(form.image_file);
      if (!upload.ok || !upload.data?.url) { showToast(upload.data?.message || "Image upload failed", "danger"); return; }
      finalForm = { ...finalForm, image_url: upload.data.url };
    }
    const call = isEdit ? updateCourseFromForm(form.id, finalForm, accountId) : createCourseFromForm(finalForm, accountId);
    const { data } = await call;
    if (!data.status) { showToast(data.message || "Operation failed", "danger"); return; }
    const { ok: refreshedOk, data: refreshed } = await fetchCourses();
    const list = Array.isArray(refreshed?.courses) ? refreshed.courses : [];
    if (refreshedOk) setCourses(list.filter((c) => Number(c.trainer_id) === accountId));
    showToast(data.message || (isEdit ? "Course updated" : "Course created"), "success");
    setForm(EMPTY_FORM); setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    const { data } = await deleteCourseById(id);
    if (!data.status) { showToast(data.message || "Delete failed", "danger"); return; }
    setCourses((prev) => prev.filter((c) => Number(c.id) !== Number(id)));
    showToast("Course deleted", "success");
  };

  const visibleCourses = useMemo(() => {
    if (activeFilter === "Published") return courses.filter((c) => String(c.raw?.status || "published").toLowerCase() === "published");
    return courses;
  }, [activeFilter, courses]);

  const totalStudents = courses.reduce((sum, c) => sum + Number(c.students_count ?? 0), 0);

  return (
    <div className="tc-wrap">
      <style>{styles}</style>
      <ActionToast show={toast.show} text={toast.text} variant={toast.variant} onClose={() => setToast((t) => ({ ...t, show: false }))} />

      {/* ── Editor ── */}
      {showForm && (
        <div className={`tc-editor ${isEdit ? "mode-edit" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h5 style={{ fontWeight: 700, margin: 0, color: "#1A202C" }}>{isEdit ? "Edit Course" : "Create New Course"}</h5>
            <button className="tc-close-btn" onClick={() => setShowForm(false)} type="button"><X size={15} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="tc-form-label">Course Title *</label>
                <input className="tc-form-control" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. React for Beginners" required />
              </div>
              <div>
                <label className="tc-form-label">Category</label>
                <select className="tc-form-control" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                  {["Development", "Design", "Marketing", "Business", "Data Science"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="tc-form-label">Duration (minutes)</label>
                <input className="tc-form-control" type="number" placeholder="e.g. 90" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} />
              </div>
              <div>
                <label className="tc-form-label">Image URL</label>
                <input className="tc-form-control" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value, image_file: null }))} placeholder="https://..." />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="tc-form-label">Description *</label>
                <textarea rows={3} className="tc-form-control" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe the course..." required />
              </div>
              <div>
                <label className="tc-form-label" style={{ display: "flex", alignItems: "center", gap: 5 }}><ImagePlus size={13} /> Upload Image</label>
                <input type="file" accept="image/*" className="tc-form-control" onChange={(e) => setForm((p) => ({ ...p, image_file: e.target.files?.[0] || null }))} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <img src={imagePreview} alt="preview" style={{ width: 100, height: 64, objectFit: "cover", borderRadius: 10, border: "1px solid #E8ECF0" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className={`tc-btn-save ${isEdit ? "mode-edit" : ""}`} type="submit">{isEdit ? "Save Changes" : "Create Course"}</button>
              <button className="tc-btn-cancel" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "My Courses",      value: courses.length,   color: "#4A90E2", bg: "#EBF4FF", Icon: BookOpen },
          { label: "Published",       value: visibleCourses.length, color: "#16A34A", bg: "#ECFDF5", Icon: BookOpen },
          { label: "Total Students",  value: totalStudents,    color: "#FF7A00", bg: "#FFF3E8", Icon: Users },
        ].map((s) => (
          <div key={s.label} className="tc-stat-card">
            <div className="tc-stat-icon" style={{ background: s.bg }}><s.Icon size={18} color={s.color} /></div>
            <div className="tc-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="tc-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="tc-toolbar">
        <span className="tc-toolbar-title">My Courses</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["All", "Published"].map((f) => (
            <button key={f} className={`tc-btn-filter ${activeFilter === f ? "active" : ""}`} type="button" onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
          <button className="tc-btn-add" type="button" onClick={openCreate}><Plus size={15} /> Create Course</button>
        </div>
      </div>

      {/* ── Course Cards ── */}
      {loading && <div style={{ textAlign: "center", padding: 40, color: "#A0AEC0" }}>Loading courses...</div>}

      {!loading && visibleCourses.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px", color: "#A0AEC0" }}>
          <BookOpen size={40} style={{ marginBottom: 12 }} />
          <p>No courses found. Click <strong>Create Course</strong> to get started.</p>
        </div>
      )}

      {visibleCourses.map((course) => (
        <div key={course.id} className="tc-course-card">
          <div style={{ display: "flex", gap: 16, padding: "16px 20px", alignItems: "flex-start" }}>
            <img
              src={resolveCourseImage(course.image, course.title)}
              style={{ width: 96, height: 72, objectFit: "cover", borderRadius: 10, border: "1px solid #E8ECF0", flexShrink: 0 }}
              alt={course.title}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span className="tc-badge" style={{ background: "#ECFDF5", color: "#16A34A", marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} /> Published
                  </span>
                  <span className="tc-badge" style={{ background: "#EBF4FF", color: "#4A90E2", marginLeft: 6 }}>{course.category || "General"}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="tc-action-btn" title="Edit" type="button" onClick={() => openEdit(course)}><Edit size={15} color="#4A90E2" /></button>
                  <button className="tc-action-btn danger" title="Delete" type="button" onClick={() => handleDelete(course.id)}><Trash2 size={15} color="#dc2626" /></button>
                </div>
              </div>
              <h6 style={{ fontWeight: 700, color: "#1A202C", margin: "8px 0 4px", fontSize: "0.95rem" }}>{course.title}</h6>
              <p style={{ fontSize: "0.8rem", color: "#A0AEC0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 500 }}>{course.description}</p>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "#8492A6" }}><Users size={14} />{course.students_count ?? 0} students</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "#8492A6" }}><Star size={14} />{course.rating ?? "-"}</span>
                {course.duration_minutes && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "#8492A6" }}><Clock size={14} />{Math.round(course.duration_minutes / 60)}h</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="tc-footer">
        Showing <strong>{visibleCourses.length}</strong> of <strong>{courses.length}</strong> courses
      </div>
    </div>
  );
}