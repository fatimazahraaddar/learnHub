export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
export const LEGACY_API_BASE =
  import.meta.env.VITE_LEGACY_API_BASE_URL || "http://localhost/backend";

const USER_CHANGED_EVENT = "learnhub:user-changed";
const USER_KEY = "user";
const TOKEN_KEY = "auth_token";

function buildUrl(base, path) {
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}/${String(path).replace(/^\/+/, "")}`;
}

function parseJsonSafe(response) {
  return response
    .json()
    .catch(() => ({ status: false, message: "Invalid server response" }));
}

function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function buildHeaders(extra = {}) {
  const token = getStoredToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function postForm(path, payload) {
  const response = await fetch(buildUrl(LEGACY_API_BASE, path), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...buildHeaders(),
    },
    body: new URLSearchParams(payload),
  });

  const data = await parseJsonSafe(response);
  return { ok: response.ok, data };
}

export async function getJson(pathWithQuery) {
  const response = await fetch(buildUrl(LEGACY_API_BASE, pathWithQuery), {
    headers: buildHeaders(),
  });
  const data = await parseJsonSafe(response);
  return { ok: response.ok, data };
}

export async function postMultipart(path, payload) {
  const formData = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  const response = await fetch(buildUrl(LEGACY_API_BASE, path), {
    method: "POST",
    headers: buildHeaders(),
    body: formData,
  });

  const data = await parseJsonSafe(response);
  return { ok: response.ok, data };
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(buildUrl(API_BASE, path), {
    ...options,
    headers: {
      Accept: "application/json",
      ...buildHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await parseJsonSafe(response);
  return { ok: response.ok, status: response.status, data };
}

function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function minutesToDuration(value) {
  const total = Number(value || 0);
  if (!total) return "Self paced";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function startCaseRole(role) {
  const value = String(role || "").toLowerCase();
  if (!value) return "Learner";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function mapCourse(course) {
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

function mapCategory(category) {
  return {
    id: Number(category?.id || 0),
    name: category?.name || "General",
    icon: category?.icon || "📘",
    color: category?.color || "#4A90E2",
    description: category?.description || "",
    count: Number(category?.courses_count || 0),
  };
}

function mapTestimonial(item) {
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


function mapTeamMember(item) {
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

function mapBlogPost(item) {
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

function mapSubscriptionPlan(item) {
  return {
    id: Number(item?.id || 0),
    name: item?.name || "Plan",
    price: Number(item?.price || 0),
    period: item?.period || "month",
    color: item?.color || "#4A90E2",
    popular: Boolean(item?.is_popular),
    features: Array.isArray(item?.features) ? item.features : [],
    disabled: Array.isArray(item?.disabled_features) ? item.disabled_features : [],
  };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseDurationToMinutes(value) {
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
export async function fetchTrainerAnalytics() {
  const { ok, data } = await apiRequest("analytics/trainer");
  return {
    ok,
    data: {
      totalEnrollments: Number(data?.total_enrollments ?? 0),
      avgRating: Number(data?.avg_rating ?? 0),
      totalCourses: Number(data?.total_courses ?? 0),
    },
  };
}

async function fetchAllCategories() {
  const { ok, data } = await apiRequest("categories");
  if (!ok) return [];
  return asArray(data);
}

async function ensureCategoryId(categoryName) {
  const targetName = String(categoryName || "General").trim();
  const categories = await fetchAllCategories();
  const existing = categories.find(
    (c) => String(c.name || "").toLowerCase() === targetName.toLowerCase()
  );

  if (existing?.id) return Number(existing.id);

  const slugBase = slugify(targetName) || "general";
  const { ok, data } = await apiRequest("categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: targetName,
      slug: `${slugBase}-${Date.now()}`,
      is_active: true,
    }),
  });

  if (ok && data?.id) return Number(data.id);

  const fallback = categories[0];
  return Number(fallback?.id || 1);
}

function toCoursePayload(form, opts = {}) {
  const title = String(form.title || "").trim();
  const slugBase = slugify(title) || "course";
  const courseId = opts.courseId ? Number(opts.courseId) : null;
  const slug = courseId ? `${slugBase}-${courseId}` : `${slugBase}-${Date.now()}`;

  return {
    title,
    slug,
    description: String(form.description || "").trim(),
    level: "beginner",
    price: Number(form.price || 0),
    duration_minutes: parseDurationToMinutes(form.duration),
    thumbnail_url: String(form.image_url || "").trim() || null,
    status: "published",
    trainer_id: opts.trainerId ? Number(opts.trainerId) : null,
    published_at: new Date().toISOString(),
  };
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStoredToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USER_CHANGED_EVENT));
  }
}

export function getDashboardRouteByRole(role) {
  if (role === "trainer") return "/trainer";
  if (role === "admin") return "/admin";
  return "/learner";
}

export function getUserDisplayData() {
  const user = getStoredUser() || {};
  const fullName = String(user.name || "").trim();
  const parts = fullName ? fullName.split(/\s+/) : [];
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");

  return {
    fullName: fullName || "User",
    firstName,
    lastName,
    email: String(user.email || ""),
    role: String(user.role || "learner"),
    image:
      user.image ||
      "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
  };
}

export async function registerUser(payload) {
  const { ok, data } = await apiRequest("auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (ok && data?.token && data?.user) {
    setStoredToken(data.token);
    setStoredUser(data.user);
  }

  return { ok, data };
}

export async function loginUser(payload) {
  const { ok, data } = await apiRequest("auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (ok && data?.token && data?.user) {
    setStoredToken(data.token);
    setStoredUser(data.user);
  }

  return { ok, data };
}

export async function fetchCurrentUser() {
  return apiRequest("auth/me");
}

export async function logoutUser() {
  const token = getStoredToken();
  if (token) {
    await apiRequest("auth/logout", { method: "POST" });
  }
  clearStoredUser();
  window.location.href = "/"; // ✅ recharge complète — stoppe toutes les requêtes en cours
}

export async function fetchProfile() {
  const { ok, data } = await apiRequest("profile");

  if (!ok || !data) {
    return {
      ok,
      data: {
        status: false,
        message: data?.message || "Profile not found",
      },
    };
  }

  const fullName = String(data.name || "").trim();
  const parts = fullName ? fullName.split(/\s+/) : [];

  return {
    ok: true,
    data: {
      status: true,
      profile: {
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" "),
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
        github: data.github || "",
        image: data.image || "",
      },
    },
  };
}

export async function fetchPublicCategories() {
  const { ok, data } = await apiRequest("categories");
  const list = asArray(data).map(mapCategory);
  return { ok, data: list };
}

export async function fetchTestimonials() {
  const { ok, data } = await apiRequest("testimonials");
  const list = asArray(data).map(mapTestimonial);
  return { ok, data: list };
}

export async function fetchTeamMembers() {
  const { ok, data } = await apiRequest("team-members");
  const list = asArray(data).map(mapTeamMember);
  return { ok, data: list };
}

export async function fetchBlogPosts() {
  const { ok, data } = await apiRequest("blog-posts");
  const list = asArray(data).map(mapBlogPost);
  return { ok, data: list };
}

export async function fetchSubscriptionPlans() {
  const { ok, data } = await apiRequest("subscription-plans");
  const list = asArray(data).map(mapSubscriptionPlan);
  return { ok, data: list };
}
export async function fetchCourses() {
  const { ok, data } = await apiRequest("courses");

  if (!ok) return { ok: false, data: { courses: [] } };

  const list = data.data || (Array.isArray(data) ? data : []);

  return {
    ok: true,
    data: {
      courses: list.map((c) => ({
        ...c,
        image: c.thumbnail_url || c.image_url || "",
        category: c.category?.name || "General",
        // ...
      })),
    },
  };
}

export async function fetchHomePageData() {
  try {
    const [coursesRes, categoriesRes, testimonialsRes] = await Promise.all([
      fetchCourses(),
      fetchPublicCategories(),
      fetchTestimonials(),
    ]);

    // Sécurisation des données selon leur vraie structure
    const courses = Array.isArray(coursesRes?.data?.courses)
      ? coursesRes.data.courses
      : [];

    const categories = Array.isArray(categoriesRes?.data?.categories)
      ? categoriesRes.data.categories
      : Array.isArray(categoriesRes?.data)
        ? categoriesRes.data
        : [];

    const testimonials = Array.isArray(testimonialsRes?.data?.testimonials)
      ? testimonialsRes.data.testimonials
      : Array.isArray(testimonialsRes?.data)
        ? testimonialsRes.data
        : [];

    const certificateCount = testimonials.length * 10;

    // Compter combien de cours par catégorie
    const categoryUsage = courses.reduce((acc, course) => {
      const key = String(course.category || "General").trim();

      acc[key] = (acc[key] || 0) + 1;

      return acc;
    }, {});

    // Normaliser les catégories
    const normalizedCategories = categories.map((cat) => ({
      ...cat,
      count: Number(
        categoryUsage[String(cat.name || "General").trim()] ||
        cat.count ||
        0
      ),
    }));

    // Calcul des apprenants actifs
    const totalStudents = courses.reduce(
      (sum, course) => sum + Number(course.students || 0),
      0
    );

    const stats = [
      {
        label: "Active Learners",
        value: `${Math.max(totalStudents, 1).toLocaleString()}+`,
        color: "#4A90E2",
      },
      {
        label: "Courses Available",
        value: `${courses.length.toLocaleString()}+`,
        color: "#7F3FBF",
      },
      {
        label: "Certificates Issued",
        value: `${certificateCount.toLocaleString()}+`,
        color: "#FF7A00",
      },
      {
        label: "Completion Rate",
        value: "87%",
        color: "#28A745",
      },
    ];

    return {
      ok: coursesRes?.ok || categoriesRes?.ok || testimonialsRes?.ok,
      data: {
        status: true,
        courses,
        categories: normalizedCategories,
        testimonials,
        stats,
      },
    };
  } catch (error) {
    return {
      ok: false,
      data: {
        status: false,
        message: error.message || "Failed to load homepage data",
        courses: [],
        categories: [],
        testimonials: [],
        stats: [],
      },
    };
  }
}

export async function fetchCourseById(courseId) {
  const { ok, data } = await apiRequest(`courses/${courseId}`);
  if (!ok || !data) {
    return {
      ok,
      data: { status: false, message: data?.message || "Course not found" },
    };
  }

  return { ok: true, data: mapCourse(data) };
}

export async function createCourseFromForm(form, trainerId = null) {
  const categoryId = await ensureCategoryId(form.category);
  const payload = {
    ...toCoursePayload(form, { trainerId }),
    category_id: categoryId,
  };

  const { ok, data } = await apiRequest("courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: data?.message || "Failed to create course" },
    };
  }

  return { ok: true, data: { status: true, course: mapCourse(data) } };
}

export async function updateCourseFromForm(courseId, form, trainerId = null) {
  const categoryId = await ensureCategoryId(form.category);
  const payload = {
    ...toCoursePayload(form, { courseId, trainerId }),
    category_id: categoryId,
  };

  const { ok, data } = await apiRequest(`courses/${courseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: data?.message || "Failed to update course" },
    };
  }

  return { ok: true, data: { status: true, course: mapCourse(data) } };
}

