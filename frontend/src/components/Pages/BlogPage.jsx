import { useEffect, useState } from "react";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchBlogPosts, fetchPublicCategories } from "../../lib/api";

export function BlogPage() {
const navigate = useNavigate();
const [search, setSearch] = useState("");
const [activeCategory, setActiveCategory] = useState("All");
const [posts, setPosts] = useState([]);
const [categories, setCategories] = useState([]);
const [message, setMessage] = useState("");
const [newsletterEmail, setNewsletterEmail] = useState("");
const [newsletterInfo, setNewsletterInfo] = useState("");

useEffect(() => {
const load = async () => {
const [postsRes, categoriesRes] = await Promise.all([
fetchBlogPosts(),
fetchPublicCategories(),
]);

if (!postsRes.ok) {
setMessage("Unable to load blog posts.");
}

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

return ( <div className="bg-light min-vh-100">
  {message ? <div className="alert alert-warning m-3">{message}</div> : null}


  {/* HERO */}
  <div
    className="py-5 text-center text-white"
    style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)" }}
  >
    <div className="container">
      <h1 className="fw-bold mb-3">Blog & Resources</h1>
      <p className="text-light mb-4">
        Expert insights, career tips, and learning strategies.
      </p>

      <div className="input-group mx-auto" style={{ maxWidth: "500px" }}>
        <span className="input-group-text">
          <Search size={16} />
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          placeholder="Search articles..."
        />
      </div>
    </div>
  </div>

  <div className="container py-5">

    {/* FILTERS */}
    <div className="mb-4 d-flex flex-wrap gap-2">
      {["All", ...categories.map(c => c.name)].map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`btn ${
            activeCategory === cat ? "btn-primary" : "btn-outline-secondary"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* FEATURED */}
    {activeCategory === "All" && !search && featured ? (
      <div className="card mb-5 shadow-sm">
        <div className="row g-0">

          <div className="col-lg-6">
            <img
              src={featured.image}
              className="img-fluid h-100"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="col-lg-6 p-4">

            <span className="badge bg-primary mb-2">
              {featured.category}
            </span>

            <h4 className="fw-bold">{featured.title}</h4>
            <p className="text-muted">{featured.excerpt}</p>

            <div className="d-flex gap-3 small text-muted mb-3">
              <span><Calendar size={14} /> {featured.date}</span>
              <span><Clock size={14} /> {featured.readTime}</span>
            </div>

            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={() => navigate(`/blog?post=${featured.id}`)}
            >
              Read More <ArrowRight size={14} />
            </button>

          </div>

        </div>
      </div>
    ) : null}

    {/* GRID */}
    <div className="row g-4">
      {filtered.map((post) => (

        <div key={post.id} className="col-md-6 col-lg-4">

          <div className="card h-100 shadow-sm">

            <img
              src={post.image}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
            />

            <div className="card-body">

              <div className="small text-muted mb-2">
                <Calendar size={12} /> {post.date} • <Clock size={12} /> {post.readTime}
              </div>

              <h6>{post.title}</h6>
              <p className="text-muted small">{post.excerpt}</p>

            </div>

            <div className="card-footer d-flex justify-content-between align-items-center">
              <small>{post.author}</small>
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                onClick={() => navigate(`/blog?post=${post.id}`)}
              >
                Read
              </button>
            </div>

          </div>

        </div>

      ))}
    </div>

    {/* NEWSLETTER */}
    <div
      className="text-center p-5 mt-5 rounded"
      style={{ background: "linear-gradient(135deg, #4A90E2, #7F3FBF)" }}
    >
      <h4 className="text-white fw-bold">Stay in the Loop</h4>
      <p className="text-white-50">
        Get latest articles delivered to your inbox.
      </p>

      <div className="input-group mx-auto" style={{ maxWidth: "400px" }}>
        <input
          className="form-control"
          placeholder="Email..."
          value={newsletterEmail}
          onChange={(e) => setNewsletterEmail(e.target.value)}
        />
        <button
          className="btn btn-warning text-white"
          type="button"
          onClick={() => {
            if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
              setNewsletterInfo("Please enter a valid email address.");
              return;
            }
            setNewsletterInfo("Subscribed successfully.");
            setNewsletterEmail("");
          }}
        >
          Subscribe
        </button>
      </div>
      {newsletterInfo ? <p className="small text-white mt-2 mb-0">{newsletterInfo}</p> : null}
    </div>

  </div>
</div>


);
}
