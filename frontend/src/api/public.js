// src/api/public.js

import { apiRequest } from './client';
import {
  asArray,
  mapCategory,
  mapTestimonial,
  mapTeamMember,
  mapBlogPost,
  mapSubscriptionPlan,
} from './utils';

import { fetchCourses } from './courses';

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export async function fetchPublicCategories() {
  const { ok, data } = await apiRequest("categories");
  const list = asArray(data).map(mapCategory);
  return { ok, data: list };
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export async function fetchTestimonials() {
  const { ok, data } = await apiRequest("testimonials");
  const list = asArray(data).map(mapTestimonial);
  return { ok, data: list };
}

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────

export async function fetchTeamMembers() {
  const { ok, data } = await apiRequest("team-members");
  const list = asArray(data).map(mapTeamMember);
  return { ok, data: list };
}

// ─── BLOG POSTS ───────────────────────────────────────────────────────────────

export async function fetchBlogPosts() {
  const { ok, data } = await apiRequest("blog-posts");
  const list = asArray(data).map(mapBlogPost);
  return { ok, data: list };
}

// ─── SUBSCRIPTION PLANS ───────────────────────────────────────────────────────

export async function fetchSubscriptionPlans() {
  const { ok, data } = await apiRequest("subscription-plans");
  const list = asArray(data).map(mapSubscriptionPlan);
  return { ok, data: list };
}

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────

export async function fetchHomePageData() {
  try {
    const [coursesRes, categoriesRes, testimonialsRes] = await Promise.all([
      fetchCourses(),
      fetchPublicCategories(),
      fetchTestimonials(),
    ]);

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

    const categoryUsage = courses.reduce((acc, course) => {
      const key = String(course.category || "General").trim();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const normalizedCategories = categories.map((cat) => ({
      ...cat,
      count: Number(
        categoryUsage[String(cat.name || "General").trim()] || cat.count || 0
      ),
    }));

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

// ─── CONTACT ──────────────────────────────────────────────────────────────────

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
      message:
        data?.message ||
        (ok ? "Message sent successfully." : "Unable to send message."),
    },
  };
}

// ─── UPLOAD IMAGE ─────────────────────────────────────────────────────────────

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
      message:
        data?.message ||
        (ok ? "Image uploaded successfully" : "Upload failed"),
      url: data?.url || "",
      path: data?.path || "",
    },
  };
}