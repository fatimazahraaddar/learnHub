import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Users, ArrowRight } from "lucide-react";
import { resolveCourseImage } from "../../lib/courseImage";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .cc-card {
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.22s, transform 0.22s;
    height: 100%;
  }
  .cc-card:hover {
    box-shadow: 0 10px 36px rgba(0,0,0,0.1);
    transform: translateY(-3px);
    text-decoration: none;
  }
 
  .cc-img-wrap {
    position: relative;
    overflow: hidden;
    height: 186px;
  }
  .cc-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    display: block;
  }
  .cc-card:hover .cc-img { transform: scale(1.04); }
 
  .cc-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,20,40,0.45) 0%, transparent 55%);
  }
 
  .cc-body {
    padding: 16px 18px 18px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
 
  .cc-category {
    display: inline-flex; align-items: center;
    padding: 4px 10px; border-radius: 20px;
    background: #EBF4FF; color: #4A90E2;
    font-size: 0.72rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.04em;
    margin-bottom: 10px; width: fit-content;
  }
 
  .cc-title {
    font-size: 0.95rem; font-weight: 700;
    color: #1A202C; line-height: 1.4;
    margin: 0 0 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
 
  .cc-meta {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 16px;
  }
  .cc-meta-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.78rem; color: #8492A6; font-weight: 500;
  }
 
  .cc-divider {
    height: 1px; background: #F0F3F7; margin-bottom: 14px;
  }
 
  .cc-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; padding: 9px 16px;
    border-radius: 10px; border: none;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 10px rgba(74,144,226,0.28);
    transition: opacity 0.15s, transform 0.15s;
    margin-top: auto;
  }
  .cc-btn:hover { opacity: 0.9; transform: translateY(-1px); }
`;
 
export function CourseCard({ id, title, category, students, students_count, duration, image }) {
  const studentCount = Number(students || students_count || 0);
  const imageSrc     = resolveCourseImage(image, title);
  const navigate     = useNavigate();
 
  useEffect(() => {
    if (document.getElementById("cc-styles")) return;
    const tag = document.createElement("style");
    tag.id = "cc-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }, []);
 
  return (
    <Link to={`/courses/${id}`} className="cc-card">
      {/* Image */}
      <div className="cc-img-wrap">
        <img
          src={imageSrc}
          alt={title}
          className="cc-img"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="cc-img-overlay" />
      </div>
 
      {/* Body */}
      <div className="cc-body">
        <span className="cc-category">{category || "General"}</span>
 
        <p className="cc-title">{title}</p>
 
        <div className="cc-meta">
          <span className="cc-meta-item">
            <Users size={13} />
            {studentCount.toLocaleString()} students
          </span>
          <span className="cc-meta-item">
            <Clock size={13} />
            {duration || "Self paced"}
          </span>
        </div>
 
        <div className="cc-divider" />
 
        <button
          className="cc-btn"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/courses/${id}`);
          }}
        >
          Enroll Now <ArrowRight size={14} />
        </button>
      </div>
    </Link>
  );
}