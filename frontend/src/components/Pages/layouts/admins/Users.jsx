import { useEffect, useMemo, useState } from "react";
import { Search, Filter, UserPlus, MoreVertical, Shield, Mail, X } from "lucide-react";
import { fetchAdminUsersData } from "../../../../api";

const ROLE_COLORS = {
  Learner: { bg: "#EBF4FF", color: "#4A90E2" },
  Trainer: { bg: "#F3EBFF", color: "#7F3FBF" },
  Admin:   { bg: "#FFF3E8", color: "#FF7A00" },
};
const STATUS_COLORS = {
  Active:    { bg: "#F0FFF4", color: "#28A745" },
  Inactive:  { bg: "#F7F7F7", color: "#888" },
  Suspended: { bg: "#FFF5F5", color: "#dc2626" },
};
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100";

// ✅ Clé du token unifiée
const getToken = () => localStorage.getItem("auth_token");

// ✅ Headers communs
const authHeaders = () => ({
  "Content-Type": "application/json",
  "Accept": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

function UserModal({ user, onClose, onSaved }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name:                  user?.name  || "",
    email:                 user?.email || "",
    role:                  (user?.role || "Learner").toLowerCase(),
    password:              "",
    password_confirmation: "",
  });
  const [error,  setError]  = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required."); return; }
    if (!isEdit && !form.password) { setError("Password is required for new users."); return; }
    if (form.password && form.password !== form.password_confirmation) { setError("Passwords do not match."); return; }

    setSaving(true);
    const payload = {
      name:  form.name.trim(),
      email: form.email.trim(),
      role:  form.role,
      ...(form.password ? { password: form.password, password_confirmation: form.password_confirmation } : {}),
    };

    try {
      const res = await fetch(
        isEdit ? `http://127.0.0.1:8000/api/users/${user.id}` : `http://127.0.0.1:8000/api/users`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: authHeaders(), // ✅ corrigé (était auth_token avant)
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      setSaving(false);

      if (!res.ok) {
        setError(data?.message || Object.values(data?.errors || {})?.[0]?.[0] || "Operation failed.");
        return;
      }
      onSaved();
    } catch {
      setSaving(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: 440, maxWidth: "95vw" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">{isEdit ? "Edit User" : "Add New User"}</h5>
          <button className="btn btn-sm btn-light rounded-circle" onClick={onClose} type="button"><X size={16} /></button>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Full Name *</label>
            <input className="form-control" value={form.name} onChange={set("name")} placeholder="Jane Doe" autoComplete="off" />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email *</label>
            <input type="email" className="form-control" value={form.email} onChange={set("email")} placeholder="jane@example.com" autoComplete="off" />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Role</label>
            <select className="form-select" value={form.role} onChange={set("role")}>
              <option value="learner">Learner</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Password {isEdit && <span className="text-muted">(leave blank to keep current)</span>}
            </label>
            <input
              type="password" autoComplete="new-password" className="form-control"
              value={form.password} onChange={set("password")}
              placeholder={isEdit ? "••••••••" : "Min 6 characters"}
            />
          </div>
          {form.password && (
            <div className="mb-3">
              <label className="form-label fw-semibold small">Confirm Password</label>
              <input
                type="password" autoComplete="new-password" className="form-control"
                value={form.password_confirmation} onChange={set("password_confirmation")}
                placeholder="Repeat password"
              />
            </div>
          )}
          <div className="d-flex gap-2 justify-content-end mt-4">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving} className="btn text-white fw-semibold"
              style={{ background: "linear-gradient(135deg,#4A90E2,#7F3FBF)" }}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminUsers() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [users,      setUsers]      = useState([]);
  const [summary,    setSummary]    = useState({ total: 0, learners: 0, trainers: 0, admins: 0 });
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [modal,      setModal]      = useState(null);
  const [toast,      setToast]      = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const reloadUsers = () => {
    fetchAdminUsersData().then(({ data }) => {
      if (!data?.status) return;
      setUsers(Array.isArray(data.users) ? data.users : []);
      if (data.summary) setSummary(data.summary);
    });
  };

  useEffect(() => {
    let cancelled = false;
    fetchAdminUsersData().then(({ data }) => {
      if (cancelled || !data?.status) return;
      setUsers(Array.isArray(data.users) ? data.users : []);
      if (data.summary) setSummary(data.summary);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const filteredUsers = useMemo(() => {
    const q      = search.trim().toLowerCase();
    const byRole = roleFilter === "All" ? users : users.filter((u) => u.role === roleFilter);
    if (!q) return byRole;
    return byRole.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q));
  }, [users, search, roleFilter]);

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
        method: "DELETE",
        headers: authHeaders(), // ✅ corrigé
      });
      if (res.ok) { setUsers((prev) => prev.filter((u) => u.id !== user.id)); showToast(`${user.name} deleted.`); }
      else showToast("Delete failed — check permissions.");
    } catch {
      showToast("Network error during delete.");
    }
    setOpenMenuId(null);
  };

  const handleToggleSuspend = (user) => {
    const newStatus = user.status === "Suspended" ? "Active" : "Suspended";
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    showToast(`${user.name} is now ${newStatus}.`);
    setOpenMenuId(null);
  };

  const handleChangeRole = async (user) => {
    const order    = ["Learner", "Trainer", "Admin"];
    const nextRole = order[(order.indexOf(user.role) + 1) % order.length];
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: authHeaders(), // ✅ corrigé
        body: JSON.stringify({ role: nextRole.toLowerCase() }),
      });
      if (res.ok) { setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))); showToast(`${user.name} is now ${nextRole}.`); }
      else showToast("Role change failed.");
    } catch {
      showToast("Network error during role change.");
    }
    setOpenMenuId(null);
  };

  const handleModalSaved = () => {
    setModal(null);
    showToast("User saved successfully!");
    reloadUsers();
  };

  return (
    <div className="container my-4">
      <div className="row g-3 mb-4">
        {[
          { label: "Total Users", value: summary.total,    color: "#4A90E2" },
          { label: "Learners",    value: summary.learners, color: "#7F3FBF" },
          { label: "Trainers",    value: summary.trainers, color: "#FF7A00" },
          { label: "Admins",      value: summary.admins,   color: "#28A745" },
        ].map((s) => (
          <div key={s.label} className="col-6 col-sm-3">
            <div className="card text-center border shadow-sm rounded-3 p-3">
              <h5 className="fw-bold mb-1" style={{ color: s.color }}>{s.value}</h5>
              <small className="text-muted">{s.label}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-3 p-3 bg-light rounded-3 border">
        <h4 className="mb-2 mb-sm-0">User Management</h4>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white"><Search size={16} /></span>
            <input type="text" className="form-control form-control-sm" placeholder="Search users..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" type="button"
            onClick={() => {
              const order = ["All", "Learner", "Trainer", "Admin"];
              setRoleFilter(order[(order.indexOf(roleFilter) + 1) % order.length]);
            }}>
            <Filter size={16} /> {roleFilter}
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" type="button"
            onClick={() => setModal("add")}>
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      {toast && (
        <div className="alert alert-success py-2 mb-3 d-flex justify-content-between align-items-center">
          <span>{toast}</span>
          <button className="btn-close btn-sm" onClick={() => setToast("")} />
        </div>
      )}

      <div className="table-responsive">
        <table className="table align-middle table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>User</th><th>Role</th><th>Courses</th><th>Joined</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-4">No users found.</td></tr>
            )}
            {filteredUsers.map((user) => {
              const rc = ROLE_COLORS[user.role]    || ROLE_COLORS.Learner;
              const sc = STATUS_COLORS[user.status] || STATUS_COLORS.Active;
              return (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={user.avatar} className="rounded-circle" width={40} height={40} alt={user.name}
                        onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
                      <div>
                        <div className="fw-semibold">{user.name}</div>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge" style={{ backgroundColor: rc.bg, color: rc.color }}>{user.role}</span></td>
                  <td>{user.courses}</td>
                  <td>{user.joined}</td>
                  <td><span className="badge" style={{ backgroundColor: sc.bg, color: sc.color }}>{user.status}</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-1 position-relative">
                      <button className="btn btn-light btn-sm p-1" title="Send email" type="button"
                        onClick={() => (window.location.href = `mailto:${user.email}`)}><Mail size={16} /></button>
                      <button className="btn btn-light btn-sm p-1" title="Change role" type="button"
                        onClick={() => handleChangeRole(user)}><Shield size={16} /></button>
                      <button className="btn btn-light btn-sm p-1" type="button"
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }}>
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === user.id && (
                        <div className="position-absolute end-0 top-100 mt-1 bg-white border rounded shadow-sm"
                          style={{ minWidth: 160, zIndex: 100 }} onClick={(e) => e.stopPropagation()}>
                          <button className="dropdown-item btn btn-sm w-100 text-start" type="button"
                            onClick={() => { setModal(user); setOpenMenuId(null); }}>✏️ Edit User</button>
                          <button className="dropdown-item btn btn-sm w-100 text-start text-warning" type="button"
                            onClick={() => handleToggleSuspend(user)}>
                            {user.status === "Suspended" ? "✅ Reactivate" : "⚠️ Suspend"}
                          </button>
                          <button className="dropdown-item btn btn-sm w-100 text-start text-danger" type="button"
                            onClick={() => handleDelete(user)}>🗑️ Delete User</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">Showing {filteredUsers.length} of {summary.total} users</small>
      </div>

      {modal && (
        <UserModal
          user={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  );
}