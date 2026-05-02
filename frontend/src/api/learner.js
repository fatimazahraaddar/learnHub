// src/api/learner.js

import { apiRequest } from './client';
import { mapCourse, asArray, formatDate, minutesToDuration } from './utils';

// ─── LEARNER COURSES ──────────────────────────────────────────────────────────

export async function fetchLearnerCourses(userId) {
  const { ok, data } = await apiRequest(`enrollments?user_id=${Number(userId)}`);

  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: data?.message || "Failed to load courses." },
    };
  }

  const courses = asArray(data)
    .map((e) => e.course)
    .filter(Boolean)
    .map(mapCourse);

  return { ok: true, data: courses };
}

// ─── LEARNER CERTIFICATES ─────────────────────────────────────────────────────

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

// ─── LEARNER DASHBOARD ────────────────────────────────────────────────────────

export async function fetchLearnerDashboardData(userId) {
  const [coursesRes, certsRes] = await Promise.all([
    fetchLearnerCourses(userId),
    fetchLearnerCertificates(userId),
  ]);

  if (!coursesRes.ok) {
    return {
      ok: false,
      data: {
        status: false,
        message: coursesRes.data?.message || "Failed to load dashboard.",
      },
    };
  }

  const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
  const certificates = Array.isArray(certsRes.data) ? certsRes.data : [];

  const progressBase = courses.length
    ? Math.round(
        courses.reduce(
          (sum, c) => sum + Number(c.raw?.pivot?.progress || 0),
          0
        ) / courses.length
      )
    : 0;

  const stats = {
    courses: courses.length,
    completed: courses.filter(
      (c) => Number(c.raw?.pivot?.progress || 0) >= 100
    ).length,
    hours: Math.round(
      courses.reduce(
        (sum, c) => sum + Number(c.raw?.duration_minutes || 0),
        0
      ) / 60
    ),
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

// ─── LEARNER LESSONS ──────────────────────────────────────────────────────────

export async function fetchLearnerLessonsData(userId) {
  const { ok, data } = await apiRequest("enrollments");

  if (!ok) {
    return {
      ok: false,
      data: { status: false, message: "Failed to load enrollments." },
    };
  }

  const enrollments = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const userEnrollments = enrollments.filter(
    (e) => Number(e.user_id) === Number(userId)
  );

  if (!userEnrollments.length) {
    return { ok: true, data: { status: true, lessons: [], course: null } };
  }

  let courseData = null;
  for (const enrollment of userEnrollments) {
    const { ok: courseOk, data: cd } = await apiRequest(
      `courses/${enrollment.course_id}`
    );
    if (courseOk && cd && Array.isArray(cd.modules) && cd.modules.length > 0) {
      courseData = cd;
      break;
    }
  }

  if (!courseData) {
    return { ok: true, data: { status: true, lessons: [], course: null } };
  }

  const lessons = courseData.modules
    .flatMap((module) =>
      Array.isArray(module.lessons) ? module.lessons : []
    )
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

  return {
    ok: true,
    data: { status: true, lessons, course: mapCourse(courseData) },
  };
}