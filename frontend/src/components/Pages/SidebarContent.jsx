import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  getUserDisplayData,
  logoutUser,
  subscribeUserChanges,
} from "../../lib/api";

export default function SidebarContent({
  items,
  title,
  accentColor,
  setMobileOpen,
}) {
  const [user, setUser] = useState(getUserDisplayData());

  useEffect(() => subscribeUserChanges(setUser), []);

  const handleBackToSite = async () => {
    await logoutUser();
    setMobileOpen?.(false);
  };

  return (
    <div className="d-flex flex-column h-100 text-white">
      <div className="px-4 py-4 border-bottom border-light">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #4A90E2, #7F3FBF)",
            }}
          >
            <span className="text-white fw-bold">
              <BookOpen />
            </span>
          </div>
          <span className="fw-bold fs-5">LearnHub</span>
        </div>
        <div
          className="mt-2 px-2 py-1 rounded small d-inline-block"
          style={{ backgroundColor: `${accentColor}30`, color: accentColor }}
        >
          {title}
        </div>
      </div>

      <nav className="flex-grow-1 px-2 py-3 overflow-auto">
        {items?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) =>
              `menu-item d-flex align-items-center gap-2 px-3 py-2 rounded small mb-1 ${
                isActive ? "active" : ""
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                    color: "white",
                  }
                : {}
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>

            {item.badge && (
              <span className="ms-auto px-2 py-1 rounded-pill small bg-warning text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-top border-light">
        <div className="d-flex align-items-center gap-2">
          <img
            src={user.image}
            className="rounded-circle object-fit-cover"
            style={{
              width: "36px",
              height: "36px",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
            alt="User"
          />
          <div>
            <p className="small mb-0 fw-semibold">{user.fullName}</p>
            <p className="text-secondary small mb-0">{user.email || "no-email"}</p>
          </div>
        </div>

        <NavLink
          to="/"
          onClick={handleBackToSite}
          className="mt-3 w-100 d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded text-decoration-none small text-white-50"
        >
          {"<-"} Back to Site
        </NavLink>
      </div>
    </div>
  );
}
