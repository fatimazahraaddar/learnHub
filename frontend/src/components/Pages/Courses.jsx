import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { CourseCard } from "../Pages/CourseCard";
import { fetchCourses } from "../../lib/api";

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchCourses();
      if (!ok || !Array.isArray(data)) {
        setMessage(data.message || "Failed to load courses");
        return;
      }
      setCourses(data);
    };

    load();
  }, []);

  const filtered = courses.filter((c) => {
    const t = (c.title || "").toLowerCase();
    const d = (c.description || "").toLowerCase();
    return t.includes(search.toLowerCase()) || d.includes(search.toLowerCase());
  });

  return (
    <div style={{ backgroundColor: "#F7F7F7" }} className="min-vh-100">
      <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)" }} className="py-5 text-center text-white">
        <div className="container">
          <h1 className="mb-3 fw-bold">Explore All Courses</h1>
          <p className="text-light mb-4">Find your perfect learning path.</p>

          <div className="d-flex align-items-center bg-white rounded p-2 shadow-sm mx-auto" style={{ maxWidth: "500px", width: "100%" }}>
            <Search size={16} className="text-muted me-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="form-control border-0 shadow-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="btn btn-sm">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-5">
        {message ? <div className="alert alert-warning">{message}</div> : null}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="mb-0">Showing <strong>{filtered.length}</strong> courses</p>
        </div>

        {filtered.length > 0 ? (
          <div className="row">
            {filtered.map((course) => (
              <div key={course.id} className="col-md-6 col-xl-4 mb-4">
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <h5>No courses found</h5>
            <p className="text-muted">Try changing search</p>
          </div>
        )}
      </div>
    </div>
  );
}
