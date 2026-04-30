import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Search,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User
} from "lucide-react";
import {
  clearStoredUser,
  getDashboardRouteByRole,
  getStoredUser,
  logoutUser,
} from "../../lib/api";

const PRIMARY = "#1E3A5F";
const ACCENT = "#10B981";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const ROLE_LABELS = {
  learner: "Learner Dashboard",
  trainer: "Trainer Dashboard",
  admin: "Admin Dashboard",
};

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const user = getStoredUser();
  const dashboardPath = user ? getDashboardRouteByRole(user.role) : "/auth";
  const dashboardLabel = user
    ? ROLE_LABELS[user.role] || "Dashboard"
    : "Dashboard";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white p-3 shadow-sm border-bottom sticky-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* ── Logo ── */}
        <Link
          to="/"
          className="d-flex align-items-center me-auto gap-2 text-decoration-none"
        >
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{
              width: "34px",
              height: "34px",
              background: `linear-gradient(135deg, ${PRIMARY}, #16324F)`,
            }}
          >
            <BookOpen size={18} color="#fff" />
          </div>
          <span className="fs-4 fw-bold" style={{ color: PRIMARY }}>
            Learn<span style={{ color: ACCENT }}>Hub</span>
          </span>
        </Link>

        {/* ── Hamburger mobile ── */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* ── Menu + droite ── */}
        <div className={`collapse navbar-collapse ${mobileOpen ? "show" : ""}`}>
          {/* liens centrés */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex align-items-center justify-content-center">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link
                  to={link.path}
                  className="nav-link px-3 py-2 rounded-3 fw-medium"
                  style={
                    isActive(link.path)
                      ? {
                          color: ACCENT,
                          backgroundColor: `${ACCENT}18`,
                          fontWeight: 600,
                        }
                      : { color: "#4B5563" }
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* droite */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* bouton recherche */}
            <button
              className="btn p-2 rounded-3"
              type="button"
              style={{ background: `${PRIMARY}10`, color: PRIMARY }}
              onClick={() => (window.location.href = "/courses")}
            >
              <Search size={16} />
            </button>

            {/* dropdown user */}
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center gap-2 rounded-3 px-2 py-1"
                type="button"
                style={{
                  border: `1px solid ${PRIMARY}22`,
                  background: "white",
                }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: `linear-gradient(135deg, ${PRIMARY}, #16324F)`,
                    color: "white",
                    fontSize: "12px",
                    border: `2px solid ${ACCENT}`,
                  }}
                >
                  {user
                    ? (user.name || user.fullName || user.email || "U")
                        .charAt(0)
                        .toUpperCase()
                    : <User size={14} color="white" />}
                </div>
                <ChevronDown size={12} color="#6c757d" />
              </button>

              <ul
                className={`dropdown-menu dropdown-menu-end shadow border-0 rounded-3 ${userMenuOpen ? "show" : ""}`}
                style={{ minWidth: "200px", padding: "8px" }}
              >
                {/* ── Un seul dashboard selon le rôle ── */}
                {user && (
                  <li>
                    <Link
                      to={dashboardPath}
                      className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2"
                      style={{ color: PRIMARY }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span style={{ color: ACCENT }}>
                        <LayoutDashboard size={16} />
                      </span>
                      {dashboardLabel}
                    </Link>
                  </li>
                )}

                {/* ── Settings ── */}
                <li>
                  <Link
                    to={user ? `${dashboardPath}/profile` : "/auth"}
                    className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2"
                    style={{ color: PRIMARY }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span style={{ color: ACCENT }}>
                      <LayoutDashboard size={16} />
                    </span>
                    Dashboard
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider my-2" />
                </li>

                {/* ── Sign Out ── */}
                <li>
                  <button
                    className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2 text-danger w-100"
                    type="button"
                    onClick={async () => {
                      setUserMenuOpen(false);
                      try {
                        await logoutUser();
                      } catch {
                        clearStoredUser();
                      }
                      window.location.href = "/auth";
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </li>
              </ul>
            </div>

            {/* bouton Get Started / Dashboard */}
            {user ? (
              <Link
                to={dashboardPath}
                className="btn fw-semibold text-white px-4"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, #16324F)`,
                  borderRadius: "10px",
                  border: "none",
                }}
              >
                My Dashboard
              </Link>
            ) : (
              <Link
                to="/auth"
                className="btn fw-semibold text-white px-4"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, #059669)`,
                  borderRadius: "10px",
                  boxShadow: `0 4px 14px ${ACCENT}44`,
                  border: "none",
                }}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
