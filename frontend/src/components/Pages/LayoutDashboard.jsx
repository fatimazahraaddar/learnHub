import { Navigate, Outlet } from "react-router-dom";
import DashboardSidebar from "../Pages/DashboardSidebar";
import { DashboardTopbar } from "../Pages/DashboardTopbar";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  MessageSquare,
  Award,
  User,
  BarChart2,
  Users,
  Settings,
  FileText,
  CreditCard,
  Bell,
  BookMarked,
  Calendar,
  Star,
  PenTool,
  Globe,
} from "lucide-react";
import { useLocation } from "react-router";
import { getDashboardRouteByRole, getStoredUser } from "../../lib/api";

const LEARNER_ITEMS = [
  {
    label: "Dashboard",
    path: "/learner",
    icon: <LayoutDashboard className="me-2" />,
  },
  {
    label: "My Courses",
    path: "/learner/courses",
    icon: <BookOpen className="me-2" />,
  },
  {
    label: "Lessons",
    path: "/learner/lessons",
    icon: <PlayCircle className="me-2" />,
  },
{
  label: "Discussion",
  path: "/learner/discussion",
  icon: <MessageSquare className="me-2" />,
  // ✅ badge statique supprimé
},
  {
    label: "Certificates",
    path: "/learner/certificates",
    icon: <Award className="me-2" />,
  },

  {
    label: "Profile",
    path: "/learner/profile",
    icon: <User className="me-2" />,
  },


];

const TRAINER_ITEMS = [
  {
    label: "Overview",
    path: "/trainer",
    icon: <LayoutDashboard className="me-2" />,
  },
  {
    label: "My Courses",
    path: "/trainer/courses",
    icon: <BookOpen className="me-2" />,
  },
  {
    label: "Students",
    path: "/trainer/students",
    icon: <Users className="me-2" />,
  },
  {
    label: "Analytics",
    path: "/trainer/analytics",
    icon: <BarChart2 className="me-2" />,
  },
  {
    label: "Profile",
    path: "/trainer/profile",
    icon: <User className="me-2" />,
  },
];

const ADMIN_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <LayoutDashboard className="me-2" />,
  },
  { label: "Users", path: "/admin/users", icon: <Users className="me-2" /> },
  {
    label: "Trainers",
    path: "/admin/trainers",
    icon: <Star className="me-2" />,
  },
  {
    label: "Courses",
    path: "/admin/courses",
    icon: <BookOpen className="me-2" />,
  },
  {
    label: "Certificates",
    path: "/admin/certificates",
    icon: <Award className="me-2" />,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: <BarChart2 className="me-2" />,
  },
{
  label: "Notifications",
  path: "/admin/notifications",
  icon: <Bell className="me-2" />,
  // ✅ badge statique supprimé
},
  {
    label: "Settings",
    path: "/admin/settings",
    icon: <Settings className="me-2" />,
  },
  {
    label: "Profile",
    path: "/admin/profile",
    icon: <User className="me-2" />,
  },

];

const PAGE_TITLES = {
  "/learner": {
    title: "Dashboard",
    subtitle: "Welcome back! Keep up the great work.",
  },
  "/learner/courses": {
    title: "My Courses",
    subtitle: "Manage and continue your enrolled courses.",
  },
  "/learner/lessons": {
    title: "Lessons",
    subtitle: "Explore lesson content by difficulty level.",
  },
  "/learner/discussion": {
    title: "Discussion",
    subtitle: "Collaborate and learn with your peers.",
  },
  "/learner/certificates": {
    title: "Certificates",
    subtitle: "Your earned certifications and diplomas.",
  },
  "/learner/messages": {
    title: "Messages",
    subtitle: "Your inbox and conversations.",
  },
  "/learner/profile": {
    title: "Profile",
    subtitle: "Manage your personal information.",
  },
  "/trainer": {
    title: "Trainer Overview",
    subtitle: "Monitor your courses and student progress.",
  },
  "/trainer/courses": {
    title: "My Courses",
    subtitle: "Manage your course content.",
  },
  "/trainer/students": {
    title: "Students",
    subtitle: "View and manage your enrolled students.",
  },
  "/trainer/analytics": {
    title: "Analytics",
    subtitle: "Track performance and earnings.",
  },
  "/trainer/messages": {
    title: "Messages",
    subtitle: "Communicate with your students.",
  },
  "/trainer/profile": {
    title: "Trainer Profile",
    subtitle: "Update your professional profile.",
  },
  "/admin": {
    title: "Admin Dashboard",
    subtitle: "Platform overview and global statistics.",
  },
  "/admin/users": {
    title: "User Management",
    subtitle: "Manage learner accounts and permissions.",
  },
  "/admin/trainers": {
    title: "Trainer Management",
    subtitle: "Review and manage instructor profiles.",
  },
  "/admin/courses": {
    title: "Course Management",
    subtitle: "Review, approve, or flag courses.",
  },
  "/admin/certificates": {
    title: "Certificates",
    subtitle: "Manage issued certificates and templates.",
  },
  "/admin/payments": {
    title: "Payments & Invoices",
    subtitle: "Track revenue and transactions.",
  },
  "/admin/reports": {
    title: "Reports & Analytics",
    subtitle: "Platform-wide performance insights.",
  },
  "/admin/messages": {
    title: "Admin Messages",
    subtitle: "Communicate with learners and trainers.",
  },
  "/admin/notifications": {
    title: "Notifications",
    subtitle: "System alerts and announcements.",
  },
  "/admin/settings": {
    title: "Site Settings",
    subtitle: "Configure platform appearance and content.",
  },
  "/admin/profile": {
    title: "Admin Profile",
    subtitle: "Manage your admin account information.",
  },
};

export function LearnerDashboard() {
  const location = useLocation();
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role && user.role !== "learner") {
    return <Navigate to={getDashboardRouteByRole(user.role)} replace />;
  }

  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: "Dashboard",
    subtitle: "",
  };
  return (
    <div className="d-flex vh-100 bg-light overflow-hidden">
      <DashboardSidebar
        items={LEARNER_ITEMS}
        title="Learner Portal"
        accentColor="#4A90E2" // 🔵 ICI
      />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <DashboardTopbar title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="flex-grow-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function TrainerDashboard() {
  const location = useLocation();
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "trainer") {
    return <Navigate to={getDashboardRouteByRole(user.role)} replace />;
  }

  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: "Trainer Dashboard",
    subtitle: "",
  };
  return (
    <div className="d-flex vh-100 bg-light overflow-hidden">
      <DashboardSidebar
        items={TRAINER_ITEMS}
        title="Trainer Portal"
        accentColor="#7F3FBF" // 🟣 ICI !!!
      />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <DashboardTopbar title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="flex-grow-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const location = useLocation();
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to={getDashboardRouteByRole(user.role)} replace />;
  }

  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: "Admin Dashboard",
    subtitle: "",
  };
  return (
    <div className="d-flex vh-100 bg-light overflow-hidden">
      <DashboardSidebar
        items={ADMIN_ITEMS}
        title="Admin Panel"
        accentColor="#FF7A00" // 🟠 ICI
      />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <DashboardTopbar title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="flex-grow-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
