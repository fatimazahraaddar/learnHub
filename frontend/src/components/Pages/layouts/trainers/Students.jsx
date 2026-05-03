import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Mail, MoreVertical, ChevronDown } from "lucide-react";
import { fetchTrainerStudentsData, getStoredUser } from "../../../../api";
 
const STATUS_COLORS = {
  Active:    { bg: "#ECFDF5", color: "#16A34A" },
  Completed: { bg: "#EBF4FF", color: "#4A90E2" },
  "At Risk": { bg: "#FFFBEB", color: "#D97706" },
  New:       { bg: "#F3EBFF", color: "#7F3FBF" },
};
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .ts-wrap { font-family: 'DM Sans', sans-serif; }
 
  .ts-stat-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .ts-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .ts-stat-value { font-size: 1.7rem; font-weight: 700; line-height: 1.1; margin-bottom: 4px; }
  .ts-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
 
  .ts-toolbar {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }
  .ts-toolbar-title { font-size: 1.15rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  .ts-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F6F8FA;
    border: 1px solid #E8ECF0;
    border-radius: 10px;
    padding: 7px 14px;
    min-width: 200px;
  }
  .ts-search input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.875rem;
    color: #1A202C;
    font-family: 'DM Sans', sans-serif;
    width: 160px;
  }
  .ts-search input::placeholder { color: #A0AEC0; }
 
  .ts-btn-filter {
    display: flex; align-items: center; gap: 6px;
    background: #F6F8FA;
    border: 1px solid #E8ECF0;
    border-radius: 10px;
    padding: 7px 14px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4A5568;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }
  .ts-btn-filter:hover { background: #EEF1F5; border-color: #CBD5E0; }
  .ts-btn-filter.active {
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff;
    border-color: transparent;
  }
 
  .ts-table-wrap {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
  }
  .ts-table { width: 100%; border-collapse: collapse; }
  .ts-table thead tr { background: #F6F8FA; border-bottom: 1px solid #E8ECF0; }
  .ts-table th {
    padding: 13px 18px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #8492A6;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-align: left;
    white-space: nowrap;
  }
  .ts-table tbody tr {
    border-bottom: 1px solid #F0F3F7;
    transition: background 0.15s;
  }
  .ts-table tbody tr:last-child { border-bottom: none; }
  .ts-table tbody tr:hover { background: #FAFBFC; }
  .ts-table td { padding: 14px 18px; font-size: 0.875rem; color: #2D3748; }
 
  .ts-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  .ts-user-name { font-weight: 600; color: #1A202C; font-size: 0.9rem; }
  .ts-user-email { font-size: 0.78rem; color: #A0AEC0; margin-top: 1px; }
 
  .ts-badge {
    display: inline-flex; align-items: center;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }
 
  .ts-progress-wrap { width: 140px; }
  .ts-progress-bar {
    height: 6px;
    border-radius: 99px;
    background: #E8ECF0;
    overflow: hidden;
    margin-bottom: 4px;
  }
  .ts-progress-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s ease;
  }
  .ts-progress-label { font-size: 0.75rem; color: #8492A6; font-weight: 500; }
 
  .ts-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px; height: 34px;
    border-radius: 9px;
    border: 1px solid #E8ECF0;
    background: #fff;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
    color: #5A6A7E;
  }
  .ts-action-btn:hover { background: #F0F4FF; border-color: #C5D5F5; color: #4A90E2; transform: translateY(-1px); }
 
  .ts-footer { padding: 14px 20px; font-size: 0.8rem; color: #A0AEC0; border-top: 1px solid #F0F3F7; }
`;
 
export function TrainerStudents() {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, completed: 0, atRisk: 0 });
  const [search, setSearch] = useState("");
  const [atRiskOnly, setAtRiskOnly] = useState(false);
 
  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
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
    return list.filter((s) =>
      `${s.name} ${s.email} ${s.course}`.toLowerCase().includes(q)
    );
  }, [students, search, atRiskOnly]);
 
  const getProgressColor = (progress) => {
    if (progress === 100) return "#16A34A";
    if (progress < 30)   return "#D97706";
    return "#4A90E2";
  };
 
  return (
    <div className="ts-wrap" style={{ padding: "24px" }}>
      <style>{styles}</style>
 
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Students", value: summary.total,     color: "#4A90E2" },
          { label: "Active",         value: summary.active,    color: "#16A34A" },
          { label: "Completed",      value: summary.completed, color: "#0EA5E9" },
          { label: "At Risk",        value: summary.atRisk,    color: "#D97706" },
        ].map((s) => (
          <div key={s.label} className="ts-stat-card">
            <div className="ts-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="ts-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* Toolbar */}
      <div className="ts-toolbar">
        <span className="ts-toolbar-title">All Students</span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div className="ts-search">
            <Search size={15} color="#A0AEC0" />
            <input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`ts-btn-filter${atRiskOnly ? " active" : ""}`}
            type="button"
            onClick={() => setAtRiskOnly((prev) => !prev)}
          >
            <Filter size={14} />
            {atRiskOnly ? "At Risk" : "All"} <ChevronDown size={13} />
          </button>
        </div>
      </div>
 
      {/* Table */}
      <div className="ts-table-wrap">
        <div style={{ overflowX: "auto" }}>
          <table className="ts-table">
            <thead>
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#A0AEC0" }}>
                    No students found.
                  </td>
                </tr>
              )}
              {filtered.map((student) => {
                const sc = STATUS_COLORS[student.status] || STATUS_COLORS.New;
                return (
                  <tr key={student.id}>
                    {/* Student */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="ts-avatar">
                          {(student.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="ts-user-name">{student.name}</div>
                          <div className="ts-user-email">{student.email}</div>
                        </div>
                      </div>
                    </td>
 
                    {/* Course */}
                    <td style={{ color: "#4A5568", fontWeight: 500 }}>{student.course}</td>
 
                    {/* Progress */}
                    <td>
                      <div className="ts-progress-wrap">
                        <div className="ts-progress-bar">
                          <div
                            className="ts-progress-fill"
                            style={{
                              width: `${student.progress}%`,
                              background: getProgressColor(student.progress),
                            }}
                          />
                        </div>
                        <span className="ts-progress-label">{student.progress}%</span>
                      </div>
                    </td>
 
                    {/* Joined */}
                    <td style={{ color: "#8492A6" }}>{student.joined}</td>
 
                    {/* Status */}
                    <td>
                      <span className="ts-badge" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.color, display: "inline-block", marginRight: 6 }} />
                        {student.status}
                      </span>
                    </td>
 
                    {/* Actions */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          className="ts-action-btn"
                          title="Send email"
                          type="button"
                          onClick={() => (window.location.href = `mailto:${student.email}`)}
                        >
                          <Mail size={15} />
                        </button>
                        <button
                          className="ts-action-btn"
                          type="button"
                          onClick={() =>
                            window.alert(
                              `Student: ${student.name}\nCourse: ${student.course}\nProgress: ${student.progress}%`
                            )
                          }
                        >
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="ts-footer">
          Showing <strong>{filtered.length}</strong> of <strong>{summary.total}</strong> students
        </div>
      </div>
    </div>
  );
}
