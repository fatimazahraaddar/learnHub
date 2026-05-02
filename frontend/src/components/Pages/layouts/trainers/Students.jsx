import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Mail, MoreVertical } from "lucide-react";
import { fetchTrainerStudentsData, getStoredUser } from "../../../../api";

const STATUS_COLORS = {
  Active: "success",
  Completed: "primary",
  "At Risk": "warning",
  New: "secondary",
};

export function TrainerStudents() {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, completed: 0, atRisk: 0 });
  const [search, setSearch] = useState("");
  const [atRiskOnly, setAtRiskOnly] = useState(false);

useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      console.log("storedUser:", user); // 👈
      const { ok, data } = await fetchTrainerStudentsData(user?.id || null);
      if (!ok || !data?.status) return;
      setStudents(Array.isArray(data.students) ? data.students : []);
      setSummary(data.summary || { total: 0, active: 0, completed: 0, atRisk: 0 });
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = atRiskOnly ? students.filter((s) => s.status === "At Risk") : students;
    if (!q) return list;
    return list.filter((s) => `${s.name} ${s.email} ${s.course}`.toLowerCase().includes(q));
  }, [students, search, atRiskOnly]);

  return (
    <div className="container my-4">
      <div className="row g-3 mb-4">
        {[
          { label: "Total Students", value: String(summary.total), color: "primary" },
          { label: "Active", value: String(summary.active), color: "success" },
          { label: "Completed", value: String(summary.completed), color: "info" },
          { label: "At Risk", value: String(summary.atRisk), color: "warning" },
        ].map((s) => (
          <div className="col-md-3 col-6" key={s.label}>
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h4 className={`text-${s.color}`}>{s.value}</h4>
                <small className="text-muted">{s.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Students</h5>

          <div className="d-flex gap-2">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>

              <input
                className="form-control"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className={`btn d-flex align-items-center gap-1 ${atRiskOnly ? "btn-secondary text-white" : "btn-outline-secondary"}`}
              type="button"
              onClick={() => setAtRiskOnly((prev) => !prev)}
            >
              <Filter size={16} /> {atRiskOnly ? "All" : "At Risk"}
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={student.avatar}
                        width="35"
                        height="35"
                        className="rounded-circle"
                        alt={student.name}
                      />

                      <div>
                        <div className="fw-semibold">{student.name}</div>
                        <small className="text-muted">{student.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>{student.course}</td>

                  <td style={{ width: "180px" }}>
                    <div className="progress">
                      <div
                        className={`progress-bar ${
                          student.progress === 100
                            ? "bg-success"
                            : student.progress < 30
                            ? "bg-warning"
                            : "bg-primary"
                        }`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>

                    <small>{student.progress}%</small>
                  </td>

                  <td>{student.joined}</td>

                  <td>
                    <span className={`badge bg-${STATUS_COLORS[student.status] || "secondary"}`}>
                      {student.status}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-light" type="button" onClick={() => (window.location.href = `mailto:${student.email}`)}>
                        <Mail size={16} />
                      </button>

                      <button className="btn btn-sm btn-light" type="button" onClick={() => window.alert(`Student: ${student.name}\nCourse: ${student.course}\nProgress: ${student.progress}%`)}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer d-flex justify-content-between">
          <small className="text-muted">
            Showing {filtered.length} of {summary.total} students
          </small>
        </div>
      </div>
    </div>
  );
}
