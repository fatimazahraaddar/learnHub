import { useEffect, useState } from "react";
import {
  BookOpen, Clock, Award, Play, ChevronRight,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchLearnerDashboardData, getStoredUser } from "../../../../api";
import { resolveCourseImage } from "../../../../lib/courseImage";

export function LearnerDashboards() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    stats: { courses: 0, completed: 0, hours: 0, certificates: 0, progress: 0 },
    courses: [],
    activity: [],
  });

  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      if (!user?.id) return;
      const { ok, data } = await fetchLearnerDashboardData(user.id);
      if (!ok || !data?.status) return;
      setDashboard(data);
    };

    load();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row g-4 mb-4">
        {[
          { icon: BookOpen, label: "Courses", value: String(dashboard.stats.courses), color: "#4A90E2", bg: "#EBF4FF" },
          { icon: CheckCircle, label: "Completed", value: String(dashboard.stats.completed), color: "#28A745", bg: "#F0FFF4" },
          { icon: Clock, label: "Hours", value: `${dashboard.stats.hours}h`, color: "#7F3FBF", bg: "#F3EBFF" },
          { icon: Award, label: "Certificates", value: String(dashboard.stats.certificates), color: "#FF7A00", bg: "#FFF3E8" },
        ].map((stat) => (
          <div key={stat.label} className="col-md-3">
            <div className="card stat-card p-3 shadow-sm">
              <div className="d-flex justify-content-between mb-2">
                <div className="icon-box" style={{ background: stat.bg }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <small className="text-muted">Live</small>
              </div>
              <h4 style={{ color: stat.color }}>{stat.value}</h4>
              <p className="text-muted small">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card p-4 shadow-sm mb-4">
            <div className="d-flex justify-content-between mb-3">
              <h5>Continue Learning</h5>
              <Link to="/learner/courses" className="text-primary">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            {dashboard.courses.map((course) => (
              <div key={course.id} className="d-flex align-items-center mb-3 p-2 rounded hover-box">
                <img src={resolveCourseImage(course.image, course.title)} alt={course.title} width="60" className="rounded me-3" />
                <div className="flex-grow-1">
                  <p className="mb-1 fw-semibold">{course.title}</p>
                  <small className="text-muted">{course.category}</small>

                  <div className="progress mt-2" style={{ height: "6px" }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Number(course.raw?.pivot?.progress || 0)}%`,
                        background: "linear-gradient(90deg,#4A90E2,#7F3FBF)",
                      }}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-sm btn-primary rounded-circle"
                  type="button"
                  onClick={() => navigate("/learner/lessons")}
                >
                  <Play size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded text-white mb-4"
            style={{ background: "linear-gradient(135deg,#4A90E2,#7F3FBF)" }}>
            <h5>Overall Progress</h5>
            <h2>{dashboard.stats.progress}%</h2>

            <div className="progress mt-3">
              <div className="progress-bar bg-white" style={{ width: `${dashboard.stats.progress}%` }} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-4 shadow-sm mb-4">
            <h6>Recent Activity</h6>

            {dashboard.activity.map((e) => (
              <div key={e.id} className="border p-2 rounded mb-2">
                <p className="fw-semibold mb-1">{e.action}</p>
                <small className="text-muted d-block">{e.course}</small>
                <small className="text-muted d-block">{e.time}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