export async function deleteCourseById(courseId) {
  const { ok, data } = await apiRequest(`courses/${courseId}`, {
    method: "DELETE",
  });

  return {
    ok,
    data: {
      status: ok,
      message: ok ? "Course deleted" : data?.message || "Delete failed",
    },
  };
}

export async function enrollInCourse(userId, courseId) {
  const { ok, data } = await apiRequest("enrollments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: Number(userId),
      course_id: Number(courseId),
      status: "active",
      progress: 0,
      enrolled_at: new Date().toISOString(),
    }),
  });

  if (ok) {
    return { ok: true, data: { status: true, message: "Enrollment successful" } };
  }

  const duplicate = String(data?.message || "").toLowerCase().includes("duplicate");
  return {
    ok: false,
    data: {
      status: false,
      message:
        data?.message ||
        (duplicate ? "You are already enrolled in this course." : "Enrollment failed"),
    },
  };
}

export async function fetchMessageContacts(selfId) {
  const { ok, data } = await apiRequest("users");
  if (!ok) {
    return { ok: false, data: { status: false, message: data?.message || "Failed to load contacts" } };
  }

  const contacts = asArray(data)
    .filter((u) => Number(u.id) !== Number(selfId))
    .map((u) => ({
      id: Number(u.id),
      name: u.name || "Unnamed",
      email: u.email || "",
      role: String(u.role || "learner"),
    }));

  return { ok: true, data: { status: true, contacts } };
}

