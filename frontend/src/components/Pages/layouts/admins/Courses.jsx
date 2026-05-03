import { useEffect, useMemo, useState } from "react";
import {
  Search, Filter, Eye, Edit, Trash2, ImagePlus, Plus, X,
  BookOpen, Image, CheckCircle, LayoutGrid, ChevronDown,
  ChevronUp, GripVertical, FileText, HelpCircle
} from "lucide-react";
import {
  deleteCourseById,
  fetchCourses,
  uploadImageFile,
  updateCourseFromForm,
  createCourseFromForm,
} from "../../../../api";

import {
  fetchCourseLessons, saveCourseLessons,
  fetchCourseQuizzes, saveCourseQuizzes,
} from "../../../../api/courses";
import { resolveCourseImage } from "../../../../lib/courseImage";
import { ActionToast } from "../../ActionToast";
 
const EMPTY_FORM = {
  id: "", title: "", category: "Development",
  duration: "", description: "", image_url: "", image_file: null,
};
 
const EMPTY_LESSON = { id: null, title: "", content: "", code: "" };
const EMPTY_QUESTION = { id: null, question: "", options: ["", "", "", ""], correct: 0 };
const EMPTY_QUIZ = { id: null, title: "", questions: [{ ...EMPTY_QUESTION }] };
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .ac-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
  .ac-stat-card { background:#fff; border:1px solid #E8ECF0; border-radius:14px; padding:20px; transition:box-shadow 0.2s,transform 0.2s; }
  .ac-stat-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08); transform:translateY(-2px); }
  .ac-stat-icon { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
  .ac-stat-value { font-size:1.8rem; font-weight:700; line-height:1.1; margin-bottom:4px; }
  .ac-stat-label { font-size:0.78rem; color:#8492A6; font-weight:500; text-transform:uppercase; letter-spacing:0.05em; }
  .ac-toolbar { background:#fff; border:1px solid #E8ECF0; border-radius:14px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; }
  .ac-toolbar-title { font-size:1.15rem; font-weight:700; color:#1A202C; margin:0; }
  .ac-search { display:flex; align-items:center; gap:8px; background:#F6F8FA; border:1px solid #E8ECF0; border-radius:10px; padding:7px 14px; min-width:200px; }
  .ac-search input { border:none; background:transparent; outline:none; font-size:0.875rem; color:#1A202C; font-family:'DM Sans',sans-serif; width:160px; }
  .ac-search input::placeholder { color:#A0AEC0; }
  .ac-btn-filter { display:flex; align-items:center; gap:6px; background:#F6F8FA; border:1px solid #E8ECF0; border-radius:10px; padding:7px 14px; font-size:0.875rem; font-weight:500; color:#4A5568; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.15s,border-color 0.15s; }
  .ac-btn-filter:hover { background:#EEF1F5; border-color:#CBD5E0; }
  .ac-btn-filter.active { background:#EBF4FF; border-color:#4A90E2; color:#4A90E2; }
  .ac-btn-add { display:flex; align-items:center; gap:6px; background:linear-gradient(135deg,#4A90E2,#7F3FBF); border:none; border-radius:10px; padding:8px 16px; font-size:0.875rem; font-weight:600; color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; transition:opacity 0.15s,transform 0.15s; box-shadow:0 2px 8px rgba(74,144,226,0.3); }
  .ac-btn-add:hover { opacity:0.9; transform:translateY(-1px); }
  .ac-table-wrap { background:#fff; border:1px solid #E8ECF0; border-radius:14px; overflow:hidden; }
  .ac-table { width:100%; border-collapse:collapse; }
  .ac-table thead tr { background:#F6F8FA; border-bottom:1px solid #E8ECF0; }
  .ac-table th { padding:13px 18px; font-size:0.75rem; font-weight:600; color:#8492A6; text-transform:uppercase; letter-spacing:0.06em; text-align:left; white-space:nowrap; }
  .ac-table tbody tr { border-bottom:1px solid #F0F3F7; transition:background 0.15s; }
  .ac-table tbody tr:last-child { border-bottom:none; }
  .ac-table tbody tr:hover { background:#FAFBFC; }
  .ac-table td { padding:14px 18px; font-size:0.875rem; color:#2D3748; }
  .ac-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:0.75rem; font-weight:600; }
  .ac-action-btn { display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:9px; border:1px solid #E8ECF0; background:#fff; cursor:pointer; transition:background 0.15s,border-color 0.15s,transform 0.15s; color:#5A6A7E; }
  .ac-action-btn:hover { background:#F0F4FF; border-color:#C5D5F5; color:#4A90E2; transform:translateY(-1px); }
  .ac-action-btn.danger:hover { background:#FFF5F5; border-color:#FFC5C5; color:#dc2626; }
  .ac-action-btn.manage { background:#F0FDF4; border-color:#BBF7D0; color:#16A34A; }
  .ac-action-btn.manage:hover { background:#DCFCE7; }
  .ac-footer { padding:14px 20px; font-size:0.8rem; color:#A0AEC0; border-top:1px solid #F0F3F7; }
  .ac-editor { background:#fff; border:1px solid #E8ECF0; border-radius:14px; padding:24px; margin-bottom:24px; animation:ac-fade-in 0.15s ease; }
  .ac-editor.mode-add  { border-left:3px solid #4A90E2; }
  .ac-editor.mode-edit { border-left:3px solid #7F3FBF; }
  @keyframes ac-fade-in { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .ac-editor-title { font-size:1rem; font-weight:700; color:#1A202C; margin:0; }
  .ac-form-label { display:block; font-size:0.78rem; font-weight:600; color:#4A5568; margin-bottom:6px; }
  .ac-form-control { width:100%; padding:9px 13px; border:1px solid #E2E8F0; border-radius:9px; font-size:0.875rem; font-family:'DM Sans',sans-serif; color:#1A202C; outline:none; box-sizing:border-box; transition:border-color 0.15s,box-shadow 0.15s; background:#fff; }
  .ac-form-control:focus { border-color:#4A90E2; box-shadow:0 0 0 3px rgba(74,144,226,0.12); }
  .ac-btn-save { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; border-radius:9px; border:none; background:linear-gradient(135deg,#4A90E2,#7F3FBF); color:#fff; font-size:0.875rem; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 2px 8px rgba(74,144,226,0.3); transition:opacity 0.15s; }
  .ac-btn-save:hover { opacity:0.9; }
  .ac-btn-save:disabled { opacity:0.6; cursor:not-allowed; }
  .ac-btn-save.mode-edit { background:linear-gradient(135deg,#7F3FBF,#4A90E2); }
  .ac-btn-cancel { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:9px; border:1px solid #E2E8F0; background:#fff; color:#4A5568; font-size:0.875rem; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.15s; }
  .ac-btn-cancel:hover { background:#F6F8FA; }
  .ac-close-btn { width:32px; height:32px; border-radius:8px; border:1px solid #E2E8F0; background:#F6F8FA; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#8492A6; transition:background 0.15s; }
  .ac-close-btn:hover { background:#EEF1F5; color:#1A202C; }
 
  /* ── Manage Panel ── */
  .ac-manage-panel { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:24px; margin-bottom:16px; animation:ac-fade-in 0.2s ease; }
  .ac-manage-title { font-size:1rem; font-weight:700; color:#1A202C; margin:0 0 16px; display:flex; align-items:center; gap:8px; }
  .ac-tabs { display:flex; gap:0; border-bottom:1px solid #E2E8F0; margin-bottom:20px; }
  .ac-tab { padding:8px 20px; font-size:0.875rem; font-weight:500; cursor:pointer; border-bottom:2px solid transparent; color:#8492A6; transition:all 0.15s; background:none; border-top:none; border-left:none; border-right:none; font-family:'DM Sans',sans-serif; }
  .ac-tab.active { color:#4A90E2; border-bottom-color:#4A90E2; }
  .ac-lesson-card { background:#fff; border:1px solid #E8ECF0; border-radius:10px; padding:16px; margin-bottom:12px; }
  .ac-lesson-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .ac-lesson-num { font-size:0.75rem; font-weight:600; color:#8492A6; text-transform:uppercase; letter-spacing:0.05em; }
  .ac-btn-sm { display:inline-flex; align-items:center; gap:4px; padding:5px 12px; border-radius:7px; font-size:0.78rem; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; border:1px solid #E2E8F0; background:#fff; color:#4A5568; transition:background 0.15s; }
  .ac-btn-sm:hover { background:#F0F4FF; border-color:#C5D5F5; color:#4A90E2; }
  .ac-btn-sm.danger:hover { background:#FFF5F5; border-color:#FFC5C5; color:#dc2626; }
  .ac-btn-sm.primary { background:linear-gradient(135deg,#4A90E2,#7F3FBF); color:#fff; border:none; box-shadow:0 2px 6px rgba(74,144,226,0.25); }
  .ac-btn-sm.primary:hover { opacity:0.9; color:#fff; }
  .ac-question-block { background:#F6F8FA; border:1px solid #E8ECF0; border-radius:8px; padding:12px; margin-bottom:10px; }
  .ac-option-row { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
  .ac-correct-radio { accent-color:#16A34A; width:16px; height:16px; cursor:pointer; }
`;
 
export function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState({ show: false, text: "", variant: "info" });
  const [showEditor, setShowEditor] = useState(false);
  const [editorMode, setEditorMode] = useState("edit");
  const [form, setForm] = useState(EMPTY_FORM);
  const [withImageOnly, setWithImageOnly] = useState(false);
  const [saving, setSaving] = useState(false);
 
  // ── Manage panel state ──
  const [manageCourseId, setManageCourseId] = useState(null);
  const [manageTab, setManageTab] = useState("lessons"); // "lessons" | "quiz"
  const [lessons, setLessons] = useState({}); // { [courseId]: [...] }
  const [quizzes, setQuizzes] = useState({}); // { [courseId]: [...] }
 
  const showToast = (text, variant = "info") => setToast({ show: true, text, variant });
 
  const imagePreview = useMemo(() => {
    if (form.image_file instanceof File) return URL.createObjectURL(form.image_file);
    if (form.image_url && !form.image_url.startsWith("http")) return `http://127.0.0.1:8000/storage/${form.image_url}`;
    if (form.image_url) return form.image_url;
    return resolveCourseImage(null, form.title);
  }, [form.image_file, form.image_url, form.title]);
 
  useEffect(() => {
    let cancelled = false;
    fetchCourses().then(({ ok, data }) => {
      if (cancelled) return;
      if (ok && data.courses) setCourses(data.courses);
      else showToast(data?.message || "Failed to load courses", "danger");
    });
    return () => { cancelled = true; };
  }, []);
 
  useEffect(() => {
    return () => { if (form.image_file) URL.revokeObjectURL(imagePreview); };
  }, [form.image_file, imagePreview]);
 
  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
    return () => clearTimeout(timer);
  }, [toast.show]);
 
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = withImageOnly ? courses.filter((c) => (c.image || "").trim()) : courses;
    return list.filter((c) =>
      `${c.title || ""} ${c.description || ""} ${c.category || ""}`.toLowerCase().includes(q)
    );
  }, [courses, query, withImageOnly]);
 
  const openAdd = () => { setForm(EMPTY_FORM); setEditorMode("add"); setShowEditor(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openEdit = (course) => {
    setForm({ id: String(course.id), title: course.title || "", category: course.category || "Development", duration: course.duration || "", description: course.description || "", image_url: course.image || "", image_file: null });
    setEditorMode("edit"); setShowEditor(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeEditor = () => { setShowEditor(false); setForm(EMPTY_FORM); };
 
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { showToast("Please fill valid title and description", "danger"); return; }
    setSaving(true);
    let finalForm = { ...form };
    if (form.image_file) {
      const upload = await uploadImageFile(form.image_file);
      if (!upload.ok || !upload.data?.url) { showToast(upload.data?.message || "Image upload failed", "danger"); setSaving(false); return; }
      finalForm = { ...finalForm, image_url: upload.data.url };
    }
    if (editorMode === "add") {
      const { ok, data } = await createCourseFromForm(finalForm, null);
      setSaving(false);
      if (!ok || !data?.status) { showToast(data?.message || "Create failed", "danger"); return; }
      showToast("Course created successfully!", "success");
    } else {
      const { ok, data } = await updateCourseFromForm(form.id, finalForm, null);
      setSaving(false);
      if (!ok || !data?.status) { showToast(data?.message || "Update failed", "danger"); return; }
      showToast("Course updated successfully", "success");
    }
    const { ok, data: refreshed } = await fetchCourses();
    if (ok && refreshed?.courses) setCourses(refreshed.courses);
    setShowEditor(false); setForm(EMPTY_FORM);
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    const { data } = await deleteCourseById(id);
    if (!data.status) { showToast(data?.message || "Delete failed", "danger"); return; }
    setCourses((prev) => prev.filter((c) => Number(c.id) !== Number(id)));
    if (manageCourseId === id) setManageCourseId(null);
    showToast("Course deleted", "success");
  };
 
  // ── Toggle manage panel ──────────────────────────────────────────────────
const toggleManage = async (courseId) => {
  if (manageCourseId === courseId) { setManageCourseId(null); return; }
  setManageCourseId(courseId);
  setManageTab("lessons");

  if (!lessons[courseId]) {
    const { ok, data } = await fetchCourseLessons(courseId);
    setLessons((prev) => ({ ...prev, [courseId]: ok ? data.lessons : [] }));
  }

  if (!quizzes[courseId]) {
    const { ok, data } = await fetchCourseQuizzes(courseId);
    setQuizzes((prev) => ({ ...prev, [courseId]: ok ? data.quizzes : [] }));
  }
};
 
  // ── Lessons CRUD ─────────────────────────────────────────────────────────
  const addLesson = (courseId) => {
    setLessons((prev) => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), { ...EMPTY_LESSON, id: Date.now() }],
    }));
  };
 
  const updateLesson = (courseId, lessonId, field, value) => {
    setLessons((prev) => ({
      ...prev,
      [courseId]: prev[courseId].map((l) => l.id === lessonId ? { ...l, [field]: value } : l),
    }));
  };
 
  const deleteLesson = (courseId, lessonId) => {
    setLessons((prev) => ({
      ...prev,
      [courseId]: prev[courseId].filter((l) => l.id !== lessonId),
    }));
  };
 
const saveLessons = async (courseId) => {
  const { ok, data } = await saveCourseLessons(courseId, lessons[courseId] || []);
  showToast(data.message, ok ? "success" : "danger");
  // Recharge depuis le serveur pour avoir les vrais IDs
  if (ok) {
    const { data: fresh } = await fetchCourseLessons(courseId);
    setLessons((prev) => ({ ...prev, [courseId]: fresh.lessons }));
  }
};
 
  // ── Quiz CRUD ────────────────────────────────────────────────────────────
  const addQuiz = (courseId) => {
    setQuizzes((prev) => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), { ...EMPTY_QUIZ, id: Date.now(), questions: [{ ...EMPTY_QUESTION, id: Date.now() }] }],
    }));
  };
 
  const updateQuiz = (courseId, quizId, field, value) => {
    setQuizzes((prev) => ({
      ...prev,
      [courseId]: prev[courseId].map((q) => q.id === quizId ? { ...q, [field]: value } : q),
    }));
  };
 
  const deleteQuiz = (courseId, quizId) => {
    setQuizzes((prev) => ({
      ...prev,
      [courseId]: prev[courseId].filter((q) => q.id !== quizId),
    }));
  };
 
  const addQuestion = (courseId, quizId) => {
    setQuizzes((prev) => ({
      ...prev,
      [courseId]: prev[courseId].map((q) =>
        q.id === quizId
          ? { ...q, questions: [...q.questions, { ...EMPTY_QUESTION, id: Date.now() }] }
          : q
      ),
    }));
  };
 
  const updateQuestion = (courseId, quizId, qIdx, field, value) => {
    setQuizzes((prev) => ({
      ...prev,
      [courseId]: prev[courseId].map((q) => {
        if (q.id !== quizId) return q;
        const questions = q.questions.map((qu, i) =>
          i === qIdx ? { ...qu, [field]: value } : qu
        );
        return { ...q, questions };
      }),
    }));
  };
 
  const updateOption = (courseId, quizId, qIdx, oIdx, value) => {
    setQuizzes((prev) => ({
      ...prev,
      [courseId]: prev[courseId].map((q) => {
        if (q.id !== quizId) return q;
        const questions = q.questions.map((qu, i) => {
          if (i !== qIdx) return qu;
          const options = qu.options.map((o, j) => j === oIdx ? value : o);
          return { ...qu, options };
        });
        return { ...q, questions };
      }),
    }));
  };
 
  const deleteQuestion = (courseId, quizId, qIdx) => {
    setQuizzes((prev) => ({
      ...prev,
      [courseId]: prev[courseId].map((q) => {
        if (q.id !== quizId) return q;
        return { ...q, questions: q.questions.filter((_, i) => i !== qIdx) };
      }),
    }));
  };
 
 const saveQuizzes = async (courseId) => {
  const { ok, data } = await saveCourseQuizzes(courseId, quizzes[courseId] || []);
  showToast(data.message, ok ? "success" : "danger");
  if (ok) {
    const { data: fresh } = await fetchCourseQuizzes(courseId);
    setQuizzes((prev) => ({ ...prev, [courseId]: fresh.quizzes }));
  }
};
 
  const withImage = courses.filter((c) => (c.image || "").trim() !== "").length;
  const STATS = [
    { label: "Total Courses",  value: courses.length,             iconBg: "#EBF4FF", iconColor: "#4A90E2", Icon: BookOpen    },
    { label: "Published",      value: courses.length,             iconBg: "#ECFDF5", iconColor: "#16A34A", Icon: CheckCircle },
    { label: "With Image",     value: withImage,                  iconBg: "#FFF8F0", iconColor: "#C47A1A", Icon: Image       },
    { label: "No Image",       value: courses.length - withImage, iconBg: "#F6F8FA", iconColor: "#8492A6", Icon: LayoutGrid  },
  ];
 
  return (
    <div className="ac-wrap">
      <style>{styles}</style>
 
      <ActionToast show={toast.show} text={toast.text} variant={toast.variant} onClose={() => setToast((t) => ({ ...t, show: false }))} />
 
      {/* ── EDITOR ── */}
      {showEditor && (
        <div className={`ac-editor mode-${editorMode}`}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h5 className="ac-editor-title">{editorMode === "add" ? "Add New Course" : "Edit Course"}</h5>
            <button className="ac-close-btn" onClick={closeEditor} type="button"><X size={15} /></button>
          </div>
          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="ac-form-label">Title *</label>
                <input className="ac-form-control" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. React for Beginners" required />
              </div>
              <div>
                <label className="ac-form-label">Category</label>
                <input className="ac-form-control" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Development" />
              </div>
              <div>
                <label className="ac-form-label">Duration</label>
                <input className="ac-form-control" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g. 12 hours" />
              </div>
              <div>
                <label className="ac-form-label">Image URL</label>
                <input className="ac-form-control" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value, image_file: null }))} placeholder="https://..." />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="ac-form-label">Description *</label>
                <textarea rows={3} className="ac-form-control" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe the course content..." required />
              </div>
              <div>
                <label className="ac-form-label" style={{ display: "flex", alignItems: "center", gap: 5 }}><ImagePlus size={13} /> Upload Image</label>
                <input type="file" accept="image/*" className="ac-form-control" onChange={(e) => setForm((p) => ({ ...p, image_file: e.target.files?.[0] || null }))} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <img src={imagePreview} alt="preview" style={{ width: 100, height: 64, objectFit: "cover", borderRadius: 10, border: "1px solid #E8ECF0" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className={`ac-btn-save mode-${editorMode}`} type="submit" disabled={saving}>{saving ? "Saving…" : editorMode === "add" ? "Create Course" : "Save Changes"}</button>
              <button className="ac-btn-cancel" type="button" onClick={closeEditor}>Cancel</button>
            </div>
          </form>
        </div>
      )}
 
      {/* ── STAT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 22 }}>
        {STATS.map((s) => (
          <div key={s.label} className="ac-stat-card">
            <div className="ac-stat-icon" style={{ background: s.iconBg }}><s.Icon size={18} color={s.iconColor} /></div>
            <div className="ac-stat-value" style={{ color: s.iconColor }}>{s.value}</div>
            <div className="ac-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* ── TOOLBAR ── */}
      <div className="ac-toolbar">
        <span className="ac-toolbar-title">Course Management</span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div className="ac-search">
            <Search size={15} color="#A0AEC0" />
            <input placeholder="Search courses..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button className={`ac-btn-filter ${withImageOnly ? "active" : ""}`} type="button" onClick={() => setWithImageOnly((p) => !p)}>
            <Filter size={14} /> {withImageOnly ? "With Image" : "All"}
          </button>
          <button className="ac-btn-add" type="button" onClick={openAdd}>
            <Plus size={15} /> Add Course
          </button>
        </div>
      </div>
 
      {/* ── TABLE ── */}
      <div className="ac-table-wrap">
        <div style={{ overflowX: "auto" }}>
          <table className="ac-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#A0AEC0" }}>No courses found.</td></tr>
              )}
              {filtered.map((course) => (
                <>
                  <tr key={course.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={resolveCourseImage(course.image, course.title)} style={{ width: 42, height: 42, objectFit: "cover", borderRadius: 10, border: "1px solid #E8ECF0", flexShrink: 0 }} alt={course.title} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: "#1A202C", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>{course.title}</div>
                          <div style={{ fontSize: "0.78rem", color: "#A0AEC0", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>{course.description}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="ac-badge" style={{ background: "#EBF4FF", color: "#4A90E2" }}>{course.category || "General"}</span></td>
                    <td style={{ color: "#8492A6" }}>{course.duration || "Self paced"}</td>
                    <td><span className="ac-badge" style={{ background: "#ECFDF5", color: "#16A34A" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />Published</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button className="ac-action-btn" title="View" type="button" onClick={() => showToast(`${course.title}: ${course.description}`)}><Eye size={15} /></button>
                        <button className="ac-action-btn" title="Edit" type="button" onClick={() => openEdit(course)}><Edit size={15} color="#4A90E2" /></button>
                        <button className="ac-action-btn manage" title="Gérer leçons & quiz" type="button" onClick={() => toggleManage(course.id)}>
                          {manageCourseId === course.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                        <button className="ac-action-btn danger" title="Delete" type="button" onClick={() => handleDelete(course.id)}><Trash2 size={15} color="#dc2626" /></button>
                      </div>
                    </td>
                  </tr>
 
                  {/* ── MANAGE PANEL ── */}
                  {manageCourseId === course.id && (
                    <tr key={`manage-${course.id}`}>
                      <td colSpan={5} style={{ padding: "0 18px 18px" }}>
                        <div className="ac-manage-panel">
                          <div className="ac-manage-title">
                            <BookOpen size={16} color="#4A90E2" />
                            Gérer — {course.title}
                          </div>
 
                          {/* Tabs */}
                          <div className="ac-tabs">
                            <button className={`ac-tab ${manageTab === "lessons" ? "active" : ""}`} onClick={() => setManageTab("lessons")}>
                              <FileText size={13} style={{ marginRight: 5 }} />Leçons ({(lessons[course.id] || []).length})
                            </button>
                            <button className={`ac-tab ${manageTab === "quiz" ? "active" : ""}`} onClick={() => setManageTab("quiz")}>
                              <HelpCircle size={13} style={{ marginRight: 5 }} />Quiz ({(quizzes[course.id] || []).length})
                            </button>
                          </div>
 
                          {/* ── TAB LEÇONS ── */}
                          {manageTab === "lessons" && (
                            <div>
                              {(lessons[course.id] || []).length === 0 && (
                                <div style={{ textAlign: "center", padding: "24px", color: "#A0AEC0", fontSize: "0.875rem" }}>
                                  Aucune leçon. Clique sur "Ajouter une leçon".
                                </div>
                              )}
                              {(lessons[course.id] || []).map((lesson, idx) => (
                                <div key={lesson.id} className="ac-lesson-card">
                                  <div className="ac-lesson-card-header">
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <GripVertical size={14} color="#CBD5E0" />
                                      <span className="ac-lesson-num">Leçon {idx + 1}</span>
                                    </div>
                                    <button className="ac-btn-sm danger" type="button" onClick={() => deleteLesson(course.id, lesson.id)}>
                                      <Trash2 size={12} /> Supprimer
                                    </button>
                                  </div>
                                  <div style={{ display: "grid", gap: 10 }}>
                                    <div>
                                      <label className="ac-form-label">Titre de la leçon</label>
                                      <input className="ac-form-control" value={lesson.title} placeholder="ex: Introduction au HTML" onChange={(e) => updateLesson(course.id, lesson.id, "title", e.target.value)} />
                                    </div>
                                    <div>
                                      <label className="ac-form-label">Contenu (paragraphes)</label>
                                      <textarea rows={4} className="ac-form-control" value={lesson.content} placeholder="Écris le contenu de la leçon ici..." onChange={(e) => updateLesson(course.id, lesson.id, "content", e.target.value)} />
                                    </div>
                                    <div>
                                      <label className="ac-form-label">Code exemple (optionnel)</label>
                                      <textarea rows={3} className="ac-form-control" value={lesson.code} placeholder="ex: <h1>Hello</h1>" style={{ fontFamily: "monospace", fontSize: "0.82rem" }} onChange={(e) => updateLesson(course.id, lesson.id, "code", e.target.value)} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                <button className="ac-btn-sm" type="button" onClick={() => addLesson(course.id)}>
                                  <Plus size={13} /> Ajouter une leçon
                                </button>
                                {(lessons[course.id] || []).length > 0 && (
                                  <button className="ac-btn-sm primary" type="button" onClick={() => saveLessons(course.id)}>
                                    <CheckCircle size={13} /> Sauvegarder
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
 
                          {/* ── TAB QUIZ ── */}
                          {manageTab === "quiz" && (
                            <div>
                              {(quizzes[course.id] || []).length === 0 && (
                                <div style={{ textAlign: "center", padding: "24px", color: "#A0AEC0", fontSize: "0.875rem" }}>
                                  Aucun quiz. Clique sur "Ajouter un quiz".
                                </div>
                              )}
                              {(quizzes[course.id] || []).map((quiz, qIdx) => (
                                <div key={quiz.id} className="ac-lesson-card">
                                  <div className="ac-lesson-card-header">
                                    <span className="ac-lesson-num">Quiz {qIdx + 1}</span>
                                    <button className="ac-btn-sm danger" type="button" onClick={() => deleteQuiz(course.id, quiz.id)}>
                                      <Trash2 size={12} /> Supprimer
                                    </button>
                                  </div>
                                  <div style={{ marginBottom: 12 }}>
                                    <label className="ac-form-label">Titre du quiz</label>
                                    <input className="ac-form-control" value={quiz.title} placeholder="ex: Quiz — Introduction" onChange={(e) => updateQuiz(course.id, quiz.id, "title", e.target.value)} />
                                  </div>
 
                                  {quiz.questions.map((qu, qi) => (
                                    <div key={qu.id || qi} className="ac-question-block">
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#8492A6" }}>Question {qi + 1}</span>
                                        {quiz.questions.length > 1 && (
                                          <button className="ac-btn-sm danger" type="button" onClick={() => deleteQuestion(course.id, quiz.id, qi)}>
                                            <X size={11} />
                                          </button>
                                        )}
                                      </div>
                                      <input className="ac-form-control" value={qu.question} placeholder="Écris la question..." style={{ marginBottom: 10 }} onChange={(e) => updateQuestion(course.id, quiz.id, qi, "question", e.target.value)} />
                                      <div style={{ fontSize: "0.75rem", color: "#8492A6", marginBottom: 6 }}>Options — sélectionne la bonne réponse (●)</div>
                                      {qu.options.map((opt, oi) => (
                                        <div key={oi} className="ac-option-row">
                                          <input type="radio" className="ac-correct-radio" name={`correct-${quiz.id}-${qi}`} checked={qu.correct === oi} onChange={() => updateQuestion(course.id, quiz.id, qi, "correct", oi)} />
                                          <input className="ac-form-control" value={opt} placeholder={`Option ${String.fromCharCode(65 + oi)}`} onChange={(e) => updateOption(course.id, quiz.id, qi, oi, e.target.value)} />
                                        </div>
                                      ))}
                                    </div>
                                  ))}
 
                                  <button className="ac-btn-sm" type="button" style={{ marginTop: 8 }} onClick={() => addQuestion(course.id, quiz.id)}>
                                    <Plus size={12} /> Ajouter une question
                                  </button>
                                </div>
                              ))}
 
                              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                <button className="ac-btn-sm" type="button" onClick={() => addQuiz(course.id)}>
                                  <Plus size={13} /> Ajouter un quiz
                                </button>
                                {(quizzes[course.id] || []).length > 0 && (
                                  <button className="ac-btn-sm primary" type="button" onClick={() => saveQuizzes(course.id)}>
                                    <CheckCircle size={13} /> Sauvegarder
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ac-footer">
          Showing <strong>{filtered.length}</strong> of <strong>{courses.length}</strong> courses
        </div>
      </div>
    </div>
  );
}