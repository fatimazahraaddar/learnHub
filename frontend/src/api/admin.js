// src/api/admin.js

import { apiRequest } from './client';
import { asArray, formatDate, startCaseRole } from './utils';

// ─── USERS ────────────────────────────────────────────────────────────────────

export const updateUser = (id, body) =>
  apiRequest(`users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const deleteUser = (id) =>
  apiRequest(`users/${id}`, { method: "DELETE" });

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

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

  const stats = [
    { label: "Users", value: users.length.toLocaleString(), color: "#4A90E2", bg: "#EBF4FF" },
    { label: "Courses", value: courses.length.toLocaleString(), color: "#7F3FBF", bg: "#F3EBFF" },
    { label: "Active", value: activeEnrollments.toLocaleString(), color: "#FF7A00", bg: "#FFF3E8" },
  ];

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

  const recentActivity = [...enrollments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8)
    .map((e) => ({
      user: e.user?.name || "Unknown user",
      course: e.course?.title || "Unknown course",
      date: formatDate(e.enrolled_at || e.created_at),
      status:
        String(e.status || "").toLowerCase() === "completed"
          ? "Completed"
          : "Active",
    }));

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

// ─── USERS DATA ───────────────────────────────────────────────────────────────

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
    const courseCount = enrollments.filter(
      (e) => Number(e.user_id) === Number(u.id)
    ).length;

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

// ─── TRAINERS DATA ────────────────────────────────────────────────────────────

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

// ─── CERTIFICATES ─────────────────────────────────────────────────────────────

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
      : c.file_url
        ? "Valid"
        : "Pending",
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

export async function updateCertificateStatus(id, status) {
  return await apiRequest(`certificates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: status.toLowerCase() }),
  });
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────

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

  const geoData = [
    { country: "Learners", users: users.filter((u) => u.role === "learner").length, color: "#4A90E2" },
    { country: "Trainers", users: users.filter((u) => u.role === "trainer").length, color: "#7F3FBF" },
    { country: "Admins", users: users.filter((u) => u.role === "admin").length, color: "#FF7A00" },
  ];

  const kpis = {
    newUsers: users.length,
    enrollments: enrollments.length,
    rating:
      courses.length > 0
        ? (
          courses.reduce((sum, c) => sum + Number(c.rating || 0), 0) /
          courses.length
        ).toFixed(1)
        : "0.0",
  };

  return {
    ok: true,
    data: { status: true, categoryData, completionData, geoData, kpis },
  };
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

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
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 12);

  return { ok: true, data: { status: true, notifications } };
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

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
    data: { status: true, settings: data?.settings || {} },
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