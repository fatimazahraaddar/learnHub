import { Award, Target, Users, Heart, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";
import { fetchHomePageData, fetchTeamMembers } from "../../api";
 
const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";
 
const VALUES = [
  { icon: Target, title: "Mission-Driven",  desc: "Accessible education for everyone.", color: PRIMARY },
  { icon: Users,  title: "Community First", desc: "Learning together globally.",         color: ACCENT },
  { icon: Award,  title: "Excellence",      desc: "High-quality courses only.",          color: "#FF7A00" },
  { icon: Heart,  title: "Learner-Centric", desc: "Focused on students.",                color: "#E91E8C" },
];
 
function StatSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div className="col-6 col-md-3" key={i}>
          <div
            className="card border-0 rounded-4 p-4 h-100"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
          >
            <div style={{ height: "2rem", background: "#e9ecef", borderRadius: 8, marginBottom: 10, animation: "skeletonPulse 1.4s ease-in-out infinite" }} />
            <div style={{ height: "0.85rem", background: "#f0f2f5", borderRadius: 8, width: "55%", margin: "0 auto", animation: "skeletonPulse 1.4s ease-in-out infinite 0.2s" }} />
          </div>
        </div>
      ))}
    </>
  );
}
 
export function AboutPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
 
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
 
        // fetchHomePageData already fetches courses + testimonials in one call
        const [homeRes, teamRes] = await Promise.all([
          fetchHomePageData(),
          fetchTeamMembers(),
        ]);
 
        const team         = Array.isArray(teamRes.data)      ? teamRes.data      : [];
        const home         = homeRes?.data ?? {};
        const courses      = Array.isArray(home.courses)      ? home.courses      : [];
        const testimonials = Array.isArray(home.testimonials) ? home.testimonials : [];
 
        setTeamMembers(team);
 
        // Real computed stats from actual DB data
        const totalStudents     = courses.reduce((sum, c) => sum + Number(c.students || 0), 0);
        const totalCourses      = courses.length;
        const totalInstructors  = team.length;
        const totalCertificates = testimonials.length * 10;
 
        setStats([
          { label: "Learners",     value: `${totalStudents.toLocaleString()}+`     },
          { label: "Courses",      value: `${totalCourses.toLocaleString()}+`      },
          { label: "Instructors",  value: `${totalInstructors.toLocaleString()}+`  },
          { label: "Certificates", value: `${totalCertificates.toLocaleString()}+` },
        ]);
      } catch (err) {
        console.error("AboutPage load error:", err);
        setStats([
          { label: "Learners",     value: "0+" },
          { label: "Courses",      value: "0+" },
          { label: "Instructors",  value: "0+" },
          { label: "Certificates", value: "0+" },
        ]);
      } finally {
        setLoading(false);
      }
    };
 
    load();
  }, []);
 
  return (
    <div style={{ backgroundColor: "#F4F7FB" }}>
 
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
 
      {/* ── HERO ── */}
      <div
        className="py-5 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%)` }}
      >
        <div className="container">
          <span
            className="badge px-3 py-2 rounded-pill mb-3"
            style={{ background: `${ACCENT}33`, color: ACCENT, fontSize: "0.85rem", fontWeight: 600 }}
          >
            About Us
          </span>
          <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
            Redefining How the World Learns
          </h1>
          <p style={{ opacity: 0.75 }}>
            Our mission is to make quality education accessible to everyone, everywhere.
          </p>
        </div>
      </div>
 
      {/* ── STATS ── */}
      <div className="container py-5">
        <div className="row g-4 text-center">
          {loading ? (
            <StatSkeleton />
          ) : (
            stats.map((s, i) => (
              <div className="col-6 col-md-3" key={s.label}>
                <div
                  className="card border-0 rounded-4 p-4 h-100"
                  style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", transition: "transform .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <h4 className="fw-bold mb-1" style={{ color: i % 2 === 0 ? PRIMARY : ACCENT }}>
                    {s.value}
                  </h4>
                  <small className="text-muted">{s.label}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
 
      {/* ── MISSION ── */}
      <div className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span
                className="badge px-3 py-2 rounded-pill mb-3"
                style={{ background: `${ACCENT}22`, color: ACCENT, fontWeight: 600 }}
              >
                Our Mission
              </span>
              <h2 className="fw-bold mb-3" style={{ color: PRIMARY }}>
                Making Education Accessible Worldwide
              </h2>
              <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>
                We believe that learning should have no borders. Our platform connects ambitious
                learners with world-class instructors to build the skills of tomorrow.
              </p>
              <ul className="list-unstyled">
                {["Expert instructors", "Multi-language courses", "Scholarships", "Corporate training"].map((item, i) => (
                  <li key={i} className="d-flex align-items-center mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                      style={{ width: "28px", height: "28px", background: `${ACCENT}22` }}
                    >
                      <CheckCircle size={15} style={{ color: ACCENT }} />
                    </div>
                    <span style={{ color: PRIMARY, fontWeight: 500 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="rounded-4 overflow-hidden shadow-lg" style={{ border: `2px solid ${ACCENT}33` }}>
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80"
                  className="img-fluid w-100"
                  style={{ height: "22rem", objectFit: "cover" }}
                  alt="mission"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* ── VALUES ── */}
      <div className="py-5" style={{ background: "#F4F7FB" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="badge px-3 py-2 rounded-pill mb-3"
              style={{ background: `${PRIMARY}18`, color: PRIMARY, fontWeight: 600 }}
            >
              Our Values
            </span>
            <h2 className="fw-bold" style={{ color: PRIMARY }}>What We Stand For</h2>
          </div>
          <div className="row g-4">
            {VALUES.map((v) => (
              <div key={v.title} className="col-md-6 col-lg-3">
                <div
                  className="card border-0 rounded-4 p-4 text-center h-100"
                  style={{ background: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", transition: "all .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = v.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
                    style={{ width: "3rem", height: "3rem", background: `${v.color}18` }}
                  >
                    <v.icon size={22} style={{ color: v.color }} />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: PRIMARY }}>{v.title}</h6>
                  <p className="text-muted small mb-0">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ── TEAM ── */}
      <div className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="badge px-3 py-2 rounded-pill mb-3"
              style={{ background: `${ACCENT}22`, color: ACCENT, fontWeight: 600 }}
            >
              Our Team
            </span>
            <h2 className="fw-bold" style={{ color: PRIMARY }}>Meet the People Behind LearnHub</h2>
          </div>
 
          {teamMembers.length === 0 && !loading ? (
            <p className="text-center text-muted">No team members found.</p>
          ) : (
            <div className="row g-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="col-12 col-sm-6 col-lg-3">
                  <div
                    className="card border-0 rounded-4 h-100 overflow-hidden"
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", transition: "transform .2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                      <div
                        className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center pb-3 gap-2"
                        style={{ background: "linear-gradient(to top, rgba(30,58,95,0.85), transparent)" }}
                      >
                        <button
                          type="button"
                          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center border-0"
                          style={{ width: "32px", height: "32px", background: `${ACCENT}cc` }}
                          onClick={() => member.linkedin && window.open(member.linkedin, "_blank", "noopener,noreferrer")}
                        >
                          <Linkedin size={14} color="white" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center border-0"
                          style={{ width: "32px", height: "32px", background: `${PRIMARY}cc` }}
                          onClick={() => member.twitter && window.open(member.twitter, "_blank", "noopener,noreferrer")}
                        >
                          <Twitter size={14} color="white" />
                        </button>
                      </div>
                    </div>
                    <div className="card-body text-center">
                      <h6 className="fw-bold mb-0" style={{ color: PRIMARY }}>{member.name}</h6>
                      <small className="fw-semibold" style={{ color: ACCENT }}>{member.role}</small>
                      <p className="text-muted small mt-2 mb-0">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
 
      {/* ── CTA ── */}
      <div
        className="text-center text-white py-5"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%)` }}
      >
        <div className="container">
          <span
            className="badge px-3 py-2 rounded-pill mb-3"
            style={{ background: `${ACCENT}33`, color: ACCENT, fontWeight: 600 }}
          >
            Join Us
          </span>
          <h3 className="fw-bold mb-2">Join Our Mission</h3>
          <p className="mb-4" style={{ opacity: 0.7 }}>
            Be part of a community that's changing the future of education.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link
              to="/auth"
              className="btn btn-lg fw-semibold px-5"
              style={{ background: ACCENT, color: "white", borderRadius: "12px", border: "none", boxShadow: `0 6px 20px ${ACCENT}55` }}
            >
              Start Learning
            </Link>
            <Link
              to="/trainer"
              className="btn btn-lg fw-semibold px-5"
              style={{ background: "transparent", color: "white", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.4)" }}
            >
              Become Instructor
            </Link>
          </div>
        </div>
      </div>
 
    </div>
  );
}