export async function fetchConversation(selfId, otherId) {
  const [sent, received] = await Promise.all([
    apiRequest(`messages?sender_id=${Number(selfId)}`),
    apiRequest(`messages?receiver_id=${Number(selfId)}`),
  ]);

  if (!sent.ok && !received.ok) {
    return { ok: false, data: { status: false, message: "Failed to load messages" } };
  }

  const all = [...asArray(sent.data), ...asArray(received.data)];
  const chat = all
    .filter(
      (msg) =>
        (Number(msg.sender_id) === Number(selfId) && Number(msg.receiver_id) === Number(otherId)) ||
        (Number(msg.sender_id) === Number(otherId) && Number(msg.receiver_id) === Number(selfId))
    )
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((msg) => ({
      id: msg.id,
      sender_id: Number(msg.sender_id),
      sender_role: String(msg.sender?.role || "learner"),
      receiver_id: Number(msg.receiver_id),
      receiver_role: String(msg.receiver?.role || "learner"),
      message: msg.body || "",
      created_at: msg.created_at,
    }));

  return { ok: true, data: chat };
}

export async function sendConversationMessage(senderId, receiverId, text) {
  const { ok, data } = await apiRequest("messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender_id: Number(senderId),
      receiver_id: Number(receiverId),
      body: String(text || ""),
      subject: null,
    }),
  });

  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: data?.message || "Failed to send message" },
    };
  }

  return { ok: true, data: { status: true, message: "Message sent" } };
}

