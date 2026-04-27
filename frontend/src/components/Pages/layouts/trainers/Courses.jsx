import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Star,
  BarChart2,
  ImagePlus,
} from "lucide-react";
import {
  createCourseFromForm,
  deleteCourseById,
  fetchCourses,
  getStoredUser,
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

export function TrainerCourses() {
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState({ show: false, text: "", variant: "info" });
  const [loading, setLoading] = useState(false);

  const showToast = (text, variant = "info") => {
    setToast({ show: true, text, variant });
  };

  const imagePreview = useMemo(() => {
    if (form.image_file) {
      return URL.createObjectURL(form.image_file);
    }
    return resolveCourseImage(form.image_url, form.title);
  }, [form.image_file, form.image_url, form.title]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { ok, data } = await fetchCourses();
      if (ok && Array.isArray(data)) {
        setCourses(data);
      } else {
        showToast(data.message || "Failed to load courses", "danger");
      }
      setLoading(false);
    };

    load();
  }, []);

  useEffect(() => {
    return () => {
      if (form.image_file) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [form.image_file, imagePreview]);

  const openCreate = () => {
    setIsEdit(false);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (course) => {
    setIsEdit(true);
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
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getStoredUser();

    if (!form.title || !form.description || Number(form.price) <= 0) {
      showToast("Title, description and valid price are required", "danger");
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

    const call = isEdit
      ? updateCourseFromForm(form.id, finalForm, user?.id || null)
      : createCourseFromForm(finalForm, user?.id || null);
    const { data } = await call;

    if (!data.status) {
      showToast(data.message || "Operation failed", "danger");
      return;
    }

    const { ok: refreshedOk, data: refreshed } = await fetchCourses();
    if (refreshedOk && Array.isArray(refreshed)) {
      setCourses(refreshed);
    }

    showToast(data.message || (isEdit ? "Course updated" : "Course created"), "success");
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this course?");
    if (!ok) return;

    const { data } = await deleteCourseById(id);

    if (!data.status) {
      showToast(data.message || "Delete failed", "danger");
      return;
    }

    setCourses((prev) => prev.filter((c) => Number(c.id) !== Number(id)));
    showToast("Course deleted", "success");
  };

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const visibleCourses = useMemo(() => {
    if (activeFilter === "Published") {
      return courses.filter((course) => String(course.raw?.status || "published").toLowerCase() === "published");
    }
    return courses;
  }, [activeFilter, courses]);

  return (
    <div className="container-fluid">
      <ActionToast
        show={toast.show}
        text={toast.text}
        variant={toast.variant}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="btn-group">
          {["All", "Published"].map((f) => (
            <button
              key={f}
              className={`btn ${activeFilter === f ? "btn-primary" : "btn-outline-secondary"}`}
              type="button"
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate} type="button">
          <Plus size={18} /> Create Course
        </button>
      </div>

      {showForm && (
        <div className="card border-primary border-2 border-dashed mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <h5>{isEdit ? "Edit Course" : "Create New Course"}</h5>
              <button className="btn-close" onClick={() => setShowForm(false)} type="button" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Course Title</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option>Development</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Business</option>
                    <option>Data Science</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Duration</label>
                  <input
                    className="form-control"
                    placeholder="Ex: 12 hours"
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Price ($)</label>
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
                  <label className="form-label">Image URL (optional)</label>
                  <input
                    className="form-control"
                    placeholder="https://..."
                    value={form.image_url}
                    onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value, image_file: null }))}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center gap-2">
                    <ImagePlus size={16} /> Upload image file
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

              <div className="mt-3">
                <button className="btn btn-primary me-2" type="submit">
                  {isEdit ? "Save Changes" : "Create Course"}
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setShowForm(false)} type="button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="alert alert-light">Loading courses...</div> : null}

      {visibleCourses.map((course) => (
        <div key={course.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <div className="d-flex">
              <img
                src={resolveCourseImage(course.image, course.title)}
                width="96"
                height="80"
                className="rounded me-3"
                style={{ objectFit: "cover" }}
                alt={course.title}
              />

              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="badge bg-success me-2">Published</span>
                    <small className="text-muted">{course.category || "General"}</small>
                    <h6 className="mt-1">{course.title}</h6>
                    <p className="text-muted small mb-1">{course.description}</p>
                  </div>
                </div>

                <div className="d-flex gap-4 mt-2 small text-muted align-items-center">
                  <span className="d-flex align-items-center gap-1">
                    <Users size={16} /> 0
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <Star size={16} /> -
                  </span>
                  <span className="text-success d-flex align-items-center gap-1">
                    <BarChart2 size={16} /> ${Number(course.price || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer d-flex gap-2">
            <button className="btn btn-outline-secondary flex-fill" onClick={() => openEdit(course)} type="button">
              <Edit size={16} /> Edit
            </button>
            <button className="btn btn-outline-danger flex-fill" onClick={() => handleDelete(course.id)} type="button">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
