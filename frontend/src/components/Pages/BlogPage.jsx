import { useEffect, useState } from "react";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchBlogPosts, fetchPublicCategories } from "../../lib/api";

const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";

export function BlogPage() {
  const navigate = useNavigate();
  const [search, setSearch]                 = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts]                   = useState([]);
  const [categories, setCategories]         = useState([]);
  const [message, setMessage]               = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterInfo, setNewsletterInfo]   = useState("");

  useEffect(() => {
    const load = async () => {
      const [postsRes, categoriesRes] = await Promise.all([
        fetchBlogPosts(),
        fetchPublicCategories(),
      ]);
      if (!postsRes.ok) setMessage("Unable to load blog posts.");
      setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    };
    load();
  }, []);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = posts[0];

  return (
    <div style={{ backgroundColor: "#F4F7FB" }} className="min-vh-100">
      {message && <div className="alert alert-warning m-3">{message}</div>}

      {/* ── HERO ── */}
      <div className="py-5 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%)` }}>
        <div className="container">
          <span className="badge px-3 py-2 rounded-pill mb-3"
            style={{ background: `${ACCENT}33`, color: ACCENT, fontSize: "0.85rem", fontWeight: 600 }}>
            Blog & Resources
          </span>
          <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
            Expert Insights & Tips
          </h1>
          <p className="mb-4" style={{ opacity: 0.75 }}>
            Expert insights, career tips, and learning strategies.
          </p>
          <div className="d-flex align-items-center bg-white rounded-3 px-3 py-2 shadow mx-auto"
            style={{ maxWidth: "520px", border: `2px solid ${ACCENT}44` }}>
            <Search size={16} color={ACCENT} className="me-2 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control border-0 shadow-none p-0"
              placeholder="Search articles..."
              style={{ fontSize: "0.95rem" }}
            />
          </div>
        </div>
      </div>

      <div className="container py-5">

        {/* ── FILTERS ── */}
        <div className="mb-4 d-flex flex-wrap gap-2">
          {["All", ...categories.map(c => c.name)].map((cat) => (
            <button key={cat} type="button"
              onClick={() => setActiveCategory(cat)}
              className="btn fw-medium"
              style={activeCategory === cat
                ? { background: PRIMARY, color: "white", borderRadius: "10px", border: "none" }
                : { background: "white", color: PRIMARY, borderRadius: "10px", border: `1px solid ${PRIMARY}33` }}>
              {cat}
            </button>
          ))}
        </div>

        {/* ── FEATURED ── */}
        {activeCategory === "All" && !search && featured && (
          <div className="card mb-5 border-0 rounded-4 overflow-hidden"
            style={{ boxShadow: `0 8px 32px ${PRIMARY}18` }}>
            <div className="row g-0">
              <div className="col-lg-6">
                <img src={featured.image} className="img-fluid h-100 w-100"
                  style={{ objectFit: "cover", minHeight: "280px" }} alt={featured.title} />
              </div>
              <div className="col-lg-6 p-4 d-flex flex-column justify-content-center">
                <span className="badge px-3 py-2 rounded-pill mb-3 align-self-start"
                  style={{ background: `${ACCENT}22`, color: ACCENT, fontWeight: 600 }}>
                  {featured.category}
                </span>
                <h4 className="fw-bold mb-2" style={{ color: PRIMARY }}>{featured.title}</h4>
                <p className="text-muted mb-3">{featured.excerpt}</p>
                <div className="d-flex gap-3 small text-muted mb-4">
                  <span className="d-flex align-items-center gap-1">
                    <Calendar size={14} /> {featured.date}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <Clock size={14} /> {featured.readTime}
                  </span>
                </div>
                <button className="btn fw-semibold align-self-start d-flex align-items-center gap-2" type="button"
                  style={{ background: PRIMARY, color: "white", borderRadius: "10px", border: "none" }}
                  onClick={() => navigate(`/blog?post=${featured.id}`)}>
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── GRID ── */}
        <div className="row g-4">
          {filtered.map((post) => (
            <div key={post.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 rounded-4"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)", transition: "transform .2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <img src={post.image} className="card-img-top rounded-top-4"
                  style={{ height: "200px", objectFit: "cover" }} alt={post.title} />
                <div className="card-body">
                  <div className="small text-muted mb-2 d-flex align-items-center gap-2">
                    <Calendar size={12} /> {post.date} •
                    <Clock size={12} /> {post.readTime}
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: PRIMARY }}>{post.title}</h6>
                  <p className="text-muted small mb-0">{post.excerpt}</p>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center pb-3">
                  <small className="text-muted">{post.author}</small>
                  <button className="btn btn-sm fw-semibold" type="button"
                    style={{ background: `${ACCENT}18`, color: ACCENT, borderRadius: "8px", border: "none" }}
                    onClick={() => navigate(`/blog?post=${post.id}`)}>
                    Read <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── NEWSLETTER ── */}
        <div className="text-center p-5 mt-5 rounded-4"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%)`, boxShadow: `0 8px 32px ${PRIMARY}44` }}>
          <span className="badge px-3 py-2 rounded-pill mb-3"
            style={{ background: `${ACCENT}33`, color: ACCENT, fontWeight: 600 }}>
            Newsletter
          </span>
          <h4 className="text-white fw-bold mb-2">Stay in the Loop</h4>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
            Get latest articles delivered to your inbox.
          </p>
          <div className="d-flex gap-2 mx-auto" style={{ maxWidth: "420px" }}>
            <input
              className="form-control"
              placeholder="Your email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${ACCENT}55`, color: "white", borderRadius: "10px" }}
            />
            <button className="btn fw-semibold px-4" type="button"
              style={{ background: ACCENT, color: "white", borderRadius: "10px", border: "none", whiteSpace: "nowrap" }}
              onClick={() => {
                if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
                  setNewsletterInfo("Please enter a valid email address.");
                  return;
                }
                setNewsletterInfo("Subscribed successfully ✓");
                setNewsletterEmail("");
              }}>
              Subscribe
            </button>
          </div>
          {newsletterInfo && (
            <p className="small mt-3 mb-0" style={{ color: ACCENT }}>{newsletterInfo}</p>
          )}
        </div>

      </div>
    </div>
  );
}