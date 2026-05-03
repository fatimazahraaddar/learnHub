import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { CourseCard } from "../Pages/CourseCard";
import { fetchCourses } from "../../api";


const PRIMARY = "#1E3A5F";
const ACCENT = "#10B981";

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchCourses();
      if (!ok) {
        setMessage(data?.message || "Failed to load courses");
        return;
      }
      setCourses(data.courses || []);
    };
    load();
  }, []);

  const filtered = courses.filter((c) => {
    const t = (c.title || "").toLowerCase();
    const d = (c.description || "").toLowerCase();
    return t.includes(search.toLowerCase()) || d.includes(search.toLowerCase());
  });

  return (
    <div style={{ backgroundColor: "#F4F7FB" }} className="min-vh-100">
      {/* ── Hero ── */}
      <div
        className="py-5 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%)`,
        }}
      >
        <div className="container">
          <span
            className="badge px-3 py-2 rounded-pill mb-3"
            style={{
              background: `${ACCENT}33`,
              color: ACCENT,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            Courses
          </span>
          <h1
            className="mb-3 fw-bold"
            style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
          >
            Explore All Courses
          </h1>
          <p className="mb-4" style={{ opacity: 0.75 }}>
            Find your perfect learning path.
          </p>

          {/* barre de recherche */}
          <div
            className="d-flex align-items-center bg-white rounded-3 px-3 py-2 shadow mx-auto"
            style={{ maxWidth: "520px", border: `2px solid ${ACCENT}44` }}
          >
            <Search size={16} color={ACCENT} className="me-2 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="form-control border-0 shadow-none p-0"
              style={{ fontSize: "0.95rem" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="btn btn-sm p-0 ms-2"
                style={{ color: PRIMARY }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Liste ── */}
      <div className="container py-5">
        {message && <div className="alert alert-warning">{message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="mb-0 text-muted">
            Showing{" "}
            <strong style={{ color: PRIMARY }}>{filtered.length}</strong>{" "}
            courses
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="row g-4">
            {filtered.map((course) => (
              <div key={course.id} className="col-md-6 col-xl-4">
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: "3rem" }}>
              🔍
            </div>
            <h5 style={{ color: PRIMARY }}>No courses found</h5>
            <p className="text-muted">Try changing your search term</p>
            <button
              className="btn mt-2 fw-semibold"
              style={{
                background: ACCENT,
                color: "white",
                borderRadius: "10px",
              }}
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