export async function fetchAdminDashboardData() {
  const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
    apiRequest("users"),
    apiRequest("courses"),
    apiRequest("enrollments"),
  ]);

  if (!usersRes.ok || !coursesRes.ok || !enrollmentsRes.ok) {
    return {
      ok: false,
      data: { status: false, message: "Failed to load dashboard data" },
    };
  }

  const users = asArray(usersRes.data);
  const courses = asArray(coursesRes.data);
  const enrollments = asArray(enrollmentsRes.data);

  const activeEnrollments = enrollments.filter(
    (e) => String(e.status || "").toLowerCase() === "active"
  ).length;

  // ✅ Stats sans Revenue
  const stats = [
    { label: "Users", value: users.length.toLocaleString(), color: "#4A90E2", bg: "#EBF4FF" },
    { label: "Courses", value: courses.length.toLocaleString(), color: "#7F3FBF", bg: "#F3EBFF" },
    { label: "Active", value: activeEnrollments.toLocaleString(), color: "#FF7A00", bg: "#FFF3E8" },
  ];

  // ✅ Graphique enrollments + users par mois (sans revenue)
  const now = new Date();
  const chartData = Array.from({ length: 6 }).map((_, idx) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const monthEnrollments = enrollments.filter((e) => {
      const source = e.enrolled_at || e.created_at;
      if (!source) return false;
      const d = new Date(source);
      if (isNaN(d.getTime())) return false;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === monthKey;
    }).length;

    const monthUsers = users.filter((u) => {
      if (!u.created_at) return false;
      const d = new Date(u.created_at);
      if (isNaN(d.getTime())) return false;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === monthKey;
    }).length;

    return {
      month: date.toLocaleDateString([], { month: "short" }),
      enrollments: monthEnrollments,
      users: monthUsers,
    };
  });

  // ✅ Activité récente sans paiement
  const recentActivity = [...enrollments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8)
    .map((e) => ({
      user: e.user?.name || "Unknown user",
      course: e.course?.title || "Unknown course",
      date: formatDate(e.enrolled_at || e.created_at),
      status: String(e.status || "").toLowerCase() === "completed" ? "Completed" : "Active",
    }));

  // ✅ Alerts
  const trainerCount = users.filter((u) => String(u.role) === "trainer").length;
  const alerts = [];
  if (trainerCount === 0) alerts.push({ type: "warning", message: "No trainer assigned yet." });
  if (courses.length === 0) alerts.push({ type: "danger", message: "No courses available." });
  if (alerts.length === 0) alerts.push({ type: "success", message: "All systems operational." });

  return {
    ok: true,
    data: { status: true, stats, chartData, recentActivity, alerts },
  };
}

export async function fetchAdminUsersData() {
  const [usersRes, enrollmentsRes] = await Promise.all([
    apiRequest("users"),
    apiRequest("enrollments"),
  ]);

  if (!usersRes.ok || !enrollmentsRes.ok) {
    return { ok: false, data: { status: false, message: "Failed to load users" } };
  }

  const users = asArray(usersRes.data);
  const enrollments = asArray(enrollmentsRes.data);

  const mappedUsers = users.map((u) => {
    const role = startCaseRole(u.role);
    const courseCount = enrollments.filter((e) => Number(e.user_id) === Number(u.id)).length;

    return {
      id: Number(u.id),
      name: u.name || "Unnamed",
      email: u.email || "",
      role,
      avatar:
        u.image ||
        "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
      courses: courseCount,
      joined: formatDate(u.created_at),
      status: "Active",
    };
  });

  const summary = {
    total: mappedUsers.length,
    learners: mappedUsers.filter((u) => u.role === "Learner").length,
    trainers: mappedUsers.filter((u) => u.role === "Trainer").length,
    admins: mappedUsers.filter((u) => u.role === "Admin").length,
  };

  return { ok: true, data: { status: true, users: mappedUsers, summary } };
}

