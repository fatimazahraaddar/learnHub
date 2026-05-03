import { useEffect, useState } from "react";
import { Search, Calendar, Clock, ArrowRight, BookOpen, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchBlogPosts, fetchPublicCategories, fetchCourses } from "../../api";
import { resolveCourseImage } from "../../lib/courseImage";
 
const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 
  .bp-wrap { font-family: 'DM Sans', sans-serif; background: #F6F8FA; min-height: 100vh; }
 
  /* ── Hero ── */
  .bp-hero {
    background: linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%);
    padding: 56px 0 48px; text-align: center;
  }
  .bp-hero-tag {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 20px; margin-bottom: 16px;
    background: rgba(16,185,129,0.2); color: ${ACCENT};
    font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .bp-hero-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
    color: #fff; margin: 0 0 12px; line-height: 1.2;
  }
  .bp-hero-sub { font-size: 0.95rem; color: rgba(255,255,255,0.65); margin: 0 0 28px; }
 
  .bp-search-wrap {
    display: flex; align-items: center; gap: 10px;
    background: #fff; border-radius: 12px;
    padding: 10px 16px; max-width: 520px; margin: 0 auto;
    border: 2px solid rgba(16,185,129,0.25);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .bp-search-input {
    flex: 1; border: none; outline: none; background: transparent;
    font-size: 0.9rem; color: #1A202C; font-family: 'DM Sans', sans-serif;
  }
  .bp-search-input::placeholder { color: #A0AEC0; }
 
  /* ── Container ── */
  .bp-container { max-width: 1120px; margin: 0 auto; padding: 40px 24px; }
 
  /* ── Alert ── */
  .bp-alert {
    padding: 12px 16px; border-radius: 10px; margin-bottom: 20px;
    background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E;
    font-size: 0.85rem; font-weight: 500;
  }
 
  /* ── Filters ── */
  .bp-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
  .bp-filter-btn {
    padding: 7px 16px; border-radius: 10px; border: none;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .bp-filter-btn.active {
    background: ${PRIMARY}; color: #fff;
    box-shadow: 0 2px 8px rgba(30,58,95,0.3);
  }
  .bp-filter-btn.inactive {
    background: #fff; color: ${PRIMARY};
    border: 1px solid rgba(30,58,95,0.2);
  }
  .bp-filter-btn.inactive:hover { background: #F0F4F8; }
 
  /* ── Section header ── */
  .bp-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px; flex-wrap: wrap; gap: 12px;
  }
  .bp-section-tag-inline {
    font-size: 0.72rem; font-weight: 700; color: ${ACCENT};
    text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 2px;
  }
  .bp-section-title { font-size: 1rem; font-weight: 800; color: ${PRIMARY}; margin: 0; }
 
  .bp-see-all {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 14px; border-radius: 9px; border: none;
    background: rgba(30,58,95,0.07); color: ${PRIMARY};
    font-size: 0.8rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  }
  .bp-see-all:hover { background: rgba(30,58,95,0.13); }
 
  /* ── Course cards ── */
  .bp-courses-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px; margin-bottom: 0;
  }
  .bp-course-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; overflow: hidden; cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .bp-course-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.1); transform: translateY(-3px); }
  .bp-course-img { width: 100%; height: 140px; object-fit: cover; display: block; }
  .bp-course-body { padding: 14px; }
  .bp-course-cat {
    display: inline-block; padding: 3px 9px; border-radius: 20px;
    background: rgba(16,185,129,0.12); color: ${ACCENT};
    font-size: 0.7rem; font-weight: 600; margin-bottom: 7px;
  }
  .bp-course-title { font-size: 0.875rem; font-weight: 700; color: ${PRIMARY}; margin: 0 0 5px; line-height: 1.35; }
  .bp-course-desc {
    font-size: 0.78rem; color: #8492A6; margin: 0;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5;
  }
  .bp-course-footer {
    padding: 8px 14px 12px;
    display: flex; align-items: center; gap: 5px;
    font-size: 0.75rem; color: #A0AEC0;
  }
 
  .bp-divider { height: 1px; background: rgba(30,58,95,0.1); margin: 36px 0; }
 
  /* ── Featured article ── */
  .bp-featured {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 6px 28px rgba(30,58,95,0.1);
    display: grid; grid-template-columns: 1fr 1fr;
    margin-bottom: 36px;
  }
  @media (max-width: 768px) { .bp-featured { grid-template-columns: 1fr; } }
  .bp-featured-img { width: 100%; height: 100%; min-height: 260px; object-fit: cover; display: block; }
  .bp-featured-body {
    padding: 32px; display: flex; flex-direction: column;
    justify-content: center;
  }
  .bp-featured-cat {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 20px; margin-bottom: 14px; width: fit-content;
    background: rgba(16,185,129,0.12); color: ${ACCENT};
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .bp-featured-title { font-size: 1.2rem; font-weight: 800; color: ${PRIMARY}; margin: 0 0 10px; line-height: 1.35; }
  .bp-featured-excerpt { font-size: 0.875rem; color: #8492A6; line-height: 1.7; margin: 0 0 16px; }
  .bp-featured-meta { display: flex; gap: 16px; margin-bottom: 22px; }
  .bp-featured-meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #A0AEC0; }
  .bp-featured-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 10px; border: none;
    background: ${PRIMARY}; color: #fff;
    font-size: 0.875rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; width: fit-content;
    box-shadow: 0 3px 12px rgba(30,58,95,0.25);
    transition: opacity 0.15s, transform 0.15s;
  }
  .bp-featured-btn:hover { opacity: 0.9; transform: translateY(-1px); }
 
  /* ── Articles grid ── */
  .bp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  @media (max-width: 900px) { .bp-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px) { .bp-grid { grid-template-columns: 1fr; } }
 
  .bp-post-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
    display: flex; flex-direction: column;
  }
  .bp-post-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); transform: translateY(-3px); }
  .bp-post-img { width: 100%; height: 190px; object-fit: cover; display: block; }
  .bp-post-body { padding: 16px; flex: 1; }
  .bp-post-cat {
    display: inline-block; padding: 3px 9px; border-radius: 20px;
    background: rgba(16,185,129,0.12); color: ${ACCENT};
    font-size: 0.7rem; font-weight: 600; margin-bottom: 8px;
  }
  .bp-post-meta { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: #A0AEC0; margin-bottom: 8px; }
  .bp-post-title { font-size: 0.9rem; font-weight: 700; color: ${PRIMARY}; margin: 0 0 6px; line-height: 1.35; }
  .bp-post-excerpt { font-size: 0.8rem; color: #8492A6; line-height: 1.6; margin: 0; }
  .bp-post-footer {
    padding: 12px 16px;
    border-top: 1px solid #F0F3F7;
    display: flex; align-items: center; justify-content: space-between;
  }
  .bp-post-author { font-size: 0.75rem; color: #A0AEC0; }
  .bp-post-read-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 8px; border: none;
    background: rgba(16,185,129,0.12); color: ${ACCENT};
    font-size: 0.75rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  }
  .bp-post-read-btn:hover { background: rgba(16,185,129,0.22); }
 
  /* ── Empty ── */
  .bp-empty { text-align: center; padding: 60px 20px; color: #A0AEC0; font-size: 0.875rem; }
  .bp-empty-clear {
    display: inline-flex; margin-top: 12px;
    padding: 8px 18px; border-radius: 9px; border: none;
    background: ${PRIMARY}; color: #fff;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
 
  /* ── Skeleton ── */
  .bp-skeleton-img {
    height: 190px; background: #E8ECF0; border-radius: 14px 14px 0 0;
    animation: bpPulse 1.4s ease-in-out infinite;
  }
  .bp-skeleton-line {
    height: 12px; background: #F0F3F7; border-radius: 6px; margin-bottom: 10px;
    animation: bpPulse 1.4s ease-in-out infinite;
  }
  @keyframes bpPulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.45; }
  }
 
  /* ── Newsletter ── */
  .bp-newsletter {
    border-radius: 18px; padding: 52px 40px; text-align: center; margin-top: 48px;
    background: linear-gradient(135deg, ${PRIMARY} 0%, #16324F 100%);
    box-shadow: 0 8px 40px rgba(30,58,95,0.3);
  }
  .bp-newsletter-tag {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;
    background: rgba(16,185,129,0.2); color: ${ACCENT};
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .bp-newsletter-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0 0 8px; }
  .bp-newsletter-sub { font-size: 0.875rem; color: rgba(255,255,255,0.55); margin: 0 0 24px; }
  .bp-newsletter-row { display: flex; gap: 10px; max-width: 420px; margin: 0 auto; }
  .bp-newsletter-input {
    flex: 1; padding: 10px 14px; border-radius: 10px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(16,185,129,0.4); color: #fff;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.15s;
  }
  .bp-newsletter-input::placeholder { color: rgba(255,255,255,0.35); }
  .bp-newsletter-input:focus { border-color: ${ACCENT}; }
  .bp-newsletter-btn {
    padding: 10px 20px; border-radius: 10px; border: none;
    background: ${ACCENT}; color: #fff;
    font-size: 0.875rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; white-space: nowrap;
    box-shadow: 0 3px 12px rgba(16,185,129,0.35);
    transition: opacity 0.15s;
  }
  .bp-newsletter-btn:hover { opacity: 0.88; }
  .bp-newsletter-msg { font-size: 0.8rem; color: ${ACCENT}; margin-top: 10px; }
`;
 
export function BlogPage() {
  const navigate = useNavigate();
  const [search, setSearch]                   = useState("");
  const [activeCategory, setActiveCategory]   = useState("All");
  const [posts, setPosts]                     = useState([]);
  const [categories, setCategories]           = useState([]);
  const [courses, setCourses]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [message, setMessage]                 = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterInfo, setNewsletterInfo]   = useState("");
 
  useEffect(() => {
    if (document.getElementById("bp-styles")) return;
    const tag = document.createElement("style");
    tag.id = "bp-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }, []);
 
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [postsRes, categoriesRes, coursesRes] = await Promise.all([
          fetchBlogPosts(),
          fetchPublicCategories(),
          fetchCourses(),
        ]);
 
        const loadedPosts = Array.isArray(postsRes.data) ? postsRes.data : [];
        const loadedCats  = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
 
        // Handle all possible API shapes for courses
        const raw = coursesRes?.data;
        const loadedCourses = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.courses)
          ? raw.courses
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
 
        // Debug — remove once categories appear
        console.log("[BlogPage] coursesRes:", coursesRes);
        console.log("[BlogPage] loadedCourses:", loadedCourses);
 
        setPosts(loadedPosts);
        setCourses(loadedCourses);
 
        // Merge categories from all 3 sources
        const fromApi     = loadedCats.map((c) => c.name).filter(Boolean);
        const fromPosts   = loadedPosts.map((p) => p.category).filter(Boolean);
        const fromCourses = loadedCourses
          .map((c) => c.category || c.category_name || c.cat_name)
          .filter(Boolean);
 
        console.log("[BlogPage] fromCourses categories:", fromCourses);
 
        const allCats = [...new Set([...fromApi, ...fromPosts, ...fromCourses])];
        setCategories(allCats);
 
        if (loadedPosts.length === 0 && loadedCourses.length === 0) {
          setMessage("No content found yet. Check back soon!");
        }
      } catch (err) {
        console.error("BlogPage load error:", err);
        setCourses([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
 
  const normalize = (str) => String(str || "").toLowerCase().trim();
 
  const filtered = posts.filter((p) => {
    const matchSearch = normalize(p.title).includes(normalize(search));
    const matchCat    = activeCategory === "All" || normalize(p.category) === normalize(activeCategory);
    return matchSearch && matchCat;
  });
 
  const filteredCourses = courses.filter((c) => {
    const matchSearch = !search.trim() ||
      normalize(c.title).includes(normalize(search)) ||
      normalize(c.description).includes(normalize(search));
    const matchCat = activeCategory === "All" || normalize(c.category) === normalize(activeCategory);
    return matchSearch && matchCat;
  });
 
  const featured  = activeCategory === "All" && !search.trim() ? posts[0] : null;
  const gridPosts = featured ? filtered.filter((p) => p.id !== featured.id) : filtered;
 
  const handleSubscribe = () => {
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      setNewsletterInfo("Please enter a valid email address.");
      return;
    }
    setNewsletterInfo("Subscribed successfully ✓");
    setNewsletterEmail("");
  };
 
  return (
    <div className="bp-wrap">
 
      {/* Hero */}
      <div className="bp-hero">
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div className="bp-hero-tag">Blog & Resources</div>
          <h1 className="bp-hero-title">Expert Insights & Tips</h1>
          <p className="bp-hero-sub">Expert insights, career tips, and learning strategies.</p>
          <div className="bp-search-wrap">
            <Search size={16} color={ACCENT} style={{ flexShrink: 0 }} />
            <input
              className="bp-search-input"
              placeholder="Search articles and courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
 
      <div className="bp-container">
 
        {message && <div className="bp-alert">{message}</div>}
 
        {/* Filters */}
        <div className="bp-filters">
          {["All", ...categories].map((cat) => (
            <button
              key={cat} type="button"
              className={`bp-filter-btn ${activeCategory === cat ? "active" : "inactive"}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
 
        {/* Skeleton loading */}
        {loading && (
          <div className="bp-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #E8ECF0" }}>
                <div className="bp-skeleton-img" />
                <div style={{ padding: 16 }}>
                  <div className="bp-skeleton-line" style={{ width: "60%", marginBottom: 8 }} />
                  <div className="bp-skeleton-line" />
                  <div className="bp-skeleton-line" style={{ width: "80%" }} />
                </div>
              </div>
            ))}
          </div>
        )}
 
        {/* Courses section */}
        {!loading && filteredCourses.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div className="bp-section-header">
              <div>
                <p className="bp-section-tag-inline">Formations</p>
                <p className="bp-section-title">Cours disponibles</p>
              </div>
              <button className="bp-see-all" type="button" onClick={() => navigate("/courses")}>
                Voir tout <ArrowRight size={13} />
              </button>
            </div>
            <div className="bp-courses-grid">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bp-course-card" onClick={() => navigate(`/courses/${course.id}`)}>
                  <img
                    src={resolveCourseImage(course.image, course.title)}
                    className="bp-course-img" alt={course.title}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="bp-course-body">
                    {course.category && <span className="bp-course-cat">{course.category}</span>}
                    <p className="bp-course-title">{course.title}</p>
                    {course.description && <p className="bp-course-desc">{course.description}</p>}
                  </div>
                  {course.duration && (
                    <div className="bp-course-footer">
                      <Timer size={12} /> {course.duration}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="bp-divider" />
          </div>
        )}
 
        {/* Featured article */}
        {!loading && featured && (
          <div className="bp-featured" style={{ marginBottom: 32 }}>
            <img src={featured.image} className="bp-featured-img" alt={featured.title}
              onError={(e) => { e.target.style.display = "none"; }} />
            <div className="bp-featured-body">
              <span className="bp-featured-cat">{featured.category}</span>
              <h4 className="bp-featured-title">{featured.title}</h4>
              <p className="bp-featured-excerpt">{featured.excerpt}</p>
              <div className="bp-featured-meta">
                <span className="bp-featured-meta-item"><Calendar size={13} /> {featured.date}</span>
                <span className="bp-featured-meta-item"><Clock size={13} /> {featured.readTime}</span>
              </div>
              <button className="bp-featured-btn" type="button"
                onClick={() => navigate(`/blog?post=${featured.id}`)}>
                Read More <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
 
        {/* Articles grid */}
        {!loading && (
          gridPosts.length === 0 && filteredCourses.length === 0 ? (
            <div className="bp-empty">
              <BookOpen size={40} color="#CBD5E0" style={{ marginBottom: 12 }} />
              <p>No articles found{search ? ` for "${search}"` : ""}.</p>
              {search && (
                <button className="bp-empty-clear" type="button" onClick={() => setSearch("")}>
                  Clear search
                </button>
              )}
            </div>
          ) : gridPosts.length > 0 ? (
            <div className="bp-grid">
              {gridPosts.map((post) => (
                <div key={post.id} className="bp-post-card">
                  <img src={post.image} className="bp-post-img" alt={post.title}
                    onError={(e) => { e.target.style.display = "none"; }} />
                  <div className="bp-post-body">
                    <span className="bp-post-cat">{post.category}</span>
                    <div className="bp-post-meta">
                      <Calendar size={11} /> {post.date} ·
                      <Clock size={11} /> {post.readTime}
                    </div>
                    <p className="bp-post-title">{post.title}</p>
                    <p className="bp-post-excerpt">{post.excerpt}</p>
                  </div>
                  <div className="bp-post-footer">
                    <span className="bp-post-author">{post.author}</span>
                    <button className="bp-post-read-btn" type="button"
                      onClick={() => navigate(`/blog?post=${post.id}`)}>
                      Read <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null
        )}
 
        {/* Newsletter */}
        <div className="bp-newsletter">
          <div className="bp-newsletter-tag">Newsletter</div>
          <h4 className="bp-newsletter-title">Stay in the Loop</h4>
          <p className="bp-newsletter-sub">Get latest articles delivered to your inbox.</p>
          <div className="bp-newsletter-row">
            <input
              className="bp-newsletter-input"
              placeholder="Your email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            />
            <button className="bp-newsletter-btn" type="button" onClick={handleSubscribe}>
              Subscribe
            </button>
          </div>
          {newsletterInfo && <p className="bp-newsletter-msg">{newsletterInfo}</p>}
        </div>
 
      </div>
    </div>
  );
}
