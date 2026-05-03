import { useEffect, useMemo, useState } from "react";
import { Search, Filter, UserPlus, MoreVertical, Mail, X, Pencil, PauseCircle, PlayCircle, Trash2, ChevronDown } from "lucide-react";
import { fetchAdminUsersData } from "../../../../api";
 
const ROLE_COLORS = {
  Learner: { bg: "#EBF4FF", color: "#4A90E2" },
  Trainer: { bg: "#F3EBFF", color: "#7F3FBF" },
  Admin:   { bg: "#FFF3E8", color: "#FF7A00" },
};
const STATUS_COLORS = {
  Active:    { bg: "#ECFDF5", color: "#16A34A" },
  Inactive:  { bg: "#F7F7F7", color: "#888" },
  Suspended: { bg: "#FFF5F5", color: "#dc2626" },
};
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100";
 
const getToken = () => localStorage.getItem("auth_token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  "Accept": "application/json",
  Authorization: `Bearer ${getToken()}`,
});
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .um-wrap { font-family: 'DM Sans', sans-serif; }
 
  .um-stat-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .um-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .um-stat-value { font-size: 1.7rem; font-weight: 700; line-height: 1.1; margin-bottom: 4px; }
  .um-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
 
  .um-toolbar {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }
  .um-toolbar-title { font-size: 1.15rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  .um-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F6F8FA;
    border: 1px solid #E8ECF0;
    border-radius: 10px;
    padding: 7px 14px;
    min-width: 200px;
  }
  .um-search input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.875rem;
    color: #1A202C;
    font-family: 'DM Sans', sans-serif;
    width: 160px;
  }
  .um-search input::placeholder { color: #A0AEC0; }
 
  .um-btn-filter {
    display: flex; align-items: center; gap: 6px;
    background: #F6F8FA;
    border: 1px solid #E8ECF0;
    border-radius: 10px;
    padding: 7px 14px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4A5568;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }
  .um-btn-filter:hover { background: #EEF1F5; border-color: #CBD5E0; }
 
  .um-btn-add {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    border: none;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
  }
  .um-btn-add:hover { opacity: 0.9; transform: translateY(-1px); }
 
  .um-table-wrap {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
  }
  .um-table { width: 100%; border-collapse: collapse; }
  .um-table thead tr { background: #F6F8FA; border-bottom: 1px solid #E8ECF0; }
  .um-table th {
    padding: 13px 18px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #8492A6;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-align: left;
    white-space: nowrap;
  }
  .um-table tbody tr {
    border-bottom: 1px solid #F0F3F7;
    transition: background 0.15s;
  }
  .um-table tbody tr:last-child { border-bottom: none; }
  .um-table tbody tr:hover { background: #FAFBFC; }
  .um-table td { padding: 14px 18px; font-size: 0.875rem; color: #2D3748; }
 
  .um-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #E8ECF0;
  }
  .um-user-name { font-weight: 600; color: #1A202C; font-size: 0.9rem; }
  .um-user-email { font-size: 0.78rem; color: #A0AEC0; margin-top: 1px; }
 
  .um-badge {
    display: inline-flex; align-items: center;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }
 
  .um-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px; height: 34px;
    border-radius: 9px;
    border: 1px solid #E8ECF0;
    background: #fff;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
    color: #5A6A7E;
  }
  .um-action-btn:hover { background: #F0F4FF; border-color: #C5D5F5; color: #4A90E2; transform: translateY(-1px); }
 
  .um-dropdown {
    position: absolute;
    right: 0; top: calc(100% + 6px);
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    min-width: 185px;
    z-index: 200;
    overflow: hidden;
    animation: um-fade-in 0.12s ease;
  }
  @keyframes um-fade-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .um-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #2D3748;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.12s;
  }
  .um-dropdown-item:hover { background: #F6F8FA; }
  .um-dropdown-item.warn  { color: #D97706; }
  .um-dropdown-item.warn:hover  { background: #FFFBEB; }
  .um-dropdown-item.success { color: #16A34A; }
  .um-dropdown-item.success:hover { background: #F0FDF4; }
  .um-dropdown-item.danger { color: #dc2626; }
  .um-dropdown-item.danger:hover { background: #FFF5F5; }
  .um-dropdown-divider { height: 1px; background: #F0F3F7; margin: 4px 0; }
 
  .um-footer { padding: 14px 20px; font-size: 0.8rem; color: #A0AEC0; border-top: 1px solid #F0F3F7; }
 
  .um-toast {
    background: #1A202C;
    color: #fff;
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    animation: um-fade-in 0.2s ease;
  }
  .um-toast-close { background: none; border: none; color: #A0AEC0; cursor: pointer; padding: 0; line-height: 1; font-size: 1rem; }
  .um-toast-close:hover { color: #fff; }
 
  .um-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15,20,35,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1050;
    backdrop-filter: blur(2px);
  }
  .um-modal {
    background: #fff;
    border-radius: 18px;
    padding: 28px;
    width: 440px;
    max-width: 95vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: um-fade-in 0.2s ease;
  }
  .um-modal-title { font-size: 1.1rem; font-weight: 700; color: #1A202C; margin: 0; }
  .um-modal label { display: block; font-size: 0.8rem; font-weight: 600; color: #4A5568; margin-bottom: 6px; }
  .um-modal input, .um-modal select {
    width: 100%;
    padding: 9px 13px;
    border: 1px solid #E2E8F0;
    border-radius: 9px;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    color: #1A202C;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .um-modal input:focus, .um-modal select:focus {
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74,144,226,0.12);
  }
  .um-modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .um-btn-cancel {
    padding: 9px 18px; border-radius: 9px;
    border: 1px solid #E2E8F0;
    background: #fff; color: #4A5568;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .um-btn-cancel:hover { background: #F6F8FA; }
  .um-btn-save {
    padding: 9px 20px; border-radius: 9px; border: none;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
    transition: opacity 0.15s;
  }
  .um-btn-save:hover { opacity: 0.9; }
  .um-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
  .um-error { background: #FFF5F5; border: 1px solid #FED7D7; color: #dc2626; border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; margin-bottom: 16px; }
  .um-mb { margin-bottom: 16px; }
  .um-close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid #E2E8F0; background: #F6F8FA;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #8492A6; transition: background 0.15s;
  }
  .um-close-btn:hover { background: #EEF1F5; color: #1A202C; }
`;
 
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
        { method: isEdit ? "PUT" : "POST", headers: authHeaders(), body: JSON.stringify(payload) }
      );
      const data = await res.json().catch(() => ({}));
      setSaving(false);
      if (!res.ok) { setError(data?.message || Object.values(data?.errors || {})?.[0]?.[0] || "Operation failed."); return; }
      onSaved();
    } catch {
      setSaving(false);
      setError("Network error. Please try again.");
    }
  };
 
  return (
    <div className="um-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="um-modal um-wrap">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h5 className="um-modal-title">{isEdit ? "Edit User" : "Add New User"}</h5>
          <button className="um-close-btn" onClick={onClose} type="button"><X size={15} /></button>
        </div>
 
        {error && <div className="um-error">{error}</div>}
 
        <form onSubmit={handleSubmit}>
          <div className="um-mb">
            <label>Full Name *</label>
            <input value={form.name} onChange={set("name")} placeholder="Jane Doe" autoComplete="off" />
          </div>
          <div className="um-mb">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com" autoComplete="off" />
          </div>
          <div className="um-mb">
            <label>Role</label>
            <select value={form.role} onChange={set("role")}>
              <option value="learner">Learner</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="um-mb">
            <label>Password {isEdit && <span style={{color:"#A0AEC0", fontWeight:400}}>(leave blank to keep current)</span>}</label>
            <input type="password" autoComplete="new-password" value={form.password} onChange={set("password")}
              placeholder={isEdit ? "••••••••" : "Min 6 characters"} />
          </div>
          {form.password && (
            <div className="um-mb">
              <label>Confirm Password</label>
              <input type="password" autoComplete="new-password" value={form.password_confirmation}
                onChange={set("password_confirmation")} placeholder="Repeat password" />
            </div>
          )}
          <div className="um-modal-footer">
            <button type="button" className="um-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving} className="um-btn-save">
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
 
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
 
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
      const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) { setUsers((prev) => prev.filter((u) => u.id !== user.id)); showToast(`${user.name} deleted.`); }
      else showToast("Delete failed — check permissions.");
    } catch { showToast("Network error during delete."); }
    setOpenMenuId(null);
  };
 
  const handleToggleSuspend = (user) => {
    const newStatus = user.status === "Suspended" ? "Active" : "Suspended";
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    showToast(`${user.name} is now ${newStatus}.`);
    setOpenMenuId(null);
  };
 
  const handleModalSaved = () => { setModal(null); showToast("User saved successfully!"); reloadUsers(); };
 
  const roleOrder = ["All", "Learner", "Trainer", "Admin"];
 
  return (
    <div className="um-wrap" style={{ padding: "24px" }}>
      <style>{styles}</style>
 
      {/* Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:22 }}>
        {[
          { label: "Total Users", value: summary.total,    color: "#4A90E2" },
          { label: "Learners",    value: summary.learners, color: "#7F3FBF" },
          { label: "Trainers",    value: summary.trainers, color: "#FF7A00" },
          { label: "Admins",      value: summary.admins,   color: "#16A34A" },
        ].map((s) => (
          <div key={s.label} className="um-stat-card">
            <div className="um-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="um-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* Toolbar */}
      <div className="um-toolbar">
        <span className="um-toolbar-title">User Management</span>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div className="um-search">
            <Search size={15} color="#A0AEC0" />
            <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="um-btn-filter" type="button"
            onClick={() => setRoleFilter(roleOrder[(roleOrder.indexOf(roleFilter) + 1) % roleOrder.length])}>
            <Filter size={14} /> {roleFilter} <ChevronDown size={13} />
          </button>
          <button className="um-btn-add" type="button" onClick={() => setModal("add")}>
            <UserPlus size={15} /> Add User
          </button>
        </div>
      </div>
 
      {/* Toast */}
      {toast && (
        <div className="um-toast">
          <span>{toast}</span>
          <button className="um-toast-close" onClick={() => setToast("")}>✕</button>
        </div>
      )}
 
      {/* Table */}
      <div className="um-table-wrap">
        <div style={{ overflowX:"auto" }}>
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Courses</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign:"center", padding:"40px", color:"#A0AEC0" }}>No users found.</td></tr>
              )}
              {filteredUsers.map((user) => {
                const rc = ROLE_COLORS[user.role]    || ROLE_COLORS.Learner;
                const sc = STATUS_COLORS[user.status] || STATUS_COLORS.Active;
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <img src={user.avatar} className="um-avatar" alt={user.name}
                          onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
                        <div>
                          <div className="um-user-name">{user.name}</div>
                          <div className="um-user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="um-badge" style={{ backgroundColor: rc.bg, color: rc.color }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ fontWeight:600, color:"#4A5568" }}>{user.courses}</td>
                    <td style={{ color:"#8492A6" }}>{user.joined}</td>
                    <td>
                      <span className="um-badge" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:sc.color, display:"inline-block", marginRight:6 }} />
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8, position:"relative" }}>
 
                        {/* Mail */}
                        <button className="um-action-btn" title="Send email" type="button"
                          onClick={() => (window.location.href = `mailto:${user.email}`)}>
                          <Mail size={15} />
                        </button>
 
                        {/* More */}
                        <button className="um-action-btn" type="button"
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }}>
                          <MoreVertical size={15} />
                        </button>
 
                        {/* Dropdown */}
                        {openMenuId === user.id && (
                          <div className="um-dropdown" onClick={(e) => e.stopPropagation()}>
                            <button className="um-dropdown-item" type="button"
                              onClick={() => { setModal(user); setOpenMenuId(null); }}>
                              <Pencil size={15} color="#4A90E2" /> Edit User
                            </button>
                            <div className="um-dropdown-divider" />
                            <button
                              className={`um-dropdown-item ${user.status === "Suspended" ? "success" : "warn"}`}
                              type="button"
                              onClick={() => handleToggleSuspend(user)}>
                              {user.status === "Suspended"
                                ? <><PlayCircle size={15} /> Reactivate</>
                                : <><PauseCircle size={15} /> Suspend</>
                              }
                            </button>
                            <div className="um-dropdown-divider" />
                            <button className="um-dropdown-item danger" type="button"
                              onClick={() => handleDelete(user)}>
                              <Trash2 size={15} /> Delete User
                            </button>
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
        <div className="um-footer">
          Showing <strong>{filteredUsers.length}</strong> of <strong>{summary.total}</strong> users
        </div>
      </div>
 
      {/* Modal */}
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