export async function fetchAdminTrainersData() {
  const [usersRes, enrollmentsRes] = await Promise.all([
    apiRequest("users?role=trainer"),
    apiRequest("enrollments"),
  ]);

  if (!usersRes.ok || !enrollmentsRes.ok) {
    return {
      ok: false,
      data: { status: false, message: "Failed to load trainers data" },
    };
  }

  const trainers = asArray(usersRes.data);
  const enrollments = asArray(enrollmentsRes.data);

  const mapped = trainers.map((u) => {
    const taughtCourseIds = new Set(
      enrollments
        .filter((e) => Number(e.course?.trainer_id) === Number(u.id))
        .map((e) => Number(e.course_id))
    );

    return {
      id: Number(u.id),
      name: u.name || "Unnamed",
      email: u.email || "",
      role: "Trainer",
      courses: taughtCourseIds.size,
      joined: formatDate(u.created_at),
      status: "Active",
      avatar:
        u.image ||
        "https://images.unsplash.com/photo-1758612214917-81d7956c09de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    };
  });

  return {
    ok: true,
    data: {
      status: true,
      users: mapped,
      summary: {
        total: mapped.length,
        trainers: mapped.length,
      },
    },
  };
}

export async function fetchLearnerCourses(userId) {
  const { ok, data } = await apiRequest(`enrollments?user_id=${Number(userId)}`);
  if (!ok) {
    return { ok: false, data: { status: false, message: data?.message || "Failed to load courses." } };
  }

  const courses = asArray(data)
    .map((e) => e.course)
    .filter(Boolean)
    .map(mapCourse);

  return { ok: true, data: courses };
}

export async function fetchLearnerCertificates(userId) {
  const { ok, data } = await apiRequest("certificates");
  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: data?.message || "Failed to load certificates." },
    };
  }

  const certs = asArray(data)
    .filter((c) => Number(c.user_id) === Number(userId))
    .map((c) => ({
      id: c.id,
      course_id: c.course_id,
      course_title: c.course?.title || `Course #${c.course_id}`,
      certificate_url: c.file_url || "#",
      code: c.code || "",
    }));

  return { ok: true, data: certs };
}

export async function fetchLearnerDashboardData(userId) {
  const [coursesRes, certsRes] = await Promise.all([
    fetchLearnerCourses(userId),
    fetchLearnerCertificates(userId),
  ]);

  if (!coursesRes.ok) {
    return {
      ok: false,
      data: { status: false, message: coursesRes.data?.message || "Failed to load dashboard." },
    };
  }

  const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
  const certificates = Array.isArray(certsRes.data) ? certsRes.data : [];

  const progressBase = courses.length
    ? Math.round(
      courses.reduce((sum, c) => sum + Number(c.raw?.pivot?.progress || 0), 0) / courses.length
    )
    : 0;

  const stats = {
    courses: courses.length,
    completed: courses.filter((c) => Number(c.raw?.pivot?.progress || 0) >= 100).length,
    hours: Math.round(courses.reduce((sum, c) => sum + Number(c.raw?.duration_minutes || 0), 0) / 60),
    certificates: certificates.length,
    progress: progressBase,
  };

  const activity = courses.slice(0, 4).map((course) => ({
    id: course.id,
    action: "Course progress updated",
    course: course.title,
    progress: Number(course.raw?.pivot?.progress || 0),
    time: formatDate(course.raw?.pivot?.updated_at || course.raw?.updated_at),
  }));

  return {
    ok: true,
    data: {
      status: true,
      stats,
      courses: courses.slice(0, 3),
      activity,
    },
  };
}

export async function fetchLearnerLessonsData(userId) {
  const { ok, data } = await apiRequest(`enrollments`);
  if (!ok) return { ok: false, data: { status: false, message: "Failed to load enrollments." } };

  const enrollments = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  const userEnrollments = enrollments.filter(e => Number(e.user_id) === Number(userId));

  if (!userEnrollments.length) {
    return { ok: true, data: { status: true, lessons: [], course: null } };
  }

  // Chercher le premier cours qui a des modules/leçons
  let courseData = null;
  for (const enrollment of userEnrollments) {
    const { ok: courseOk, data: cd } = await apiRequest(`courses/${enrollment.course_id}`);
    if (courseOk && cd && Array.isArray(cd.modules) && cd.modules.length > 0) {
      courseData = cd;
      break;
    }
  }

  if (!courseData) {
    return { ok: true, data: { status: true, lessons: [], course: null } };
  }

  const lessons = courseData.modules
    .flatMap((module) => (Array.isArray(module.lessons) ? module.lessons : []))
    .sort((a, b) => Number(a.position || 0) - Number(b.position || 0))
    .map((lesson, idx) => ({
      id: Number(lesson.id || idx + 1),
      title: lesson.title || `Lesson ${idx + 1}`,
      duration: minutesToDuration(lesson.duration_minutes),
      difficulty: "Medium",
      completed: false,
      locked: false,
      type: lesson.video_url ? "video" : "lesson",
      description: lesson.content || "Course lesson content.",
      video_url: lesson.video_url || null,
    }));

  return { ok: true, data: { status: true, lessons, course: mapCourse(courseData) } };
}

