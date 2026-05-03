import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, BookOpen, ArrowLeft, ArrowRight, Users } from "lucide-react";
import { enrollInCourse, fetchCourseById, getStoredUser } from "../../api";
import { resolveCourseImage } from "../../lib/courseImage";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .cdp-wrap { font-family: 'DM Sans', sans-serif; background: #F6F8FA; min-height: 100vh; }
 
  /* Hero */
  .cdp-hero {
    background: linear-gradient(135deg, #0f0c29, #302b63);
    padding: 32px 0 48px;
  }
  .cdp-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.7);
    text-decoration: none; margin-bottom: 20px;
    transition: color 0.15s;
  }
  .cdp-back:hover { color: #fff; }
 
  .cdp-hero-title {
    font-size: 1.75rem; font-weight: 800; color: #fff;
    line-height: 1.3; margin: 0 0 8px;
  }
  .cdp-hero-category {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 20px;
    background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.85);
    font-size: 0.75rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.05em;
    margin-bottom: 14px;
  }
  .cdp-hero-desc {
    font-size: 0.9rem; color: rgba(255,255,255,0.75);
    line-height: 1.7; margin: 0 0 18px;
  }
  .cdp-hero-meta {
    display: flex; align-items: center; gap: 18px;
  }
  .cdp-meta-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.8rem; color: rgba(255,255,255,0.65); font-weight: 500;
  }
 
  /* Image */
  .cdp-img-wrap {
    border-radius: 14px; overflow: hidden;
    border: 2px solid rgba(255,255,255,0.1);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
    margin-bottom: 24px;
  }
  .cdp-img {
    width: 100%; max-height: 320px;
    object-fit: cover; display: block;
  }
 
  /* Layout */
  .cdp-body {
    max-width: 1100px; margin: 0 auto; padding: 0 20px;
  }
  .cdp-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 28px;
    align-items: start;
    margin-top: -36px;
  }
  @media (max-width: 768px) { .cdp-grid { grid-template-columns: 1fr; } }
 
  /* Sidebar card */
  .cdp-sidebar-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }
  .cdp-sidebar-body { padding: 22px; }
  .cdp-sidebar-title { font-size: 0.78rem; font-weight: 700; color: #8492A6; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 16px; }
 
  .cdp-enroll-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 12px 16px;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff; font-size: 0.9rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px rgba(74,144,226,0.35);
    transition: opacity 0.15s, transform 0.15s;
    margin-bottom: 12px;
  }
  .cdp-enroll-btn:hover { opacity: 0.9; transform: translateY(-1px); }
 
  .cdp-info-alert {
    padding: 10px 14px; border-radius: 9px;
    font-size: 0.82rem; font-weight: 500;
    background: #EBF4FF; border: 1px solid #BFDBFE; color: #1D4ED8;
  }
  .cdp-info-alert.success { background: #ECFDF5; border-color: #A7F3D0; color: #065F46; }
  .cdp-info-alert.error   { background: #FFF5F5; border-color: #FED7D7; color: #991B1B; }
 
  .cdp-sidebar-features {
    margin-top: 18px; padding-top: 16px;
    border-top: 1px solid #F0F3F7;
  }
  .cdp-feature {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; font-size: 0.82rem; color: #4A5568; font-weight: 500;
    border-bottom: 1px solid #F0F3F7;
  }
  .cdp-feature:last-child { border-bottom: none; }
  .cdp-feature-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
 
  /* Content card */
  .cdp-content-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 16px;
    overflow: hidden;
  }
  .cdp-content-header {
    padding: 18px 24px;
    border-bottom: 1px solid #F0F3F7;
    font-size: 1rem; font-weight: 700; color: #1A202C;
  }
  .cdp-content-body { padding: 24px; }
  .cdp-desc {
    font-size: 0.9rem; color: #4A5568; line-height: 1.8; margin: 0;
  }
`;
 
export function CourseDetailsPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [course, setCourse]   = useState(null);
  const [info, setInfo]       = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    if (document.getElementById("cdp-styles")) return;
    const tag = document.createElement("style");
    tag.id = "cdp-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }, []);
 
  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchCourseById(id);
      if (!ok || !data || data.status === false) {
        setInfo({ text: data?.message || "Course not found.", type: "error" });
        return;
      }
      setCourse(data);
    };
    load();
  }, [id]);
 
  const handleEnroll = async () => {
    const user = getStoredUser();
    if (!user?.id) {
      setInfo({ text: "Please login first.", type: "error" });
      navigate(`/courses/${id}/learn`);
      return;
    }
    setLoading(true);
    const { data } = await enrollInCourse(user.id, id);
    setLoading(false);
    setInfo({
      text: data.message || (data.status ? "Successfully enrolled!" : "Enrollment failed."),
      type: data.status ? "success" : "error",
    });
  };
 
  const studentCount = Number(course?.students || course?.students_count || 0);
 
  return (
    <div className="cdp-wrap">
      {/* Hero */}
      <div className="cdp-hero">
        <div className="cdp-body">
          <Link to="/courses" className="cdp-back">
            <ArrowLeft size={14} /> Back to Courses
          </Link>
 
          {course?.category && (
            <div className="cdp-hero-category">{course.category}</div>
          )}
          <h1 className="cdp-hero-title">{course?.title || "Course"}</h1>
 
          <div className="cdp-hero-meta">
            <span className="cdp-meta-item"><Clock size={13} /> Self paced</span>
            <span className="cdp-meta-item"><BookOpen size={13} /> Online</span>
            {studentCount > 0 && (
              <span className="cdp-meta-item">
                <Users size={13} /> {studentCount.toLocaleString()} students
              </span>
            )}
          </div>
        </div>
      </div>
 
      {/* Body grid */}
      <div className="cdp-body">
        <div className="cdp-grid">
 
          {/* Left — image + description */}
          <div>
            <div className="cdp-img-wrap">
              <img
                src={resolveCourseImage(course?.image, course?.title)}
                alt={course?.title || "Course image"}
                className="cdp-img"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
 
            <div className="cdp-content-card">
              <div className="cdp-content-header">About this course</div>
              <div className="cdp-content-body">
                <p className="cdp-desc">
                  {course?.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
 
          {/* Right — enroll card */}
          <div className="cdp-sidebar-card">
            <div className="cdp-sidebar-body">
              <p className="cdp-sidebar-title">Ready to start?</p>
 
              <button
                className="cdp-enroll-btn"
                onClick={handleEnroll}
                disabled={loading}
                type="button"
              >
                {loading ? "Enrolling…" : <><ArrowRight size={15} /> Enroll Now</>}
              </button>
 
              {info.text && (
                <div className={`cdp-info-alert ${info.type}`}>{info.text}</div>
              )}
 
              <div className="cdp-sidebar-features">
                {[
                  { icon: Clock,     bg: "#EBF4FF", color: "#4A90E2", label: "Self paced learning"   },
                  { icon: BookOpen,  bg: "#F3EBFF", color: "#7F3FBF", label: "Online access"          },
                  { icon: Users,     bg: "#ECFDF5", color: "#16A34A", label: "Community support"      },
                ].map(({ icon, bg, color, label }) => {
                  const FeatureIcon = icon;
                  return (
                    <div key={label} className="cdp-feature">
                      <div className="cdp-feature-icon" style={{ background: bg }}>
                        <FeatureIcon size={14} color={color} />
                      </div>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}