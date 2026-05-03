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
    .map((c) => ({
      ...mapCourse(c),
      image: c.thumbnail_url || c.image_url || "",
    }));

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
        courses.reduce((sum, c) => sum + Number(c.raw?.pivot?.progress || 0), 0) / courses.length
      )
    : 0;

  const stats = {
    courses: courses.length,
    completed: courses.filter((c) => Number(c.raw?.pivot?.progress || 0) >= 100).length,
    hours: Math.round(
      courses.reduce((sum, c) => sum + Number(c.raw?.duration_minutes || 0), 0) / 60
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
    data: { status: true, stats, courses: courses.slice(0, 3), activity },
  };
}

// ─── LEARNER LESSONS & QUIZZES ────────────────────────────────────────────────

export async function fetchLearnerLessonsData(userId) {
  // 1. Récupère les enrollments
  const { ok, data } = await apiRequest(`enrollments?user_id=${Number(userId)}`);
  if (!ok) return { ok: false, data: { status: false, lessons: [], quizzes: [], course: null } };

  const enrollments = Array.isArray(data)
    ? data
    : Array.isArray(data?.data) ? data.data : [];

  const userEnrollments = enrollments.filter(
    (e) => Number(e.user_id) === Number(userId)
  );

  if (!userEnrollments.length) {
    return { ok: true, data: { status: true, lessons: [], quizzes: [], course: null } };
  }

  // 2. Charge les leçons de chaque cours inscrit
  const allLessons = [];
  const allQuizzes = [];

  for (const enrollment of userEnrollments) {
    const courseId = enrollment.course_id;

    // Leçons
    const { ok: lessonOk, data: lessonData } = await apiRequest(`courses/${courseId}/lessons`);
    if (lessonOk) {
      const list = Array.isArray(lessonData)
        ? lessonData
        : Array.isArray(lessonData?.data) ? lessonData.data : [];

      list.forEach((l) => {
        allLessons.push({
          id: l.id,
          title: l.title || "Leçon",
          description: l.content || "",
          code: l.code || "",
          duration: minutesToDuration(l.duration_minutes || 0),
          difficulty: "Medium",
          completed: false,
          locked: false,
          course_id: courseId,
        });
      });
    }

    // Quizzes
    const { ok: qOk, data: qData } = await apiRequest(`courses/${courseId}/quizzes`);
    if (qOk) {
      const list = Array.isArray(qData)
        ? qData
        : Array.isArray(qData?.data) ? qData.data : [];

      list.forEach((q) => {
        allQuizzes.push({
          ...q,
          questions: Array.isArray(q.questions)
            ? q.questions.map((qu) => ({
                ...qu,
                options: Array.isArray(qu.options) ? qu.options : [],
                correct: Number(qu.correct ?? 0),
              }))
            : [],
        });
      });
    }
  }

  return {
    ok: true,
    data: { status: true, lessons: allLessons, quizzes: allQuizzes, course: null },
  };
}
export async function updateEnrollmentProgress(courseId, progress) {
  // Trouve l'enrollment de l'utilisateur connecté pour ce cours
  const user = (await import('./index')).getStoredUser();
  
  // Récupère l'enrollment
  const { ok, data } = await apiRequest(`enrollments?user_id=${Number(user?.id)}`);
  if (!ok) return;

  const enrollments = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  const enrollment = enrollments.find((e) => Number(e.course_id) === Number(courseId));
  if (!enrollment) return;

  // Met à jour le progress
  await apiRequest(`enrollments/${enrollment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progress }),
  });
}