import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { fetchLearnerCourses, getStoredUser } from "../../../../api";
import { resolveCourseImage } from "../../../../lib/courseImage";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .lc-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .lc-toolbar {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
    margin-bottom: 20px;
  }
  .lc-toolbar-title { font-size: 1.15rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  .lc-search {
    display: flex; align-items: center; gap: 8px;
    background: #F6F8FA; border: 1px solid #E8ECF0;
    border-radius: 10px; padding: 7px 14px; min-width: 220px;
  }
  .lc-search input {
    border: none; background: transparent; outline: none;
    font-size: 0.875rem; color: #1A202C;
    font-family: 'DM Sans', sans-serif; width: 170px;
  }
  .lc-search input::placeholder { color: #A0AEC0; }
 
  .lc-alert {
    padding: 10px 14px; border-radius: 9px;
    font-size: 0.85rem; font-weight: 500; margin-bottom: 16px;
    background: #FFFBEB; border: 1px solid #FDE68A; color: #D97706;
  }
 
  .lc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }
 
  .lc-course-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .lc-course-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
 
  .lc-course-img {
    width: 100%; height: 160px; object-fit: cover;
    display: block; border-bottom: 1px solid #E8ECF0;
  }
  .lc-course-body { padding: 16px; }
  .lc-course-tag {
    display: inline-block;
    padding: 3px 9px; border-radius: 20px;
    background: #EBF4FF; color: #4A90E2;
    font-size: 0.72rem; font-weight: 600;
    margin-bottom: 8px;
  }
  .lc-course-title {
    font-size: 0.9rem; font-weight: 700; color: #1A202C;
    margin: 0 0 6px; line-height: 1.4;
  }
  .lc-course-desc {
    font-size: 0.8rem; color: #8492A6; margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
 
  .lc-empty {
    text-align: center; padding: 60px 20px;
    color: #A0AEC0; font-size: 0.875rem;
  }
`;
 
export function LearnerCourses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery]     = useState("");
  const [message, setMessage] = useState("");
 
  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      if (!user?.id) { setMessage("Please login first."); return; }
      const { ok, data } = await fetchLearnerCourses(user.id);
      if (!ok || !Array.isArray(data)) { setMessage(data.message || "Failed to load courses."); return; }
      setCourses(data);
    };
    load();
  }, []);
 
  const filtered = courses.filter((c) =>
    (c.title || "").toLowerCase().includes(query.toLowerCase())
  );
 
  return (
    <div className="lc-wrap">
      <style>{styles}</style>
 
      {/* Toolbar */}
      <div className="lc-toolbar">
        <span className="lc-toolbar-title">My Courses ({filtered.length})</span>
        <div className="lc-search">
          <Search size={15} color="#A0AEC0" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
 
      {message && <div className="lc-alert">{message}</div>}
 
      {/* Grid */}
      {filtered.length === 0 && !message ? (
        <div className="lc-empty">No courses found.</div>
      ) : (
        <div className="lc-grid">
          {filtered.map((course) => (
            <div key={course.id} className="lc-course-card">
              <img
                src={resolveCourseImage(course.image, course.title)}
                alt={course.title}
                className="lc-course-img"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="lc-course-body">
                <span className="lc-course-tag">Course</span>
                <p className="lc-course-title">{course.title}</p>
                <p className="lc-course-desc">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}