export async function fetchTrainerStudentsData(trainerId = null) {
  const [enrollmentsRes, coursesRes] = await Promise.all([
    apiRequest("enrollments"),
    apiRequest("courses"),
  ]);

  if (!enrollmentsRes.ok || !coursesRes.ok) {
    return {
      ok: false,
      data: { status: false, message: "Failed to load students data." },
    };
  }

  const courses = asArray(coursesRes.data);
  const allEnrollments = asArray(enrollmentsRes.data);

  console.log("trainerId reçu:", trainerId);
  console.log("enrollment[0]:", allEnrollments[0]);
  console.log("course[0]:", courses[0]);

  const enrollments = allEnrollments.filter((e) => {
    if (!trainerId) return true;
    const course = courses.find((c) => Number(c.id) === Number(e.course_id));
    return Number(course?.trainer_id) === Number(trainerId);
  });

  const students = enrollments.map((e) => {
    const progress = Number(e.progress || 0);
    const status = progress === 100 ? "Completed" : progress < 30 ? "At Risk" : "Active";

    return {
      id: Number(e.id),
      name: e.user?.name || "Unnamed",
      email: e.user?.email || "",
      course: e.course?.title || "Unknown Course",
      progress,
      joined: formatDate(e.enrolled_at || e.created_at),
      status,
      avatar: e.user?.image ||
        "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    };
  });

  const summary = {
    total: students.length,
    active: students.filter((s) => s.status === "Active").length,
    completed: students.filter((s) => s.status === "Completed").length,
    atRisk: students.filter((s) => s.status === "At Risk").length,
  };

  return { ok: true, data: { status: true, students, summary } };
}
export async function fetchTrainerOverviewData(trainerId = null) {
  const [coursesRes, enrollmentsRes] = await Promise.all([
    apiRequest("courses"),
    apiRequest("enrollments"),
  ]);

  if (!coursesRes.ok || !enrollmentsRes.ok) {
    return {
      ok: false,
      data: { status: false, message: "Failed to load trainer overview data." },
    };
  }

  const allCourses = asArray(coursesRes.data);
  const allEnrollments = asArray(enrollmentsRes.data);

  const courses = trainerId
    ? allCourses.filter((c) => Number(c.trainer_id || 0) === Number(trainerId))
    : allCourses;
  const courseIds = new Set(courses.map((c) => Number(c.id)));
  const enrollments = allEnrollments.filter((e) => courseIds.has(Number(e.course_id)));

  const revenue = enrollments.reduce((sum, e) => sum + Number(e.course?.price || 0), 0);
  const students = new Set(enrollments.map((e) => Number(e.user_id))).size;
  const rating =
    courses.length > 0
      ? (
        courses.reduce((sum, c) => sum + Number(c.rating || 4.5), 0) /
        courses.length
      ).toFixed(1)
      : "0.0";

  const byMonth = {};
  enrollments.forEach((e) => {
    const source = e.enrolled_at || e.created_at;
    const d = new Date(source);
    if (Number.isNaN(d.getTime())) return;
    const month = d.toLocaleDateString([], { month: "short" });
    if (!byMonth[month]) byMonth[month] = { month, revenue: 0, students: 0 };
    byMonth[month].revenue += Number(e.course?.price || 0);
    byMonth[month].students += 1;
  });

  const trend = Object.values(byMonth).map((row) => ({
    month: row.month,
    revenue: Number(row.revenue.toFixed(2)),
    students: row.students,
  }));

  const recentStudents = [...enrollments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6)
    .map((e) => ({
      name: e.user?.name || "Unnamed",
      course: e.course?.title || "Unknown course",
      enrolled: formatDate(e.enrolled_at || e.created_at),
      progress: Number(e.progress || 0),
      avatar:
        e.user?.image ||
        "https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    }));

  return {
    ok: true,
    data: {
      status: true,
      stats: {
        students,
        courses: courses.length,
        earnings: Number(revenue.toFixed(2)),
        rating,
      },
      trend,
      myCourses: courses.slice(0, 5).map(mapCourse),
      recentStudents,
    },
  };
}
export async function updateCertificateStatus(id, status) {
  return await apiRequest(`certificates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: status.toLowerCase() }),
  });
}
export async function fetchAdminCertificatesData() {
  const { ok, data } = await apiRequest("certificates");
  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: data?.message || "Failed to load certificates." },
    };
  }

  const certs = asArray(data).map((c) => ({
    id: c.code || `CERT-${String(c.id).padStart(6, "0")}`,
    user: c.user?.name || "Unknown user",
    course: c.course?.title || `Course #${c.course_id}`,
    issued: formatDate(c.issued_at || c.created_at),
    status: c.status
      ? c.status.charAt(0).toUpperCase() + c.status.slice(1)
      : c.file_url ? "Valid" : "Pending",
    avatar:
      c.user?.image ||
      "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
  }));

  const summary = {
    total: certs.length,
    valid: certs.filter((c) => c.status === "Valid").length,
    pending: certs.filter((c) => c.status === "Pending").length,
    revoked: certs.filter((c) => c.status === "Revoked").length,
  };

  return { ok: true, data: { status: true, certs, summary } };
}

export async function fetchAdminReportsData() {
  const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
    apiRequest("users"),
    apiRequest("courses"),
    apiRequest("enrollments"),
  ]);

  if (!usersRes.ok || !coursesRes.ok || !enrollmentsRes.ok) {
    return { ok: false, data: null };
  }

  const users = asArray(usersRes.data);
  const courses = asArray(coursesRes.data);
  const enrollments = asArray(enrollmentsRes.data);

  // ✅ Enrollments par catégorie (sans revenue)
  const categoryMap = {};
  courses.forEach((c) => {
    const key = c.category?.name || "General";
    if (!categoryMap[key]) categoryMap[key] = { name: key, students: 0 };
  });
  enrollments.forEach((e) => {
    const key = e.course?.category?.name || "General";
    if (!categoryMap[key]) categoryMap[key] = { name: key, students: 0 };
    categoryMap[key].students += 1;
  });
  const categoryData = Object.values(categoryMap)
    .sort((a, b) => b.students - a.students)
    .slice(0, 8);

  // ✅ Taux de complétion par mois
  const monthMap = {};
  enrollments.forEach((e) => {
    const d = new Date(e.created_at || e.enrolled_at);
    if (isNaN(d.getTime())) return;
    const month = d.toLocaleDateString([], { month: "short" });
    if (!monthMap[month]) monthMap[month] = { month, rate: 0, total: 0 };
    monthMap[month].total += 1;
    if (String(e.status || "").toLowerCase() === "completed")
      monthMap[month].rate += 1;
  });
  const completionData = Object.values(monthMap).map((m) => ({
    month: m.month,
    rate: m.total ? Math.round((m.rate / m.total) * 100) : 0,
  }));

  // ✅ Distribution par rôle
  const geoData = [
    { country: "Learners", users: users.filter((u) => u.role === "learner").length, color: "#4A90E2" },
    { country: "Trainers", users: users.filter((u) => u.role === "trainer").length, color: "#7F3FBF" },
    { country: "Admins", users: users.filter((u) => u.role === "admin").length, color: "#FF7A00" },
  ];

  // ✅ KPIs sans revenue
  const kpis = {
    newUsers: users.length,
    enrollments: enrollments.length,
    rating: courses.length > 0
      ? (courses.reduce((sum, c) => sum + Number(c.rating || 0), 0) / courses.length).toFixed(1)
      : "0.0",
  };

  return {
    ok: true,
    data: { status: true, categoryData, completionData, geoData, kpis },
  };
}

