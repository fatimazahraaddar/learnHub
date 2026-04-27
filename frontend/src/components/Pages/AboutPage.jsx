import { Award, Target, Users, Heart, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";
import { fetchCourses, fetchTeamMembers, fetchTestimonials } from "../../lib/api";

const VALUES = [
{ icon: Target, title: "Mission-Driven", desc: "Accessible education for everyone.", color: "#4A90E2" },
{ icon: Users, title: "Community First", desc: "Learning together globally.", color: "#7F3FBF" },
{ icon: Award, title: "Excellence", desc: "High-quality courses only.", color: "#FF7A00" },
{ icon: Heart, title: "Learner-Centric", desc: "Focused on students.", color: "#28A745" },
];

export function AboutPage() {
const [teamMembers, setTeamMembers] = useState([]);
const [stats, setStats] = useState([
  { value: "0+", label: "Learners" },
  { value: "0+", label: "Courses" },
  { value: "0+", label: "Instructors" },
  { value: "0+", label: "Certificates" },
]);

useEffect(() => {
const load = async () => {
const [teamRes, courseRes, testimonialsRes] = await Promise.all([
  fetchTeamMembers(),
  fetchCourses(),
  fetchTestimonials(),
]);

const team = Array.isArray(teamRes.data) ? teamRes.data : [];
const courses = Array.isArray(courseRes.data) ? courseRes.data : [];
const testimonials = Array.isArray(testimonialsRes.data) ? testimonialsRes.data : [];

setTeamMembers(team);
setStats([
  { value: `${Math.max(courses.reduce((sum, c) => sum + Number(c.students || 0), 0), 0).toLocaleString()}+`, label: "Learners" },
  { value: `${courses.length.toLocaleString()}+`, label: "Courses" },
  { value: `${team.length.toLocaleString()}+`, label: "Instructors" },
  { value: `${(testimonials.length * 10).toLocaleString()}+`, label: "Certificates" },
]);
};
load();
}, []);

return ( <div>


  {/* HERO */}
  <div
    className="py-5 text-center text-white"
    style={{ background: "linear-gradient(135deg,#0f0c29,#302b63)" }}
  >
    <div className="container">
      <h1 className="fw-bold mb-3">About Us</h1>
      <p className="text-light">
        Redefining how the world learns.
      </p>
    </div>
  </div>

  {/* STATS */}
  <div className="container py-5">
    <div className="row text-center g-4">

      {stats.map((s) => (
        <div className="col-md-3" key={s.label}>
          <div className="card p-3 shadow-sm">
            <h4 className="text-primary fw-bold">{s.value}</h4>
            <small>{s.label}</small>
          </div>
        </div>
      ))}

    </div>
  </div>

  {/* MISSION */}
  <div className="container py-5">
    <div className="row align-items-center">

      <div className="col-lg-6">
        <h3 className="fw-bold">Our Mission</h3>
        <p className="text-muted">
          Making education accessible worldwide.
        </p>

        <ul className="list-unstyled">
          {[
            "Expert instructors",
            "Multi-language courses",
            "Scholarships",
            "Corporate training",
          ].map((item, i) => (
            <li key={i} className="d-flex align-items-center mb-2">
              <CheckCircle size={16} className="text-success me-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-lg-6">
        <img
          src="https://images.unsplash.com/photo-1758612214917-81d7956c09de?w=600"
          className="img-fluid rounded"
          alt="mission"
        />
      </div>

    </div>
  </div>

  {/* VALUES */}
  <div className="bg-light py-5">
    <div className="container">
      <h3 className="text-center mb-4 fw-bold">Our Values</h3>

      <div className="row g-4">

        {VALUES.map((v) => (
          <div key={v.title} className="col-md-3">

            <div className="card p-3 text-center shadow-sm">

              <v.icon size={30} style={{ color: v.color }} />

              <h6 className="mt-2">{v.title}</h6>
              <p className="text-muted small">{v.desc}</p>

            </div>

          </div>
        ))}

      </div>

    </div>
  </div>

  {/* TEAM */}
  <div className="container py-5">
    <h3 className="text-center mb-4 fw-bold">Our Team</h3>

    <div className="container">
      <div className="row g-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="col-12 col-sm-6 col-lg-3">
            
            <div className="card border-0 shadow-sm h-100 team-card">
              
              {/* IMAGE */}
              <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-100 h-100 object-fit-cover team-img"
                />

                {/* OVERLAY */}
                <div className="overlay d-flex align-items-end justify-content-center">
                  <div className="d-flex gap-2 mb-3">
                    
                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => {
                        if (member.linkedin) {
                          window.open(member.linkedin, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      <Linkedin size={14} color="white" />
                    </button>

                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => {
                        if (member.twitter) {
                          window.open(member.twitter, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      <Twitter size={14} color="white" />
                    </button>

                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="card-body text-center">
                <h5 className="mb-0">{member.name}</h5>
                <small className="text-primary">{member.role}</small>
                <p className="text-muted">{member.bio}</p>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  </div>

  {/* CTA */}
  <div
    className="text-center text-white py-5"
    style={{ background: "linear-gradient(135deg,#4A90E2,#7F3FBF)" }}
  >
    <h3 className="fw-bold">Join Our Mission</h3>

    <div className="mt-3">

      <Link to="/auth" className="btn btn-light me-2">
        Start Learning
      </Link>

      <Link to="/trainer" className="btn btn-outline-light">
        Become Instructor
      </Link>

    </div>

  </div>

</div>


);
}
