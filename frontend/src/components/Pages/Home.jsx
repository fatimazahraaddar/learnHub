import {
  ArrowRight, Play, Star, Users, BookOpen, Award, TrendingUp,
  CheckCircle, ChevronRight, Code, BarChart2, Megaphone, Palette,
  Briefcase, Camera, Globe, Music, Cpu, PenTool,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CourseCard } from "../Pages/CourseCard";
import { fetchHomePageData } from "../../api";

const ICON_MAP = {
  code: Code, chart: BarChart2, megaphone: Megaphone, palette: Palette,
  briefcase: Briefcase, camera: Camera, globe: Globe, music: Music,
  cpu: Cpu, pen: PenTool, design: Palette, graphic: PenTool,
  book: BookOpen, trending: TrendingUp, users: Users, award: Award,
};

function CategoryIcon({ name }) {
  const key = (name || "").toLowerCase().trim();
  const match = Object.keys(ICON_MAP).find((k) => key.includes(k));
  const Icon = match ? ICON_MAP[match] : BookOpen;
  return <Icon size={28} />;
}

const BENEFITS = [
  { icon: "🎓", title: "Expert-Led Courses", desc: "Learn from industry professionals with years of real-world experience." },
  { icon: "📱", title: "Learn Anywhere", desc: "Access courses on any device, anytime. Our platform is fully mobile responsive." },
  { icon: "🏆", title: "Earn Certificates", desc: "Get recognized with industry-accepted certificates upon course completion." },
  { icon: "💬", title: "Community Support", desc: "Join a vibrant community of learners for peer support and networking." },
  { icon: "⚡", title: "Self-Paced Learning", desc: "No deadlines. Learn at your own pace with lifetime course access." },
  { icon: "🔒", title: "Secure Platform", desc: "Your data and progress are protected with enterprise-grade security." },
];

const CATEGORY_COLORS = [
  { bg: "#E8F4FD", color: "#1E3A5F" },
  { bg: "#ECFDF5", color: "#10B981" },
  { bg: "#FFF3E0", color: "#FF7A00" },
  { bg: "#F3EBFF", color: "#7F3FBF" },
  { bg: "#FFF0F6", color: "#E91E8C" },
  { bg: "#ECFDF5", color: "#059669" },
  { bg: "#EEF2FF", color: "#3B4FBF" },
  { bg: "#FCE4EC", color: "#E53935" },
];

const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";

