import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, BookOpen, Star } from "lucide-react";
import { fetchTrainerOverviewData, getStoredUser } from "../../../../lib/api";
import { resolveCourseImage } from "../../../../lib/courseImage";

const PIE_COLORS = ["#4A90E2", "#7F3FBF", "#FF7A00", "#28A745", "#EF4444"];

export function TrainerOverview() {
  const [overview, setOverview] = useState({
    stats: { students: 0, courses: 0, rating: "0.0" },
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
      name,
      value,
      color: PIE_COLORS[idx % PIE_COLORS.length],
    }));
  }, [overview.myCourses]);

  return (
    <div className="container-fluid py-4">
      <div className="row g-3 mb-4">
        {[
          { icon: Users,    label: "Students", value: overview.stats.students, color: "#4A90E2" },
          { icon: BookOpen, label: "Courses",  value: overview.stats.courses,  color: "#7F3FBF" },
          { icon: Star,     label: "Rating",   value: overview.stats.rating,   color: "#FF7A00" },
        ].map((stat, i) => (
          <div key={i} className="col-md-6 col-lg-4">
            <div className="card p-3 shadow-sm">
              <stat.icon size={25} style={{ color: stat.color }} />
              <h4 className="mt-2">{stat.value}</h4>
              <small className="text-muted">{stat.label}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card p-3 shadow-sm">
            <h5>Revenue Overview</h5>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={overview.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-3 shadow-sm">
            <h5>Courses by Category</h5>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={courseDistribution} dataKey="value">
                  {courseDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-3 shadow-sm mt-4">
        <h5>Enrollment Trend</h5>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={overview.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="students" stroke="#4A90E2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="row g-4 mt-3">
        <div className="col-lg-6">
          <div className="card p-3 shadow-sm">
            <h5>My Courses</h5>
            {overview.myCourses.length > 0 ? (
              overview.myCourses.map((course) => (
                <div key={course.id} className="d-flex align-items-center mb-3">
                  <img
                    src={resolveCourseImage(course.image, course.title)}
                    width="50"
                    className="me-3 rounded"
                    alt={course.title}
                    onError={(e) => { e.target.src = "https://placehold.co/50x50?text=N/A"; }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-0">{course.title}</p>
                    <small className="text-muted">{course.students} students</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted small mb-0">No courses yet.</p>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-3 shadow-sm">
            <h5>Recent Students</h5>
            {overview.recentStudents.length > 0 ? (
              overview.recentStudents.map((s) => (
                <div key={s.id ?? s.name} className="d-flex align-items-center mb-3">
                  <img
                    src={s.avatar}
                    width="40"
                    className="rounded-circle me-3"
                    alt={s.name}
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}`; }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-0">{s.name}</p>
                    <small className="text-muted">{s.course}</small>
                  </div>
                  <span>{s.progress}%</span>
                </div>
              ))
            ) : (
              <p className="text-muted small mb-0">No recent students.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}