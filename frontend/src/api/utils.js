// src/api/utils.js

// ─── ARRAY HELPER ─────────────────────────────────────────────────────────────

export function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

// ─── DATE & TIME ──────────────────────────────────────────────────────────────

export function minutesToDuration(value) {
  const total = Number(value || 0);
  if (!total) return "Self paced";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

// ─── STRING HELPERS ───────────────────────────────────────────────────────────

export function startCaseRole(role) {
  const value = String(role || "").toLowerCase();
  if (!value) return "Learner";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function parseDurationToMinutes(value) {
  const raw = String(value || "").toLowerCase().trim();
  if (!raw) return 0;

  const hourMatch = raw.match(/(\d+)\s*h/);
  const minuteMatch = raw.match(/(\d+)\s*m/);
  if (hourMatch || minuteMatch) {
    const h = Number(hourMatch?.[1] || 0);
    const m = Number(minuteMatch?.[1] || 0);
    return h * 60 + m;
  }

  const justNumber = Number(raw.replace(/[^\d]/g, ""));
  if (!Number.isNaN(justNumber) && justNumber > 0) {
    if (raw.includes("hour")) return justNumber * 60;
    return justNumber;
  }

  return 0;
}

// ─── MAPPERS ──────────────────────────────────────────────────────────────────

export function mapCourse(course) {
  return {
    id: course.id,
    title: course.title || "Untitled Course",
    description: course.description || "",
    price: Number(course.price || 0).toFixed(2),
    category: course.category?.name || "General",
    students: Number(course.students_count || 0),
    duration: minutesToDuration(course.duration_minutes),
    image: course.thumbnail_url || "",
    modules: course.modules || [],
    raw: course,
  };
}

export function mapCategory(category) {
  return {
    id: Number(category?.id || 0),
    name: category?.name || "General",
    icon: category?.icon || "📘",
    color: category?.color || "#4A90E2",
    description: category?.description || "",
    count: Number(category?.courses_count || 0),
  };
}

export function mapTestimonial(item) {
  return {
    id: Number(item?.id || 0),
    name: item?.name || item?.user?.name || "Learner",
    role: item?.role || startCaseRole(item?.user?.role || "learner"),
    avatar:
      item?.avatar_url ||
      item?.user?.image ||
      "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    text: item?.text || "",
    rating: Number(item?.rating || 5),
  };
}

export function mapTeamMember(item) {
  return {
    id: Number(item?.id || 0),
    name: item?.name || "Team Member",
    role: item?.role || "Instructor",
    bio: item?.bio || "",
    image:
      item?.image_url ||
      "https://images.unsplash.com/photo-1758612214917-81d7956c09de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    linkedin: item?.linkedin_url || "",
    twitter: item?.twitter_url || "",
  };
}

export function mapBlogPost(item) {
  return {
    id: Number(item?.id || 0),
    title: item?.title || "Untitled Post",
    excerpt: item?.excerpt || "",
    image:
      item?.image_url ||
      "https://images.unsplash.com/photo-1565229284535-2cbbe3049123?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    date: formatDate(item?.published_at || item?.created_at),
    readTime: `${Number(item?.read_time_minutes || 0) || 5} min`,
    author: item?.author?.name || "LearnHub Team",
    category: item?.category?.name || "General",
  };
}

export function mapSubscriptionPlan(item) {
  return {
    id: Number(item?.id || 0),
    name: item?.name || "Plan",
    price: Number(item?.price || 0),
    period: item?.period || "month",
    color: item?.color || "#4A90E2",
    popular: Boolean(item?.is_popular),
    features: Array.isArray(item?.features) ? item.features : [],
    disabled: Array.isArray(item?.disabled_features)
      ? item.disabled_features
      : [],
  };
}