export function HomePage() {
  const [homeData, setHomeData] = useState({ stats: [], categories: [], courses: [], testimonials: [] });
  const [message, setMessage]   = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchHomePageData();
      if (!ok || !data) { setMessage("Unable to load homepage data."); return; }
      setHomeData({
        stats:        Array.isArray(data.stats)        ? data.stats        : [],
        categories:   Array.isArray(data.categories)   ? data.categories   : [],
        courses:      Array.isArray(data.courses)      ? data.courses      : [],
        testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
      });
    };
    load();
  }, []);

  const statsWithIcons = [
    { icon: Users,      ...(homeData.stats[0] || { label: "Active Learners",     value: "0+" }) },
    { icon: BookOpen,   ...(homeData.stats[1] || { label: "Courses Available",   value: "0+" }) },
    { icon: Award,      ...(homeData.stats[2] || { label: "Certificates Issued", value: "0+" }) },
    { icon: TrendingUp, ...(homeData.stats[3] || { label: "Completion Rate",     value: "0%" }) },
  ];

  return (
    <div className="bg-white">
      {message && <div className="alert alert-warning m-3">{message}</div>}

      {/* ───── HERO ───── */}
      <section className="position-relative overflow-hidden py-5"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 60%, #0D2137 100%)`, minHeight: "92vh", display: "flex", alignItems: "center" }}>

        {/* blobs */}
        <div className="position-absolute rounded-circle"
          style={{ width: "32rem", height: "32rem", top: "-6rem", left: "-6rem", filter: "blur(5rem)", backgroundColor: ACCENT, opacity: 0.12 }} />
        <div className="position-absolute rounded-circle"
          style={{ width: "24rem", height: "24rem", bottom: "-4rem", right: "-4rem", filter: "blur(5rem)", backgroundColor: ACCENT, opacity: 0.1 }} />

        <div className="container position-relative">
          <div className="row align-items-center g-5">

            {/* ── Texte gauche ── */}
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
                style={{ backgroundColor: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}55` }}>
                <Star size={14} />
                <span className="small fw-semibold">Rated #1 E-Learning Platform 2026</span>
              </div>

              <h1 className="text-white mb-4"
                style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 800, lineHeight: 1.12 }}>
                Learn Without <br />
                <span style={{ color: ACCENT }}>Limits.</span>
              </h1>

              <p className="text-light lead mb-4" style={{ opacity: 0.85 }}>
                Master in-demand skills with 1,200+ expert-led courses. Join 500,000+ learners advancing their careers on LearnHub.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/courses" className="btn btn-lg px-4 d-inline-flex align-items-center gap-2 fw-semibold"
                  style={{ background: ACCENT, color: "white", borderRadius: "12px", boxShadow: `0 8px 24px ${ACCENT}55`, border: "none" }}>
                  Explore Courses <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* ── Image droite ── */}
            <div className="col-lg-6 d-none d-lg-block position-relative">
              <div className="rounded-4 overflow-hidden shadow-lg" style={{ border: `2px solid ${ACCENT}44` }}>
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80"
                  alt="Learning" className="img-fluid w-100" style={{ height: "26rem", objectFit: "cover" }} />
              </div>
              <div className="position-absolute bg-white rounded-3 p-3 shadow-lg"
                style={{ bottom: "-1rem", left: "-2rem", minWidth: "200px" }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ width: "2.5rem", height: "2.5rem", backgroundColor: `${ACCENT}22` }}>
                    <TrendingUp size={18} style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <p className="small text-muted mb-0">This week</p>
                    <p className="mb-0 fw-semibold">+2,400 new learners</p>
                  </div>
                </div>
              </div>
              <div className="position-absolute bg-white rounded-3 p-3 shadow-lg"
                style={{ top: "-1rem", right: "-1rem", minWidth: "190px" }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ width: "2.5rem", height: "2.5rem", backgroundColor: `${PRIMARY}18` }}>
                    <Award size={18} style={{ color: PRIMARY }} />
                  </div>
                  <div>
                    <p className="small text-muted mb-0">Certificates issued</p>
                    <p className="mb-0 fw-semibold">120,000+</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section id="featured-courses" className="py-5" style={{ background: "#F4F7FB" }}>
        <div className="container">
          <div className="row g-4">
            {statsWithIcons.map((stat, i) => (
              <div key={stat.label} className="col-6 col-lg-3">
                <div className="card text-center border-0 rounded-4 p-4 h-100"
                  style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", transition: "transform .2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
                    style={{ width: "3.2rem", height: "3.2rem", background: CATEGORY_COLORS[i % CATEGORY_COLORS.length].bg }}>
                    <stat.icon size={22} style={{ color: CATEGORY_COLORS[i % CATEGORY_COLORS.length].color }} />
                  </div>
                  <p className="fs-3 fw-bold mb-1" style={{ color: PRIMARY }}>{stat.value}</p>
                  <p className="text-muted small mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-3"
              style={{ background: `${ACCENT}22`, color: ACCENT, fontSize: "0.85rem", fontWeight: 600 }}>
              Categories
            </span>
            <h2 className="fw-bold mb-2" style={{ fontSize: "2rem", color: PRIMARY }}>Explore Top Categories</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "36rem" }}>
              Find courses in your field of interest and start building valuable skills today.
            </p>
          </div>
          <div className="row g-3">
            {homeData.categories.map((cat, i) => {
              const palette = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <div key={cat.id} className="col-6 col-sm-4 col-lg-3">
                  <Link to="/courses" className="text-decoration-none">
                    <div className="card border-0 rounded-4 p-4 text-center h-100"
                      style={{ background: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", transition: "all .25s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${palette.color}30`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}>
                      <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
                        style={{ width: "3.5rem", height: "3.5rem", background: palette.bg }}>
                        <span style={{ color: palette.color }}><CategoryIcon name={cat.icon || cat.name} /></span>
                      </div>
                      <h3 className="fs-6 fw-bold mb-1" style={{ color: PRIMARY }}>{cat.name}</h3>
                      <p className="small mb-0" style={{ color: palette.color, fontWeight: 600 }}>{cat.count} courses</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── FEATURED COURSES ───── */}
      <section className="py-5" style={{ background: "#F4F7FB" }}>
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge px-3 py-2 rounded-pill mb-2"
              style={{ background: `${PRIMARY}18`, color: PRIMARY, fontSize: "0.85rem", fontWeight: 600 }}>
              Featured
            </span>
            <h2 className="fw-bold mb-2" style={{ fontSize: "2rem", color: PRIMARY }}>Top Courses</h2>
            <Link to="/courses" className="d-inline-flex align-items-center gap-1 text-decoration-none fw-semibold"
              style={{ color: ACCENT }}>
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="row g-4">
            {homeData.courses.slice(0, 6).map((course) => (
              <div key={course.id} className="col-12 col-sm-6 col-lg-4">
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── BENEFITS ───── */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-3"
              style={{ background: `${ACCENT}22`, color: ACCENT, fontSize: "0.85rem", fontWeight: 600 }}>
              Why LearnHub
            </span>
            <h2 className="fw-bold mb-2" style={{ fontSize: "2rem", color: PRIMARY }}>Everything You Need to Succeed</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "36rem" }}>
              Built for ambitious learners who want real results, not just theory.
            </p>
          </div>
          <div className="row g-4">
            {BENEFITS.map((b, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-4">
                <div className="rounded-4 p-4 h-100"
                  style={{ background: "white", border: `1px solid ${PRIMARY}15`, boxShadow: "0 2px 16px rgba(0,0,0,0.05)", transition: "transform .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${PRIMARY}15`; }}>
                  <div className="fs-2 mb-3">{b.icon}</div>
                  <h3 className="fs-5 fw-bold mb-2" style={{ color: PRIMARY }}>{b.title}</h3>
                  <p className="text-muted mb-0" style={{ lineHeight: 1.6 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ───── CTA ───── */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="rounded-4 p-5 text-center"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}12, ${ACCENT}18)`, border: `1px solid ${PRIMARY}20`, boxShadow: `0 8px 32px ${PRIMARY}18` }}>
            <h2 className="fw-bold mb-3" style={{ fontSize: "2rem", color: PRIMARY }}>Start Your Learning Journey Today</h2>
            <p className="text-muted mb-4">Join 500,000+ learners. Get unlimited access to 1,200+ expert courses.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/auth" className="btn btn-lg px-5 d-inline-flex align-items-center gap-2 fw-semibold"
                style={{ background: PRIMARY, color: "white", borderRadius: "12px", boxShadow: `0 8px 24px ${PRIMARY}44`, border: "none" }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/subscription" className="btn btn-lg px-5 d-inline-flex align-items-center gap-2 fw-semibold"
                style={{ borderRadius: "12px", border: `2px solid ${ACCENT}`, color: ACCENT, background: "white" }}>
                View Pricing
              </Link>
            </div>
            <p className="text-muted mt-4 mb-0">
              <CheckCircle size={16} style={{ color: ACCENT }} className="me-1" />
              No credit card required · Free 7-day trial
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}