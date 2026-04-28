import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
//import { useEffect, useState } from "react";

// Layouts et Pages Publiques
import { PublicLayout } from "./Pages/publicLayout";
import { HomePage } from "./Pages/Home";
import { CoursesPage } from "./Pages/Courses";
import { CourseDetailsPage } from "./Pages/CourseDetails";
import { BlogPage } from "./Pages/BlogPage";
import { ContactPage } from "./Pages/Contact";
import { AboutPage } from "./Pages/AboutPage";
import { AuthPage } from "./Pages/AuthPage";
import { SubscriptionPage } from "./Pages/SubscriptionPage";

// Learner imports
import { LearnerDashboard } from "./Pages/LayoutDashboard";
import { LearnerDashboards } from "./Pages/layouts/learners/LearnerDashboard";
import { LearnerCourses } from "./Pages/layouts/learners/Courses";
import { LearnerLessons } from "./Pages/layouts/learners/Lessons";
import { LearnerDiscussion } from "./Pages/layouts/learners/Discussion";
import { LearnerCertificates } from "./Pages/layouts/learners/Certificates";

import { LearnerProfile } from "./Pages/layouts/learners/Profile";

// Trainer imports
import { TrainerDashboard } from "./Pages/LayoutDashboard";
import { TrainerDashboards } from "./Pages/layouts/trainers/TrainerDashboard";
import { TrainerCourses } from "./Pages/layouts/trainers/Courses";
import { TrainerStudents } from "./Pages/layouts/trainers/Students";
import { TrainerOverview } from "./Pages/layouts/trainers/Overview";
import { TrainerProfile } from "./Pages/layouts/trainers/Profile";
import { TrainerAnalytics } from "./Pages/layouts/trainers/Analytics";

// Admin imports
import { AdminDashboard } from "./Pages/LayoutDashboard";
import { AdminDashboards } from "./Pages/layouts/admins/AdminDashboard";
import { AdminUsers } from "./Pages/layouts/admins/Users";
import { AdminCourses } from "./Pages/layouts/admins/Courses";
import { AdminCertificates } from "./Pages/layouts/admins/Certificates";
import { AdminReports } from "./Pages/layouts/admins/Reports";
import { AdminNotifications } from "./Pages/layouts/admins/Notifications";
import { AdminSettings } from "./Pages/layouts/admins/Settings";
import { AdminTrainers } from "./Pages/layouts/admins/Trainers";
import { AdminProfile } from "./Pages/layouts/admins/Profile";


import { getStoredUser } from "../lib/api";

// Composant de Protection des Routes
function ProtectedRoute({ allowedRole }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    switch (user.role) {
      case "learner": return <Navigate to="/learner" replace />;
      case "trainer": return <Navigate to="/trainer" replace />;
      case "admin": return <Navigate to="/admin" replace />;
      default: return <Navigate to="/auth" replace />;
    }
  }

  return <Outlet />;
}

export const Router = createBrowserRouter([
  // --- ROUTES PUBLIQUES ---
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "course/:id", element: <CourseDetailsPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "subscription", element: <SubscriptionPage /> },
    ],
  },

  // --- ROUTES LEARNER ---
  {
    path: "/learner",
    element: <ProtectedRoute allowedRole="learner" />,
    children: [
      {
        element: <LearnerDashboard />,
        children: [
          { index: true, element: <LearnerDashboards /> },
          { path: "courses", element: <LearnerCourses /> },
          { path: "lessons", element: <LearnerLessons /> },
          { path: "discussion", element: <LearnerDiscussion /> },
          { path: "certificates", element: <LearnerCertificates /> },
          { path: "profile", element: <LearnerProfile /> },
        ],
      },
    ],
  },

  // --- ROUTES TRAINER ---
  {
    path: "/trainer",
    element: <ProtectedRoute allowedRole="trainer" />,
    children: [
      {
        element: <TrainerDashboard />,
        children: [
          { index: true, element: <TrainerDashboards /> },
          { path: "courses", element: <TrainerCourses /> },
          { path: "students", element: <TrainerStudents /> },
          { path: "profile", element: <TrainerProfile /> },
          { path: "overview", element: <TrainerOverview /> },
          { path: "analytics", element: <TrainerAnalytics /> },
        ],
      },
    ],
  },

  // --- ROUTES ADMIN ---
  {
    path: "/admin",
    element: <ProtectedRoute allowedRole="admin" />,
    children: [
      {
        element: <AdminDashboard />,
        children: [
          { index: true, element: <AdminDashboards /> },
          { path: "users", element: <AdminUsers /> },
          { path: "trainers", element: <AdminTrainers /> },
          { path: "courses", element: <AdminCourses /> },
          { path: "certificates", element: <AdminCertificates /> },
          { path: "reports", element: <AdminReports /> },
          { path: "notifications", element: <AdminNotifications /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "profile", element: <AdminProfile /> },
        ],
      },
    ],
  },
]);