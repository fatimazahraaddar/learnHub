import { useEffect, useState } from "react";
import {
  BookOpen, Clock, Award, Play, ChevronRight, CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchLearnerDashboardData, getStoredUser } from "../../../../api";
import { resolveCourseImage } from "../../../../lib/courseImage";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .ld-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .ld-stat-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 20px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .ld-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .ld-stat-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .ld-stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1.1; margin-bottom: 4px; color: #1A202C; }
  .ld-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
 
  .ld-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .ld-card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #F0F3F7;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ld-card-title { font-size: 1rem; font-weight: 700; color: #1A202C; margin: 0; }
  .ld-card-body  { padding: 20px; }
 
  .ld-view-all {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.82rem; font-weight: 600; color: #4A90E2;
    text-decoration: none; transition: opacity 0.15s;
  }
  .ld-view-all:hover { opacity: 0.75; }
 
  .ld-course-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #F0F3F7;
    transition: background 0.15s;
  }
  .ld-course-item:last-child { border-bottom: none; padding-bottom: 0; }
  .ld-course-img {
    width: 60px; height: 52px;
    border-radius: 10px; object-fit: cover; flex-shrink: 0;
    border: 1px solid #E8ECF0;
  }
  .ld-course-title { font-size: 0.875rem; font-weight: 600; color: #1A202C; margin: 0 0 2px; }
  .ld-course-cat   { font-size: 0.75rem; color: #A0AEC0; }
 
  .ld-progress-bar {
    height: 5px; border-radius: 99px;
    background: #E8ECF0; overflow: hidden; margin-top: 8px;
  }
  .ld-progress-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #4A90E2, #7F3FBF);
  }
 
  .ld-play-btn {
    display: flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    border: none; color: #fff; cursor: pointer;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
    transition: opacity 0.15s, transform 0.15s;
  }
  .ld-play-btn:hover { opacity: 0.9; transform: scale(1.05); }
 
  .ld-progress-card {
    border-radius: 14px; padding: 24px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff; margin-bottom: 20px;
  }
  .ld-progress-title { font-size: 0.85rem; font-weight: 600; opacity: 0.85; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .ld-progress-value { font-size: 2.5rem; font-weight: 700; line-height: 1; margin: 0 0 16px; }
  .ld-progress-track {
    height: 7px; border-radius: 99px;
    background: rgba(255,255,255,0.25); overflow: hidden;
  }
  .ld-progress-track-fill {
    height: 100%; border-radius: 99px; background: #fff;
    transition: width 0.4s ease;
  }
 
  .ld-activity-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid #F0F3F7;
  }
  .ld-activity-item:last-child { border-bottom: none; padding-bottom: 0; }
  .ld-activity-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #4A90E2; flex-shrink: 0; margin-top: 6px;
  }
  .ld-activity-action { font-size: 0.875rem; font-weight: 600; color: #1A202C; margin: 0 0 2px; }
  .ld-activity-course { font-size: 0.78rem; color: #4A5568; margin: 0 0 2px; }
  .ld-activity-time   { font-size: 0.72rem; color: #A0AEC0; margin: 0; }
`;
 
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
 
  const statItems = [
    { icon: BookOpen,     label: "Courses",      value: String(dashboard.stats.courses),      color: "#4A90E2", bg: "#EBF4FF" },
    { icon: CheckCircle,  label: "Completed",    value: String(dashboard.stats.completed),    color: "#16A34A", bg: "#ECFDF5" },
    { icon: Clock,        label: "Hours",        value: `${dashboard.stats.hours}h`,          color: "#7F3FBF", bg: "#F3EBFF" },
    { icon: Award,        label: "Certificates", value: String(dashboard.stats.certificates), color: "#FF7A00", bg: "#FFF3E8" },
  ];
 
  return (
    <div className="ld-wrap">
      <style>{styles}</style>
 
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 22 }}>
        {statItems.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="ld-stat-card">
              <div className="ld-stat-icon" style={{ background: s.bg }}>
                <Icon size={18} color={s.color} />
              </div>
              <div className="ld-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="ld-stat-label">{s.label}</div>
            </div>
          );
        })}
      </div>
 
      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
 
        {/* Left column */}
        <div>
          {/* Continue Learning */}
          <div className="ld-card">
            <div className="ld-card-header">
              <span className="ld-card-title">Continue Learning</span>
              <Link to="/learner/courses" className="ld-view-all">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="ld-card-body">
              {dashboard.courses.length === 0 && (
                <p style={{ color: "#A0AEC0", fontSize: "0.875rem", textAlign: "center", padding: "20px 0", margin: 0 }}>
                  No courses yet.
                </p>
              )}
              {dashboard.courses.map((course) => (
                <div key={course.id} className="ld-course-item">
                  <img
                    src={resolveCourseImage(course.image, course.title)}
                    alt={course.title}
                    className="ld-course-img"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="ld-course-title">{course.title}</p>
                    <span className="ld-course-cat">{course.category}</span>
                    <div className="ld-progress-bar">
                      <div
                        className="ld-progress-fill"
                        style={{ width: `${Number(course.raw?.pivot?.progress || 0)}%` }}
                      />
                    </div>
                  </div>
                  <button
                    className="ld-play-btn"
                    type="button"
                    onClick={() => navigate("/learner/lessons")}
                  >
                    <Play size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
 
          {/* Overall Progress */}
          <div className="ld-progress-card">
            <p className="ld-progress-title">Overall Progress</p>
            <p className="ld-progress-value">{dashboard.stats.progress}%</p>
            <div className="ld-progress-track">
              <div className="ld-progress-track-fill" style={{ width: `${dashboard.stats.progress}%` }} />
            </div>
          </div>
        </div>
 
        {/* Right column — Recent Activity */}
        <div className="ld-card">
          <div className="ld-card-header">
            <span className="ld-card-title">Recent Activity</span>
          </div>
          <div className="ld-card-body">
            {dashboard.activity.length === 0 && (
              <p style={{ color: "#A0AEC0", fontSize: "0.875rem", textAlign: "center", padding: "20px 0", margin: 0 }}>
                No activity yet.
              </p>
            )}
            {dashboard.activity.map((e) => (
              <div key={e.id} className="ld-activity-item">
                <div className="ld-activity-dot" />
                <div>
                  <p className="ld-activity-action">{e.action}</p>
                  <p className="ld-activity-course">{e.course}</p>
                  <p className="ld-activity-time">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}