import { Award, Target, Users, Heart, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";
import { fetchHomePageData, fetchTeamMembers } from "../../api";
 
const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";
 
const VALUES = [
  { icon: Target, title: "Mission-Driven",  desc: "Accessible education for everyone.", color: PRIMARY   },
  { icon: Users,  title: "Community First", desc: "Learning together globally.",         color: ACCENT    },
  { icon: Award,  title: "Excellence",      desc: "High-quality courses only.",          color: "#FF7A00" },
  { icon: Heart,  title: "Learner-Centric", desc: "Focused on students.",                color: "#E91E8C" },
];
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 
  .ap-wrap { font-family: 'DM Sans', sans-serif; background: #F6F8FA; min-height: 100vh; }
 
  /* ── Hero ── */
  .ap-hero {
    background: linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%);
    padding: 56px 0 48px; text-align: center;
  }
  .ap-hero-tag {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 20px; margin-bottom: 16px;
    background: rgba(16,185,129,0.2); color: ${ACCENT};
    font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .ap-hero-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
    color: #fff; margin: 0 0 12px; line-height: 1.2;
  }
  .ap-hero-sub { font-size: 0.95rem; color: rgba(255,255,255,0.65); margin: 0; }
 
  /* ── Container ── */
  .ap-container { max-width: 1120px; margin: 0 auto; padding: 40px 24px; }
 
  /* ── Section tag (same pattern as blog/contact) ── */
  .ap-section-tag {
    font-size: 0.72rem; font-weight: 700; color: ${ACCENT};
    text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 2px;
  }
  .ap-section-tag-dark {
    font-size: 0.72rem; font-weight: 700; color: ${PRIMARY};
    text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 2px;
  }
  .ap-section-title {
    font-size: 1.5rem; font-weight: 800; color: ${PRIMARY}; margin: 0 0 8px; line-height: 1.25;
  }
  .ap-section-sub { font-size: 0.875rem; color: #8492A6; line-height: 1.7; margin: 0; }
 
  /* ── Stats grid ── */
  .ap-stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    margin-bottom: 36px;
  }
  @media (max-width: 768px) { .ap-stats-grid { grid-template-columns: repeat(2, 1fr); } }
 
  .ap-stat-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; padding: 24px 16px; text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .ap-stat-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); transform: translateY(-3px); }
  .ap-stat-value { font-size: 1.6rem; font-weight: 800; margin: 0 0 4px; }
  .ap-stat-label { font-size: 0.78rem; font-weight: 600; color: #A0AEC0; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
 
  /* ── Skeleton ── */
  .ap-skeleton {
    height: 20px; background: #E8ECF0; border-radius: 8px; margin-bottom: 8px;
    animation: apPulse 1.4s ease-in-out infinite;
  }
  @keyframes apPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
 
  /* ── Divider ── */
  .ap-divider { height: 1px; background: rgba(30,58,95,0.08); margin: 0; }
 
  /* ── Mission section ── */
  .ap-mission {
    background: #fff; padding: 56px 0;
  }
  .ap-mission-inner {
    max-width: 1120px; margin: 0 auto; padding: 0 24px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
  }
  @media (max-width: 768px) { .ap-mission-inner { grid-template-columns: 1fr; } }
 
  .ap-check-list { list-style: none; padding: 0; margin: 20px 0 0; }
  .ap-check-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid rgba(30,58,95,0.06);
    font-size: 0.875rem; font-weight: 600; color: ${PRIMARY};
  }
  .ap-check-item:last-child { border-bottom: none; }
  .ap-check-dot {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    background: rgba(16,185,129,0.15);
    display: flex; align-items: center; justify-content: center;
  }
  .ap-mission-img {
    width: 100%; height: 340px; object-fit: cover; display: block;
    border-radius: 16px;
    border: 2px solid rgba(16,185,129,0.2);
    box-shadow: 0 12px 40px rgba(30,58,95,0.15);
  }
 
  /* ── Values grid ── */
  .ap-values-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
  }
  @media (max-width: 900px) { .ap-values-grid { grid-template-columns: repeat(2, 1fr); } }
 
  .ap-value-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; padding: 24px 16px; text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .ap-value-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); transform: translateY(-3px); }
  .ap-value-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
  }
  .ap-value-title { font-size: 0.875rem; font-weight: 800; color: ${PRIMARY}; margin: 0 0 5px; }
  .ap-value-desc  { font-size: 0.78rem; color: #8492A6; margin: 0; line-height: 1.5; }
 
  /* ── Team ── */
  .ap-team-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;
  }
  @media (max-width: 900px) { .ap-team-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px)  { .ap-team-grid { grid-template-columns: 1fr; } }
 
  .ap-team-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .ap-team-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); transform: translateY(-3px); }
  .ap-team-img-wrap { position: relative; height: 200px; overflow: hidden; }
  .ap-team-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ap-team-overlay {
    position: absolute; bottom: 0; left: 0; width: 100%;
    padding: 28px 0 12px;
    background: linear-gradient(to top, rgba(30,58,95,0.85), transparent);
    display: flex; justify-content: center; gap: 8px;
  }
  .ap-social-btn {
    width: 30px; height: 30px; border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    transition: opacity 0.15s;
  }
  .ap-social-btn:hover { opacity: 0.8; }
  .ap-team-body { padding: 16px; text-align: center; }
  .ap-team-name { font-size: 0.875rem; font-weight: 800; color: ${PRIMARY}; margin: 0 0 3px; }
  .ap-team-role { font-size: 0.75rem; font-weight: 700; color: ${ACCENT}; margin: 0 0 8px; }
  .ap-team-bio  { font-size: 0.75rem; color: #8492A6; margin: 0; line-height: 1.5; }
 
  /* ── CTA ── */
  .ap-cta {
    background: linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%);
    padding: 56px 24px; text-align: center;
  }
  .ap-cta-tag {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 20px; margin-bottom: 16px;
    background: rgba(16,185,129,0.2); color: ${ACCENT};
    font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .ap-cta-title { font-size: 1.6rem; font-weight: 800; color: #fff; margin: 0 0 10px; }
  .ap-cta-sub   { font-size: 0.875rem; color: rgba(255,255,255,0.6); margin: 0 0 28px; }
  .ap-cta-btns  { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
  .ap-btn-primary {
    padding: 12px 32px; border-radius: 10px; border: none;
    background: ${ACCENT}; color: #fff;
    font-size: 0.875rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; text-decoration: none;
    box-shadow: 0 4px 16px rgba(16,185,129,0.4);
    transition: opacity 0.15s, transform 0.15s;
    display: inline-flex; align-items: center;
  }
  .ap-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); color: #fff; }
  .ap-btn-outline {
    padding: 12px 32px; border-radius: 10px;
    border: 2px solid rgba(255,255,255,0.35); color: #fff;
    font-size: 0.875rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; text-decoration: none; background: transparent;
    transition: border-color 0.15s, background 0.15s;
    display: inline-flex; align-items: center;
  }
  .ap-btn-outline:hover { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.07); color: #fff; }
 
  /* ── Section wrapper ── */
  .ap-section { padding: 48px 0; }
  .ap-section-center { text-align: center; margin-bottom: 28px; }
`;
 
export function AboutPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
 
  // Inject styles once
  if (typeof document !== "undefined" && !document.getElementById("ap-styles")) {
    const tag = document.createElement("style");
    tag.id = "ap-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }
 
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [homeRes, teamRes] = await Promise.all([
          fetchHomePageData(),
          fetchTeamMembers(),
        ]);
 
        const team         = Array.isArray(teamRes.data)      ? teamRes.data      : [];
        const home         = homeRes?.data ?? {};
        const courses      = Array.isArray(home.courses)      ? home.courses      : [];
        const testimonials = Array.isArray(home.testimonials) ? home.testimonials : [];
 
        setTeamMembers(team);
 
        const totalStudents     = courses.reduce((sum, c) => sum + Number(c.students || 0), 0);
        const totalCourses      = courses.length;
        const totalInstructors  = team.length;
        const totalCertificates = testimonials.length * 10;
 
        setStats([
          { label: "Learners",     value: `${totalStudents.toLocaleString()}+`,    color: PRIMARY },
          { label: "Courses",      value: `${totalCourses.toLocaleString()}+`,     color: ACCENT  },
          { label: "Instructors",  value: `${totalInstructors.toLocaleString()}+`, color: PRIMARY },
          { label: "Certificates", value: `${totalCertificates.toLocaleString()}+`,color: ACCENT  },
        ]);
      } catch (err) {
        console.error("AboutPage load error:", err);
        setStats([
          { label: "Learners",     value: "0+", color: PRIMARY },
          { label: "Courses",      value: "0+", color: ACCENT  },
          { label: "Instructors",  value: "0+", color: PRIMARY },
          { label: "Certificates", value: "0+", color: ACCENT  },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
 
  return (
    <div className="ap-wrap">
 
      {/* ── Hero ── */}
      <div className="ap-hero">
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div className="ap-hero-tag">About Us</div>
          <h1 className="ap-hero-title">Redefining How the World Learns</h1>
          <p className="ap-hero-sub">Our mission is to make quality education accessible to everyone, everywhere.</p>
        </div>
      </div>
 
      {/* ── Stats ── */}
      <div className="ap-container" style={{ paddingBottom: 0 }}>
        <div className="ap-stats-grid">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="ap-stat-card">
                  <div className="ap-skeleton" style={{ width: "60%", margin: "0 auto 10px" }} />
                  <div className="ap-skeleton" style={{ width: "40%", margin: "0 auto", height: 10 }} />
                </div>
              ))
            : stats.map((s) => (
                <div key={s.label} className="ap-stat-card">
                  <p className="ap-stat-value" style={{ color: s.color }}>{s.value}</p>
                  <p className="ap-stat-label">{s.label}</p>
                </div>
              ))
          }
        </div>
      </div>
 
      <div className="ap-divider" />
 
      {/* ── Mission ── */}
      <div className="ap-mission">
        <div className="ap-mission-inner">
          <div>
            <p className="ap-section-tag">Our Mission</p>
            <h2 className="ap-section-title">Making Education Accessible Worldwide</h2>
            <p className="ap-section-sub">
              We believe that learning should have no borders. Our platform connects ambitious
              learners with world-class instructors to build the skills of tomorrow.
            </p>
            <ul className="ap-check-list">
              {["Expert instructors", "Multi-language courses", "Scholarships", "Corporate training"].map((item) => (
                <li key={item} className="ap-check-item">
                  <div className="ap-check-dot">
                    <CheckCircle size={13} style={{ color: ACCENT }} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=80"
              alt="Our mission"
              className="ap-mission-img"
            />
          </div>
        </div>
      </div>
 
      <div className="ap-divider" />
 
      {/* ── Values ── */}
      <div className="ap-section" style={{ background: "#F6F8FA" }}>
        <div className="ap-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="ap-section-center">
            <p className="ap-section-tag-dark">Our Values</p>
            <h2 className="ap-section-title">What We Stand For</h2>
          </div>
          <div className="ap-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="ap-value-card">
                <div className="ap-value-icon" style={{ background: `${v.color}18` }}>
                  <v.icon size={20} style={{ color: v.color }} />
                </div>
                <p className="ap-value-title">{v.title}</p>
                <p className="ap-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      <div className="ap-divider" />
 
      {/* ── Team ── */}
      <div className="ap-section" style={{ background: "#fff" }}>
        <div className="ap-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="ap-section-center">
            <p className="ap-section-tag">Our Team</p>
            <h2 className="ap-section-title">Meet the People Behind LearnHub</h2>
          </div>
 
          {!loading && teamMembers.length === 0 ? (
            <p style={{ textAlign: "center", color: "#A0AEC0", fontSize: "0.875rem" }}>
              No team members found.
            </p>
          ) : (
            <div className="ap-team-grid">
              {teamMembers.map((member) => (
                <div key={member.id} className="ap-team-card">
                  <div className="ap-team-img-wrap">
                    <img src={member.image} alt={member.name} className="ap-team-img" />
                    <div className="ap-team-overlay">
                      <button
                        type="button" className="ap-social-btn"
                        style={{ background: `${ACCENT}cc` }}
                        onClick={() => member.linkedin && window.open(member.linkedin, "_blank", "noopener,noreferrer")}
                      >
                        <Linkedin size={13} color="white" />
                      </button>
                      <button
                        type="button" className="ap-social-btn"
                        style={{ background: `${PRIMARY}cc` }}
                        onClick={() => member.twitter && window.open(member.twitter, "_blank", "noopener,noreferrer")}
                      >
                        <Twitter size={13} color="white" />
                      </button>
                    </div>
                  </div>
                  <div className="ap-team-body">
                    <p className="ap-team-name">{member.name}</p>
                    <p className="ap-team-role">{member.role}</p>
                    <p className="ap-team-bio">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
 
      {/* ── CTA ── */}
      <div className="ap-cta">
        <div className="ap-cta-tag">Join Us</div>
        <h3 className="ap-cta-title">Join Our Mission</h3>
        <p className="ap-cta-sub">Be part of a community that's changing the future of education.</p>
        <div className="ap-cta-btns">
          <Link to="/auth"    className="ap-btn-primary">Start Learning</Link>
          <Link to="/trainer" className="ap-btn-outline">Become Instructor</Link>
        </div>
      </div>
 
    </div>
  );
}