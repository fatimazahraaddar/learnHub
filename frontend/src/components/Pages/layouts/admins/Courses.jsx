import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Eye, Edit, Trash2, ImagePlus } from "lucide-react";
import {
  deleteCourseById,
  fetchCourses,
  uploadImageFile,
  updateCourseFromForm,
} from "../../../../lib/api";
import { resolveCourseImage } from "../../../../lib/courseImage";
import { ActionToast } from "../../ActionToast";

const EMPTY_FORM = {
  id: "",
  title: "",
  category: "Development",
  duration: "",
  price: "",
  description: "",
  image_url: "",
  image_file: null,
};

export function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState({ show: false, text: "", variant: "info" });
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [withImageOnly, setWithImageOnly] = useState(false);

  const showToast = (text, variant = "info") => {
    setToast({ show: true, text, variant });
  };

  const imagePreview = useMemo(() => {
    if (form.image_file) return URL.createObjectURL(form.image_file);
    return resolveCourseImage(form.image_url, form.title);
  }, [form.image_file, form.image_url, form.title]);

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchCourses();
      if (ok && Array.isArray(data)) {
        setCourses(data);
      } else {
        showToast(data.message || "Failed to load courses", "danger");
      }
    };

    load();
  }, []);

  useEffect(() => {
    return () => {
      if (form.image_file) URL.revokeObjectURL(imagePreview);
    };
  }, [form.image_file, imagePreview]);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = withImageOnly ? courses.filter((c) => (c.image || "").trim()) : courses;
    return list.filter((c) =>
      `${c.title || ""} ${c.description || ""} ${c.category || ""}`.toLowerCase().includes(q)
    );
  }, [courses, query, withImageOnly]);

  const openEdit = (course) => {
    setForm({
      id: String(course.id),
      title: course.title || "",
      category: course.category || "Development",
      duration: course.duration || "",
      price: String(course.price || ""),
      description: course.description || "",
      image_url: course.image || "",
      image_file: null,
    });
    setShowEditor(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.id || !form.title || !form.description || Number(form.price) <= 0) {
      showToast("Please fill valid title, description and price", "danger");
      return;
    }

    let finalForm = { ...form };
    if (form.image_file) {
      const upload = await uploadImageFile(form.image_file);
      if (!upload.ok || !upload.data?.url) {
        showToast(upload.data?.message || "Image upload failed", "danger");
        return;
      }
      finalForm = { ...finalForm, image_url: upload.data.url };
    }

    const { data } = await updateCourseFromForm(form.id, finalForm, null);

    if (!data.status) {
      showToast(data.message || "Update failed", "danger");
      return;
    }

    const { ok: refreshedOk, data: refreshed } = await fetchCourses();
    if (refreshedOk && Array.isArray(refreshed)) {
      setCourses(refreshed);
    }

    showToast("Course updated successfully", "success");
    setShowEditor(false);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    const { data } = await deleteCourseById(id);

    if (!data.status) {
      showToast(data.message || "Delete failed", "danger");
      return;
    }

    setCourses((prev) => prev.filter((c) => Number(c.id) !== Number(id)));
    showToast("Course deleted", "success");
  };

  return (
    <div className="container my-4">
      <ActionToast
        show={toast.show}
        text={toast.text}
        variant={toast.variant}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      {showEditor && (
        <div className="card border-warning border-2 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Edit Course</h5>
              <button className="btn-close" onClick={() => setShowEditor(false)} type="button" />
            </div>

            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input
                    className="form-control"
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Duration</label>
                  <input
                    className="form-control"
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    className="form-control"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-control"
                    value={form.image_url}
                    onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value, image_file: null }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center gap-2">
                    <ImagePlus size={16} /> Upload image
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
                <button className="btn btn-warning text-white" type="submit">Save</button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowEditor(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-3 mb-4">
        {[
          { label: "Total Courses", value: String(courses.length), color: "#4A90E2" },
          { label: "Published", value: String(courses.length), color: "#28A745" },
          { label: "With Image", value: String(courses.filter((c) => (c.image || "").trim() !== "").length), color: "#FF7A00" },
          { label: "No Image", value: String(courses.filter((c) => !(c.image || "").trim()).length), color: "#888" },
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

      <div className="card shadow-sm border">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Courses</h5>
          <div className="d-flex gap-2 flex-wrap">
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
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light text-muted small">
              <tr>
                {["Course", "Category", "Price", "Duration", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                  <td className="text-muted">${Number(course.price || 0).toFixed(2)}</td>
                  <td className="text-muted">{course.duration || "Self paced"}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: "#F0FFF4", color: "#28A745" }}>
                      Published
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-light btn-sm p-1" title="View" type="button" onClick={() => showToast(`${course.title}: ${course.description}`)}>
                        <Eye size={16} className="text-muted" />
                      </button>
                      <button className="btn btn-light btn-sm p-1" title="Edit" type="button" onClick={() => openEdit(course)}>
                        <Edit size={16} className="text-primary" />
                      </button>
                      <button className="btn btn-light btn-sm p-1" title="Delete" type="button" onClick={() => handleDelete(course.id)}>
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
