// src/api/trainer.js

import { apiRequest } from './client';
import { asArray, mapCourse, formatDate } from './utils';

// ─── TRAINER ANALYTICS ────────────────────────────────────────────────────────

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

// ─── TRAINER OVERVIEW ─────────────────────────────────────────────────────────

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
  const enrollments = allEnrollments.filter((e) =>
    courseIds.has(Number(e.course_id))
  );

  const revenue = enrollments.reduce(
    (sum, e) => sum + Number(e.course?.price || 0),
    0
  );
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

// ─── TRAINER STUDENTS ─────────────────────────────────────────────────────────

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

  const enrollments = allEnrollments.filter((e) => {
    if (!trainerId) return true;
    const course = courses.find((c) => Number(c.id) === Number(e.course_id));
    return Number(course?.trainer_id) === Number(trainerId);
  });

  const students = enrollments.map((e) => {
    const progress = Number(e.progress || 0);
    const status =
      progress === 100 ? "Completed" : progress < 30 ? "At Risk" : "Active";

    return {
      id: Number(e.id),
      name: e.user?.name || "Unnamed",
      email: e.user?.email || "",
      course: e.course?.title || "Unknown Course",
      progress,
      joined: formatDate(e.enrolled_at || e.created_at),
      status,
      avatar:
        e.user?.image ||
        "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    };
  });

  const summary = {
    total: students.length,
    active: students.filter((s) => s.status === "Active").length,
    completed: students.filter((s) => s.status === "Completed").length,
    atRisk: students.filter((s) => s.status === "At Risk").length,
  };

  return {
    ok: true,
    data: { status: true, students, summary },
  };
}