export async function fetchAdminNotificationsData() {
  const [coursesRes, usersRes, enrollmentsRes, certificatesRes] = await Promise.all([
    apiRequest("courses"),
    apiRequest("users"),
    apiRequest("enrollments"),
    apiRequest("certificates"),
  ]);

  if (!coursesRes.ok || !usersRes.ok || !enrollmentsRes.ok || !certificatesRes.ok) {
    return { ok: false, data: null };
  }

  const courses = asArray(coursesRes.data);
  const users = asArray(usersRes.data);
  const enrollments = asArray(enrollmentsRes.data);
  const certificates = asArray(certificatesRes.data);

  const notifications = [
    ...courses.slice(0, 3).map((c) => ({
      id: `course-${c.id}`,
      type: "info",
      title: "New Course Published",
      message: `${c.title || "A course"} is now available.`,
      time: formatDate(c.created_at),
      read: false,
    })),
    ...users.slice(0, 3).map((u) => ({
      id: `user-${u.id}`,
      type: "success",
      title: "New User Registered",
      message: `${u.name || "A user"} joined as ${startCaseRole(u.role)}.`,
      time: formatDate(u.created_at),
      read: false,
    })),
    ...enrollments.slice(0, 2).map((e) => ({
      id: `enroll-${e.id}`,
      type: "warning",
      title: "New Enrollment",
      message: `${e.user?.name || "A learner"} enrolled in ${e.course?.title || "a course"}.`,
      time: formatDate(e.created_at || e.enrolled_at),
      read: false,
    })),
    ...certificates.slice(0, 2).map((c) => ({
      id: `cert-${c.id}`,
      type: "success",
      title: "Certificate Issued",
      message: `Certificate ${c.code || c.id} generated.`,
      time: formatDate(c.created_at || c.issued_at),
      read: false,
    })),
  ]
    // ✅ Trier par date décroissante
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 12);

  return { ok: true, data: { status: true, notifications } };
}
export async function fetchPlatformSettings() {
  const { ok, data } = await apiRequest("platform-settings");
  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: data?.message || "Failed to load platform settings." },
    };
  }

  return {
    ok: true,
    data: {
      status: true,
      settings: data?.settings || {},
    },
  };
}

