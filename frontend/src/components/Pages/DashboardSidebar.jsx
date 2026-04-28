import { useEffect, useState } from "react";
import { BookOpen, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getUserDisplayData, logoutUser, subscribeUserChanges } from "../../lib/api";

export default function SidebarContent({ items, title, accentColor, setMobileOpen }) {
  const [user, setUser] = useState(getUserDisplayData());

  useEffect(() => subscribeUserChanges(setUser), []);

  const handleBackToSite = async () => {
    await logoutUser();
    setMobileOpen?.(false);
  };

  const initials = (user.firstName || user.fullName || "U").charAt(0).toUpperCase();

  return (
    <div
      className="d-flex flex-column h-100 text-white"
      style={{ background: "linear-gradient(180deg, #0f0c29 0%, #1a1a2e 100%)" }}
    >

      {/* LOGO */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="rounded-2 d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
          >
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="fw-bold fs-5 text-white">LearnHub</span>
        </div>

        <div
          className="px-3 py-1 rounded-pill small d-inline-block fw-medium"
          style={{
            backgroundColor: `${accentColor}25`,
            color: accentColor,
            border: `1px solid ${accentColor}40`,
          }}
        >
          {title}
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-grow-1 px-3 py-3 overflow-auto" style={{ scrollbarWidth: "none" }}>
        {items?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={() => setMobileOpen?.(false)}
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 small mb-1 text-decoration-none"
            style={({ isActive }) => ({
              background: isActive
                ? `linear-gradient(135deg, ${accentColor}DD, ${accentColor}99)`
                : "transparent",
              color: isActive ? "white" : "rgba(255,255,255,0.6)",
              fontWeight: isActive ? 600 : 400,
              transition: "all 0.2s ease",
            })}
          >
            <span style={{ opacity: 0.9 }}>{item.icon}</span>
            <span className="flex-grow-1">{item.label}</span>

            {item.badge && Number(item.badge) > 0 && (
              <span
                className="px-2 rounded-pill"
                style={{
                  fontSize: "0.7rem",
                  backgroundColor: accentColor,
                  color: "white",
                  fontWeight: 600,
                  minWidth: 20,
                  textAlign: "center",
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* USER FOOTER */}
      <div className="px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="d-flex align-items-center gap-2 mb-3 p-2 rounded-3"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          {/* ✅ Initiale uniquement */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
            style={{
              width: 38, height: 38, fontSize: 16,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
              color: "white",
              border: `2px solid ${accentColor}60`,
            }}
          >
            {initials}
          </div>

          <div className="overflow-hidden">
            <p className="small mb-0 fw-semibold text-white text-truncate">{user.fullName}</p>
            <p className="mb-0 text-truncate" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>
              {user.email || "no-email"}
            </p>
          </div>
        </div>

        <button
          onClick={handleBackToSite}
          className="w-100 d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 border-0 small"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
          }}
        >
          <LogOut size={14} /> Back to Site
        </button>
      </div>
    </div>
  );
}