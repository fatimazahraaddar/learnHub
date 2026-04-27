import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { fetchLearnerCourses, getStoredUser } from "../../../../lib/api";

export function LearnerCourses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      if (!user?.id) {
        setMessage("Please login first.");
        return;
      }

      const { ok, data } = await fetchLearnerCourses(user.id);

      if (!ok || !Array.isArray(data)) {
        setMessage(data.message || "Failed to load courses.");
        return;
      }

      setCourses(data);
    };

    load();
  }, []);

  const filtered = courses.filter((c) =>
    (c.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container my-4">
      <div className="row mb-4 g-2 align-items-center">
        <div className="col-md-6">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search your courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {message ? <div className="alert alert-warning">{message}</div> : null}

      <h4 className="fw-bold mb-3">My Courses ({filtered.length})</h4>
      <div className="row g-4">
        {filtered.map((course) => (
          <div key={course.id} className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">Course</small>
                <h6 className="fw-semibold">{course.title}</h6>
                <p className="text-muted mb-1">{course.description}</p>
                <strong>${course.price}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
