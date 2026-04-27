import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, BookOpen, ArrowLeft } from "lucide-react";
import { enrollInCourse, fetchCourseById, getStoredUser } from "../../lib/api";
import { resolveCourseImage } from "../../lib/courseImage";

export function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [info, setInfo] = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchCourseById(id);
      if (!ok || !data || data.status === false) {
        setInfo(data?.message || "Course not found");
        return;
      }
      setCourse(data);
    };
    load();
  }, [id]);

  const handleEnroll = async () => {
    const user = getStoredUser();
    if (!user?.id) {
      setInfo("Please login first.");
      return;
    }

    const { data } = await enrollInCourse(user.id, id);

    setInfo(data.message || (data.status ? "Enrolled" : "Enrollment failed"));
  };

  return (
    <div className="bg-light">
      <div className="py-5 text-white" style={{ background: "linear-gradient(135deg,#0f0c29,#302b63)" }}>
        <div className="container">
          <Link to="/courses" className="text-light d-inline-flex align-items-center mb-3">
            <ArrowLeft size={16} className="me-1" /> Back
          </Link>

          <div className="row">
            <div className="col-lg-8">
              <h2 className="mt-3 fw-bold">{course?.title || "Course"}</h2>
              <img
                src={resolveCourseImage(course?.image, course?.title)}
                alt={course?.title || "Course image"}
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "340px", objectFit: "cover", width: "100%" }}
              />
              <p className="text-light">{course?.description}</p>

              <div className="d-flex gap-3 small">
                <span><Clock size={14} /> Self paced</span>
                <span><BookOpen size={14} /> Online</span>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h4>${course?.price || "0.00"}</h4>
                  <button className="btn btn-primary w-100 mb-2" onClick={handleEnroll}>
                    Enroll Now
                  </button>
                  {info ? <div className="alert alert-info py-2 mb-0">{info}</div> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