export async function savePlatformSettings(settings) {
  const { ok, data } = await apiRequest("platform-settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings || {}),
  });

  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: data?.message || "Unable to save settings." },
    };
  }

  return {
    ok: true,
    data: {
      status: true,
      message: data?.message || "Settings saved successfully.",
      settings: data?.settings || {},
    },
  };
}

export async function submitContactMessage({ name, email, subject, message }) {
  const { ok, data } = await apiRequest("contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message }),
  });

  return {
    ok,
    data: {
      status: ok,
      message: data?.message || (ok ? "Message sent successfully." : "Unable to send message."),
    },
  };
}

export async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append("image", file);

  const { ok, data } = await apiRequest("uploads/images", {
    method: "POST",
    body: formData,
  });

  return {
    ok,
    data: {
      status: ok,
      message: data?.message || (ok ? "Image uploaded successfully" : "Upload failed"),
      url: data?.url || "",
      path: data?.path || "",
    },
  };
}

// 

export async function saveProfile(_role, accountId, form) {
  const fullName = `${form.firstName || ""} ${form.lastName || ""}`.trim();

  const formData = new FormData();

  formData.append('_method', 'PUT');

  formData.append('name', fullName || "User");
  formData.append('email', form.email || "");
  formData.append('phone', form.phone || "");
  formData.append('location', form.location || "");
  formData.append('bio', form.bio || "");
  formData.append('linkedin', form.linkedin || "");
  formData.append('twitter', form.twitter || "");
  formData.append('github', form.github || "");

  if (form.image && form.image instanceof File) {
    formData.append('image', form.image);
  }

  const { ok, data } = await apiRequest(`profile`, {
    method: "POST", // POST + _method: PUT is more stable for uploads
    body: formData,
  });

  if (!ok || !data) {
    return {
      ok,
      data: { status: false, message: data?.message || "Save failed" },
    };
  }

  const parts = String(data.name || "").trim().split(/\s+/);
  const profile = {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
    email: data.email || "",
    phone: data.phone || "",
    location: data.location || "",
    bio: data.bio || "",
    linkedin: data.linkedin || "",
    twitter: data.twitter || "",
    github: data.github || "",
    image: data.image || "",
  };

  mergeStoredUser({
    name: data.name,
    email: data.email,
    image: data.image,
  });

  return { ok: true, data: { status: true, profile } };
}

export function mergeStoredUser(partial) {
  const current = getStoredUser() || {};
  const next = { ...current, ...partial };
  setStoredUser(next);
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USER_CHANGED_EVENT));
  }
}

export function subscribeUserChanges(callback) {
  if (typeof window === "undefined") return () => { };

  const handler = () => callback(getUserDisplayData());
  const storageHandler = (e) => {
    if (!e.key || e.key === USER_KEY || e.key === TOKEN_KEY) {
      handler();
    }
  };

  window.addEventListener(USER_CHANGED_EVENT, handler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(USER_CHANGED_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
