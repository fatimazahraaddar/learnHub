// src/api/courses.js

import { apiRequest } from './client';
import {
  mapCourse,
  asArray,
  slugify,
  parseDurationToMinutes,
  minutesToDuration,
} from './utils';

// ─── PRIVATE HELPERS ──────────────────────────────────────────────────────────

async function fetchAllCategories() {
  const { ok, data } = await apiRequest("categories");
  if (!ok) return [];
  return asArray(data);
}



// ─── LESSONS ──────────────────────────────────────────────────────────────────

export async function fetchCourseLessons(courseId) {
  const { ok, data } = await apiRequest(`courses/${courseId}/lessons`);
  if (!ok) return { ok: false, data: { lessons: [] } };

  const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return {
    ok: true,
    data: {
      lessons: list.map((l) => ({
        id: l.id,
        title: l.title || "",
        content: l.content || "",
        code: l.code || "",
        position: l.position || 0,
      })),
    },
  };
}

export async function saveCourseLessons(courseId, lessons) {
  const { ok, data } = await apiRequest(`courses/${courseId}/lessons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessons }),
  });

  return {
    ok,
    data: {
      status: ok,
      message: ok ? "Lessons saved" : data?.message || "Failed to save lessons",
    },
  };
}

// ─── QUIZZES ──────────────────────────────────────────────────────────────────

export async function fetchCourseQuizzes(courseId) {
  const { ok, data } = await apiRequest(`courses/${courseId}/quizzes`);
  if (!ok) return { ok: false, data: { quizzes: [] } };

  const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return {
    ok: true,
    data: {
      quizzes: list.map((q) => ({
        id: q.id,
        title: q.title || "",
        questions: Array.isArray(q.questions)
          ? q.questions.map((qu) => ({
              id: qu.id,
              question: qu.question || "",
              options: Array.isArray(qu.options) ? qu.options : ["", "", "", ""],
              correct: Number(qu.correct ?? qu.correct_answer ?? 0),
            }))
          : [],
      })),
    },
  };
}

export async function saveCourseQuizzes(courseId, quizzes) {
  const { ok, data } = await apiRequest(`courses/${courseId}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quizzes }),
  });

  return {
    ok,
    data: {
      status: ok,
      message: ok ? "Quizzes saved" : data?.message || "Failed to save quizzes",
    },
  };
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
  const slug = courseId
    ? `${slugBase}-${courseId}`
    : `${slugBase}-${Date.now()}`;

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

// ─── COURSES API ──────────────────────────────────────────────────────────────

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
  duration: minutesToDuration(c.duration_minutes),
  students: Number(c.students_count || 0),
})),
    },
  };
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
        (duplicate
          ? "You are already enrolled in this course."
          : "Enrollment failed"),
    },
  };
}