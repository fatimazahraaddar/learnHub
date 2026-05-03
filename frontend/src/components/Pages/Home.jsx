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
  const key   = (name || "").toLowerCase().trim();
  const match = Object.keys(ICON_MAP).find((k) => key.includes(k));
  const Icon  = match ? ICON_MAP[match] : BookOpen;
  return <Icon size={26} />;
}
 
const BENEFITS = [
  { icon: "🎓", title: "Expert-Led Courses",   desc: "Learn from industry professionals with years of real-world experience." },
  { icon: "📱", title: "Learn Anywhere",        desc: "Access courses on any device, anytime. Our platform is fully mobile responsive." },
  { icon: "🏆", title: "Earn Certificates",     desc: "Get recognized with industry-accepted certificates upon course completion." },
  { icon: "💬", title: "Community Support",     desc: "Join a vibrant community of learners for peer support and networking." },
  { icon: "⚡", title: "Self-Paced Learning",   desc: "No deadlines. Learn at your own pace with lifetime course access." },
  { icon: "🔒", title: "Secure Platform",       desc: "Your data and progress are protected with enterprise-grade security." },
];
 
const CATEGORY_COLORS = [
  { bg: "#E6F7F2", color: "#10B981" },
  { bg: "#E8EEF6", color: "#1E3A5F" },
  { bg: "#FFF3E8", color: "#FF7A00" },
  { bg: "#F3EBFF", color: "#7F3FBF" },
  { bg: "#FFF0F6", color: "#E91E8C" },
  { bg: "#ECFDF5", color: "#059669" },
  { bg: "#EEF2FF", color: "#3B4FBF" },
  { bg: "#FCE4EC", color: "#E53935" },
];
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 
  .hp-wrap * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
 
  /* ── Shared ── */
  .hp-section { padding: 72px 0; }
  .hp-container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
 
  .hp-section-tag {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 20px;
    font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 14px;
  }
  .hp-section-title {
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    font-weight: 800; color: #1A202C;
    margin: 0 0 12px; line-height: 1.25;
  }
  .hp-section-sub {
    font-size: 0.95rem; color: #8492A6;
    max-width: 520px; margin: 0 auto; line-height: 1.7;
  }
 
  /* ── Hero ── */
  .hp-hero {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #1a1a4e 100%);
    min-height: 92vh;
    display: flex; align-items: center;
    padding: 64px 0;
  }
  .hp-hero-blob1 {
    position: absolute; width: 520px; height: 520px;
    top: -80px; left: -80px; border-radius: 50%;
    background: #10B981; opacity: 0.1; filter: blur(80px);
    pointer-events: none;
  }
  .hp-hero-blob2 {
    position: absolute; width: 380px; height: 380px;
    bottom: -60px; right: -60px; border-radius: 50%;
    background: #059669; opacity: 0.12; filter: blur(70px);
    pointer-events: none;
  }
  .hp-hero-inner {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 48px; align-items: center;
  }
  @media (max-width: 900px) {
    .hp-hero-inner { grid-template-columns: 1fr; }
    .hp-hero-img-col { display: none; }
  }
 
  .hp-hero-pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 16px; border-radius: 99px; margin-bottom: 24px;
    background: rgba(16,185,129,0.15);
    border: 1px solid rgba(16,185,129,0.35);
    color: #6EE7B7; font-size: 0.82rem; font-weight: 600;
  }
  .hp-hero-title {
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    font-weight: 800; color: #fff; line-height: 1.12;
    margin: 0 0 18px;
  }
  .hp-hero-accent { color: #10B981; }
  .hp-hero-desc {
    font-size: 1rem; color: rgba(255,255,255,0.75);
    line-height: 1.75; margin: 0 0 32px; max-width: 480px;
  }
  .hp-hero-cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #10B981, #059669);
    color: #fff; font-size: 0.95rem; font-weight: 700;
    text-decoration: none; cursor: pointer;
    box-shadow: 0 8px 24px rgba(16,185,129,0.4);
    transition: opacity 0.15s, transform 0.15s;
  }
  .hp-hero-cta:hover { opacity: 0.9; transform: translateY(-2px); color: #fff; }
 
  .hp-hero-img-wrap {
    position: relative;
    border-radius: 18px; overflow: hidden;
    border: 2px solid rgba(255,255,255,0.1);
    box-shadow: 0 24px 64px rgba(0,0,0,0.4);
  }
  .hp-hero-img { width: 100%; height: 400px; object-fit: cover; display: block; }
 
  .hp-hero-badge {
    position: absolute;
    background: #fff; border-radius: 12px;
    padding: 12px 16px; box-shadow: 0 8px 28px rgba(0,0,0,0.15);
    display: flex; align-items: center; gap: 10px; min-width: 190px;
  }
  .hp-hero-badge-icon {
    width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .hp-hero-badge-label { font-size: 0.72rem; color: #8492A6; margin: 0 0 2px; }
  .hp-hero-badge-value { font-size: 0.875rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  /* ── Stats ── */
  .hp-stats { background: #F6F8FA; }
  .hp-stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
  }
  @media (max-width: 700px) { .hp-stats-grid { grid-template-columns: repeat(2, 1fr); } }
 
  .hp-stat-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; padding: 22px 20px; text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .hp-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-3px); }
  .hp-stat-icon {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .hp-stat-value { font-size: 1.8rem; font-weight: 800; color: #1A202C; margin: 0 0 4px; line-height: 1; }
  .hp-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
 
  /* ── Categories ── */
  .hp-categories { background: #fff; }
  .hp-cat-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
  }
  @media (max-width: 900px) { .hp-cat-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 600px) { .hp-cat-grid { grid-template-columns: repeat(2, 1fr); } }
 
  .hp-cat-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; padding: 22px 16px; text-align: center;
    text-decoration: none; display: block;
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  }
  .hp-cat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 32px rgba(0,0,0,0.1); }
  .hp-cat-icon {
    width: 52px; height: 52px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 12px;
  }
  .hp-cat-name  { font-size: 0.875rem; font-weight: 700; color: #1A202C; margin: 0 0 4px; }
  .hp-cat-count { font-size: 0.75rem; font-weight: 600; }
 
  /* ── Featured Courses ── */
  .hp-courses { background: #F6F8FA; }
  .hp-courses-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
  }
  .hp-view-all {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.85rem; font-weight: 700; color: #10B981;
    text-decoration: none; transition: opacity 0.15s;
  }
  .hp-view-all:hover { opacity: 0.75; color: #10B981; }
  .hp-courses-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  }
  @media (max-width: 900px) { .hp-courses-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .hp-courses-grid { grid-template-columns: 1fr; } }
 
  /* ── Benefits ── */
  .hp-benefits { background: #fff; }
  .hp-benefits-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
  }
  @media (max-width: 900px) { .hp-benefits-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .hp-benefits-grid { grid-template-columns: 1fr; } }
 
  .hp-benefit-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; padding: 24px;
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  }
  .hp-benefit-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.08);
    border-color: #10B981;
  }
  .hp-benefit-emoji { font-size: 2rem; margin-bottom: 14px; display: block; }
  .hp-benefit-title { font-size: 0.95rem; font-weight: 700; color: #1A202C; margin: 0 0 8px; }
  .hp-benefit-desc  { font-size: 0.85rem; color: #8492A6; line-height: 1.65; margin: 0; }
 
  /* ── CTA ── */
  .hp-cta { background: #fff; }
  .hp-cta-box {
    border-radius: 20px; padding: 56px 40px; text-align: center;
    background: linear-gradient(135deg, #f0fdf8 0%, #ecfdf5 100%);
    border: 1px solid #A7F3D0;
    box-shadow: 0 8px 40px rgba(16,185,129,0.1);
  }
  .hp-cta-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #1A202C; margin: 0 0 12px; }
  .hp-cta-sub   { font-size: 0.95rem; color: #8492A6; margin: 0 0 32px; }
  .hp-cta-btns  { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
 
  .hp-cta-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #10B981, #059669);
    color: #fff; font-size: 0.9rem; font-weight: 700;
    text-decoration: none; cursor: pointer;
    box-shadow: 0 6px 20px rgba(16,185,129,0.35);
    transition: opacity 0.15s, transform 0.15s;
  }
  .hp-cta-btn-primary:hover { opacity: 0.9; transform: translateY(-2px); color: #fff; }
 
  .hp-cta-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 12px;
    border: 2px solid #10B981;
    color: #10B981; background: #fff;
    font-size: 0.9rem; font-weight: 700;
    text-decoration: none; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .hp-cta-btn-outline:hover { background: #ECFDF5; color: #059669; }
 
  .hp-cta-note {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 0.82rem; color: #A0AEC0; margin-top: 20px;
  }
 
  .hp-alert {
    padding: 10px 16px; border-radius: 9px; margin-bottom: 16px;
    background: #FFFBEB; border: 1px solid #FDE68A; color: #D97706;
    font-size: 0.85rem; font-weight: 500;
  }
`;
 
export function HomePage() {
  const [homeData, setHomeData] = useState({ stats: [], categories: [], courses: [], testimonials: [] });
  const [message, setMessage]   = useState("");
 
  useEffect(() => {
    if (document.getElementById("hp-styles")) return;
    const tag = document.createElement("style");
    tag.id = "hp-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }, []);
 
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
    <div className="hp-wrap">
      {message && <div className="hp-alert">{message}</div>}
 
      {/* ── Hero ── */}
      <section className="hp-hero">
        <div className="hp-hero-blob1" />
        <div className="hp-hero-blob2" />
        <div className="hp-container" style={{ width: "100%" }}>
          <div className="hp-hero-inner">
 
            {/* Left */}
            <div>
              <div className="hp-hero-pill">
                <Star size={13} /> Rated #1 E-Learning Platform 2026
              </div>
              <h1 className="hp-hero-title">
                Learn Without <br />
                <span className="hp-hero-accent">Limits.</span>
              </h1>
              <p className="hp-hero-desc">
                Master in-demand skills with 1,200+ expert-led courses. Join 500,000+ learners advancing their careers on LearnHub.
              </p>
              <Link to="/courses" className="hp-hero-cta">
                Explore Courses <ArrowRight size={17} />
              </Link>
            </div>
 
            {/* Right — image */}
            <div className="hp-hero-img-col" style={{ position: "relative" }}>
              <div className="hp-hero-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80"
                  alt="Learning" className="hp-hero-img"
                />
              </div>
              {/* Badge bottom-left */}
              <div className="hp-hero-badge" style={{ bottom: "-16px", left: "-24px" }}>
                <div className="hp-hero-badge-icon" style={{ background: "#ECFDF5" }}>
                  <TrendingUp size={17} color="#16A34A" />
                </div>
                <div>
                  <p className="hp-hero-badge-label">This week</p>
                  <p className="hp-hero-badge-value">+2,400 new learners</p>
                </div>
              </div>
              {/* Badge top-right */}
              <div className="hp-hero-badge" style={{ top: "-16px", right: "-16px" }}>
                <div className="hp-hero-badge-icon" style={{ background: "#F3EBFF" }}>
                  <Award size={17} color="#7F3FBF" />
                </div>
                <div>
                  <p className="hp-hero-badge-label">Certificates issued</p>
                  <p className="hp-hero-badge-value">120,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* ── Stats ── */}
      <section className="hp-section hp-stats">
        <div className="hp-container">
          <div className="hp-stats-grid">
            {statsWithIcons.map((stat, i) => {
              const palette = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              const StatIcon = stat.icon;
              return (
                <div key={stat.label} className="hp-stat-card">
                  <div className="hp-stat-icon" style={{ background: palette.bg }}>
                    <StatIcon size={22} color={palette.color} />
                  </div>
                  <p className="hp-stat-value">{stat.value}</p>
                  <p className="hp-stat-label">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
 
      {/* ── Categories ── */}
      <section className="hp-section hp-categories">
        <div className="hp-container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="hp-section-tag" style={{ background: "#E6F7F2", color: "#10B981" }}>
              Categories
            </span>
            <h2 className="hp-section-title">Explore Top Categories</h2>
            <p className="hp-section-sub">
              Find courses in your field of interest and start building valuable skills today.
            </p>
          </div>
          <div className="hp-cat-grid">
            {homeData.categories.map((cat, i) => {
              const palette = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <Link key={cat.id} to="/courses" className="hp-cat-card"
                  style={{ "--hover-shadow": `0 10px 32px ${palette.color}25` }}>
                  <div className="hp-cat-icon" style={{ background: palette.bg }}>
                    <span style={{ color: palette.color }}>
                      <CategoryIcon name={cat.icon || cat.name} />
                    </span>
                  </div>
                  <p className="hp-cat-name">{cat.name}</p>
                  <p className="hp-cat-count" style={{ color: palette.color }}>{cat.count} courses</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
 
      {/* ── Featured Courses ── */}
      <section className="hp-section hp-courses">
        <div className="hp-container">
          <div className="hp-courses-header">
            <div>
              <span className="hp-section-tag" style={{ background: "#E6F7F2", color: "#10B981" }}>
                Featured
              </span>
              <h2 className="hp-section-title" style={{ marginBottom: 0 }}>Top Courses</h2>
            </div>
            <Link to="/courses" className="hp-view-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="hp-courses-grid">
            {homeData.courses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>
 
      {/* ── Benefits ── */}
      <section className="hp-section hp-benefits">
        <div className="hp-container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="hp-section-tag" style={{ background: "#ECFDF5", color: "#16A34A" }}>
              Why LearnHub
            </span>
            <h2 className="hp-section-title">Everything You Need to Succeed</h2>
            <p className="hp-section-sub">
              Built for ambitious learners who want real results, not just theory.
            </p>
          </div>
          <div className="hp-benefits-grid">
            {BENEFITS.map((b, i) => (
              <div key={i} className="hp-benefit-card">
                <span className="hp-benefit-emoji">{b.icon}</span>
                <p className="hp-benefit-title">{b.title}</p>
                <p className="hp-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── CTA ── */}
      <section className="hp-section hp-cta">
        <div className="hp-container">
          <div className="hp-cta-box">
            <h2 className="hp-cta-title">Start Your Learning Journey Today</h2>
            <p className="hp-cta-sub">Join 500,000+ learners. Get unlimited access to 1,200+ expert courses.</p>
            <div className="hp-cta-btns">
              <Link to="/auth" className="hp-cta-btn-primary">
                Get Started Free <ArrowRight size={17} />
              </Link>
              <Link to="/subscription" className="hp-cta-btn-outline">
                View Pricing
              </Link>
            </div>
            <div className="hp-cta-note">
              <CheckCircle size={14} color="#10B981" />
              No credit card required · Free 7-day trial
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}