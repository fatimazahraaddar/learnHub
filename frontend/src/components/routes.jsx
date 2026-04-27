import { createBrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { PublicLayout } from "./Pages/publicLayout";
import { HomePage } from "./Pages/Home";
import { CoursesPage } from "./Pages/Courses";
import { CourseDetailsPage } from "./Pages/CourseDetails";
import { BlogPage } from "./Pages/BlogPage";
import { ContactPage } from "./Pages/Contact";
import { AboutPage } from "./Pages/AboutPage";
import { AuthPage } from "./Pages/AuthPage";
import { LearnerDashboard } from "./Pages/LayoutDashboard";
import { LearnerCourses } from "./Pages/layouts/learners/Courses";
import { LearnerLessons } from "./Pages/layouts/learners/Lessons";
import { LearnerDiscussion } from "./Pages/layouts/learners/Discussion";
import { LearnerCertificates } from "./Pages/layouts/learners/Certificates";
import { LearnerMessage } from "./Pages/layouts/learners/Message";
import { LearnerProfile } from "./Pages/layouts/learners/Profile";
import { TrainerDashboard } from "./Pages/LayoutDashboard";
import { TrainerCourses } from "./Pages/layouts/trainers/Courses";
import { TrainerStudents } from "./Pages/layouts/trainers/Students";
import { TrainerOverview } from "./Pages/layouts/trainers/Overview";
import { TrainerProfile } from "./Pages/layouts/trainers/Profile";
import { TrainerMessage }  from "./Pages/layouts/trainers/Messages";
import { AdminDashboard } from "./Pages/LayoutDashboard";
import { AdminUsers } from "./Pages/layouts/admins/Users";
import { AdminCourses } from "./Pages/layouts/admins/Courses";
import { AdminCertificates } from "./Pages/layouts/admins/Certificates";
import { AdminReports } from "./Pages/layouts/admins/Reports";
import { AdminNotifications } from "./Pages/layouts/admins/Notifications";
import { AdminSettings } from "./Pages/layouts/admins/Settings";
import { AdminTrainers } from "./Pages/layouts/admins/Trainers";
import { AdminProfile } from "./Pages/layouts/admins/Profile";
import { AdminMessage } from "./Pages/layouts/admins/Messages";
import { SubscriptionPage } from "./Pages/SubscriptionPage";
import { BarChart2 } from "lucide-react";
import { LearnerDashboards } from "./Pages/layouts/learners/LearnerDashboard";
import { TrainerDashboards } from "./Pages/layouts/trainers/TrainerDashboard";
import { AdminDashboards } from "./Pages/layouts/admins/AdminDashboard";
import { fetchTrainerOverviewData, getStoredUser } from "../lib/api";

export function TrainerAnalytics() {
  const [stats, setStats] = useState({
    views: 0,
    enrollments: 0,
    revenue: 0,
    rating: "0.0",
  });

  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      const { ok, data } = await fetchTrainerOverviewData(user?.id || null);
      if (!ok || !data?.status) return;

      setStats({
        views: Number(data.stats.students || 0) * 10,
        enrollments: Number(data.stats.students || 0),
        revenue: Number(data.stats.earnings || 0),
        rating: data.stats.rating || "0.0",
      });
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: stats.views.toLocaleString(), color: "#4A90E2" },
          { label: "Enrollments", value: stats.enrollments.toLocaleString(), color: "#7F3FBF" },
          { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, color: "#28A745" },
          { label: "Avg Rating", value: `${stats.rating} *`, color: "#FF7A00" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
        <BarChart2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Detailed analytics charts are available in the full version.</p>
      </div>
    </div>
  );
}

export const Router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "courses", Component: CoursesPage },
      { path: "courses/:id", Component: CourseDetailsPage },
      { path: "blog", Component: BlogPage },
      { path: "contact", Component: ContactPage },
      { path: "about", Component: AboutPage },
      { path: "auth", Component: AuthPage },
      { path: "subscription", Component: SubscriptionPage },
    ],
  },
  {
    path: "/learner",
    Component: LearnerDashboard,
    children: [
      { index: true, Component: LearnerDashboards },
      { path: "courses", Component: LearnerCourses },
      { path: "lessons", Component: LearnerLessons },
      { path: "discussion", Component: LearnerDiscussion },
      { path: "certificates", Component: LearnerCertificates },
      { path: "messages", Component: LearnerMessage },
      { path: "profile", Component: LearnerProfile },
    ],
  },
  {
    path: "/trainer",
    Component: TrainerDashboard,
    children: [
      { index: true, Component: TrainerDashboards },
      { path: "courses", Component: TrainerCourses },
      { path: "students", Component: TrainerStudents },
      { path: "analytics", Component: TrainerAnalytics },
      { path: "messages", Component: TrainerMessage },
      { path: "profile", Component: TrainerProfile },
      { path: "overview", Component: TrainerOverview },
    ],
  },
  {
    path: "/admin",
    Component: AdminDashboard,
    children: [
      { index: true, Component: AdminDashboards },
      { path: "users", Component: AdminUsers },
      { path: "trainers", Component: AdminTrainers },
      { path: "courses", Component: AdminCourses },
      { path: "certificates", Component: AdminCertificates },
      { path: "reports", Component: AdminReports },
      { path: "messages", Component: AdminMessage },
      { path: "notifications", Component: AdminNotifications },
      { path: "settings", Component: AdminSettings },
      { path: "profile", Component: AdminProfile },
    ],
  },
]);
