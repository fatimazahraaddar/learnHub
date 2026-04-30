import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { resolveCourseImage } from "../../lib/courseImage";

export function CourseCard({ id, title, category, students, duration, image }) {
  const studentCount = Number(students || 0);
  const imageSrc = resolveCourseImage(image, title);

  return (
    <Link to={`/courses/${id}`} className="card h-100 text-decoration-none border-0 shadow-sm course-card">
      <div className="position-relative overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover", transition: "transform 0.3s" }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <span className="badge mb-2"
          style={{ backgroundColor: "#EBF4FF", color: "#4A90E2", fontWeight: 600, fontSize: "0.75rem" }}>
          {category || "General"}
        </span>

        <h5 className="card-title text-dark" style={{ fontWeight: 600 }}>{title}</h5>

        <div className="d-flex align-items-center gap-3 mb-2">
          <div className="d-flex align-items-center gap-1">
            <Users size={14} className="text-muted" />
            <small className="text-muted">{studentCount.toLocaleString()}</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Clock size={14} className="text-muted" />
            <small className="text-muted">{duration || "Self paced"}</small>
          </div>
        </div>

        <div className="mt-auto pt-2 border-top">
          <button
            className="btn btn-primary btn-sm w-100"
            style={{ background: "#1E3A5F", borderColor: "#1E3A5F" }}
            onClick={(e) => { e.preventDefault(); window.location.href = `/courses/${id}`; }}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </Link>
  );
}