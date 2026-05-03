import { useEffect, useMemo, useState } from "react";
import { Search, Filter, UserPlus, Mail, MoreVertical, Trash2, Pencil, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAdminTrainersData, updateUser, deleteUser } from "../../../../api";
 
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1758612214917-81d7956c09de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100";
 
const STATUS_COLORS = {
  Active:    { bg: "#ECFDF5", color: "#16A34A" },
  Inactive:  { bg: "#F7F7F7", color: "#888"    },
  Suspended: { bg: "#FFF5F5", color: "#dc2626" },
};
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .at-wrap { font-family: 'DM Sans', sans-serif; }
 
  .at-stat-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .at-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .at-stat-value { font-size: 1.7rem; font-weight: 700; line-height: 1.1; margin-bottom: 4px; color: #4A90E2; }
  .at-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
 
  .at-toolbar {
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
  .at-toolbar-title { font-size: 1.15rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  .at-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F6F8FA;
    border: 1px solid #E8ECF0;
    border-radius: 10px;
    padding: 7px 14px;
    min-width: 200px;
  }
  .at-search input {
    border: none; background: transparent; outline: none;
    font-size: 0.875rem; color: #1A202C;
    font-family: 'DM Sans', sans-serif; width: 160px;
  }
  .at-search input::placeholder { color: #A0AEC0; }
 
  .at-btn-filter {
    display: flex; align-items: center; gap: 6px;
    background: #F6F8FA; border: 1px solid #E8ECF0;
    border-radius: 10px; padding: 7px 14px;
    font-size: 0.875rem; font-weight: 500; color: #4A5568;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }
  .at-btn-filter:hover { background: #EEF1F5; border-color: #CBD5E0; }
  .at-btn-filter.active { background: #EBF4FF; border-color: #4A90E2; color: #4A90E2; }
 
  .at-btn-add {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    border: none; border-radius: 10px; padding: 8px 16px;
    font-size: 0.875rem; font-weight: 600; color: #fff;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
  }
  .at-btn-add:hover { opacity: 0.9; transform: translateY(-1px); }
 
  .at-table-wrap {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
  }
  .at-table { width: 100%; border-collapse: collapse; }
  .at-table thead tr { background: #F6F8FA; border-bottom: 1px solid #E8ECF0; }
  .at-table th {
    padding: 13px 18px;
    font-size: 0.75rem; font-weight: 600; color: #8492A6;
    text-transform: uppercase; letter-spacing: 0.06em;
    text-align: left; white-space: nowrap;
  }
  .at-table tbody tr { border-bottom: 1px solid #F0F3F7; transition: background 0.15s; }
  .at-table tbody tr:last-child { border-bottom: none; }
  .at-table tbody tr:hover { background: #FAFBFC; }
  .at-table td { padding: 14px 18px; font-size: 0.875rem; color: #2D3748; }
 
  .at-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    object-fit: cover; border: 2px solid #E8ECF0;
  }
  .at-user-name { font-weight: 600; color: #1A202C; font-size: 0.9rem; }
  .at-user-email { font-size: 0.78rem; color: #A0AEC0; margin-top: 1px; }
 
  .at-badge {
    display: inline-flex; align-items: center;
    padding: 4px 10px; border-radius: 20px;
    font-size: 0.75rem; font-weight: 600;
  }
 
  .at-action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 9px;
    border: 1px solid #E8ECF0; background: #fff;
    cursor: pointer; transition: background 0.15s, border-color 0.15s, transform 0.15s;
    color: #5A6A7E;
  }
  .at-action-btn:hover { background: #F0F4FF; border-color: #C5D5F5; color: #4A90E2; transform: translateY(-1px); }
 
  .at-dropdown {
    position: absolute; right: 0; top: calc(100% + 6px);
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    min-width: 185px; z-index: 200; overflow: hidden;
    animation: at-fade-in 0.12s ease;
  }
  @keyframes at-fade-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .at-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px; font-size: 0.875rem; font-weight: 500;
    color: #2D3748; background: transparent; border: none;
    width: 100%; text-align: left; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background 0.12s;
  }
  .at-dropdown-item:hover { background: #F6F8FA; }
  .at-dropdown-item.danger { color: #dc2626; }
  .at-dropdown-item.danger:hover { background: #FFF5F5; }
  .at-dropdown-divider { height: 1px; background: #F0F3F7; margin: 4px 0; }
 
  .at-footer { padding: 14px 20px; font-size: 0.8rem; color: #A0AEC0; border-top: 1px solid #F0F3F7; }
 
  .at-toast {
    background: #1A202C; color: #fff; border-radius: 10px;
    padding: 12px 18px; font-size: 0.875rem; font-weight: 500;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    animation: at-fade-in 0.2s ease;
  }
  .at-toast-close { background: none; border: none; color: #A0AEC0; cursor: pointer; font-size: 1rem; }
  .at-toast-close:hover { color: #fff; }
 
  /* Modal */
  .at-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15,20,35,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1050; backdrop-filter: blur(2px);
  }
  .at-modal {
    background: #fff; border-radius: 18px; padding: 28px;
    width: 420px; max-width: 95vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: at-fade-in 0.2s ease;
  }
  .at-modal-title { font-size: 1.05rem; font-weight: 700; color: #1A202C; margin: 0; }
  .at-modal label { display: block; font-size: 0.8rem; font-weight: 600; color: #4A5568; margin-bottom: 6px; }
  .at-modal select, .at-modal p {
    width: 100%; padding: 9px 13px;
    border: 1px solid #E2E8F0; border-radius: 9px;
    font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    color: #1A202C; outline: none; box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .at-modal select:focus { border-color: #4A90E2; box-shadow: 0 0 0 3px rgba(74,144,226,0.12); }
  .at-modal p { background: #FFF8F0; border-color: #FFE0B2; color: #7A4000; border-radius: 9px; margin: 0; }
  .at-modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .at-btn-cancel {
    padding: 9px 18px; border-radius: 9px;
    border: 1px solid #E2E8F0; background: #fff; color: #4A5568;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .at-btn-cancel:hover { background: #F6F8FA; }
  .at-btn-primary {
    padding: 9px 20px; border-radius: 9px; border: none;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
    transition: opacity 0.15s;
  }
  .at-btn-primary:hover { opacity: 0.9; }
  .at-btn-danger {
    padding: 9px 20px; border-radius: 9px; border: none;
    background: #dc2626; color: #fff;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s;
  }
  .at-btn-danger:hover { opacity: 0.85; }
  .at-close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid #E2E8F0; background: #F6F8FA;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #8492A6; transition: background 0.15s;
  }
  .at-close-btn:hover { background: #EEF1F5; color: #1A202C; }
`;
 
export function AdminTrainers() {
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [summary, setSummary] = useState({ total: 0, trainers: 0 });
  const [search, setSearch]   = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [info, setInfo]       = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
 
  const [showRoleModal,   setShowRoleModal]   = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser,    setSelectedUser]    = useState(null);
  const [newRole,         setNewRole]         = useState("");
 
  const showToast = (msg) => { setInfo(msg); setTimeout(() => setInfo(""), 3000); };
 
  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchAdminTrainersData();
      if (!ok || !data?.status) return;
      setUsers(Array.isArray(data.users) ? data.users : []);
      setSummary(data.summary || { total: 0, trainers: 0 });
    };
    load();
  }, []);
 
  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
 
  const filtered = useMemo(() => {
    const q    = search.trim().toLowerCase();
    const list = activeOnly ? users.filter((u) => u.status === "Active") : users;
    if (!q) return list;
    return list.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q));
  }, [users, search, activeOnly]);
 
  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role?.toLowerCase() || "trainer");
    setShowRoleModal(true);
    setOpenMenuId(null);
  };
 
  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    const { ok } = await updateUser(selectedUser.id, {
      name: selectedUser.name,
      email: selectedUser.email,
      role: newRole,
    });
    if (ok) {
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));
      showToast(`Role of ${selectedUser.name} updated to "${newRole}".`);
    } else {
      showToast("Error updating role.");
    }
    setShowRoleModal(false);
  };
 
  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };
 
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const { ok } = await deleteUser(selectedUser.id);
    if (ok) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      showToast(`${selectedUser.name} has been deleted.`);
    } else {
      showToast("Error deleting user.");
    }
    setShowDeleteModal(false);
  };
 
  return (
    <div className="at-wrap" style={{ padding: "24px" }}>
      <style>{styles}</style>
 
      {/* Stat Card */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:22 }}>
        <div className="at-stat-card">
          <div className="at-stat-value">{summary.total}</div>
          <div className="at-stat-label">Total Trainers</div>
        </div>
      </div>
 
      {/* Toolbar */}
      <div className="at-toolbar">
        <span className="at-toolbar-title">Trainer Management</span>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div className="at-search">
            <Search size={15} color="#A0AEC0" />
            <input
              placeholder="Search trainers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`at-btn-filter ${activeOnly ? "active" : ""}`}
            type="button"
            onClick={() => setActiveOnly((p) => !p)}
          >
            <Filter size={14} />
            {activeOnly ? "Active only" : "All"} <ChevronDown size={13} />
          </button>
          <button className="at-btn-add" type="button" onClick={() => navigate("/admin/users")}>
            <UserPlus size={15} /> Add Trainer
          </button>
        </div>
      </div>
 
      {/* Toast */}
      {info && (
        <div className="at-toast">
          <span>{info}</span>
          <button className="at-toast-close" onClick={() => setInfo("")}>✕</button>
        </div>
      )}
 
      {/* Table */}
      <div className="at-table-wrap">
        <div style={{ overflowX:"auto" }}>
          <table className="at-table">
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Role</th>
                <th>Courses</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign:"center", padding:"40px", color:"#A0AEC0" }}>
                    No trainers found.
                  </td>
                </tr>
              )}
              {filtered.map((user) => {
                const sc = STATUS_COLORS[user.status] || STATUS_COLORS.Active;
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <img
                          src={user.avatar || DEFAULT_AVATAR}
                          className="at-avatar" alt={user.name}
                          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                        />
                        <div>
                          <div className="at-user-name">{user.name}</div>
                          <div className="at-user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="at-badge" style={{ background:"#F3EBFF", color:"#7F3FBF" }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ fontWeight:600, color:"#4A5568" }}>{user.courses}</td>
                    <td style={{ color:"#8492A6" }}>{user.joined}</td>
                    <td>
                      <span className="at-badge" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:sc.color, display:"inline-block", marginRight:6 }} />
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8, position:"relative" }}>
                        {/* Mail */}
                        <button className="at-action-btn" title="Send email" type="button"
                          onClick={() => (window.location.href = `mailto:${user.email}`)}>
                          <Mail size={15} />
                        </button>
 
                        {/* More */}
                        <button className="at-action-btn" type="button"
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }}>
                          <MoreVertical size={15} />
                        </button>
 
                        {/* Dropdown */}
                        {openMenuId === user.id && (
                          <div className="at-dropdown" onClick={(e) => e.stopPropagation()}>
                            <button className="at-dropdown-item" type="button"
                              onClick={() => handleOpenRoleModal(user)}>
                              <Pencil size={15} color="#4A90E2" /> Edit Role
                            </button>
                            <div className="at-dropdown-divider" />
                            <button className="at-dropdown-item danger" type="button"
                              onClick={() => handleOpenDeleteModal(user)}>
                              <Trash2 size={15} /> Delete Trainer
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
        <div className="at-footer">
          Showing <strong>{filtered.length}</strong> of <strong>{summary.total}</strong> trainers
        </div>
      </div>
 
      {/* Modal : Edit Role */}
      {showRoleModal && (
        <div className="at-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowRoleModal(false)}>
          <div className="at-modal at-wrap">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h5 className="at-modal-title">Edit Role — {selectedUser?.name}</h5>
              <button className="at-close-btn" onClick={() => setShowRoleModal(false)}><X size={15} /></button>
            </div>
            <div>
              <label>New Role</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
                <option value="learner">Learner</option>
              </select>
            </div>
            <div className="at-modal-footer">
              <button className="at-btn-cancel" onClick={() => setShowRoleModal(false)}>Cancel</button>
              <button className="at-btn-primary" onClick={handleUpdateRole}>Save</button>
            </div>
          </div>
        </div>
      )}
 
      {/* Modal : Confirm Delete */}
      {showDeleteModal && (
        <div className="at-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}>
          <div className="at-modal at-wrap">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h5 className="at-modal-title">Delete {selectedUser?.name}?</h5>
              <button className="at-close-btn" onClick={() => setShowDeleteModal(false)}><X size={15} /></button>
            </div>
            <p>This action is irreversible. Are you sure you want to delete this trainer?</p>
            <div className="at-modal-footer">
              <button className="at-btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="at-btn-danger" onClick={handleDeleteUser}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}