import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Search,
  ChevronDown,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { clearStoredUser, logoutUser } from "../../lib/api";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white p-3 shadow-sm border-bottom sticky-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center me-auto gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #4A90E2, #7F3FBF)",
            }}
          >
            <BookOpen size={16} color="#fff" />
          </div>
          <span className="fs-4 fw-bold" style={{ color: "#333333" }}>
            Learn<span style={{ color: "#4A90E2" }}>Hub</span>
          </span>
        </Link>

        {/* Hamburger mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu central + Right side */}
        <div
          className={`collapse navbar-collapse ${mobileOpen ? "show" : ""}`}
        >
          {/* Menu centré */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex align-items-center justify-content-center" style={{margin:"auto"}}>
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link navs ${
                    isActive(link.path) ? "active fw-semibold" : ""
                  }`}
                  style={
                    isActive(link.path)
                      ? { color: "#4A90E2", backgroundColor: "#EBF4FF" }
                      : { color: "#555" }
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            <button className="btn btn-light p-2" type="button" onClick={() => (window.location.href = "/courses")}>
              <Search size={16} />
            </button>

            <div className="dropdown">
              <button
                className="btn btn-light d-flex align-items-center gap-2"
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <img
                  src="https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                  alt="User"
                  className="rounded-circle"
                  style={{ width: "28px", height: "28px", objectFit: "cover" }}
                />
                <ChevronDown size={12} color="#6c757d" />
              </button>

              <ul
                className={`dropdown-menu dropdown-menu-end ${
                  userMenuOpen ? "show" : ""
                }`}
              >
                <li>
                  <Link
                    to="/learner"
                    className="dropdown-item d-flex align-items-center gap-2"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} /> Learner Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/trainer"
                    className="dropdown-item d-flex align-items-center gap-2"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={16} /> Trainer Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="dropdown-item d-flex align-items-center gap-2"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings size={16} /> Admin Dashboard
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 text-danger w-100"
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

            <Link
              to="/auth"
              className="btn text-white"
              style={{ backgroundColor: "#4A90E2" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
