import { useEffect, useState } from "react";
import { Bell, Search, MessageSquare } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserDisplayData, subscribeUserChanges } from "../../lib/api";

export function DashboardTopbar({ title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getUserDisplayData());

  useEffect(() => subscribeUserChanges(setUser), []);

  const dashboardBase = location.pathname.startsWith("/admin")
    ? "/admin"
    : location.pathname.startsWith("/trainer")
    ? "/trainer"
    : "/learner";

  const notificationsRoute = dashboardBase === "/admin"
    ? "/admin/notifications"
    : `${dashboardBase}/messages`;

  const initials = (user.firstName || user.fullName || "U").charAt(0).toUpperCase();

  return (
    <div
      className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between position-sticky top-0"
      style={{ zIndex: 30 }}
    >
      <div>
        <h1 className="text-dark mb-0" style={{ fontWeight: 700 }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-secondary small mb-0">{subtitle}</p>
        )}
      </div>

      <div className="d-flex align-items-center gap-2">

        <div className="d-none d-sm-flex align-items-center gap-2 bg-light rounded px-3 py-2">
          <Search style={{ width: 16, height: 16, color: "#9CA3AF" }} />
          <input
            placeholder="Search..."
            className="border-0 bg-transparent small text-dark"
            style={{ width: 160, outline: "none" }}
          />
        </div>

        <button
          className="position-relative p-2 rounded border-0 bg-transparent"
          type="button"
          onClick={() => navigate(notificationsRoute)}
        >
          <Bell style={{ width: 20, height: 20, color: "#6B7280" }} />
          <span
            className="position-absolute rounded-circle"
            style={{ top: 4, right: 4, width: 8, height: 8, backgroundColor: "#FF7A00" }}
          />
        </button>

        <button
          className="position-relative p-2 rounded border-0 bg-transparent"
          type="button"
          onClick={() => navigate(`${dashboardBase}/messages`)}
        >
          <MessageSquare style={{ width: 20, height: 20, color: "#6B7280" }} />
          <span
            className="position-absolute rounded-circle"
            style={{ top: 4, right: 4, width: 8, height: 8, backgroundColor: "#4A90E2" }}
          />
        </button>

        {/* ✅ Initiale uniquement */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
          style={{
            width: 36, height: 36, fontSize: 16,
            background: "linear-gradient(135deg, #4A90E2, #7F3FBF)",
            cursor: "pointer",
            border: "2px solid #4A90E2",
          }}
        >
          {initials}
        </div>

      </div>
    </div>
  );
}