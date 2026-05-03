import { useEffect, useMemo, useState } from "react";
import { ThumbsUp, MessageCircle, Share2, Search, Pin } from "lucide-react";
import { fetchBlogPosts, apiRequest, getStoredUser } from "../../../../api";
 
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .slice(0, 80)
    + "-" + Date.now();
}
 
export function LearnerDiscussion() {
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [info, setInfo] = useState("");
  const [publishing, setPublishing] = useState(false);
 
  const user = getStoredUser();
 
  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchBlogPosts();
      if (!ok) return;
 
      const mapped = (Array.isArray(data) ? data : []).slice(0, 8).map((post, idx) => ({
        id: post.id,
        author: post.author,
        avatar: post.image,
        course: post.category,
        time: post.date,
        title: post.title,
        content: post.excerpt,
        likes: 10 + idx,
        replies: 2 + idx,
        pinned: idx === 0,
        tags: [post.category, "Community"],
      }));
 
      setPosts(mapped);
    };
 
    load();
  }, []);
 
  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => `${p.title} ${p.content} ${p.course}`.toLowerCase().includes(q));
  }, [posts, query]);
 
  const toggleLike = (id) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };
 
  const publishPost = async () => {
    const text = newPost.trim();
    if (!text) return;
 
    setPublishing(true);
    setInfo("");
 
    const payload = {
      author_id: user?.id ? Number(user.id) : null,
      title: text.length > 100 ? `${text.slice(0, 100)}...` : text,
      slug: slugify(text),
      excerpt: text,
      content: text,
      status: "published",
      published_at: new Date().toISOString(),
    };
 
    const { ok, data } = await apiRequest("blog-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
 
    setPublishing(false);
 
    if (!ok) {
      setInfo(data?.message || "Failed to publish post.");
      return;
    }
 
    const next = {
      id: data.id || Date.now(),
      author: user?.name || "You",
      avatar: user?.image || null,
      course: "General",
      time: "Just now",
      title: payload.title,
      content: text,
      likes: 0,
      replies: 0,
      pinned: false,
      tags: ["Community"],
    };
 
    setPosts((prev) => [next, ...prev]);
    setNewPost("");
    setInfo("Post published.");
  };
 
  return (
    <div className="container my-4 overflow-hidden">
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex gap-3 overflow-hidden">
          {user?.image ? (
            <img
              src={user.image}
              alt="user"
              className="rounded-circle flex-shrink-0"
              width="40"
              height="40"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 40, height: 40, background: "linear-gradient(135deg,#4A90E2,#7F3FBF)", fontSize: 16 }}
            >
              {(user?.name || "U")[0].toUpperCase()}
            </div>
          )}
 
          <div className="flex-grow-1 min-width-0">
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Share a question, insight, or experience..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
 
            <div className="d-flex justify-content-between flex-wrap gap-2">
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm" type="button"
                  onClick={() => setInfo("Attachment upload will be available soon.")}>Attach</button>
                <button className="btn btn-outline-secondary btn-sm" type="button"
                  onClick={() => setInfo("Tags added: #Community")}>Tag</button>
              </div>
 
              <button
                className="btn btn-primary btn-sm"
                disabled={!newPost || publishing}
                type="button"
                onClick={publishPost}
              >
                {publishing ? "Publishing..." : "Post to Community"}
              </button>
            </div>
            {info ? <small className="text-muted d-block mt-2">{info}</small> : null}
          </div>
        </div>
      </div>
 
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="input-group w-50">
          <span className="input-group-text bg-white">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search discussions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
 
      {filteredPosts.map((post) => (
        <div key={post.id} className="card shadow-sm mb-3">
          <div className="card-body d-flex gap-3 overflow-hidden">
            {post.avatar ? (
              <img
                src={post.avatar}
                alt={post.author}
                className="rounded-circle flex-shrink-0"
                width="40"
                height="40"
                style={{ objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div
                className="rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 40, height: 40, background: "linear-gradient(135deg,#4A90E2,#7F3FBF)", fontSize: 16 }}
              >
                {(post.author || "U")[0].toUpperCase()}
              </div>
            )}
 
            <div className="flex-grow-1 min-width-0">
              <div className="d-flex justify-content-between mb-1 flex-wrap gap-1">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <strong>{post.author}</strong>
                  <span className="badge bg-primary">{post.course}</span>
                  {post.pinned && (
                    <span className="text-warning small d-flex align-items-center gap-1">
                      <Pin size={14} /> Pinned
                    </span>
                  )}
                </div>
                <small className="text-muted">{post.time}</small>
              </div>
 
              <h6 className="fw-semibold">{post.title}</h6>
              <p className="text-muted">{post.content}</p>
 
              <div className="mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="badge bg-light text-dark me-1">
                    #{tag}
                  </span>
                ))}
              </div>
 
              <div className="d-flex align-items-center gap-3 border-top pt-3 flex-wrap">
                <button className="btn btn-link p-0 text-decoration-none" onClick={() => toggleLike(post.id)} type="button">
                  <ThumbsUp size={16} /> {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                </button>
 
                <button className="btn btn-link p-0 text-decoration-none text-muted" type="button"
                  onClick={() => setInfo(`Replies opened for: ${post.title}`)}>
                  <MessageCircle size={16} /> {post.replies} Replies
                </button>
 
                <button
                  className="btn btn-link p-0 text-decoration-none text-muted"
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${post.title} - ${post.content}`);
                      setInfo("Post copied to clipboard.");
                    } catch {
                      setInfo("Unable to copy link.");
                    }
                  }}
                >
                  <Share2 size={16} /> Share
                </button>
 
                <button className="btn btn-link ms-auto text-primary text-decoration-none" type="button"
                  onClick={() => setInfo(`Thread opened: ${post.title}`)}>
                  View Thread
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}