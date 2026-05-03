import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, BookOpen, Star, Play, ChevronRight } from "lucide-react";
import { fetchTrainerOverviewData, getStoredUser } from "../../../../api";
import { resolveCourseImage } from "../../../../lib/courseImage";

const PIE_COLORS = ["#4A90E2", "#7F3FBF", "#FF7A00", "#28A745", "#EF4444"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .ad-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
  .ad-stat-card {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px;
    padding: 20px; transition: box-shadow 0.2s, transform 0.2s;
  }
  .ad-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .ad-stat-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
  }
  .ad-stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1.1; margin-bottom: 4px; color: #1A202C; }
  .ad-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
  .ad-card { background: #fff; border: 1px solid #E8ECF0; border-radius: 14px; overflow: hidden; }
  .ad-card-header {
    padding: 16px 20px; border-bottom: 1px solid #F0F3F7;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ad-section-title { font-size: 1rem; font-weight: 700; color: #1A202C; margin: 0; }
  .hover-box { transition: background 0.15s; cursor: pointer; }
  .hover-box:hover { background: #F6F8FA; }
`;

export function TrainerOverview() {
  const [overview, setOverview] = useState({
    stats: { students: 0, courses: 0, earnings: 0, rating: "0.0" },
    trend: [],
    myCourses: [],
    recentStudents: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const user = getStoredUser();
        const { ok, data } = await fetchTrainerOverviewData(user?.id || null);
        if (!ok || !data?.status) return;
        setOverview(data);
      } catch {
        console.error("Failed to load trainer overview");
      }
    };
    load();
  }, []);

  const courseDistribution = useMemo(() => {
    const map = {};
    overview.myCourses.forEach((course) => {
      const key = course.category || "General";
      map[key] = Number(map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value], idx) => ({
      name, value, color: PIE_COLORS[idx % PIE_COLORS.length],
    }));
  }, [overview.myCourses]);

  const STATS = [
    { icon: Users,    label: "Students",  value: String(overview.stats.students),          color: "#4A90E2", bg: "#EBF4FF" },
    { icon: BookOpen, label: "Courses",   value: String(overview.stats.courses),            color: "#7F3FBF", bg: "#F3EBFF" },
  ];

  return (
    <div className="ad-wrap">
      <style>{styles}</style>
      <div className="container-fluid">

        {/* ── Stat Cards ── */}
        <div className="row g-4 mb-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="col-md-3">
              <div className="ad-stat-card">
                <div className="ad-stat-icon" style={{ background: stat.bg }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <div className="ad-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                <div className="ad-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-section-title">Revenue Overview</span>
              </div>
              <div className="p-3">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={overview.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8492A6" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#8492A6" }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4A90E2" />
                        <stop offset="100%" stopColor="#7F3FBF" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="ad-card h-100">
              <div className="ad-card-header">
                <span className="ad-section-title">Courses by Category</span>
              </div>
              <div className="p-3 d-flex flex-column align-items-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={courseDistribution} dataKey="value" innerRadius={50} outerRadius={80}>
                      {courseDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
                  {courseDistribution.map((entry) => (
                    <span key={entry.name} style={{ fontSize: "0.75rem", color: "#4A5568", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: entry.color, display: "inline-block" }} />
                      {entry.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Enrollment Trend ── */}
        <div className="ad-card mb-4">
          <div className="ad-card-header">
            <span className="ad-section-title">Enrollment Trend</span>
          </div>
          <div className="p-3">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={overview.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8492A6" }} />
                <YAxis tick={{ fontSize: 12, fill: "#8492A6" }} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#4A90E2" strokeWidth={2} dot={{ fill: "#4A90E2", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── My Courses + Recent Students ── */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-section-title">My Courses</span>
                <span style={{ fontSize: "0.8rem", color: "#8492A6" }}>{overview.myCourses.length} total</span>
              </div>
              <div className="p-3">
                {overview.myCourses.length === 0 && (
                  <p className="text-muted small mb-0 text-center py-3">No courses yet.</p>
                )}
                {overview.myCourses.map((course) => (
                  <div key={course.id} className="d-flex align-items-center mb-3 p-2 rounded hover-box">
                    <img
                      src={resolveCourseImage(course.image, course.title)}
                      width="52" height="52"
                      className="rounded me-3"
                      style={{ objectFit: "cover", flexShrink: 0 }}
                      alt={course.title}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <p className="mb-0 fw-semibold" style={{ fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {course.title}
                      </p>
                      <small className="text-muted">{course.students} étudiants · {course.category}</small>
                    </div>
                    <button className="btn btn-sm btn-primary rounded-circle ms-2" type="button">
                      <Play size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-section-title">Recent Students</span>
                <span style={{ fontSize: "0.8rem", color: "#8492A6" }}>{overview.recentStudents.length} recent</span>
              </div>
              <div className="p-3">
                {overview.recentStudents.length === 0 && (
                  <p className="text-muted small mb-0 text-center py-3">No students yet.</p>
                )}
                {overview.recentStudents.map((s, i) => (
                  <div key={i} className="d-flex align-items-center mb-3 p-2 rounded hover-box">
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg,#4A90E2,#7F3FBF)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 700, fontSize: "0.85rem", marginRight: 12,
                    }}>
                      {(s.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <p className="mb-0 fw-semibold" style={{ fontSize: "0.875rem" }}>{s.name}</p>
                      <small className="text-muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                        {s.course}
                      </small>
                      <div className="progress mt-1" style={{ height: 5 }}>
                        <div className="progress-bar" style={{ width: `${s.progress}%`, background: "linear-gradient(90deg,#4A90E2,#7F3FBF)" }} />
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4A90E2", marginLeft: 10 }}>
                      {s.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}