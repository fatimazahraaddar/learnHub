import {
  ArrowRight,
  Play,
  Star,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CourseCard } from "../Pages/CourseCard";
import { fetchHomePageData } from "../../lib/api";

const BENEFITS = [
  {
    icon: "🎓",
    title: "Expert-Led Courses",
    desc: "Learn from industry professionals with years of real-world experience.",
  },
  {
    icon: "📱",
    title: "Learn Anywhere",
    desc: "Access courses on any device, anytime. Our platform is fully mobile responsive.",
  },
  {
    icon: "🏆",
    title: "Earn Certificates",
    desc: "Get recognized with industry-accepted certificates upon course completion.",
  },
  {
    icon: "💬",
    title: "Community Support",
    desc: "Join a vibrant community of learners for peer support and networking.",
  },
  {
    icon: "⚡",
    title: "Self-Paced Learning",
    desc: "No deadlines. Learn at your own pace with lifetime course access.",
  },
  {
    icon: "🔒",
    title: "Secure Platform",
    desc: "Your data and progress are protected with enterprise-grade security.",
  },
];

export function HomePage() {
  const [homeData, setHomeData] = useState({
    stats: [],
    categories: [],
    courses: [],
    testimonials: [],
  });
  const [message, setMessage] = useState("");
  const [demoInfo, setDemoInfo] = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchHomePageData();
      if (!ok || !data) {
        setMessage("Unable to load homepage data.");
        return;
      }
      setHomeData({
        stats: Array.isArray(data.stats) ? data.stats : [],
        categories: Array.isArray(data.categories) ? data.categories : [],
        courses: Array.isArray(data.courses) ? data.courses : [],
        testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
      });
    };
    load();
  }, []);

  const statsWithIcons = [
    { icon: Users, ...(homeData.stats[0] || { label: "Active Learners", value: "0+" }) },
    { icon: BookOpen, ...(homeData.stats[1] || { label: "Courses Available", value: "0+" }) },
    { icon: Award, ...(homeData.stats[2] || { label: "Certificates Issued", value: "0+" }) },
    { icon: TrendingUp, ...(homeData.stats[3] || { label: "Completion Rate", value: "0%" }) },
  ];

  return (
    <div className="bg-white">
      {message ? <div className="alert alert-warning m-3">{message}</div> : null}
      {/* Hero Section */}
      <section
        className="position-relative overflow-hidden py-32"
        style={{
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        }}
      >
        {/* Background blobs */}
        <div
          className="position-absolute rounded-circle opacity-25"
          style={{
            width: "24rem",
            height: "24rem",
            top: 0,
            left: 0,
            filter: "blur(3rem)",
            backgroundColor: "#4A90E2",
          }}
        />
        <div
          className="position-absolute rounded-circle opacity-25"
          style={{
            width: "20rem",
            height: "20rem",
            bottom: 0,
            right: 0,
            filter: "blur(3rem)",
            backgroundColor: "#7F3FBF",
          }}
        />

        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4"
                style={{
                  backgroundColor: "rgba(74,144,226,0.15)",
                  color: "#4A90E2",
                  border: "1px solid rgba(74,144,226,0.3)",
                }}
              >
                <Star className="me-1" /> Rated #1 E-Learning Platform 2026
              </div>
              <h1
                className="text-white display-4 mb-4"
                style={{ lineHeight: 1.15, fontWeight: 800 }}
              >
                Learn Without <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #4A90E2, #7F3FBF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Limits.
                </span>
              </h1>
              <p className="text-light lead mb-4">
                Master in-demand skills with 1,200+ expert-led courses. Join
                500,000+ learners advancing their careers on LearnHub.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link
                  to="/courses"
                  className="btn btn-primary d-inline-flex align-items-center gap-2 btn1"
                  style={{
                    background: "linear-gradient(135deg, #4A90E2, #7F3FBF)",
                    fontWeight: 600,
                  }}
                >
                  Explore Courses <ArrowRight className="ms-1" />
                </Link>
                <button
                  className="btn btn-outline-light d-inline-flex align-items-center gap-2"
                  type="button"
                  onClick={() => {
                    const section = document.getElementById("featured-courses");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                    setDemoInfo("Demo: Explore the featured courses section below.");
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-white-20"
                    style={{ width: "2rem", height: "2rem" }}
                  >
                    <Play className="text-white" />
                  </div>
                  Watch Demo
                </button>
              </div>
              {demoInfo ? <p className="small text-light mt-2 mb-0">{demoInfo}</p> : null}

              <div className="d-flex align-items-center gap-3 mt-4">
                <div className="d-flex">
                  {[
                    "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=50",
                    "https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=50",
                    "https://images.unsplash.com/photo-1755548413928-4aaeba7c740e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=50",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="learner"
                      className="rounded-circle border border-white overlap-avatar"
                      style={{
                        width: "36px",
                        height: "36px",
                        objectFit: "cover",
                        marginLeft: i === 0 ? 0 : "-10px",
                        transition: "transform 0.3s",
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div className="d-flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="text-warning" />
                    ))}
                  </div>
                  <p className="text-light small mt-1">
                    4.9 from 50,000+ reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block position-relative">
              <div className="rounded-3 overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1758612214917-81d7956c09de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Learning"
                  className="img-fluid rounded-3"
                  style={{ height: "24rem", objectFit: "cover" }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                  }}
                />
              </div>

              {/* Floating cards */}
              <div
                className="position-absolute bg-white rounded-3 p-3 shadow"
                style={{ bottom: "-1.5rem", left: "-1.5rem" }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "#EBF4FF",
                    }}
                  >
                    <TrendingUp className="text-primary" />
                  </div>
                  <div>
                    <p className="small text-muted mb-0">This week</p>
                    <p className="mb-0 fw-semibold">+2,400 new learners</p>
                  </div>
                </div>
              </div>

              <div
                className="position-absolute bg-white rounded-3 p-3 shadow"
                style={{ top: "-1rem", right: "-1rem" }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "#F0FFF4",
                    }}
                  >
                    <Award className="text-success" />
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

      {/* Stats Section */}
      <section id="featured-courses" className="py-5 bg-light">
        <div className="container">
          <div className="row g-3">
            {statsWithIcons.map((stat) => (
              <div key={stat.label} className="col-6 col-lg-3">
                <div className="card text-center shadow-sm rounded-3 p-3 border-0">
                  <div
                    className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      background: "linear-gradient(135deg, #EBF4FF, #F3EBFF)",
                    }}
                  >
                    <stat.icon className="fs-4 text-primary" />
                  </div>
                  <p className="fs-4 fw-bold mb-1">{stat.value}</p>
                  <p className="text-muted small">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge text-primary bg-light px-3 py-1">
              Categories
            </span>
            <h2 className="mt-3 mb-2 fw-bold">Explore Top Categories</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "36rem" }}>
              Find courses in your field of interest and start building valuable
              skills today.
            </p>
          </div>
          <div className="row g-3">
            {homeData.categories.map((cat) => (
              <div key={cat.id} className="col-6 col-sm-3 my-card">
                <Link
                  to="/courses"
                  className="card text-center border-0 my-card-item text-decoration-none text-dark p-3"
                >
                  <div className="fs-2 mb-2">{cat.icon}</div>
                  <h3 className="fs-6 fw-semibold">{cat.name}</h3>
                  <p className="small text-muted">{cat.count} courses</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-purple text-purple px-3 py-1">
                Featured
              </span>
              <h2 className="mt-2 fw-bold">Top Courses</h2>
            </div>
            <Link
              to="/courses"
              className="d-none d-sm-flex align-items-center gap-1 text-primary text-decoration-none fw-semibold"
            >
              View All Courses <ChevronRight />
            </Link>
          </div>
          <div className="row g-3">
            {homeData.courses.slice(0, 6).map((course) => (
              <div key={course.id} className="col-12 col-sm-6 col-lg-4">
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="badge bg-warning-subtle p-2 text-warning"
              style={{ borderRadius: "50px" }}
            >
              Why LearnHub
            </span>
            <h2 className="mt-2 mb-3 fw-bold">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "36rem" }}>
              Built for ambitious learners who want real results, not just
              theory.
            </p>
          </div>
          <div className="row g-4">
            {BENEFITS.map((b, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-4">
                <div className="bg-white rounded-3 p-4 shadow-sm border border-light my-card">
                  <div className="fs-2 mb-2">{b.icon}</div>
                  <h3>{b.title}</h3>
                  <p className="text-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)" }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <p className="badge p-2 text-primary">Testimonials</p>

            <h2 className="mt-2 mb-3 text-white fw-bold">
              What Our Learners Say
            </h2>

            <p className="mx-auto text-light" style={{ maxWidth: "36rem" }}>
              Real stories from learners who transformed their careers with
              LearnHub.
            </p>
          </div>

          {/* 🔥 spacing مزيان */}
          <div className="row g-4">
            {homeData.testimonials.map((t) => (
              <div key={t.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "16px",
                    padding: "1.25rem", // ✅ padding متوازن
                  }}
                >
                  {/* Stars */}
                  <div className="d-flex mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} className="text-warning me-1" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="small text-white mb-3">"{t.text}"</p>

                  {/* User */}
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={t.avatar}
                      className="rounded-circle"
                      width="40"
                      height="40"
                      alt={t.name}
                    />

                    <div>
                      <p className="mb-0 fw-semibold text-white">{t.name}</p>
                      <p className="small mb-0 text-light">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Start Your Learning Journey Today</h2>
          <p className="text-muted mb-4">
            Join 500,000+ learners. Get unlimited access to 1,200+ expert
            courses.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link
              to="/auth"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #4A90E2, #7F3FBF)",
                fontWeight: 600,
              }}
            >
              Get Started Free <ArrowRight />
            </Link>
            <Link
              to="/subscription"
              className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-muted mt-3">
            <CheckCircle className="text-success me-1" /> No credit card
            required · Free 7-day trial
          </p>
        </div>
      </section>
    </div>
  );
}
