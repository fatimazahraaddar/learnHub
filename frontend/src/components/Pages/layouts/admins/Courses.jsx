import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Eye, Edit, Trash2, ImagePlus, Plus, X } from "lucide-react";
import {
  deleteCourseById,
  fetchCourses,
  uploadImageFile,
  updateCourseFromForm,
  createCourseFromForm,
} from "../../../../api";
import { resolveCourseImage } from "../../../../lib/courseImage";
import { ActionToast } from "../../ActionToast";

const EMPTY_FORM = {
  id: "",
  title: "",
  category: "Development",
  duration: "",
  description: "",
  image_url: "",
  image_file: null,
};

export function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState({ show: false, text: "", variant: "info" });
  const [showEditor, setShowEditor] = useState(false);
  const [editorMode, setEditorMode] = useState("edit");
  const [form, setForm] = useState(EMPTY_FORM);
  const [withImageOnly, setWithImageOnly] = useState(false);
  const [saving, setSaving] = useState(false);

  const showToast = (text, variant = "info") => {
    setToast({ show: true, text, variant });
  };

  const imagePreview = useMemo(() => {
    if (form.image_file instanceof File) {
      return URL.createObjectURL(form.image_file);
    }
    if (form.image_url && !form.image_url.startsWith("http")) {
      return `http://127.0.0.1:8000/storage/${form.image_url}`;
    }
    if (form.image_url) {
      return form.image_url;
    }
    return resolveCourseImage(null, form.title);
  }, [form.image_file, form.image_url, form.title]);

  useEffect(() => {
    let cancelled = false;
    fetchCourses().then(({ ok, data }) => {
      if (cancelled) return;
      if (ok && data.courses) {
        setCourses(data.courses);
      } else {
        showToast(data?.message || "Failed to load courses", "danger");
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    return () => {
      if (form.image_file) URL.revokeObjectURL(imagePreview);
    };
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

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditorMode("add");
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ← ajoutez cette ligne
  };

const openEdit = (course) => {
  console.log("course:", course);
  setForm({
    id: String(course.id),
    title: course.title || "",
    category: course.category || "Development",
    duration: course.duration || "",
    description: course.description || "",
    image_url: course.image || "",
    image_file: null,
  });
  setEditorMode("edit");
  setShowEditor(true);
  window.scrollTo({ top: 0, behavior: "smooth" }); // ← ajoutez cette ligne
};

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      showToast("Please fill valid title and description", "danger");
      return;
    }

    setSaving(true);
    let finalForm = { ...form };

    if (form.image_file) {
      const upload = await uploadImageFile(form.image_file);
      if (!upload.ok || !upload.data?.url) {
        showToast(upload.data?.message || "Image upload failed", "danger");
        setSaving(false);
        return;
      }
      finalForm = { ...finalForm, image_url: upload.data.url };
    }

    if (editorMode === "add") {
      const { ok, data } = await createCourseFromForm(finalForm, null);
      setSaving(false);
      if (!ok || !data?.status) {
        showToast(data?.message || "Create failed", "danger");
        return;
      }
      showToast("Course created successfully!", "success");
    } else {
      const { ok, data } = await updateCourseFromForm(form.id, finalForm, null);
      setSaving(false);
      if (!ok || !data?.status) {
        showToast(data?.message || "Update failed", "danger");
        return;
      }
      showToast("Course updated successfully", "success");
    }

    const { ok, data: refreshed } = await fetchCourses();
    if (ok && refreshed?.courses) setCourses(refreshed.courses);

    setShowEditor(false);
    setForm(EMPTY_FORM);
  };

  useEffect(() => {
  console.log("showEditor:", showEditor, "editorMode:", editorMode);
}, [showEditor, editorMode]);


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    const { data } = await deleteCourseById(id);
    if (!data.status) {
      showToast(data?.message || "Delete failed", "danger");
      return;
    }
    setCourses((prev) => prev.filter((c) => Number(c.id) !== Number(id)));
    showToast("Course deleted", "success");
  };

  const closeEditor = () => {
    setShowEditor(false);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="container my-4">
      <ActionToast
        show={toast.show}
        text={toast.text}
        variant={toast.variant}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      {/* ── Editor Form ── */}
      {showEditor && (
        <div className={`card border-2 mb-4 ${editorMode === "add" ? "border-primary" : "border-warning"}`}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">
                {editorMode === "add" ? "➕ Add New Course" : "✏️ Edit Course"}
              </h5>
              <button className="btn btn-sm btn-light rounded-circle" onClick={closeEditor} type="button">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Title *</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. React for Beginners"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Category</label>
                  <input
                    className="form-control"
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    placeholder="e.g. Development"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Duration</label>
                  <input
                    className="form-control"
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    placeholder="e.g. 12 hours"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small">Description *</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the course content..."
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Image URL</label>
                  <input
                    className="form-control"
                    value={form.image_url}
                    onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value, image_file: null }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                    <ImagePlus size={15} /> Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => setForm((p) => ({ ...p, image_file: e.target.files?.[0] || null }))}
                  />
                </div>
                <div className="col-12">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="rounded border"
                    style={{ width: "180px", height: "110px", objectFit: "cover" }}
                  />
                </div>
              </div>

              <div className="mt-3 d-flex gap-2">
                <button
                  className="btn text-white fw-semibold"
                  style={{
                    background:
                      editorMode === "add"
                        ? "linear-gradient(135deg,#4A90E2,#7F3FBF)"
                        : "#FFC107",
                  }}
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving…" : editorMode === "add" ? "Create Course" : "Save Changes"}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={closeEditor}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Courses", value: courses.length, color: "#4A90E2" },
          { label: "Published", value: courses.length, color: "#28A745" },
          { label: "With Image", value: courses.filter((c) => (c.image || "").trim() !== "").length, color: "#FF7A00" },
          { label: "No Image", value: courses.filter((c) => !(c.image || "").trim()).length, color: "#888" },
        ].map((s) => (
          <div key={s.label} className="col-6 col-sm-3">
            <div className="card text-center shadow-sm border h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-1" style={{ color: s.color }}>{s.value}</h5>
                <p className="text-muted mb-0 small">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="card shadow-sm border">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">All Courses</h5>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className={`btn btn-sm d-flex align-items-center gap-1 ${withImageOnly ? "btn-secondary text-white" : "btn-outline-secondary"}`}
              type="button"
              onClick={() => setWithImageOnly((prev) => !prev)}
            >
              <Filter size={16} /> {withImageOnly ? "All" : "With Image"}
            </button>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              type="button"
              onClick={openAdd}
            >
              <Plus size={16} /> Add Course
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light text-muted small">
              <tr>
                {["Course", "Category", "Duration", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">No courses found.</td>
                </tr>
              )}
              {filtered.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={resolveCourseImage(course.image, course.title)}
                        className="rounded"
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                        alt={course.title}
                      />
                      <div className="text-truncate" style={{ maxWidth: "220px" }}>
                        <div className="fw-semibold">{course.title}</div>
                        <div className="text-muted small">{course.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: "#EBF4FF", color: "#4A90E2" }}>
                      {course.category || "General"}
                    </span>
                  </td>
                  <td className="text-muted">{course.duration || "Self paced"}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: "#F0FFF4", color: "#28A745" }}>
                      Published
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-light btn-sm p-1" title="View" type="button"
                        onClick={() => showToast(`${course.title}: ${course.description}`)}>
                        <Eye size={16} className="text-muted" />
                      </button>
                      <button className="btn btn-light btn-sm p-1" title="Edit" type="button"
                        onClick={() => openEdit(course)}>
                        <Edit size={16} className="text-primary" />
                      </button>
                      <button className="btn btn-light btn-sm p-1" title="Delete" type="button"
                        onClick={() => handleDelete(course.id)}>
                        <Trash2 size={16} className="text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}